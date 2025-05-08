import { createClient } from "@supabase/supabase-js";

// Using Vite env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL and Anon Key must be set in environment variables",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Document interface
export interface Document {
  id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  upload_time: string;
  file_type: string;
  file_size: number;
  is_script: boolean;
}

/**
 * Fetches all documents for the current user
 */
export const getUserDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("upload_time", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }

  return data || [];
};

/**
 * Fetches a single document by ID
 */
export const getDocumentById = async (id: string): Promise<Document | null> => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching document:", error);
    return null;
  }

  return data;
};

/**
 * Gets a download URL for a document
 */
export const getDocumentUrl = async (
  storagePath: string,
): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry

  if (error || !data?.signedUrl) {
    console.error("Error getting document URL:", error);
    return null;
  }

  return data.signedUrl;
};

/**
 * Deletes a document from storage and database
 */
export const deleteDocument = async (
  id: string,
  storagePath: string,
): Promise<boolean> => {
  try {
    // First delete from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([storagePath]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      return false;
    }

    // Then delete from database
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Error deleting from database:", dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    return false;
  }
};
