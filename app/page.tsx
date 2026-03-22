import { WpContentOnly } from "@/components/wp-content-only";
import { buildRouteMetadata } from "@/lib/wp-content";
import type { Metadata } from "next";

export const metadata: Metadata = buildRouteMetadata("home");

export default function HomePage() {
  return <WpContentOnly slug="home" />;
}
