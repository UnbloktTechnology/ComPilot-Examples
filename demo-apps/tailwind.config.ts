import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				"aeonik-regular": ["Aeonik-Regular"],
			},
			colors: {
				"red-sygnum": "#df2a4f",
			},
		},
	},

	plugins: [],
} satisfies Config;
