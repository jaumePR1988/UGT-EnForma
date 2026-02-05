/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#E30613", // UGT Red
                "background-light": "#F3F4F6",
                "background-dark": "#111827",
                "card-light": "#FFFFFF",
                "card-dark": "#1F2937",
                "ugt-red": "#E30613",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
            },
        },
    },
    plugins: [],
}
