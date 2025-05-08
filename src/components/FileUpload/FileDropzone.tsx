import React, { useState, useCallback } from "react";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface FileDropzoneProps {
  onFileSelected: (file: File, isScript: boolean) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isScript, setIsScript] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const allowedExtensions = [
      "pdf",
      "docx",
      "txt",
      "html",
      "rtf",
      "fdx",
      "fdr",
      "fdxt",
    ];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      setUploadError(
        "File type not supported. Please upload PDF, DOCX, TXT, HTML, RTF, FDX, FDR, or FDXT files.",
      );
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description:
          "Please upload PDF, DOCX, TXT, HTML, RTF, FDX, FDR, or FDXT files.",
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      setUploadError("File size exceeds the 10MB limit.");
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size exceeds the 10MB limit.",
      });
      return false;
    }
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      setUploadError(null);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
          setFileUploaded(file);
          onFileSelected(file, isScript);
          toast({
            title: "File uploaded successfully",
            description: `${file.name} is ready for processing.`,
          });
        }
      }
    },
    [onFileSelected, isScript],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadError(null);

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFileUploaded(file);
        onFileSelected(file, isScript);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for processing.`,
        });
      }
    }
  };

  const resetUpload = () => {
    setFileUploaded(null);
    setUploadError(null);
  };

  const acceptExtensions =
    ".pdf,.docx,.txt,.html,.rtf,.fdx,.fdr,.fdxt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/html,application/rtf,application/vnd.finaldraft,application/x-final-draft,application/vnd.finaldraft.template";

  return (
    <Card
      className={`p-6 ${dragActive ? "border-primary border-2" : "border border-dashed"} rounded-lg transition-all duration-200`}
    >
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center p-6 text-center cursor-pointer"
      >
        {fileUploaded ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 animate-fade-in" />
            <div className="space-y-1">
              <p className="font-medium text-xl">File Ready</p>
              <p className="text-muted-foreground">{fileUploaded.name}</p>
            </div>
            <Button variant="outline" onClick={resetUpload} className="mt-4">
              Upload a Different File
            </Button>
          </div>
        ) : uploadError ? (
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive animate-fade-in" />
            <div className="space-y-1">
              <p className="font-medium text-xl">Upload Error</p>
              <p className="text-muted-foreground">{uploadError}</p>
            </div>
            <Button variant="outline" onClick={resetUpload} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <Upload
              className={`h-12 w-12 ${dragActive ? "text-primary" : "text-muted-foreground"} mb-4`}
            />
            <h3 className="text-lg font-semibold">
              Drag and drop your file here
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Support for PDF, DOCX, TXT, HTML, RTF, FDX, FDR, and FDXT files
            </p>
            <div className="flex items-center justify-center mb-4">
              <input
                type="checkbox"
                id="isScript"
                name="isScript"
                checked={isScript}
                onChange={(e) => setIsScript(e.target.checked)}
                className="mr-2"
                aria-label="This is a script (screenplay, stage play, etc.)"
              />
              <label
                htmlFor="isScript"
                className="text-sm select-none cursor-pointer"
              >
                This is a script (screenplay, stage play, etc.)
                <span
                  tabIndex={0}
                  aria-label="Scripts enable interactive features like line practice."
                  className="ml-1 text-muted-foreground cursor-help"
                  title="Scripts enable interactive features like line practice."
                >
                  ℹ️
                </span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors">
                  Browse Files
                </div>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept={acceptExtensions}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default FileDropzone;
