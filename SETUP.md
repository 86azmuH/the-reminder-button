# Setup Guide

This project is a simple Next.js website. When someone clicks the button, the frontend calls `/api/send-email`, and the backend sends an email through Gmail with a local image attached.

## 1. Install Dependencies

Run this in the project folder:

```bash
npm install
```

## 2. Add the Image

The image file belongs here:

```text
public/email-image.png
```

The API route currently expects the image to be named:

```text
email-image.png
```

To replace the placeholder, delete `public/email-image.png` and put your own image in the same folder with the same filename.

To use a different filename, open:

```text
app/api/send-email/route.js
```

Then change this line near the top:

```js
const IMAGE_FILENAME = "email-image.png";
```

For example:

```js
const IMAGE_FILENAME = "my-photo.jpg";
```

If you change the filename, also update the preview image in `app/page.js`:

```js
<img src="/email-image.png" alt="Email attachment preview" className="image-preview" />
```

## 3. Create `.env.local`

Private values go in a file named:

```text
.env.local
```

Create that file in the root of the project, next to `package.json`.

You can copy the example file:

```bash
copy .env.example .env.local
```

On macOS or Linux, use:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```bash
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_16_character_google_app_password
TARGET_EMAIL=recipient@example.com
SECRET_LINK_SLUG=replace_with_a_long_random_slug
```

## 4. Environment Variables

### `GMAIL_USER`

This is the Gmail address that sends the message:

```bash
GMAIL_USER=your_gmail_address@gmail.com
```

### `GMAIL_APP_PASSWORD`

This is a Google App Password for the Gmail account:

```bash
GMAIL_APP_PASSWORD=your_16_character_google_app_password
```

Do not use your normal Gmail password. In your Google Account, turn on 2-Step Verification, then create an App Password for this project. Paste the 16-character password into `.env.local`.

Do not put the app password in frontend code. It must stay private on the backend so other people cannot use your Gmail account to send emails.

### `TARGET_EMAIL`

This is the email address that receives the message:

```bash
TARGET_EMAIL=recipient@example.com
```

### `SECRET_LINK_SLUG`

This controls the unlisted route for the page:

```bash
SECRET_LINK_SLUG=replace_with_a_long_random_slug
```

If the value is `replace-with-a-long-random-value`, the page is available at:

```text
/r/replace-with-a-long-random-value
```

The regular homepage `/` returns a 404. The email API also checks this secret so direct requests without it are rejected.

## 5. Run Locally

Start the local development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/r/your-secret-slug
```

## 6. Test the Email Button

1. Make sure `.env.local` exists.
2. Make sure `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `TARGET_EMAIL`, and `SECRET_LINK_SLUG` are filled in.
3. Make sure the image exists at `public/email-image.png`.
4. Run `npm run dev`.
5. Open `http://localhost:3000/r/your-secret-slug`.
6. Edit the custom message if needed.
7. Click **Send email**.
8. Confirm by clicking **Yes, send it**.
9. Check the target recipient inbox.

If sending fails, the site will show an error message. Common causes are a missing environment variable, a normal Gmail password instead of an App Password, or 2-Step Verification not being enabled for the Gmail account.

## 7. Build the Project

To check that the project builds:

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

## 8. Deploy on Vercel

### Option A: Vercel Website

1. Push this project to GitHub.
2. Go to Vercel.
3. Click **Add New Project**.
4. Import the GitHub repository.
5. Keep the default Next.js settings.
6. Add the environment variables listed below.
7. Deploy.

### Option B: Vercel CLI

Install the Vercel CLI:

```bash
npm install -g vercel
```

Preview deploy:

```bash
vercel
```

Production deploy:

```bash
vercel --prod
```

## 9. Add Environment Variables in Vercel

In the Vercel project dashboard:

1. Open your project.
2. Go to **Settings**.
3. Go to **Environment Variables**.
4. Add these variables:

```bash
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_16_character_google_app_password
TARGET_EMAIL=recipient@example.com
SECRET_LINK_SLUG=replace_with_a_long_random_slug
```

Add them for Production, Preview, and Development if you want the same behavior everywhere.

After changing environment variables in Vercel, redeploy the project.

After deployment, the public link will be:

```text
https://your-project-name.vercel.app/r/your-secret-slug
```

## 10. Change the Vercel Site Name or Link

In Vercel:

1. Open your project.
2. Go to **Settings**.
3. Go to **General**.
4. Change the project name if needed.

Vercel gives you a free `.vercel.app` URL. The exact URL is based on the project name and your Vercel account.

To use a custom domain:

1. Open your project in Vercel.
2. Go to **Settings**.
3. Go to **Domains**.
4. Add your domain.
5. Follow Vercel's DNS instructions.

## 11. What Is Free and What May Cost Money

Usually free:

- Running the site locally
- Hosting a small Next.js site on Vercel's free tier
- Using Vercel's generated `.vercel.app` URL
- Sending a small number of emails within Gmail's sending limits

May require payment:

- Buying a custom domain, such as `yourname.com`
- Sending more emails than Gmail allows
- Using paid Vercel features or higher usage limits
- Paid DNS or email services if your domain provider charges for them

## 12. About the Cooldown

The backend includes a simple 60-second cooldown per IP address. This helps prevent accidental double sending without needing a database.

Because Vercel runs serverless functions, this memory can reset or differ between function instances. For serious production rate limiting, use a real database, Redis, or a hosted rate-limit service.
