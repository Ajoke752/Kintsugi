import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(",")[1];
        
        // TODO: Send to your Express backend API
        // const response = await fetch('YOUR_BACKEND_URL/api/debrief', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ audio: base64Audio })
        // });
        
        // Mock processing for now
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Debrief processed",
          description: "Your insights and action plan are ready.",
        });
      };
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Please try recording again.",
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
