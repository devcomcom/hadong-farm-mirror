// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

// Supabase 클라이언트 설정
const supabaseUrl = "https://ktqrlpycogsjbdfkbnbl.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cXJscHljb2dzamJkZmtibmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NjE2NjcsImV4cCI6MjA1NjEzNzY2N30.cqo7sWh0Q2iss4258XU4HC22oXgdJ_vJC2IVE7y3TEU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Hello from Functions!");

Deno.serve(async (req) => {
    if (req.method === "POST") {
        try {
            const body = await req.json();
            // Clerk 웹훅 이벤트 타입 확인
            const eventType = body.type;

            // user.created 이벤트만 처리
            if (eventType !== "user.created") {
                return new Response(
                    JSON.stringify({ message: "Ignored event type" }),
                    { status: 200 }
                );
            }

            const { email_addresses } = body.data;

            if (!email_addresses?.[0]?.email_address) {
                throw new Error("Email address is required");
            }

            // users 테이블에 새로운 사용자 추가
            const { data, error } = await supabase
                .from("users")
                .insert([
                    {
                        email: email_addresses[0].email_address,
                        role: "ROLELESS", // 기본값 설정
                    },
                ])
                .select();

            if (error) throw error;

            return new Response(
                JSON.stringify({
                    message: "User created successfully",
                    user: data,
                }),
                { status: 201 }
            );
        } catch (error) {
            console.error("Error processing webhook:", error);
            return new Response(
                JSON.stringify({
                    error: error.message || "Internal server error",
                }),
                { status: 500 }
            );
        }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
        headers: { "Content-Type": "application/json" },
        status: 405,
    });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/clerk-hook' \
    --header 'Authorization: Bearer <your_token>' \
    --header 'Content-Type: application/json' \
    --data '{"email":"user@example.com", "name":"User Name", "contact":"1234567890", "role":"WORKER"}'

*/
