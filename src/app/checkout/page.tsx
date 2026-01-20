"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/src/store/cart";
import { useAuthStore } from "@/src/store/auth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { formatPrice } from "@/src/lib/utils";
import { toast } from "sonner";
import { CreditCard, Wallet, Building2 } from "lucide-react";
import { useCreateOrder } from "@/src/hooks/use-orders";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  city: z.string().min(2, "Vui lòng chọn tỉnh/thành phố"),
  district: z.string().min(2, "Vui lòng chọn quận/huyện"),
  note: z.string().optional(),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Pre-fill user info if logged in
  useEffect(() => {
    if (user) {
      setValue("fullName", user.name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const shippingFee = getTotalPrice >= 500000 ? 0 : 30000;
  const finalTotal = getTotalPrice + shippingFee;

  const { mutateAsync: createOrder } = useCreateOrder();

  const onSubmit = async (data: CheckoutInput) => {
    setIsSubmitting(true);
    
    try {
      await createOrder({
          items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
          })),
          shippingInfo: data,
          paymentMethod,
          totalAmount: finalTotal,
          shippingFee
      });
      
      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push("/orders");
    } catch (error) {
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      placeholder="0123456789"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    placeholder="Số nhà, tên đường"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                    <Input
                      id="city"
                      placeholder="Hà Nội"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Input
                      id="district"
                      placeholder="Hoàn Kiếm"
                      {...register("district")}
                    />
                    {errors.district && (
                      <p className="text-sm text-red-500">{errors.district.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                  <Input
                    id="note"
                    placeholder="Ghi chú cho đơn hàng"
                    {...register("note")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-muted-foreground">
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 opacity-50">
                    <RadioGroupItem value="bank" id="bank" disabled />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                        <p className="text-sm text-muted-foreground">
                          Đang cập nhật
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 opacity-50">
                    <RadioGroupItem value="card" id="card" disabled />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                        <p className="text-sm text-muted-foreground">
                          Đang cập nhật
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(getTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Bằng việc đặt hàng, bạn đồng ý với{" "}
                  <a href="#" className="text-primary hover:underline">
                    Điều khoản sử dụng
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
