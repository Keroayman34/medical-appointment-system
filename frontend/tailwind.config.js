/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#355872",
        accent: "#7AAACE",
        skysoft: "#9CD5FF",
        cream: "#F7F8F0",
      },
      fontSize: {
        // Page titles / Main headings
        h1: ["2.25rem", { lineHeight: "2.5rem", fontWeight: "700" }], // 36px
        // Section headings
        h2: ["1.875rem", { lineHeight: "2.25rem", fontWeight: "700" }], // 30px
        // Card titles / Subheadings
        h3: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }], // 24px
        // Subsection headings
        h4: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }], // 20px
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fit, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [],
};
