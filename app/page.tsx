import { WpPage } from "@/components/wp-page";

export default function Home() {
  // This renders the high-fidelity WordPress/Elementor export (195KB of HTML/CSS)
  // which contains every section, cloud, and leaf exactly as you requested.
  return <WpPage slug="home" />;
}
