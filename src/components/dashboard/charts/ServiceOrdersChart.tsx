import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import type { DashboardChartData } from "@/services/DashboardChartService";

interface ServiceOrdersChartProps {
  data: DashboardChartData["serviceOrders"];
}

export default function ServiceOrdersChart({ data }: ServiceOrdersChartProps) {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    colors: ["#465FFF", "#7592FF", "#9CB9FF", "#C2D6FF", "#EEF2FF"],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: data.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#6B7280", fontSize: "11px" },
        trim: true,
      },
    },
    legend: { show: false },
    yaxis: {
      title: { text: "Orders" },
      labels: { style: { colors: ["#6B7280"], fontSize: "12px" } },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val: number) => `${val} orders` },
    },
  };

  const series = [{ name: "Orders", data: data.data }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Orders by Service
        </h3>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          Distribution across service categories
        </p>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[400px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={280} />
        </div>
      </div>
    </div>
  );
}
