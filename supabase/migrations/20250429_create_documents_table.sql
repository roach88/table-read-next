-- Migration: Create documents table for uploads
CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    filename text NOT NULL,
    storage_path text NOT NULL,
    upload_time timestamptz NOT NULL DEFAULT now(),
    file_type text NOT NULL,
    file_size integer NOT NULL,
    is_script boolean NOT NULL
);

CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
