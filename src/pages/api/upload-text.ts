import type { APIRoute } from "astro";
import { supabase } from "@/services/supabase";

export const post: APIRoute = async ({ request, locals }) => {
  // Parse form data
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const isScript = formData.get("isScript") === "true";

  // Auth (assume locals.user contains user info)
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Validate file
  const allowedExts = [
    "pdf",
    "docx",
    "txt",
    "html",
    "rtf",
    "fdx",
    "fdr",
    "fdxt",
  ];
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!file || !ext || !allowedExts.includes(ext)) {
    return new Response(JSON.stringify({ error: "Unsupported file type" }), {
      status: 400,
    });
  }
  if (file.size > 10 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: "File too large" }), {
      status: 400,
    });
  }

  // Upload to Supabase Storage
  const storagePath = `${user.id}/${crypto.randomUUID()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, { upsert: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // Insert metadata into Supabase DB
  const { error: dbError } = await supabase.from("documents").insert([
    {
      user_id: user.id,
      filename: file.name,
      storage_path: storagePath,
      upload_time: new Date().toISOString(),
      file_type: ext,
      file_size: file.size,
      is_script: isScript,
    },
  ]);
  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), {
      status: 500,
    });
  }

  // Success response
  return new Response(
    JSON.stringify({
      success: true,
      filename: file.name,
      isScript,
      storagePath,
    }),
    { status: 200 },
  );
};
