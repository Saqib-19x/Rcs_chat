import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { loginUser } from "@/Service/auth.service";
import userLogo from "../assets/main_logo.svg";
import ChatIllustration from "../assets/Chat.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Missing Information", {
        description: "Both email and password are required.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData);
      if (response.success) {
        navigate("/chatdashboard");
        toast.success("Login Successful");
      } else {
        toast.error("Login Failed", { description: response.message });
      }
    } catch (error) {
      toast.error("Login Error", { description: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | RCS Chats</title>
      </Helmet>

      <div className="h-screen w-screen  flex items-center justify-center bg-gray-100">
        <div className="flex w-full h-full shadow-lg rounded-xl overflow-hidden bg-white">
          {/* Left Side - Illustration */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 w-1/2 h-full">
            <img
              src={ChatIllustration}
              alt="Chat Illustration"
              className="w-4/5 h-auto"
            />
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center p-10 w-full md:w-1/2 h-full">
            <div className="text-center">
              <img className="w-14 mx-auto" src={userLogo} alt="Logo" />
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                Welcome to <span className="font-bold">Celchats</span>
              </h2>
            </div>

            <form className="space-y-5 mt-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-2 w-full border-gray-300 rounded-lg px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-2 w-full border-gray-300 rounded-lg px-4 py-3"
                  required
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <input type="checkbox" id="rememberMe" className="mr-2" />
                  <label htmlFor="rememberMe">Remember Me</label>
                </div>
                <a href="#" className="text-green-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-green-600 font-semibold hover:underline"
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
