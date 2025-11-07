import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkspaceAnalyticsCardProps {
  title: string;
  count: string | number;
}

export const WorkspaceAnalyticsCard = ({
  title,
  count,
}: WorkspaceAnalyticsCardProps) => {
  return (
    <Card className="min-w-48 text-center">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-6xl">{count}</div>
      </CardContent>
    </Card>
  );
};
