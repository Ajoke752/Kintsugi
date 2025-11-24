const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const User = require("../models/User");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// In development you can set SKIP_AUTH=true to allow unauthenticated
// access for quick local testing (do NOT use in production).
const requireAuth =
  process.env.SKIP_AUTH === "true"
    ? (req, res, next) => next()
    : ClerkExpressRequireAuth();

// GET /api/dashboard
// Fetches User Stats + The most recent Log
router.get("/", requireAuth, async (req, res) => {
  try {
    // If SKIP_AUTH is enabled for local dev, return a simple mock payload
    if (process.env.SKIP_AUTH === "true") {
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

    const { auth } = req;
    const userId = auth.userId;

    // 1. Get User Stats (or create if new)
    let user = await User.findOne({ clerkId: userId });

    // If user doesn't exist yet (first login), create them silently
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

    res.json({ user, activeMission });
  } catch (error) {
    console.error("Dashboard Load Error:", error);
    res.status(500).json({ error: "Dashboard Offline" });
  }
});

module.exports = router;
