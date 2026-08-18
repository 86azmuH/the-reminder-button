"use client";

import { useState } from "react";

export default function ReminderPage({ secretSlug }) {
  const [isSending, setIsSending] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendEmail() {
    if (isSending) return;

    setIsSending(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-link": secretSlug,
        },
        body: JSON.stringify({
          customMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The email could not be sent.");
      }

      setMessage("Success! The email was sent with the image attached.");
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="table-scene" aria-hidden="true">
        <span className="chip chip-top chip-blue" />
        <span className="chip chip-top chip-green" />
        <span className="chip chip-top chip-red" />
        <span className="card-stack card-stack-left" />
      </div>

      <section className="content-panel" aria-label="Send reminder email">
        <div className="title-mark title-mark-top" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <h1>Remind him</h1>
        <div className="title-mark title-mark-bottom" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>

        <div className="attachment-panel">
          <img src="/email-image.png" alt="Email attachment preview" className="image-preview" />
          <div className="attachment-icon" aria-hidden="true">
            <span />
          </div>
          <div className="attachment-copy">
            <h2>Attached image</h2>
            <p>This image will be included in the email.</p>
          </div>
        </div>

        <section className="message-section" aria-labelledby="message-title">
          <div className="message-heading">
            <div className="message-icon" aria-hidden="true">
              <span />
            </div>
            <h2 id="message-title">Your message</h2>
          </div>
          <textarea
            id="custom-message"
            className="message-input"
            aria-label="Custom email message"
            placeholder="Write your message here..."
            value={customMessage}
            onChange={(event) => setCustomMessage(event.target.value.slice(0, 500))}
            maxLength={500}
            rows={5}
            disabled={isSending}
          />
          <p className="message-count">{customMessage.length} / 500</p>
        </section>

        <button className="send-button" onClick={sendEmail} disabled={isSending}>
          <span aria-hidden="true" />
          {isSending ? "Sending..." : "Send email"}
        </button>

        {message && <p className="status success">{message}</p>}
        {error && <p className="status error">{error}</p>}
      </section>
    </main>
  );
}
