import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { loginUser } from "@/Service/auth.service";
import userLogo from "../assets/main_logo.svg";
import { PasswordInput } from "./Passwordref";
import { Input } from "@/components/ui/input";
import Chat from "../assets/Chat.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginUs = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Missing Information", { description: "Both email and password are required." });
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData);
      if (response.success) {
        setFormData({ email: "", password: "" });
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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Login | RCS Chats</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
          {/* Left Side - Image */}
          <div className="hidden md:flex items-center justify-center bg-gray-100 p-6">
            <img src={Chat} alt="Chat Illustration" className="w-4/5 rounded-xl shadow-md" />
          </div>

          {/* Right Side - Login Form */}
          <div className="p-8 w-full flex flex-col justify-center">
            <Card className="border-none shadow-none">
              <CardHeader className="text-center">
                <img className="w-16 mx-auto" src={userLogo} alt="Logo" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Welcome Back!</h2>
                <p className="text-sm text-gray-500">Sign in to continue</p>
              </CardHeader>
              
              <CardContent>
                <form className="space-y-5" onSubmit={handleLoginUs}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleLoginChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <PasswordInput
                      name="password"
                      value={formData.password}
                      onChange={handleLoginChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg shadow-md font-medium"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}