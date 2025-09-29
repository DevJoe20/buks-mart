import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,   
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email, full_name } = await req.json();
    console.log("Incoming:", email, full_name);

    if (!email || !full_name) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    // check if email already exists
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: "You are already subscribed!" },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("subscribers")
      .insert([{ email, full_name }]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
