import { synthesizeSpeech } from "../../services/elevenlabs";

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

// Using standard Fetch API (Request/Response) for Cloudflare compatibility
export async function ttsHandler(request: Request): Promise<Response> {
  // Handle method check
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: {
        Allow: "POST",
        "Content-Type": "application/json",
      },
    });
  }

  // Parse JSON body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { text, voiceId } = body || {};
  if (!text || typeof text !== "string") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid `text` in request body." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const audioBuffer = await synthesizeSpeech({
      text,
      voiceId: voiceId || DEFAULT_VOICE_ID,
    });

    // Return audio response
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="tts.mp3"',
      },
    });
  } catch (error: unknown) {
    console.error("TTS API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Failed to synthesize speech.";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
