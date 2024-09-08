import lineClamp from "@tailwindcss/line-clamp";

const tailwindConfig = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [lineClamp],
};

export default tailwindConfig;
