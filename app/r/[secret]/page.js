import { notFound } from "next/navigation";
import ReminderPage from "../../components/ReminderPage";

export default async function SecretReminderPage({ params }) {
  const { secret } = await params;

  if (!process.env.SECRET_LINK_SLUG || secret !== process.env.SECRET_LINK_SLUG) {
    notFound();
  }

  return <ReminderPage secretSlug={secret} />;
}
