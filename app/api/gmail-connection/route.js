import { NextResponse } from "next/server.js";
import {
  clearFintrakUserGmailConnection,
  getFintrakUserById,
} from "../../lib/fintrakUsers.js";
import { revokeGoogleToken } from "../../lib/googleOAuth.js";
import {
  reportServerError,
  reportServerWarning,
} from "../../lib/observability.server.js";
import { readSessionFromRequest } from "../../lib/serverAuth.js";
import { decryptSecretValue } from "../../lib/serverSecrets.js";
import {
  getSupabaseAdmin,
  hasSupabaseAdminConfig,
} from "../../lib/supabaseAdmin.js";

export async function DELETE(req) {
  try {
    const session = readSessionFromRequest(req);
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig()) {
      return NextResponse.json(
        { error: "Supabase is not configured for Gmail disconnect." },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { user, error } = await getFintrakUserById(supabase, session.id);

    if (error || !user) {
      if (error) {
        await reportServerError({
          event: "gmail.disconnect.user_lookup_failed",
          message: "Failed to load FinTrak user during Gmail disconnect.",
          error,
          request: req,
          context: { sessionUserId: session.id },
        });
      }

      return NextResponse.json(
        { error: "Could not load your Gmail connection." },
        { status: 500 }
      );
    }

    let warning = "";

    if (user.gmailRefreshToken) {
      let refreshToken = "";

      try {
        refreshToken = decryptSecretValue(user.gmailRefreshToken);
      } catch (decryptError) {
        await reportServerError({
          event: "gmail.disconnect.token_decrypt_failed",
          message: "Failed to decrypt Gmail refresh token during disconnect.",
          error: decryptError,
          request: req,
          context: { sessionUserId: session.id },
        });
        warning =
          "Gmail was disconnected in FinTrak, but Google access may need to be removed manually.";
      }

      if (refreshToken) {
        try {
          await revokeGoogleToken(refreshToken);
        } catch (revokeError) {
          const message =
            revokeError instanceof Error
              ? revokeError.message
              : "Google token revocation failed";

          if (revokeError?.status === 400) {
            await reportServerWarning({
              event: "gmail.disconnect.token_already_invalid",
              message:
                "Google reported the Gmail token was already invalid during disconnect.",
              request: req,
              context: {
                sessionUserId: session.id,
                googleMessage: message,
              },
            });
          } else {
            await reportServerError({
              event: "gmail.disconnect.revoke_failed",
              message: "Failed to revoke Gmail access during disconnect.",
              error: revokeError,
              request: req,
              context: { sessionUserId: session.id },
            });
            warning =
              "Gmail was disconnected in FinTrak, but Google access may need to be removed manually.";
          }
        }
      }
    }

    const { error: clearError } = await clearFintrakUserGmailConnection(
      supabase,
      user.id
    );

    if (clearError) {
      await reportServerError({
        event: "gmail.disconnect.clear_failed",
        message: "Failed to clear saved Gmail connection.",
        error: clearError,
        request: req,
        context: { sessionUserId: session.id },
      });

      return NextResponse.json(
        { error: "Could not disconnect Gmail right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      gmailConnected: false,
      warning: warning || null,
    });
  } catch (error) {
    await reportServerError({
      event: "gmail.disconnect.unexpected_error",
      message: "Unexpected Gmail disconnect error.",
      error,
      request: req,
    });
    return NextResponse.json(
      { error: "Unexpected Gmail disconnect error." },
      { status: 500 }
    );
  }
}
