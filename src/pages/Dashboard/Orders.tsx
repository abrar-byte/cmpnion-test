import PageMeta from "@/components/common/PageMeta";
import OrderListSection from "@/components/dashboard/OrderListSection";

export default function Orders() {
  return (
    <>
      <PageMeta
        title="Orders | CMPNION Hotel Dashboard"
        description="Search, filter, and manage guest service orders"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and manage all guest service requests
          </p>
        </div>
        <OrderListSection />
      </div>
    </>
  );
}
