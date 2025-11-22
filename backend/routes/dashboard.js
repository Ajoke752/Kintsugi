const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const User = require("../models/User");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// GET /api/dashboard
// Fetches User Stats + The most recent Log
router.get("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { auth } = req;
    const userId = auth.userId;

    // 1. Get User Stats (or create if new)
    let user = await User.findOne({ clerkId: userId });

    // If user doesn't exist yet (first login), create them silently
    if (!user) {
      user = await User.create({
        clerkId: userId,
        email: "operator@kintsugi.app", // You can fetch real email from Clerk if needed
      });
    }

    // 2. Get the most recent Log (Mission)
    // We sort by 'createdAt' descending (-1) to get the latest one
    const recentLog = await Log.findOne({ clerkId: userId }).sort({
      createdAt: -1,
    });

    // 3. Check if the mission is from "Today" and is "Incomplete"
    let activeMission = null;
    if (recentLog) {
      const isToday =
        new Date(recentLog.createdAt).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0);
      // If it's from today, send it back to the frontend
      if (isToday) {
        activeMission = recentLog;
      }
    }

    res.json({ user, activeMission });
  } catch (error) {
    console.error("Dashboard Load Error:", error);
    res.status(500).json({ error: "Dashboard Offline" });
  }
});

module.exports = router;
