/** @type {import('tailwindcss').Config} */

export default {
	darkMode: ["class"],
	content: [
		"../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
		"../../apps/web/src/**/*.{js,ts,jsx,tsx,mdx}",
		"../../apps/extension/src/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				fixel: ["Fixel", "sans-serif"],
				sofiaPro: ["Sofia Pro", "sans-serif"]
			},
			colors: {
				dark: '#0A0B0A',
				white: '#FBFFFC',
				slate: {
					'600': '#D9D9D9',
					'700': '#898989'
				},
				green: {
					'300': '#57FFC1'
				},
				purple: {
					'300': '#515CEC'
				},
			},
		},
		container: {
			center: 'true',
			padding: '1rem',
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1325px'
			}
		}
	},

	plugins: [require("tailwindcss-animate")],
};
