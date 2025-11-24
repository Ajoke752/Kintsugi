const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");
const User = require("../models/User");
const Log = require("../models/log");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Setup Multer (Temp storage for audio)
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// SYSTEM PROMPT: The "Commander"
const SYSTEM_PROMPT = `
You are 'Kintsugi'. Analyze the user's audio transcript.
Return a JSON object with this EXACT structure:
{
  "mood": "Single word emotion (e.g. Lethargic)",
  "protocol": [
    { "category": "PHYSIOLOGY", "action": "Physical task under 6 words" },
    { "category": "ENVIRONMENT", "action": "Space change task under 6 words" },
    { "category": "MOMENTUM", "action": "Mental task under 6 words" }
  ]
}
`;

// ROUTE: POST /api/debrief
// 1. 'upload.single' handles the audio file
router.post(
  "/",
  upload.single("audio"),
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const { auth } = req;
      const userId = auth.userId;
      if (!req.file)
        return res.status(400).json({ error: "No audio intel received." });

      // STEP 1: Transcribe (Voice -> Text)
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: "whisper-1",
      });

      // STEP 2: Analyze (Text -> Tactical Plan)
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: transcription.text },
        ],
        response_format: { type: "json_object" }, // Critical for error-free parsing
      });

      const aiData = JSON.parse(completion.choices[0].message.content);

      // STEP 3: Save to MongoDB
      const newLog = new Log({
        clerkId: userId,
        transcript: transcription.text,
        moodDetected: aiData.mood,
        protocol: aiData.protocol,
      });
      await newLog.save();

      // Cleanup: Delete the temp audio file
      fs.unlinkSync(req.file.path);

      // Respond
      res.json(newLog);
    } catch (error) {
      console.error("Mission Failure:", error);
      // Cleanup file if error occurred
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      res.status(500).json({ error: "System Processing Error" });
    }
  }
);

router.patch(
  "/:logId/complete",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    try {
      const { taskId } = req.body;
      const { auth } = req;
      const userId = auth.userId; // Clerk ID

      // 1. Update the Log (Mark task as true)
      const log = await Log.findOneAndUpdate(
        { _id: req.params.logId, "protocol._id": taskId },
        {
          $set: { "protocol.$.isCompleted": true },
        },
        { new: true }
      );

      if (!log) return res.status(404).json({ error: "Log not found" });

      // 2. Update the User (Award XP)
      // We use 'upsert: true' to create the User if they don't exist yet
      const user = await User.findOneAndUpdate(
        { clerkId: userId },
        {
          $inc: { xp: 10, totalMissionsCompleted: 1 },
          $setOnInsert: { level: 1, currentStreak: 1 },
        },
        { new: true, upsert: true }
      );

      // 3. Calculate Level Up (Simple logic: Level up every 100 XP)
      const newLevel = Math.floor(user.xp / 100) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        await user.save();
      }

      res.json({ log, user, msg: "Task Confirmed. XP Awarded." });
    } catch (error) {
      console.error("Completion Error:", error);
      res.status(500).json({ error: "Server Malfunction" });
    }
  }
);

module.exports = router;
