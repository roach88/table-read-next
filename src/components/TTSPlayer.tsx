import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Available ElevenLabs voices
const VOICES = [
  { name: "Rachel", id: "21m00Tcm4TlvDq8ikWAM" },
  { name: "Domi", id: "AZnzlk1XvdvUeBnXmlld" },
  { name: "Bella", id: "EXAVITQu4vr4xnSDxMaL" },
  { name: "Antoni", id: "ErXwobaYiN019PkySvjV" },
  { name: "Elli", id: "MF3mGyEYCl7XYWbV9V6O" },
];

export const TTSPlayer: React.FC = () => {
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState(VOICES[0].id);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up the created URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handlePlay = async () => {
    setLoading(true);
    setError(null);

    // Clean up previous audio URL if it exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Text-to-speech generation failed");
      }

      // Convert response to blob and create URL
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("TTS error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="tts-text" className="text-sm font-medium">
            Text to Synthesize
          </label>
          <Textarea
            id="tts-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
            rows={4}
            className="resize-y min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="voice-select" className="text-sm font-medium">
            Voice
          </label>
          <Select value={voiceId} onValueChange={setVoiceId}>
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {VOICES.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handlePlay}
          disabled={loading || !text.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Synthesizing...
            </>
          ) : (
            "Generate Speech"
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {audioUrl && (
          <div className="pt-4">
            <audio
              controls
              src={audioUrl}
              className="w-full"
              autoPlay={false}
              preload="metadata"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TTSPlayer;
