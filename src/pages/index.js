"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/input";
import { Button, Typography, Alert } from "@mui/material";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверное имя пользователя или пароль");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push("/dashboard/main");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Произошла ошибка при входе");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] manrope">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Login Form Section */}
        <div className="flex items-center justify-center p-8 bg-[#1A132A]">
          <div className="w-full max-w-[430px]">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: "white", fontWeight: 600 }}
            >
              Войти в систему
            </Typography>
            <p className="text-sm text-gray-400 mb-8">
              Добро пожаловать в систему мониторинга солнечных панелей
            </p>

            {error && (
              <Alert severity="error" sx={{ mb: 3, fontFamily: "Manrope" }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
              <Input
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{
                  backgroundColor: "#6E39CB",
                  color: "#FFFFFF",
                  height: "45px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "17px",
                  fontWeight: "600",
                  fontFamily: "Manrope, sans-serif",
                  "&:hover": {
                    backgroundColor: "#A877FD",
                  },
                  "&:disabled": {
                    backgroundColor: "#4A2B8A",
                    color: "#B8B8B8",
                  },
                }}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex items-center justify-center bg-[#6E39CB] p-8">
          <Image
            src="/icons/solar-system.svg"
            alt="Солнечная система"
            width={600}
            height={600}
            priority
          />
        </div>
      </div>
    </div>
  );
}
