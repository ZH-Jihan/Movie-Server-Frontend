import "dotenv/config";
import { cookies } from "next/headers";

const dev = process.env.DEV_URL;
const server_url = process.env.PROD_URL;
const env = process.env.ENV;

export const API_BASE_URL = env === "production" ? server_url : dev;

export const token = async () => {
  const token = (await cookies())?.get("token");
  if (!token || !token.value) {
    throw new Error("Token is missing or invalid");
  }
  return token;
};
