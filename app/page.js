"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (username === "" || email === "" || password === "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Send login request to the backend
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect based on user type
        if (userType === "player") {
          if (data.player_id) {
            localStorage.setItem("playerId", data.player_id); // Store playerId
            router.push("/player/categories");
          } else {
            alert("Player ID not found in the response.");
          }
        } else if (userType === "creator") {
          // Ensure the backend sends creator_id in the response
          if (data.creator_id) {
            localStorage.setItem("creatorId", data.creator_id); // Store creatorId
            router.push("/creator/creator-dashboard");
          } else {
            alert("Creator ID not found in the response.");
          }
        } else {
          alert("Please select a valid user type.");
        }
      }
      else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAdminLogin = () => {
    router.push("/adminlogin");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <img
          src="/quiz.png" // Change this to your actual logo path
          alt="Logo"
          className="w-2/3 max-w-xs"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          {/* Username Field */}
          <div className="mb-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
            />
          </div>

          {/* Email Field */}
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>

          {/* User Type Selector */}
          <div className="mb-4">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              Select User Type
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select --</option>
              <option value="player">Player</option>
              <option value="creator">Creator</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
          >
            Login
          </button>

          {/* Log in as Admin Button */}
          <button
            onClick={handleAdminLogin}
            className="w-full bg-gray-500 text-white py-2 rounded-md mt-4 hover:bg-gray-600"
          >
            Log in as Admin
          </button>

          {/* Sign Up Link */}
          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="text-blue-500 underline cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}