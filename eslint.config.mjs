import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "supabase/.temp/**",
      "supabase/.branches/**",
      "public/images/home-automation/**",
    ],
  },
];

export default config;
