// Using native fetch API (no import needed for browsers or Cloudflare)

export interface TextToSpeechParams {
  text: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  speakerBoost?: boolean;
  style?: number;
  speed?: number;
}

/**
 * Synthesize speech using the ElevenLabs API.
 * Returns an ArrayBuffer (mp3) or throws on error.
 */
export const synthesizeSpeech = async (
  params: TextToSpeechParams,
): Promise<ArrayBuffer> => {
  // Get API key from environment or config
  // For Cloudflare Workers, this would come from environment variables
  const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  if (!API_KEY) {
    throw new Error(
      "ELEVENLABS_API_KEY is not defined in environment variables",
    );
  }

  const {
    text,
    voiceId,
    modelId = "eleven_monolingual_v1",
    stability = 0.5,
    similarityBoost = 0.75,
    speakerBoost = true,
    style = 0,
    speed = 1.0,
  } = params;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
  const body = {
    text,
    model_id: modelId,
    voice_settings: {
      stability,
      similarity_boost: similarityBoost,
      speaker_boost: speakerBoost,
      style,
      use_speaker_boost: speakerBoost,
    },
    optimization_level: 0,
    experimental_streaming: false,
    speed,
    output_format: "mp3_44100_128",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} ${errorBody}`);
  }

  // Return the arrayBuffer directly - no need for Buffer conversion
  return await response.arrayBuffer();
};

// --- The following are frontend/demo helpers and are left unchanged ---

// Mock function for the demo - in a real app, this would use a document parsing library
export const parseDocument = async (file: File): Promise<string> => {
  if (file.type === "text/plain") {
    return await file.text();
  }
  // For demo purposes, return mock content for PDF and DOCX files
  if (file.type === "application/pdf") {
    return `This is a simulated PDF content.\nThe actual implementation would use a PDF parsing library.\nMultiple lines are shown to demonstrate the text formatting.\n\nSCRIPT EXAMPLE:\nJohn: Hello there, how are you today?\nSarah: I'm doing well, thank you for asking. How about yourself?\nJohn: Can't complain. The weather is lovely, isn't it?\nSarah: Absolutely beautiful. Perfect day for a walk in the park.\nJohn: Would you like to join me for lunch? There's a new cafe that just opened.\nSarah: That sounds wonderful. I'd love to.`;
  }
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return `This is a simulated DOCX content.\nThe actual implementation would use a DOCX parsing library.\nMultiple lines are shown to demonstrate the text formatting.`;
  }
  return "Unsupported file format. Please upload a PDF, DOCX, or TXT file.";
};

// Helper function to detect if the content is likely a script
export const isScriptFormat = (content: string): boolean => {
  // Simple heuristic: look for character dialogue patterns (e.g., "Name: Line")
  const lines = content.split("\n");
  let dialogueCount = 0;
  for (const line of lines) {
    if (line.match(/^[A-Za-z\s]+:.+/)) {
      dialogueCount++;
    }
  }
  // If more than 20% of the lines match the dialogue pattern, consider it a script
  return dialogueCount > 0 && dialogueCount / lines.length > 0.2;
};
