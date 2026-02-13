import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

async function getGoogleUser(accessToken) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const user = await res.json();
  if (!user?.sub) return null;

  return user;
}

async function getUserFromRequest(req) {
  const auth = req.headers.get("authorization") || "";
  const accessToken = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!accessToken) return null;

  return getGoogleUser(accessToken);
}

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("category_overrides")
      .eq("user_sub", user.sub)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      categoryOverrides: data?.category_overrides || {},
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load user data" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const categoryOverrides =
      body?.categoryOverrides && typeof body.categoryOverrides === "object"
        ? body.categoryOverrides
        : {};

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("user_profiles").upsert(
      {
        user_sub: user.sub,
        email: user.email || null,
        category_overrides: categoryOverrides,
      },
      { onConflict: "user_sub" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save user data" },
      { status: 500 }
    );
  }
}
