import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import DocumentActions from "@/components/Document/DocumentActions";
import DocumentPreview from "@/components/Document/DocumentPreview";
import FileDropzone from "@/components/FileUpload/FileDropzone";
import ScriptPractice from "@/components/Interactive/ScriptPractice";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isScriptFormat, parseDocument } from "@/services/elevenlabs";
import { getDocumentById, getDocumentUrl } from "@/services/supabase";
import { createTimestamps } from "@/utils/audio";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ConvertPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ConvertPage({ searchParams }: ConvertPageProps) {
  // Next.js App Router: get search params from props
  const documentId = searchParams?.id as string | undefined;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isScript, setIsScript] = useState<boolean>(false);
  const [voiceId, setVoiceId] = useState<string>("21m00Tcm4TlvDq8ikWAM");
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [timestamps, setTimestamps] = useState<
    Array<{ time: number; lineIndex: number }>
  >([]);
  const [showInteractiveMode, setShowInteractiveMode] =
    useState<boolean>(false);
  const [documentName, setDocumentName] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");
  const [documentSize, setDocumentSize] = useState<number>(0);
  const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(false);
  const [documentData, setDocumentData] = useState<any>(null);

  // Fetch document if ID is provided
  useEffect(() => {
    if (documentId) {
      setIsDocumentLoading(true);
      getDocumentById(documentId)
        .then((doc) => {
          setDocumentData(doc);
        })
        .finally(() => setIsDocumentLoading(false));
    }
  }, [documentId]);

  // Load document content when document data is available
  useEffect(() => {
    if (documentData) {
      loadDocumentContent(documentData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentData]);

  // Load document content from Supabase storage
  const loadDocumentContent = async (doc: any) => {
    setIsLoading(true);
    try {
      // Get document URL from storage
      const url = await getDocumentUrl(doc.storage_path);
      if (!url) {
        throw new Error("Failed to get document URL");
      }
      // Fetch document content
      const response = await fetch(url);
      const blob = await response.blob();
      // Create a mock file object for parsing
      const file = new File([blob], doc.filename, {
        type: `application/${doc.file_type}`,
      });
      // Parse document content
      const content = await parseDocument(file);
      setDocumentContent(content);
      // Set document metadata
      setDocumentName(doc.filename);
      setDocumentType(doc.file_type);
      setDocumentSize(doc.file_size);
      setIsScript(doc.is_script);
      // Create timestamps for audio playback
      setTimestamps(createTimestamps(content));
    } catch (error) {
      console.error("Error loading document:", error);
      toast.error("Failed to load document content");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileSelected = async (file: File, isScriptFile: boolean) => {
    setSelectedFile(file);
    setIsLoading(true);
    setAudioUrl("");
    setCurrentLineIndex(-1);
    try {
      // Parse document content
      const content = await parseDocument(file);
      setDocumentContent(content);
      // Check if content is in script format
      const scriptDetected = isScriptFile || isScriptFormat(content);
      setIsScript(scriptDetected);
      // Create timestamps for audio playback
      setTimestamps(createTimestamps(content));
      // Set document metadata
      setDocumentName(file.name);
      setDocumentType(file.type);
      setDocumentSize(file.size);
      // Upload file to Supabase via API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("isScript", scriptDetected.toString());
      const response = await fetch("/api/upload-text", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload file");
      }
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error("Failed to process document");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle text-to-speech conversion
  const handleConvertToAudio = async () => {
    if (!documentContent) {
      toast.error("Please upload or select a document first");
      return;
    }
    setIsConverting(true);
    try {
      // Call TTS API
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: documentContent,
          voiceId,
          speed,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "TTS conversion failed");
      }
      // Create audio URL from response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      // Clean up previous audio URL if exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(url);
      toast.success("Audio generated successfully");
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error("Failed to generate audio");
    } finally {
      setIsConverting(false);
    }
  };

  // Handle interactive mode for scripts
  const handleStartInteractive = () => {
    setShowInteractiveMode(true);
  };

  // Play AI line in interactive mode
  const handlePlayAILine = async (text: string, callback: () => void) => {
    try {
      // Call TTS API for single line
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }
      // Play audio
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      // When audio finishes, clean up and call callback
      audio.onended = () => {
        URL.revokeObjectURL(url);
        callback();
      };
      // Start playback
      audio.play();
    } catch (error) {
      console.error("Error playing AI line:", error);
      toast.error("Failed to play AI line");
      callback(); // Call callback anyway to continue flow
    }
  };

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Show loading state while fetching document
  if (documentId && isDocumentLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground">Loading document...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/documents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {documentId
              ? documentName || "View Document"
              : "Convert Document to Audio"}
          </h1>
        </div>
        {!documentContent && !isLoading ? (
          <FileDropzone onFileSelected={handleFileSelected} />
        ) : showInteractiveMode ? (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-start mb-4">
              <Button
                variant="outline"
                onClick={() => setShowInteractiveMode(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Document
              </Button>
            </div>
            <ScriptPractice
              content={documentContent}
              onPlayAILine={handlePlayAILine}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <DocumentPreview
                content={documentContent}
                isLoading={isLoading}
                currentLine={currentLineIndex}
                isScript={isScript}
              />
              {audioUrl && (
                <div className="mt-6">
                  <AudioPlayer
                    audioUrl={audioUrl}
                    timestamps={timestamps}
                    onLineChange={setCurrentLineIndex}
                    showTranscript={true}
                  />
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <DocumentActions
                onConvert={handleConvertToAudio}
                onStartInteractive={
                  isScript ? handleStartInteractive : undefined
                }
                isScript={isScript}
                isConverting={isConverting}
                voiceId={voiceId}
                speed={speed}
                onVoiceChange={setVoiceId}
                onSpeedChange={(value) => setSpeed(value[0])}
              />
              {documentName && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2">Document Info</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Name:</strong> {documentName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Size:</strong> {Math.round(documentSize / 1024)}{" "}
                      KB
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Type:</strong> {documentType}
                    </p>
                    {isScript && (
                      <p className="text-sm font-medium text-primary mt-2">
                        Script format detected!
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
