// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

/** A sidebar link with its icon, from src/styles/docs-icons.css */
const page = (label, slug, icon) => ({ label, slug, attrs: { class: `ic ic-${icon}` } });

// https://astro.build/config
export default defineConfig({
  site: "https://headlessos.com",
  trailingSlash: "never",
  // Docs moved under /docs; keep the old top-level URLs working
  redirects: {
    "/introduction": "/docs/introduction",
    "/getting-started": "/docs/getting-started",
    "/installation": "/docs/installation",
    "/contributing": "/docs/contributing",
    "/roadmap": "/docs/roadmap",
    "/apps/dashboard": "/docs/apps/dashboard",
    "/apps/docker": "/docs/apps/docker",
    "/apps/file-explorer": "/docs/apps/file-explorer",
    "/apps/server-admin": "/docs/apps/server-admin",
    "/apps/terminal": "/docs/apps/terminal",
    "/concepts/architecture": "/docs/concepts/architecture",
    "/concepts/parsing": "/docs/concepts/parsing",
    "/concepts/security": "/docs/concepts/security",
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Astro names a page's stylesheet after its route, as in index@_@astro.css. Cloudflare answers
          // a path with "@" in it with a redirect to its %40 form: a round trip before the page can paint.
          assetFileNames: (asset) => {
            const name = asset.names?.[0] ?? "asset";
            if (!name.includes("@")) return "_astro/[name].[hash][extname]";
            return `_astro/${name.replace(/\.[^.]*$/, "").replaceAll("@", "-")}.[hash][extname]`;
          },
        },
      },
    },
  },
  integrations: [
    // /icon is a noindex design study; a sitemap must list only pages meant for search
    sitemap({ filter: (page) => new URL(page).pathname !== "/icon" }),
    starlight({
      title: "HeadlessOS Docs",
      description:
        "Documentation for HeadlessOS, a desktop for your Linux servers over SSH.",
      logo: {
        src: "./src/assets/logo-mark.svg",
        replacesTitle: false,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/abhee235/headlessos",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/abhee235/headlessos-web/edit/main/src/content/docs/",
      },
      customCss: ["./src/styles/starlight.css", "./src/styles/docs.css", "./src/styles/docs-icons.css"],
      head: [
        // The site's preview image, so a docs link shared in chat or on social media shows a picture
        { tag: "meta", attrs: { property: "og:image", content: "https://headlessos.com/og-image.png" } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "HeadlessOS, a desktop for your Linux servers" } },
        { tag: "meta", attrs: { name: "twitter:image", content: "https://headlessos.com/og-image.png" } },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true } },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
          },
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            page("Docs home", "docs", "book-open"),
            page("Introduction", "docs/introduction", "file-text"),
            page("Quick Start", "docs/getting-started", "rocket"),
            page("Installation", "docs/installation", "download"),
            page("Connect a server", "docs/connect-a-server", "plug"),
          ],
        },
        {
          label: "Using HeadlessOS",
          items: [
            page("The desktop", "docs/guides/desktop", "app-window"),
            page("Sessions and Fleet", "docs/guides/sessions-and-fleet", "network"),
            page("Settings", "docs/guides/settings", "settings"),
          ],
        },
        {
          label: "Apps",
          items: [
            page("Dashboard", "docs/apps/dashboard", "gauge"),
            page("File Explorer", "docs/apps/file-explorer", "folder"),
            page("Terminal", "docs/apps/terminal", "terminal"),
            page("Docker", "docs/apps/docker", "container"),
            page("Services", "docs/apps/services", "cog"),
            page("Task Manager", "docs/apps/task-manager", "activity"),
            page("Server Admin", "docs/apps/server-admin", "server"),
          ],
        },
        {
          label: "AI",
          items: [
            page("Set up AI", "docs/ai/setup", "sparkles"),
            page("AI Agent", "docs/ai/agent", "bot"),
            page("UI Agent", "docs/ai/ui-agent", "wand-sparkles"),
            page("Safety and approvals", "docs/ai/safety", "shield-check"),
            page("LLM Observatory", "docs/ai/observatory", "telescope"),
          ],
        },
        {
          label: "Concepts",
          items: [
            page("Architecture", "docs/concepts/architecture", "layers"),
            page("How parsing works", "docs/concepts/parsing", "braces"),
            page("Security model", "docs/concepts/security", "shield"),
          ],
        },
        {
          label: "Help",
          items: [
            page("Troubleshooting", "docs/troubleshooting", "life-buoy"),
            page("FAQ", "docs/faq", "circle-help"),
            page("Changelog", "docs/changelog", "history"),
          ],
        },
        {
          label: "Project",
          items: [
            page("Contribute", "docs/contributing", "git-pull-request"),
            page("Roadmap", "docs/roadmap", "map"),
          ],
        },
      ],
      components: {
        // Default to light when no theme was picked, like the marketing pages
        ThemeProvider: "./src/components/docs/ThemeProvider.astro",
        Header: "./src/components/docs/Header.astro",
        MobileMenuFooter: "./src/components/docs/MobileMenuFooter.astro",
        PageTitle: "./src/components/docs/PageTitle.astro",
        Head: "./src/components/docs/Head.astro",
      },
      disable404Route: true,
      pagefind: true,
      lastUpdated: true,
    }),
    mdx(),
  ],
});
