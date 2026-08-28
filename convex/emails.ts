import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? "Movera <hello@movera.com.au>";
const PHONE_DISPLAY = "03 8503 4444";

function thankYouHtml(name: string, movingFrom: string, movingTo: string, moveDate: string) {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f6f3;font-family:Helvetica,Arial,sans-serif;color:#4a5762;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2dcc9;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:#1b2a38;padding:22px 28px;">
                <div style="font-size:18px;font-weight:700;letter-spacing:1px;color:#ffffff;">MOVERA</div>
                <div style="font-size:12px;color:#c9d1cc;margin-top:4px;">Melbourne Removalists · Two Men and a Truck</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:22px;color:#22303d;">Thanks, ${firstName} — we've got your request.</h1>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.65;">
                  One of our Melbourne removalists will call you back with a genuine, no-obligation quote.
                  We don't sell your details to five competing movers — you deal with Movera, start to finish.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eef4f8;border:1px solid #c6d8e5;border-radius:10px;padding:16px;margin-bottom:20px;">
                  <tr><td style="font-size:14px;line-height:1.9;color:#22303d;">
                    <strong>Moving from:</strong> ${movingFrom || "—"}<br />
                    <strong>Moving to:</strong> ${movingTo || "—"}<br />
                    <strong>Preferred date:</strong> ${moveDate || "—"}
                  </td></tr>
                </table>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.65;">
                  Need to move sooner, or want to add details? Call us on
                  <strong style="color:#2c5f8a;">${PHONE_DISPLAY}</strong>.
                </p>
                <p style="margin:18px 0 0;font-size:13px;color:#7c8790;line-height:1.6;">
                  Every Movera move includes $100,000 goods-in-transit cover, trained and background-checked
                  crews, and one coordinator managing your job end to end.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f7f6f3;border-top:1px solid #e2dcc9;padding:18px 28px;font-size:12px;color:#7c8790;">
                Movera · Melbourne, VIC · ${PHONE_DISPLAY}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Sends the automatic "Thank You" email to a customer after they submit the
 * landing-page quote form. Requires RESEND_API_KEY (and optionally
 * RESEND_FROM_ADDRESS) to be set in the Convex deployment environment. When the
 * key is absent the action logs and exits without failing the submission.
 */
export const sendQuoteThankYou = internalAction({
  args: {
    quoteId: v.id("quoteRequests"),
    name: v.string(),
    email: v.string(),
    movingFrom: v.string(),
    movingTo: v.string(),
    moveDate: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping thank-you email");
      return null;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [args.email],
        subject: "Thanks for your quote request — Movera Removalists Melbourne",
        html: thankYouHtml(args.name, args.movingFrom, args.movingTo, args.moveDate),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend request failed (${response.status}): ${body}`);
    }

    await ctx.runMutation(internal.emails.markThankYouSent, { quoteId: args.quoteId });
    return null;
  },
});

export const markThankYouSent = internalMutation({
  args: { quoteId: v.id("quoteRequests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.quoteId, { thankYouEmailSent: true });
    return null;
  },
});
