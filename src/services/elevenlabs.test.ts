import { describe, expect, it } from "vitest";
import { synthesizeSpeech } from "./elevenlabs";

const TEST_TEXT = "Hello, this is a test of the ElevenLabs TTS integration.";
const TEST_VOICE_ID =
  process.env.ELEVENLABS_TEST_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Replace with your test voice ID if needed

describe("synthesizeSpeech (ElevenLabs TTS)", () => {
  it("should return a non-empty Buffer for valid text and voiceId", async () => {
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn("Skipping test: ELEVENLABS_API_KEY not set");
      return;
    }
    if (!TEST_VOICE_ID) {
      console.warn("Skipping test: ELEVENLABS_TEST_VOICE_ID not set");
      return;
    }
    const audioBuffer = await synthesizeSpeech({
      text: TEST_TEXT,
      voiceId: TEST_VOICE_ID,
    });
    expect(audioBuffer).toBeInstanceOf(ArrayBuffer);
    expect(audioBuffer.byteLength).toBeGreaterThan(1024); // Should be at least 1KB
    // Optional: Uncomment to write buffer to disk for manual listening
    // import { writeFileSync } from 'fs';
    // writeFileSync('tts-test-output.mp3', audioBuffer);
  });
});
