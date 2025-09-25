import Input from "@/components/input";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="grid grid-cols-12 gap-2 place-items-center  h-full">
        <div className="col-span-6 flex justify-center ">
          <div className="w-[430px]">
            <Typography variant="h4" component="h1" gutterBottom>
              Войти в систему
            </Typography>

            <p className="text-sm text-gray-400 mb-5">
              Добро пожаловать в систему мониторинга солнечных панелей
            </p>
            <div className="space-y-[20px]">
              <Input placeholder={"Имя пользователя"} />
              <Input placeholder={"Пароль"} isPassword={true} type="password" />

              <Link href={"/dashboard/main"}>
                <Button
                  sx={{
                    backgroundColor: "#6E39CB",
                    color: "#FFFFFF",
                    height: "45px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "17px",
                    fontWeight: "600",
                    width: "100%",
                    fontFamily: "Manrope, sans-serif",
                    "&:hover": {
                      backgroundColor: "#A877FD",
                    },
                  }}
                >
                  {" "}
                  Войти
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-6 bg-[#6E39CB] h-screen y-[10px] p-2 w-full flex items-center justify-center">
          <Image
            src={"/icons/solar-system.svg"}
            alt="solar"
            width={600}
            height={600}
            className="bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
