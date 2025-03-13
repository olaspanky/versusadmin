"use client";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      router.push("/pages/dashboard");
    }
  };

  if (isAuthenticated) {
    router.push("/pages/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 hover:scale-105">
        {/* Logo or Icon */}
        <div className="flex justify-center mb-6">
          <Image
            src="/admin-icon.png" // Replace with your admin icon or logo
            alt="Admin Logo"
            width={80}
            height={80}
            className="animate-pulse"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 animate-fade-in">
          Admin Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter admin password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          For authorized admins only
        </p>
      </div>

      {/* Tailwind CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}