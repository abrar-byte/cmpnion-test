import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      className="z-999999"
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-gray-200 bg-white text-gray-800 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-white/90",
          title: "text-sm font-medium",
          description: "text-sm text-gray-500 dark:text-gray-400",
          actionButton:
            "bg-brand-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg",
          cancelButton:
            "bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg dark:bg-gray-800 dark:text-gray-400",
        },
      }}
    />
  );
}
