/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: token("page"),
        surface: token("surface"),
        ink: token("ink"),
        "ink-2": token("ink-2"),
        accent: token("accent"),
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        meta: ["0.8125rem", { lineHeight: "1.25rem" }],
        body: ["1rem", { lineHeight: "1.5rem" }],
        lead: ["1.25rem", { lineHeight: "1.75rem" }],
        title: ["2.5rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
      },
    },
  },
  darkMode: "media",
  plugins: [],
};
