/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [],
    darkMode: "class", // 使用 class 控制主题
    theme: {
        extend: {
            colors: {
                greenTheme: { background: '#e0f2f1' },
                purpleTheme: { background: '#ede7f6' },
            },
        },
    },
}