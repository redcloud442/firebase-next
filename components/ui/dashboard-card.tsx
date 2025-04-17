import { Card, CardContent } from "./card";

export const DashboardCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => (
  <Card className="transition-all hover:shadow-md hover:scale-[1.02] duration-200 h-52">
    <CardContent className="p-5 space-y-1">
      <p className="text-lg text-muted-foreground">{title}</p>
      <p className="text-4xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);
