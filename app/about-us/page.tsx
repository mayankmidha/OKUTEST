import { WpContentOnly } from "@/components/wp-content-only";
import { buildRouteMetadata } from "@/lib/wp-content";
import type { Metadata } from "next";

export const metadata: Metadata = buildRouteMetadata("about-us");

export default function AboutUsPage() {
  return <WpContentOnly slug="about-us" />;
}
