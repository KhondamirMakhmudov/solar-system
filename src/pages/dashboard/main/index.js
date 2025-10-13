import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import StatCard from "@/components/card/StatisticCard";
import Image from "next/image";
import MapOfUz from "@/components/map-country";
import { Typography } from "@mui/material";
import RegionCard from "@/components/card/RegionCard";
import { useEffect, useState } from "react";
import useGetPythonQuery from "@/hooks/python/useGetQuery";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { get } from "lodash";

const Index = () => {
  const [expandedRegions, setExpandedRegions] = useState({});
  const [regionsData, setRegionsData] = useState([
    {
      id: "region1",
      name: "АО SSЭС",
      inverterCount: 3,
      projectCapacity: "174.0 кВт",
      totalGeneration: "430,123 кВт",
      dailyGeneration: "3,131 кВт",
      currentGeneration: "58.1 кВт",
      inverters: [
        {
          name: "Инвертор #1",
          status: "Онлайн",
          currentPower: "19.4 кВт",
          earnings: "₽94,200",
          totalGeneration: "143,041 кВт",
          efficiency: "98.2%",
        },
        {
          name: "Инвертор #2",
          status: "Онлайн",
          currentPower: "19.8 кВт",
          earnings: "₽95,800",
          totalGeneration: "145,582 кВт",
          efficiency: "99.1%",
        },
        {
          name: "Инвертор #3",
          status: "Предупреждение",
          currentPower: "18.9 кВт",
          earnings: "₽94,500",
          totalGeneration: "141,500 кВт",
          efficiency: "94.7%",
        },
      ],
    },
    {
      id: "region2",
      name: "Московская область",
      inverterCount: 4,
      projectCapacity: "232.0 кВт",
      totalGeneration: "567,890 кВт",
      dailyGeneration: "4,234 кВт",
      currentGeneration: "76.3 кВт",
      inverters: [
        {
          name: "Инвертор МО-1",
          status: "Онлайн",
          currentPower: "19.1 кВт",
          earnings: "₽123,400",
          totalGeneration: "141,973 кВт",
          efficiency: "97.8%",
        },
        {
          name: "Инвертор МО-2",
          status: "Онлайн",
          currentPower: "19.5 кВт",
          earnings: "₽125,600",
          totalGeneration: "144,229 кВт",
          efficiency: "98.9%",
        },
        {
          name: "Инвертор МО-3",
          status: "Онлайн",
          currentPower: "18.7 кВт",
          earnings: "₽119,200",
          totalGeneration: "140,688 кВт",
          efficiency: "96.4%",
        },
        {
          name: "Инвертор МО-4",
          status: "Офлайн",
          currentPower: "0.0 кВт",
          earnings: "₽141,000",
          totalGeneration: "141,000 кВт",
          efficiency: "0%",
        },
      ],
    },
    {
      id: "region3",
      name: "Краснодарский край",
      inverterCount: 5,
      projectCapacity: "290.0 кВт",
      totalGeneration: "723,456 кВт",
      dailyGeneration: "5,678 кВт",
      currentGeneration: "95.2 кВт",
      inverters: [
        {
          name: "Инвертор КК-1",
          status: "Онлайн",
          currentPower: "19.8 кВт",
          earnings: "₽156,700",
          totalGeneration: "144,691 кВт",
          efficiency: "99.2%",
        },
      ],
    },
  ]);

  const overviewData = [
    { icon: "🏭", value: "5", label: "Всего регионов" },
    { icon: "⚡", value: "847 кВт", label: "Общая мощность" },
    { icon: "📊", value: "2.1M кВт", label: "Общая выработка" },
    { icon: "💰", value: "₽284,500", label: "Общий доход" },
  ];

  const {
    data: company,
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
  } = useGetPythonQuery({
    key: KEYS.company,
    url: URLS.company,
  });

  const toggleRegion = (regionId) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionId]: !prev[regionId],
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRegionsData((prevData) =>
        prevData.map((region) => ({
          ...region,
          inverters: region.inverters.map((inverter) => {
            if (inverter.status === "Онлайн") {
              const currentValue = parseFloat(inverter.currentPower);
              const variation = (Math.random() - 0.5) * 2; // ±1 кВт вариация
              const newValue = Math.max(0, currentValue + variation);
              return {
                ...inverter,
                currentPower: newValue.toFixed(1) + " кВт",
              };
            }
            return inverter;
          }),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <DashboardLayout headerTitle={"Главная"}>
      {/* <div className="grid grid-cols-12 gap-4 my-[20px] bg-[#1A132A] shadow-md p-[20px] rounded-lg border border-[#555555] divide-x divide-[#555555] manrope">
        <StatCard
          title="Проектная мощность"
          percent="10.0%"
          value={1500}
          unit="кВт"
        />
        <StatCard
          title="Проектная мощность"
          percent="10.0%"
          value={185655.54}
          unit="МВт"
          subtitle="за все время"
        />
        <StatCard
          title="Выработано"
          percent="10.0%"
          value={20249.73}
          unit="МВт"
          subtitle="сегодня"
        />
        <StatCard
          title="Текущая выработка"
          percent="10.0%"
          value={1056.54}
          unit="кВт"
        />
      </div> */}

      <div className="grid grid-cols-12 gap-4 my-[20px] bg-[#1A132A] p-[30px] border border-[#555555] shadow-sm replace-items-center rounded-lg">
        <div className="col-span-12 mb-[15px] text-white">
          <Typography variant="h4">Мониторинг солнечных панелей</Typography>
        </div>
        <div className="col-span-6 h-[600px]">
          <MapOfUz markersData={get(company, "data.data")} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
