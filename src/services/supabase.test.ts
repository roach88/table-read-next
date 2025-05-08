import { describe, it, expect, afterAll } from "vitest";
import { supabase } from "./supabase";

// Test that the Supabase client initializes correctly

describe("Supabase Client", () => {
  it("should initialize the client", () => {
    expect(supabase).toBeDefined();
  });

  it("should list contents of the documents storage bucket", async () => {
    const { data, error } = await supabase.storage.from("documents").list("");
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});

const TEST_BUCKET = "test-bucket"; // Change to your test bucket name
const TEST_FILE_PATH = "test-folder/test-file.txt";
const TEST_FILE_CONTENT = new Blob(["hello world"], { type: "text/plain" });

// Helper to upload using supabase client directly
const uploadFile = async (bucket: string, path: string, file: Blob) => {
  return await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: "text/plain",
  });
};

describe("Supabase File Upload", () => {
  it("uploads a file successfully", async () => {
    const { data, error } = await uploadFile(
      TEST_BUCKET,
      TEST_FILE_PATH,
      TEST_FILE_CONTENT,
    );
    expect(error).toBeNull();
    expect(data).toBeTruthy();
    // Optionally: fetch file metadata to confirm
    const { data: fileData, error: listError } = await supabase.storage
      .from(TEST_BUCKET)
      .list("test-folder");
    expect(listError).toBeNull();
    expect(fileData?.some((f) => f.name === "test-file.txt")).toBe(true);
  });

  afterAll(async () => {
    // Clean up: delete the test file
    await supabase.storage.from(TEST_BUCKET).remove([TEST_FILE_PATH]);
  });
});
