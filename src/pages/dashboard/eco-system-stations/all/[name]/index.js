"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import GaugeCard from "@/components/chart/gauge";
import { motion } from "framer-motion";

const EcologyDetailPage = () => {
  const { name } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://10.20.6.64:80/ws");

    socket.onopen = () => console.log("✅ WebSocket connected");

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData((prev) => {
          const existing = prev.filter(
            (item) => item.unique_key !== parsed.unique_key
          );
          return [...existing, parsed];
        });
      } catch {
        console.warn("⚠️ Not JSON:", event.data);
      }
    };

    socket.onclose = () => console.log("❌ WebSocket disconnected");
    return () => socket.close();
  }, []);

  const filtered = data.filter((item) => item.name === name);

  return (
    <DashboardLayout headerTitle={`Экологические показатели: ${name}`}>
      <div className="p-6 manrope">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 0.4 }}
              >
                <GaugeCard
                  name={item.node_name}
                  value={parseFloat(item.value).toFixed(2)}
                  min={0}
                  max={item.max_value || 200}
                  unit={item.unit || ""}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Ma’lumot yuklanmoqda...</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EcologyDetailPage;
