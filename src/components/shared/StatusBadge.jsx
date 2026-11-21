import { Badge } from "@/components/ui/badge";
import { APPOINTMENT_STATUS, PAYMENT_STATUS } from "@/lib/constants";

export function AppointmentStatusBadge({ status }) {
  const config = APPOINTMENT_STATUS[status] ?? { label: status, className: "" };
  return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
}

export function PaymentBadge({ status = "unpaid" }) {
  const config = PAYMENT_STATUS[status] ?? { label: status, className: "" };
  return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
}