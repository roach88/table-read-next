import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import FileDropzone from "@/components/FileUpload/FileDropzone";
import DocumentPreview from "@/components/Document/DocumentPreview";
import DocumentActions from "@/components/Document/DocumentActions";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import ScriptPractice from "@/components/Interactive/ScriptPractice";
import {
  parseDocument,
  synthesizeSpeech,
  isScriptFormat,
} from "@/services/elevenlabs";
import { createAudioObjectUrl, createTimestamps } from "@/utils/audio";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const ConvertPage = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isScript, setIsScript] = useState<boolean>(false);
  const [voiceId, setVoiceId] = useState<string>("21m00Tcm4TlvDq8ikWAM"); // Default voice
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [timestamps, setTimestamps] = useState<
    Array<{ time: number; lineIndex: number }>
  >([]);
  const [showInteractiveMode, setShowInteractiveMode] =
    useState<boolean>(false);

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
    setAudioUrl("");
    setCurrentLineIndex(-1);
    try {
      const content = await parseDocument(file);
      setDocumentContent(content);
      // Check if the document appears to be a script
      const scriptDetected = isScriptFormat(content);
      setIsScript(scriptDetected);
      setTimestamps(createTimestamps(content));
    } catch (error) {
      console.error("Error parsing document:", error);
      toast({
        variant: "destructive",
        title: "Error parsing document",
        description:
          "Failed to read the uploaded file. Please try again with a different file.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToAudio = async () => {
    if (!documentContent) {
      toast({
        variant: "destructive",
        title: "No document content",
        description: "Please upload a document first.",
      });
      return;
    }
    setIsConverting(true);
    try {
      const audioBlob = await synthesizeSpeech({
        text: documentContent,
        voiceId,
        speed,
      });
      if (audioBlob) {
        const url = createAudioObjectUrl(audioBlob);
        setAudioUrl(url);
      }
    } catch (error) {
      console.error("Error converting to audio:", error);
      toast({
        variant: "destructive",
        title: "Error converting to audio",
        description:
          "Failed to convert document to audio. Please try again later.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleStartInteractive = () => {
    setShowInteractiveMode(true);
  };

  const handlePlayAILine = (text: string, callback: () => void) => {
    // In a real implementation, this would use ElevenLabs to synthesize and play the AI line
    toast({
      title: "AI Speaking",
      description: text,
    });
    // Simulate AI speech completion after a delay based on text length
    const delay = Math.min(1000 + text.length * 50, 5000);
    setTimeout(() => {
      callback();
    }, delay);
  };

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Convert Document to Audio</h1>
        {!selectedFile ? (
          <FileDropzone onFileSelected={handleFileSelected} />
        ) : showInteractiveMode ? (
          <div className="grid grid-cols-1 gap-6">
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
              />
              {audioUrl && (
                <div className="mt-6">
                  <AudioPlayer
                    audioUrl={audioUrl}
                    timestamps={timestamps}
                    onLineChange={setCurrentLineIndex}
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
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">Document Info</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Name:</strong> {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Size:</strong>{" "}
                    {Math.round(selectedFile.size / 1024)} KB
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Type:</strong> {selectedFile.type}
                  </p>
                  {isScript && (
                    <p className="text-sm font-medium text-primary mt-2">
                      Script format detected!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConvertPage;
