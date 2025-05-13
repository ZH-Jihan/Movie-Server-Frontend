
const dev_url = process.env.NEXT_PUBLIC_DEV_URL;
const server_url = process.env.NEXT_PUBLIC_PROD_URL;
const env = process.env.NEXT_PUBLIC_ENV;

export const API_BASE_URL = env === "production" ? server_url : dev_url;


