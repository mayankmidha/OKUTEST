import type { Metadata } from "next";
import HomeHero from "@/components/HomeHero";

export const metadata: Metadata = {
  title: "Oku Therapy | Come as you are",
  description: "We hold space for your healing. Discover a trauma-informed, inclusive approach to mental wellness.",
};

export default function HomePage() {
  return <HomeHero />;
}
