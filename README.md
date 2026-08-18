# The Reminder Button

A small website built to make sure one unfortunate poker moment is never forgotten.

During a casual poker game, one player built up a huge chip lead and confidently shared a photo of it. The lead did not last.

The Reminder Button turns that dramatic reversal into a playful technical demo: an invited visitor can send a custom reminder, complete with an anonymized version of the original photo.

## What It Does

- Provides an unlisted page accessible through a secret link
- Lets visitors write a custom message of up to 500 characters
- Sends the message to a configured recipient
- Attaches the original poker-chip photo to every email
- Shows loading, success, and error feedback
- Uses a one-minute, per-IP cooldown to discourage repeated sends
- Works across desktop and mobile with a custom poker-themed interface

## How It Works

The site is built with Next.js 16 and React 19 using the App Router.

The frontend sends the visitor's message to `/api/send-email`, a server-side Next.js route. The route checks the secret-link value, limits the message length, escapes it for safe HTML insertion, and sends the email through Gmail using Nodemailer, with the original photo attached.

The source code is stored on GitHub, while Vercel builds and hosts the frontend and API route.

Email credentials, the recipient address, and the secret route are stored as environment variables rather than being included in the repository.

## Tech Stack

- Next.js 16
- React 19
- JavaScript
- Custom CSS
- Nodemailer
- Gmail SMTP
- Vercel

## Privacy and Safety

The website does not have a public homepage. Instead, it uses an unlisted URL with a secret slug as a lightweight way to limit access to invited visitors.

Messages are sent through the server rather than directly from the browser, keeping the email credentials hidden. User-provided text is also escaped before being inserted into the HTML email.

## Local Development

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`, then provide values for:

```text
GMAIL_USER
GMAIL_APP_PASSWORD
TARGET_EMAIL
SECRET_LINK_SLUG
```

Open `http://localhost:3000/r/your-secret-slug`, replacing `your-secret-slug` with the value of `SECRET_LINK_SLUG`.

For detailed configuration and deployment instructions, see [`SETUP.md`](SETUP.md).

## Current Limitations

This is a playful personal project, not a public-facing product.

- The secret link is lightweight access control, not full authentication.
- The cooldown is stored in memory and may reset when a serverless instance restarts.
- The site supports one configured recipient and one attached image.
- Gmail requires an app password rather than the account's regular password.

## Why This Exists

Because a dramatic comeback deserves a memorable technical demo.
