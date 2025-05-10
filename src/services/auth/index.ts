"use server";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);

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
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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

    const cookies = require("next/headers").cookies;
    cookies().set("token", result.data, cookieOptions);

    return result;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const cookies = require("next/headers").cookies;
    const token = cookies().get("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Decode the token to get user information
    // Note: This is a simple decode, not a verification. The server should verify the token.
    const tokenData = JSON.parse(atob(token.value.split(".")[1]));

    return {
      id: tokenData.id,
      email: tokenData.email,
      name: tokenData.name,
      isAdmin: tokenData.role === "ADMIN" || false,
    };
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const cookies = require("next/headers").cookies;
    
    // Delete the authentication token cookie
    cookies().delete("token");

    return { success: true };
  } catch (error) {
    throw error;
  }
}

