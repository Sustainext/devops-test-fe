const nextConfig = {
  env: {
    BACKEND_API_URL: "https://vapt-be.sustainext.ai",
    // BACKEND_API_URL: 'http://127.0.0.1:8000',
    NEXT_APP_ZOHO_URL_EMISSIONS:
      "https://analytics.zoho.in/open-view/283231000002209106",
    NEXT_APP_SUPERSET_URL_ENV_EMISSIONS:
      "https://superset-dev.sustainext.ai/superset/dashboard/11/?standalone=3&refreshTime=120",
    NEXT_APP_SUPERSET_URL_ENV_WASTE:
      "https://superset-dev.sustainext.ai/superset/dashboard/12/?standalone=3&refreshTime=120",
    CLIMATIQ_KEY: "98YJN6V0VC4M5KPQNSVHWCVEM8NT",
    NEXT_PUBLIC_APP_CLIMATIQ_DATAVERSION: "16",
    REDIS_HOST:'127.0.0.1',
    REDIS_PORT:'6379',

    // SSO
    AUTH0_SECRET: "LONG RANDOM VALsUE",
    AUTH0_BASE_URL: "https://vapt.sustainext.ai",
    // AUTH0_BASE_URL: "http://localhost:3000",
    AUTH0_ISSUER_BASE_URL: "https://dev-0biozzwskqs6o65f.us.auth0.com",
    AUTH0_CLIENT_ID: "Jr9m3MSh0oJr6h2a876tPN5h44OU4Bo8",
    AUTH0_CLIENT_SECRET:
      "VcLShjMepGqKoT5t9MwsuyGPHbWwwEN6zBl62XsXPSlkdHlVXeZFeRjpi6qX7t-q",
    AUTH0_REDIRECT_URL: "https://sustainext-udm.sustainext.ai/callback",
    // AUTH0_REDIRECT_URL: "http://localhost:3000/callback",
  },
 
  images: {
    domains: [
      "udm-be-dev.sustainext.ai",
      "sustainextstorage1.blob.core.windows.net",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.IGNORE_BUILD_ERRORS": JSON.stringify("true"),
      })
    );
 
    return config;
  },
 // distDir: "custom_build",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: true,
  output: 'standalone'
};
 
export default nextConfig;
