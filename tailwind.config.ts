import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Desktop/mobile layout switch runs on pure CSS width via this
      // breakpoint, not JS/device detection. Overriding just "md" here (not
      // touching sm/lg/xl/2xl) moves that threshold from Tailwind's default
      // 768px down to 500px everywhere it's used.
      screens: {
        md: "500px",
      },
      colors: {
        brand: {
          // These 4 map straight to CSS variables set in globals.css. To
          // re-skin this template for a different site, only these 4 values
          // need to change (see :root in app/globals.css) — no component
          // files need to be touched.
          from: "var(--brand-from)",
          to: "var(--brand-to)",
          accent: "var(--brand-accent)",
          accentDark: "var(--brand-accent-dark)",
          // Neutral dark-theme chrome — shared across every site variant.
          dark: "#1a1a1a",
          darker: "#141414",
          panel: "#232323",
        },
      },
    },
  },
  plugins: [],
};

export default config;
