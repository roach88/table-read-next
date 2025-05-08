import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("sb-access-token")?.value;
  if (cookie) {
    const { data, error } = await supabase.auth.getUser(cookie);
    // Optionally, you could block access if not authenticated:
    // if (!data?.user) return NextResponse.redirect('/login');
    // Or just log for now
    if (data?.user) {
      // User is authenticated
      // You can't mutate request in middleware, but you can set headers or rewrite if needed
    }
  }
  return NextResponse.next();
}
