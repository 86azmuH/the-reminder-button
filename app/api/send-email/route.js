import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

const IMAGE_FILENAME = "email-image.png";
const COOLDOWN_MS = 60 * 1000;

// This in-memory cooldown is intentionally simple and database-free.
// On serverless platforms like Vercel, memory can reset between function instances.
const cooldowns = globalThis.emailSendCooldowns || new Map();
globalThis.emailSendCooldowns = cooldowns;

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function missingEnvironmentValues() {
  return ["GMAIL_USER", "GMAIL_APP_PASSWORD", "TARGET_EMAIL", "SECRET_LINK_SLUG"].filter((key) => !process.env[key]);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request) {
  const missingValues = missingEnvironmentValues();

  if (missingValues.length > 0) {
    return NextResponse.json(
      {
        error: `Missing environment variable(s): ${missingValues.join(", ")}`,
      },
      { status: 500 }
    );
  }

  if (request.headers.get("x-secret-link") !== process.env.SECRET_LINK_SLUG) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const clientIp = getClientIp(request);
  const lastSentAt = cooldowns.get(clientIp) || 0;
  const now = Date.now();

  if (now - lastSentAt < COOLDOWN_MS) {
    const waitSeconds = Math.ceil((COOLDOWN_MS - (now - lastSentAt)) / 1000);
    return NextResponse.json(
      {
        error: `Please wait ${waitSeconds} second(s) before sending another email.`,
      },
      { status: 429 }
    );
  }

  try {
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      payload = {};
    }

    const customMessage = typeof payload.customMessage === "string" && payload.customMessage.trim()
      ? payload.customMessage.trim().slice(0, 500)
      : "No words...";
    const htmlMessage = escapeHtml(customMessage).replaceAll("\n", "<br />");

    // These values come from environment variables so private email settings are not hardcoded.
    // The Gmail app password must stay on the backend because exposing it in browser code would let anyone send email from your account.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const targetEmail = process.env.TARGET_EMAIL;
    const fromEmail = process.env.GMAIL_USER;

    // The local image is read from /public and attached to the email below.
    const imagePath = path.join(process.cwd(), "public", IMAGE_FILENAME);
    const imageBuffer = await readFile(imagePath);

    await transporter.sendMail({
      from: fromEmail,
      to: targetEmail,
      subject: "The Reminder Button",
      text: customMessage,
      html: `<p>${htmlMessage}</p>`,
      attachments: [
        {
          filename: IMAGE_FILENAME,
          content: imageBuffer,
        },
      ],
    });

    cooldowns.set(clientIp, now);

    return NextResponse.json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Email delivery failed.", error);
    return NextResponse.json(
      {
        error: "The email could not be sent.",
      },
      { status: 500 }
    );
  }
}
