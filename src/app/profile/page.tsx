import type { Metadata } from "next";
import { ProfileContent } from "@/components/profile-content";
import { getUserVotedItems } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Votes",
  description: "Review your VALOVOTE voting history.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  const items = user ? await getUserVotedItems(user.id) : [];

  return <ProfileContent items={items} />;
}
