import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/utils/orderFormatters";

interface CompletionRateChartProps {
  completionRate: number;
  revenueToday: number;
  dailyTarget: number;
}

export default function CompletionRateChart({
  completionRate,
  revenueToday,
  dailyTarget,
}: CompletionRateChartProps) {
  const targetProgress = Math.min(
    Math.round((revenueToday / dailyTarget) * 100),
    100,
  );

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 280,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "75%" },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "32px",
            fontWeight: "700",
            offsetY: -8,
            color: "#1D2939",
            formatter: (val) => `${Math.round(val)}%`,
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Completion"],
  };

  const revenueProgress = targetProgress;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="rounded-2xl bg-white px-5 pb-6 pt-5 shadow-default dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daily Performance
          </h3>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Completion rate & revenue target
          </p>
        </div>

        <div className="relative mt-2">
          <Chart
            options={options}
            series={[completionRate]}
            type="radialBar"
            height={280}
          />
          <span
            className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[90%] rounded-full px-3 py-1 text-xs font-medium ${
              revenueProgress >= 75
                ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500"
            }`}
          >
            {revenueProgress >= 75 ? "On track" : "Below target"}
          </span>
        </div>

        <p className="mx-auto mt-8 max-w-xs text-center text-sm text-gray-500 dark:text-gray-400">
          {formatCurrency(revenueToday)} earned today
          {dailyTarget > 0 && (
            <> — {revenueProgress}% of {formatCurrency(dailyTarget)} target</>
          )}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 px-6 py-4 sm:gap-10">
        <div className="text-center">
          <p className="mb-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Completed
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {completionRate}%
          </p>
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="text-center">
          <p className="mb-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Revenue
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {formatCurrency(revenueToday)}
          </p>
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="text-center">
          <p className="mb-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Target
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {formatCurrency(dailyTarget)}
          </p>
        </div>
      </div>
    </div>
  );
}
