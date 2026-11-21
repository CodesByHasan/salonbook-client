import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <span className="grid size-11 place-items-center rounded-lg bg-rose-50 text-primary dark:bg-primary/15">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}