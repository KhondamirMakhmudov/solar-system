"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Title from "@/components/title";

const EcologyPage = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const socket = new WebSocket("ws://10.20.6.64:80/ws");

    socket.onopen = () => console.log("✅ WebSocket подключен");

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        // Игнорируем, если name отсутствует
        if (!parsed.name) return;

        setData((prev) => {
          const existingIndex = prev.findIndex(
            (item) => item.unique_key === parsed.unique_key
          );

          if (existingIndex !== -1) {
            // Обновляем существующий элемент на том же месте
            const newData = [...prev];
            newData[existingIndex] = parsed;
            return newData;
          } else {
            // Добавляем новый элемент
            return [...prev, parsed];
          }
        });
      } catch {
        console.warn("⚠️ Не JSON:", event.data);
      }
    };

    socket.onclose = () => console.log("❌ WebSocket отключен");
    return () => socket.close();
  }, []);

  // Уникальные названия станций
  const names = [...new Set(data.map((item) => item.name))].filter(Boolean);

  return (
    <DashboardLayout headerTitle="Экологические показатели станции">
      <div className="p-6 manrope min-h-screen ">
        {names.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {names.map((name) => {
              const items = data.filter((d) => d.name === name);
              const ip = items[0]?.ip || "—";
              const lastUpdate = items[0]?.date_app_timestamp;

              return (
                <motion.div
                  key={name}
                  layout
                  onClick={() =>
                    router.push(
                      `/dashboard/eco-system-stations/all/${encodeURIComponent(
                        name
                      )}`
                    )
                  }
                  className="cursor-pointer bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-6 border border-gray-100"
                >
                  {/* Заголовок */}
                  <div className="flex justify-between items-center mb-3">
                    <Title>{name}</Title>
                    <span className="text-sm text-gray-500">
                      {items.length} показателей
                    </span>
                  </div>

                  {/* IP и время обновления */}
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>IP: {ip}</span>
                    {lastUpdate && (
                      <span>
                        Обновлено:{" "}
                        {dayjs(lastUpdate).format("HH:mm:ss, DD.MM.YYYY")}
                      </span>
                    )}
                  </div>

                  {/* Показатели (progress bars) */}
                  <div className="space-y-4">
                    {items.map((item) => {
                      const value = parseFloat(item.value) || 0;
                      const max = item.max_value || 200;
                      const percentage = Math.min((value / max) * 100, 100);

                      return (
                        <div key={item.unique_key || item.node_name}>
                          <div className="flex justify-between text-sm text-gray-700 mb-1">
                            <span className="truncate w-[65%]">
                              {item.node_name}
                            </span>
                            <span>
                              {value.toFixed(2)} {item.unit || ""}
                            </span>
                          </div>

                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              layout
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className={`h-full rounded-full ${
                                percentage > 80
                                  ? "bg-gradient-to-r from-red-400 to-red-500"
                                  : percentage > 60
                                  ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                  : "bg-gradient-to-r from-[#B388FE] to-[#9D66FD]"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-8">
            Данные загружаются...
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EcologyPage;
