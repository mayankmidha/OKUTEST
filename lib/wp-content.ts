import { load } from "cheerio";
import type { Metadata } from "next";

import routesJson from "@/content/generated/routes.json";
import stylesheetsJson from "@/content/generated/stylesheets.json";

// Import compiled static assets directly to avoid Vercel fs.readFileSync crashes
import { content as homeHtml } from "./compiled-wp/home.page.html";
import { content as aboutHtml } from "./compiled-wp/about-us.page.html";
import { content as peopleHtml } from "./compiled-wp/people.page.html";
import { content as footerHtml } from "./compiled-wp/footer.html";
import { content as popupsHtml } from "./compiled-wp/popups.html";

import { content as wpEmojiStyles } from "./compiled-wp/wp-emoji-styles.css";
import { content as classicThemeStyles } from "./compiled-wp/classic-theme-styles.css";
import { content as globalStyles } from "./compiled-wp/global-styles.css";
import { content as wpCustomStyles } from "./compiled-wp/wp-custom.css";
import { content as oceanInlineStyles } from "./compiled-wp/ocean-inline.css";

export type RouteSlug = "home" | "about-us" | "people";

type YoastImage = {
  height?: number;
  type?: string;
  url: string;
  width?: number;
};

type YoastRobots = {
  follow?: string;
  index?: string;
  "max-image-preview"?: string;
  "max-snippet"?: string;
  "max-video-preview"?: string;
};

type YoastData = {
  article_modified_time?: string;
  canonical?: string;
  og_description?: string;
  og_image?: YoastImage[];
  og_locale?: string;
  og_site_name?: string;
  og_title?: string;
  og_type?: string;
  og_url?: string;
  robots?: YoastRobots;
  schema?: Record<string, unknown>;
  title?: string;
  twitter_card?: string;
  twitter_misc?: Record<string, string>;
};

type WpRouteRecord = {
  bodyClass: string;
  modified: string;
  pageId: number;
  path: string;
  slug: RouteSlug;
  title: string;
  yoast?: YoastData;
};

export type PopupEntry = {
  html: string;
  id: string;
};

const SITE_ORIGINS = [
  "https://okutherapy.com",
  "http://okutherapy.com",
  "https://www.okutherapy.com",
  "http://www.okutherapy.com",
];

const ROUTES = routesJson as Record<RouteSlug, WpRouteRecord>;
const STYLESHEETS = stylesheetsJson as string[];

let popupEntriesCache: PopupEntry[] | null = null;

function normalizeExtractedHtml(rawHtml: string): string {
  let normalized = rawHtml;

  for (const origin of SITE_ORIGINS) {
    normalized = normalized.replaceAll(`href="${origin}/about-us/"`, 'href="/about-us"');
    normalized = normalized.replaceAll(`href="${origin}/people/"`, 'href="/people"');
    normalized = normalized.replaceAll(`href="${origin}/therapists/"`, 'href="/therapists"');
    normalized = normalized.replaceAll(`href="${origin}/"`, 'href="/"');
    normalized = normalized.replaceAll(`href='${origin}'`, "href='/'");
  }

  for (const origin of SITE_ORIGINS) {
    normalized = normalized.split(origin).join("");
    normalized = normalized
      .split(origin.replaceAll("/", "\\/"))
      .join("");
  }

  normalized = normalized.replaceAll("&#038;", "&");
  return normalized;
}

function normalizePathname(pathname: string): string {
  const clean = pathname.split("?")[0].split("#")[0] || "/";
  if (clean === "/") {
    return "/";
  }
  return clean.endsWith("/") ? clean : `${clean}/`;
}

function getSlugForPathname(pathname: string): RouteSlug {
  const normalized = normalizePathname(pathname);

  for (const slug of Object.keys(ROUTES) as RouteSlug[]) {
    const routePath = ROUTES[slug].path;
    if (normalized === routePath || normalized === routePath.slice(0, -1)) {
      return slug;
    }
  }

  return "home";
}

export function getWpRoute(slug: RouteSlug): WpRouteRecord {
  return ROUTES[slug];
}

export function getBodyClassForPathname(pathname: string): string {
  const slug = getSlugForPathname(pathname);
  const route = ROUTES[slug];
  return route ? route.bodyClass : "home";
}

export function getPageHtml(slug: RouteSlug): string {
  let rawHtml = "";
  if (slug === "home") rawHtml = homeHtml;
  if (slug === "about-us") rawHtml = aboutHtml;
  if (slug === "people") rawHtml = peopleHtml;
  return normalizeExtractedHtml(rawHtml);
}

export function getHeaderHtml(slug: RouteSlug): string {
  // Placeholder as header.html.ts is missing
  return "";
}

export function getFooterHtml(): string {
  return normalizeExtractedHtml(footerHtml);
}

export function getPopupEntries(): PopupEntry[] {
  if (popupEntriesCache) {
    return popupEntriesCache;
  }

  const html = popupsHtml;
  if (!html) return [];

  const $ = load(html);
  const entries: PopupEntry[] = [];

  $("div[data-elementor-type='popup']").each((_, node) => {
    const popup = $(node);
    const id = popup.attr("data-elementor-id");
    if (!id) {
      return;
    }

    popup.removeAttr("data-elementor-type");
    popup.removeAttr("data-elementor-post-type");

    entries.push({
      id,
      html: $.html(popup) ?? "",
    });
  });

  popupEntriesCache = entries;
  return entries;
}

export function getSchemaJson(slug: RouteSlug): string | null {
  const route = ROUTES[slug];
  const schema = route?.yoast?.schema;
  if (!schema) {
    return null;
  }
  return JSON.stringify(schema);
}

export function getLocalStylesheetPaths(): string[] {
  return STYLESHEETS.map((stylesheet) => {
    try {
      return new URL(stylesheet).pathname;
    } catch {
      return stylesheet.split("?")[0];
    }
  });
}

export type InlineStyleBlock = {
  cssText: string;
  id?: string;
};

export function getPreStylesheetInlineStyles(): InlineStyleBlock[] {
  return [
    {
      cssText: wpEmojiStyles,
      id: "wp-emoji-styles-inline-css",
    },
    {
      cssText: classicThemeStyles,
      id: "classic-theme-styles-inline-css",
    },
    {
      cssText: globalStyles,
      id: "global-styles-inline-css",
    },
  ].filter((entry) => entry.cssText.trim().length > 0);
}

export function getPostStylesheetInlineStyles(): InlineStyleBlock[] {
  return [
    {
      cssText: wpCustomStyles,
      id: "wp-custom-css",
    },
    {
      cssText: oceanInlineStyles,
    },
  ].filter((entry) => entry.cssText.trim().length > 0);
}

export function buildRouteMetadata(slug: RouteSlug): Metadata {
  const route = ROUTES[slug];
  if (!route) return { title: "OKU Therapy" };

  const yoast = route.yoast;

  const description = yoast?.og_description;
  const images =
    yoast?.og_image?.map((image) => ({
      height: image.height,
      type: image.type,
      url: image.url,
      width: image.width,
    })) ?? [];

  const otherMeta: Record<string, string> = {};
  if (yoast?.article_modified_time) {
    otherMeta["article:modified_time"] = yoast.article_modified_time;
  }
  if (yoast?.robots?.["max-snippet"]) {
    otherMeta["robots:max-snippet"] = yoast.robots["max-snippet"];
  }
  if (yoast?.robots?.["max-image-preview"]) {
    otherMeta["robots:max-image-preview"] = yoast.robots["max-image-preview"];
  }
  if (yoast?.robots?.["max-video-preview"]) {
    otherMeta["robots:max-video-preview"] = yoast.robots["max-video-preview"];
  }

  const metadata: Metadata = {
    alternates: yoast?.canonical
      ? {
          canonical: yoast.canonical,
        }
      : undefined,
    description,
    openGraph: {
      description,
      images,
      locale: yoast?.og_locale,
      siteName: yoast?.og_site_name,
      title: yoast?.og_title ?? yoast?.title ?? route.title,
      url: yoast?.og_url ?? route.path,
    },
    other: Object.keys(otherMeta).length > 0 ? otherMeta : undefined,
    robots: yoast?.robots
      ? {
          follow: yoast.robots.follow !== "nofollow",
          index: yoast.robots.index !== "noindex",
        }
      : undefined,
    title: yoast?.title ?? route.title,
    twitter: {
      description,
      images: images.map((image) => image.url),
      title: yoast?.og_title ?? yoast?.title ?? route.title,
    },
  };

  return metadata;
}
