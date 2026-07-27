"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import logo from "../../assets/LearnQube.png";
import focused from "../../assets/focused.jpg";
import GoogleIcon from "../../assets/googleIcon";
import axiosInstance from "../../config";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      if (!response?.data) {
        throw new Error("Invalid response from server");
      }
      setIsLoading(false);
      Cookies.set("token", response?.data?.token, {
        secure: true,
        sameSite: "None",
        path: "/",
      });
      Cookies.set("userName", response?.data?.user?.name, {
        secure: true,
        sameSite: "None",
        path: "/",
      });
      Cookies.set("userEmail", response?.data?.user?.email, {
        secure: true,
        sameSite: "None",
        path: "/",
      });
      Cookies.set("userRole", response?.data?.user?.role, {
        secure: true,
        sameSite: "None",
        path: "/",
      });
      toast.success("Login successfully");
      router.push("/dashboard");
    } catch (error) {
      console.log(
        "Login Failed:",
        error.response?.data?.message || error.message,
      );
      setIsLoading(false);
      toast.error("Login failed. Try again.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      window.location.href =
        "https://api-learnqube-backend.onrender.com/api/v1/auth/google/callback";
    } catch (error) {
      console.log(
        "Google Login Failed:",
        error.response?.data?.message || error.message,
      );
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <div className="w-full h-screen md:min-h-screen flex items-center justify-center md:p-4 bg-gray-50">
      <div className="flex w-full max-w-5xl h-full md:h-[600px]">
        {/* Login Form Side */}
        <div className="flex-1">
          <Card className="w-full h-full shadow-lg rounded-r-none">
            <CardHeader className="space-y-6 pt-8">
              {/* Logo Section */}
              <div className="flex items-center justify-center">
                <Link href={"/"}>
                  <div className="flex items-center gap-4">
                    <div>
                      <Image
                        src={logo}
                        alt="learnQube"
                        height={80}
                        width={80}
                        className="h-12 w-12"
                      />
                    </div>
                    <span className="font-bold text-2xl text-[#481895]">
                      LEARNQUBE
                    </span>
                  </div>
                </Link>
              </div>

              <div className="space-y-1 pt-2">
                <CardTitle className="text-2xl text-center">
                  Welcome back
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your credentials to access your account
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm hover:text-blue-700 text-[#481895]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked })
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white bg-[#481895]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Login Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignup}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>

                {/* Signup Link */}
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="hover:text-blue-700 text-[#481895]"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Image Side */}
        <div className="hidden lg:block flex-1 h-[600px]">
          <div className="h-full w-full relative rounded-r-lg overflow-hidden">
            <Image
              src={focused}
              alt="illustration"
              layout="fill"
              objectFit="cover"
              className="rounded-r-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
