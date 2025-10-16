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
import { useSession } from "next-auth/react";
import ContentLoader from "@/components/loader";

const Index = () => {
  const { data: session } = useSession();
  const {
    data: company,
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
  } = useGetPythonQuery({
    key: KEYS.company,
    url: URLS.company,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      Accept: "application/json",
    },
    enabled: !!session?.accessToken,
  });

  if (isLoadingCompany || isFetchingCompany) {
    return (
      <DashboardLayout>
        <ContentLoader />
      </DashboardLayout>
    );
  }
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
        <div className="col-span-12 h-[600px]">
          <MapOfUz markersData={get(company, "data.data")} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
