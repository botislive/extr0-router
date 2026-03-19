import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {}
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  const json = await req.json();

  // The Hono backend Router runs on Port 3000 locally.
  const backendUrl = "http://127.0.0.1:3000/v1/chat/completions";

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The router's authMiddleware now accepts standard Supabase session tokens
        "Authorization": `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        messages: json.messages,
        stream: true
      })
    });

    if (!response.ok) {
       const err = await response.text();
       return new Response(err, { status: response.status });
    }

    // Pipe the Vercel AI SDK string stream back to the original client
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });
  } catch (error) {
    console.error("[Proxy Error]", error);
    return new Response(JSON.stringify({ error: "Gateway Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
