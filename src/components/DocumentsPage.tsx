import FileDropzone, {
  FileDropzoneHandle,
} from "@/components/FileUpload/FileDropzone";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, FileText, MoreVertical, Play, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Document type definition
interface DocumentItem {
  id: string;
  name: string;
  date: string;
  type: string;
  size: string;
  isScript: boolean;
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dropzoneRef = useRef<FileDropzoneHandle>(null);

  // Fetch documents from backend
  const fetchDocuments = async () => {
    setLoading(true);
    setUploadError(null);
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setUploadError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle file upload
  const handleFileSelected = async (file: File, isScript: boolean) => {
    setUploading(true);
    setUploadError(null);
    setSuccess(false);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("isScript", String(isScript));
    try {
      const res = await fetch("/api/upload-text", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setSuccess(true);
      await fetchDocuments();
    } catch (err) {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <Button
            onClick={() => dropzoneRef.current?.triggerFileInput()}
            type="button"
          >
            Upload New Document
          </Button>
        </div>
        {/* Upload Dropzone */}
        <div className="mb-8">
          <FileDropzone ref={dropzoneRef} onFileSelected={handleFileSelected} />
          {uploading && <div className="mt-2 text-primary">Uploading...</div>}
          {uploadError && (
            <div className="mt-2 text-destructive">{uploadError}</div>
          )}
          {success && (
            <div className="mt-2 text-green-600">Upload successful!</div>
          )}
        </div>
        {loading ? (
          <div className="text-center py-12">Loading documents...</div>
        ) : documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="overflow-hidden cursor-pointer"
                onClick={() =>
                  window.location.assign(
                    `/convert?id=${encodeURIComponent(doc.id)}`,
                  )
                }
                tabIndex={0}
                role="button"
                aria-label={`Open ${doc.name} in Convert view`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    window.location.assign(
                      `/convert?id=${encodeURIComponent(doc.id)}`,
                    );
                }}
              >
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    {doc.isScript && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        Script
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" /> Play
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Documents Yet</h2>
            <p className="text-muted-foreground mb-6">
              Upload your first document to get started
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentsPage;
