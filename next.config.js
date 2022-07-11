/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
	reactStrictMode: true,
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	images: {
		domains: ['tailwindui.com', 'images.unsplash.com', 'lh3.googleusercontent.com', 'api.govip.online'],
	},
	productionBrowserSourceMaps: false,
	i18n,
};
