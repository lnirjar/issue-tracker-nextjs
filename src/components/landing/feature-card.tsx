import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const FeatureCard = ({
  feature,
}: {
  feature: { title: string; description?: string; imageUrl: string };
}) => {
  const { title, description, imageUrl } = feature;

  return (
    <Card className="max-w-lg overflow-hidden">
      <CardContent className="p-0">
        <Image src={imageUrl} width={1366} height={768} alt={title} />
      </CardContent>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
