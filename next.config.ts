import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Set your 3 Groq API keys here (or in .env file)
    GROQ_HIRE_API_KEY: process.env.GROQ_HIRE_API_KEY || "",
    GROQ_RESUME_API_KEY: process.env.GROQ_RESUME_API_KEY || "",
    GROQ_ROADMAP_API_KEY: process.env.GROQ_ROADMAP_API_KEY || "",
  }
};

export default nextConfig;
