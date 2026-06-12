import type { Metadata } from "next";
import { ProfileContent } from "@/components/profile-content";

export const metadata: Metadata = {
  title: "My Votes",
  description: "Review your VALOVOTE voting history.",
};

export default function ProfilePage() {
  return <ProfileContent items={[]} />;
}
