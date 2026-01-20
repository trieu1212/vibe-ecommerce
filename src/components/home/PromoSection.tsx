import { Truck, Shield, Headphones, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    description: "Cho đơn hàng trên 500.000đ",
  },
  {
    icon: Shield,
    title: "Bảo hành chính hãng",
    description: "Cam kết 100% chính hãng",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Tư vấn nhiệt tình",
  },
  {
    icon: CreditCard,
    title: "Thanh toán an toàn",
    description: "Nhiều phương thức thanh toán",
  },
];

export function PromoSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-4">
                  <feature.icon className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
