import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import type { DashboardChartData } from "@/services/DashboardChartService";

interface OrderStatusChartProps {
  data: DashboardChartData["statusBreakdown"];
}

const STATUS_COLORS = ["#0BA5EC", "#465FFF", "#F79009", "#12B76A", "#F04438"];

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const options: ApexOptions = {
    colors: STATUS_COLORS,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 280,
    },
    labels: data.labels,
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: true, fontSize: "14px" },
            value: {
              show: true,
              fontSize: "22px",
              fontWeight: 600,
              formatter: (val) => val,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              formatter: () =>
                String(data.data.reduce((a, b) => a + b, 0)),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit, sans-serif",
      labels: { colors: "#6B7280" },
    },
    stroke: { width: 0 },
    tooltip: {
      y: { formatter: (val: number) => `${val} orders` },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Order Status
        </h3>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          Current breakdown by workflow stage
        </p>
      </div>
      <Chart options={options} series={data.data} type="donut" height={280} />
    </div>
  );
}
