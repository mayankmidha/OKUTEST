import type { Metadata } from "next";
import PeoplePage from "@/components/PeoplePage";

export const metadata: Metadata = {
  title: "Our People | Oku Therapy",
  description: "Meet the practitioners at Oku Therapy. A collective of clinicians dedicated to inclusive, trauma-informed care.",
};

export default function Page() {
  return <PeoplePage />;
}
