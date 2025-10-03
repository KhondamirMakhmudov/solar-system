import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import GaugeCard from "@/components/chart/gauge";
const Index = () => {
  const gauges = [
    {
      name: "AbsolutePressure - 10sec",
      value: 962.07,
      min: 0,
      max: 1600,
      unit: "mbar",
    },
    { name: "Temperature - 10sec", value: 16.39, min: 0, max: 500, unit: "°C" },
    { name: "Velocity - 10sec", value: 0.02, min: 0, max: 30, unit: "m/s" },
    { name: "HeatedLine - 10sec", value: 180, min: 0, max: 200, unit: "°C" },
    {
      name: "HeatedProbe - 10sec",
      value: 155.17,
      min: 0,
      max: 200,
      unit: "°C",
    },
    { name: "CO - 10sec", value: 3, min: 0, max: 1250, unit: "mg/m3" },
    { name: "O2 - 10sec", value: 20.81, min: 0, max: 25, unit: "%" },
  ];
  return (
    <DashboardLayout headerTitle={"Экологические показатели станции"}>
      <div className="grid grid-cols-4 gap-4 p-6">
        {gauges.map((g, i) => (
          <GaugeCard key={i} {...g} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Index;
