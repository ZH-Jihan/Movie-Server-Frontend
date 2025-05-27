"use server";

import { API_BASE_URL } from "@/lib/api";
import { cookies } from "next/headers";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
export const token = async () => {
  const token = (await cookies())?.get("token");
  return token;
};
export async function register(data: RegisterData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function login(data: LoginData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const result = await response.json();

    // Set the token in an HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    };

    const cookieStore = await cookies();
    cookieStore.set("token", result.data, cookieOptions);

    return result;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const tkn = await token();

    if (!tkn) {
      throw new Error("No authentication token found");
    }

    // Decode the token to get user information
    // Note: This is a simple decode, not a verification. The server should verify the token.
    const tokenData = JSON.parse(atob(tkn.value.split(".")[1]));

    if (tokenData) {
      return {
        id: tokenData.id,
        email: tokenData.email,
        name: tokenData.name,
        isAdmin: tokenData.role === "ADMIN" || false,
      };
    }
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    // Delete the authentication token cookie
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return { success: true };
  } catch (error) {
    throw error;
  }
}
