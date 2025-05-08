import mammoth from "mammoth";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import path from "path";
import pdfParse from "pdf-parse";
import { Readable } from "stream";
import { supabase } from "../../services/supabase";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;

// Helper: Extract text from file buffer (supports TXT, PDF, DOCX)
async function extractTextFromBuffer(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".txt") {
    return buffer.toString("utf-8");
  }
  if (ext === ".pdf") {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  }
  if (ext === ".docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  throw new Error("Unsupported file type for TTS");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { documentId } = req.query;
  if (!documentId || typeof documentId !== "string") {
    res.status(400).json({ error: "Missing documentId" });
    return;
  }

  // 1. Download file from Supabase Storage
  const { data, error } = await supabase.storage
    .from("documents")
    .download(documentId);
  if (error || !data) {
    res.status(404).json({ error: "File not found in storage" });
    return;
  }
  const fileBuffer = Buffer.from(await data.arrayBuffer());

  // 2. Extract text from file
  let text: string;
  try {
    text = await extractTextFromBuffer(fileBuffer, documentId);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
    return;
  }

  // 3. Stream to ElevenLabs
  const ttsRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    },
  );

  if (!ttsRes.ok || !ttsRes.body) {
    res.status(500).json({ error: "Failed to stream from ElevenLabs" });
    return;
  }

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Transfer-Encoding", "chunked");

  if (typeof Readable.fromWeb === "function") {
    // Node 18+ supports fromWeb for web streams
    Readable.fromWeb(ttsRes.body as any).pipe(res);
  } else {
    // Fallback for older Node: buffer the stream
    const reader = ttsRes.body.getReader();
    const stream = new Readable({
      async read() {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          this.push(value);
        }
        this.push(null);
      },
    });
    stream.pipe(res);
  }
}
