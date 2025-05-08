import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  MoreVertical,
  Play,
  Trash2,
  Clock,
  Loader2,
  FileAudio,
  FileBarChart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabase";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TTSPlayer from "@/components/TTSPlayer";

interface Document {
  id: string;
  filename: string;
  upload_time: string;
  file_type: string;
  file_size: number;
  is_script: boolean;
  storage_path: string;
}

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [showTTSDialog, setShowTTSDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );

  // Fetch documents from Supabase
  const {
    data: documents = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("upload_time", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get icon based on file type
  const getFileIcon = (fileType: string) => {
    if (["mp3", "wav", "ogg", "m4a"].includes(fileType)) {
      return <FileAudio className="h-6 w-6 text-primary" />;
    }
    if (["pdf", "docx", "txt", "html", "rtf"].includes(fileType)) {
      return <FileText className="h-6 w-6 text-primary" />;
    }
    if (["fdx", "fdr", "fdxt"].includes(fileType)) {
      return <FileBarChart className="h-6 w-6 text-primary" />;
    }
    return <FileText className="h-6 w-6 text-primary" />;
  };

  // Handle play button click
  const handlePlay = (doc: Document) => {
    navigate(`/convert?id=${doc.id}`);
  };

  // Handle document deletion
  const handleDelete = async (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  // Confirm document deletion
  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([documentToDelete.storage_path]);

      if (storageError) {
        throw new Error(storageError.message);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentToDelete.id);

      if (dbError) {
        throw new Error(dbError.message);
      }

      toast.success("Document deleted successfully");
      refetch(); // Refresh the document list
    } catch (error) {
      toast.error("Failed to delete document");
      console.error("Delete error:", error);
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  // Open TTS dialog
  const handleOpenTTS = (doc: Document) => {
    setSelectedDocument(doc);
    setShowTTSDialog(true);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <Link to="/convert">
            <Button>Upload New Document</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <div className="p-4 bg-destructive/10 rounded-full inline-block mb-4">
              <FileText className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Failed to Load Documents
            </h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading your documents
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{doc.filename}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{doc.file_type.toUpperCase()}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(doc.upload_time)}</span>
                        </div>
                      </div>
                    </div>
                    {doc.is_script && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        Script
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlay(doc)}
                    >
                      <Play className="h-4 w-4 mr-1" /> Play
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(doc)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenTTS(doc)}>
                          Text to Speech
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePlay(doc)}>
                          View Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(doc)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            <Link to="/convert">
              <Button>Upload Document</Button>
            </Link>
          </div>
        )}
      </div>

      {/* TTS Dialog */}
      <Dialog open={showTTSDialog} onOpenChange={setShowTTSDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Text to Speech</DialogTitle>
            <DialogDescription>
              Generate speech from{" "}
              {selectedDocument?.filename || "document text"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <TTSPlayer />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTTSDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.filename}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DocumentsPage;
