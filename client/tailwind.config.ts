import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Pastel/Kid-friendly palette
                primary: "#FFB7B2", // Pastel Red
                secondary: "#B5EAD7", // Pastel Green
                accent: "#C7CEEA", // Pastel Purple
                background: "#F9F9F9",
                text: "#4A4A4A",
            },
        },
    },
    plugins: [],
};
export default config;
