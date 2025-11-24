const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const User = require("../models/User");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// GET /api/dashboard
// Fetches User Stats + The most recent Log
router.get("/", async (req, res) => {
  try {
    // Development fallback: if SKIP_AUTH=true or not production and no Authorization header,
    // return a mock payload to make local frontend testing easier.
    const isDevFallback =
      process.env.SKIP_AUTH === "true" || process.env.NODE_ENV !== "production";
    const hasAuthHeader = !!req.headers.authorization;

    if (isDevFallback && !hasAuthHeader) {
      console.log(
        "[dashboard] Dev fallback: returning mock payload (no Authorization header detected)"
      );
      const mockUser = { clerkId: "dev-user", email: "dev@local" };
      const mockMission = {
        _id: "mock-mission-1",
        createdAt: new Date().toISOString(),
        protocol: [
          {
            _id: "t1",
            action: "Reflect for 5 minutes",
            isCompleted: false,
            category: "reflection",
          },
          {
            _id: "t2",
            action: "Write one action plan",
            isCompleted: false,
            category: "action",
          },
        ],
      };
      return res.json({ user: mockUser, activeMission: mockMission });
    }

    // If an Authorization header exists, require Clerk auth middleware to populate req.auth
    if (hasAuthHeader) {
      // Call Clerk middleware and continue inside its callback
      return ClerkExpressRequireAuth()(req, res, async () => {
        try {
          const { auth } = req;
          const userId = auth.userId;

          // 1. Get User Stats (or create if new)
          let user = await User.findOne({ clerkId: userId });
          if (!user) {
            user = await User.create({
              clerkId: userId,
              email: "operator@kintsugi.app",
            });
          }

          // 2. Get the most recent Log (Mission)
          const recentLog = await Log.findOne({ clerkId: userId }).sort({
            createdAt: -1,
          });

          // 3. Check if the mission is from "Today"
          let activeMission = null;
          if (recentLog) {
            const isToday =
              new Date(recentLog.createdAt).setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0);
            if (isToday) activeMission = recentLog;
          }

          return res.json({ user, activeMission });
        } catch (error) {
          console.error("Dashboard Load Error (with auth):", error);
          return res.status(500).json({ error: "Dashboard Offline" });
        }
      });
    }

    // If no auth header and not allowed to fallback, reject as unauthorized
    console.warn(
      "[dashboard] Unauthorized request - no Authorization header and not in dev fallback mode"
    );
    return res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Dashboard Load Error:", error);
    res.status(500).json({ error: "Dashboard Offline" });
  }
});

module.exports = router;
