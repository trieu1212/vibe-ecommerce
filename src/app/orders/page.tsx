import { OrderHistory } from "@/src/components/orders/OrderHistory";

export const metadata = {
  title: "Lịch sử đơn hàng | Vibe",
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderHistory />
    </div>
  );
}
