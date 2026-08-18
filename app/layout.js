import "./globals.css";

export const metadata = {
  title: "The Reminder Button",
  description: "Send a playful reminder with a custom message.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
