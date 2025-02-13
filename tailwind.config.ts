import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "banner-color" : "#0F1213",
        "banner" : "#0F1213",
        "black-1": "#242425",
        "black-2" : "#222427",
        "black-3": "#353739",
        "black-border": "#43474A",
        "balance" : "#8e9aa3",
        "red-1" : "#ff3862",
        "purple" : "#6144e5",
        "purple-bright" : "#7370FE",
        "purple-txt" : "#5F3AAD",
        "gray" : "#7774",
        "gray-bright" : "#313132",
        "gray-txt" : "#6D6D6D",
        "gray-txt-1" : "#808080",
        "yellow" : "#E4731E",
        "modal" : "#212428",
        "modal-title" : "#2a3039",
        "menu": "#1A1B1F",
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      }
    },
  },
  plugins: [],
};
export default config;
