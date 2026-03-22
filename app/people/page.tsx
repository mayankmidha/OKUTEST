import { WpContentOnly } from "@/components/wp-content-only";
import { buildRouteMetadata } from "@/lib/wp-content";
import type { Metadata } from "next";

export const metadata: Metadata = buildRouteMetadata("people");

export default function PeoplePage() {
  return <WpContentOnly slug="people" />;
}
