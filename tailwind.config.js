/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-300": "#41EC16",
                "primary-100": "#96FF7C",
                "hover-100": "#D6D9EA",
                "hover-white": "#D4D4D4",
                white: "#FFFFFF",
                background: "#0E130E",
                frame:"#C3C3C3",
                error: "#FF0000",
            },
            fontFamily: {
                pretendard: ["Pretendard", "sans-serif"],
                hs:["HsJandari"]
            },
            fontSize: {
                "title": ["160px"],
                "heading-logo": ["50px"]
            },
        },
    },
    plugins: [],
};
