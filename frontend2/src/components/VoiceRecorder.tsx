import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";


const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= 60) {
            // Use setTimeout to avoid calling stopRecording inside state update
            setTimeout(() => stopRecording(), 0);
            return 60;
          }
          return newTime;
        });
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak freely. You have 60 seconds.",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

 const { getToken } = useAuth(); // Get the auth hook

 const processAudio = async (audioBlob: Blob) => {
   setIsProcessing(true);

   try {
     const token = await getToken(); // Get the JWT for the backend

     // 1. Create Form Data (Not JSON)
     const formData = new FormData();
     formData.append("audio", audioBlob, "debrief.webm"); // Must be "audio" to match backend upload.single("audio")

     // 2. Send to Real Backend
     const response = await fetch("http://localhost:5000/api/debrief", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${token}`, // Authenticate request
         // Note: Do NOT set Content-Type manually for FormData, fetch does it automatically
       },
       body: formData,
     });

     if (!response.ok) throw new Error("Upload failed");

     const data = await response.json();
     console.log("AI Protocol:", data); // Debugging

     toast({
       title: "Mission Protocol Generated",
       description: `Mood: ${data.moodDetected}. Check your Action Plans.`,
     });
   } catch (error) {
     console.error(error);
     toast({
       title: "Transmission Failed",
       description: "Could not reach Command Center (Backend).",
       variant: "destructive",
     });
   } finally {
     setIsProcessing(false);
   }
 };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {isRecording ? "Recording..." : isProcessing ? "Processing..." : "Ready to Debrief"}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {isRecording 
            ? "Talk about what's on your mind. Be honest, be real."
            : isProcessing
            ? "Analyzing your debrief and generating insights..."
            : "Hit the button below and start talking. You have 60 seconds."}
        </p>
      </div>

      {/* Recording Timer */}
      {(isRecording || recordingTime > 0) && (
        <div className="text-center">
          <div className="text-5xl font-bold text-primary tabular-nums">
            {recordingTime}s
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {60 - recordingTime}s remaining
          </div>
        </div>
      )}

      {/* Recording Button */}
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        )}
        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-32 h-32 rounded-full text-lg font-semibold transition-all ${
            isRecording
              ? "bg-destructive hover:bg-destructive/90 shadow-glow-primary"
              : "bg-primary hover:bg-primary/90 shadow-glow-primary"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-12 h-12 animate-spin" />
          ) : isRecording ? (
            <Square className="w-12 h-12" />
          ) : (
            <Mic className="w-12 h-12" />
          )}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center max-w-md">
        {isRecording
          ? "Click the square to stop early, or recording will auto-stop at 60 seconds"
          : "Your voice is processed securely and never shared"}
      </div>
    </div>
  );
};

export default VoiceRecorder;
