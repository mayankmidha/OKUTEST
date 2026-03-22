import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "About Us | Oku Therapy",
  description: "Learn about our philosophy, our approach to trauma-informed care, and our commitment to inclusivity.",
};

export default function Page() {
  return <AboutPage />;
}
