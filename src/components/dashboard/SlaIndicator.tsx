import { AlertIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";

interface SlaIndicatorProps {
  overdueMinutes: number;
}

export default function SlaIndicator({ overdueMinutes }: SlaIndicatorProps) {
  return (
    <Badge color="error" size="sm" startIcon={<AlertIcon className="size-3" />}>
      SLA {overdueMinutes}m
    </Badge>
  );
}
