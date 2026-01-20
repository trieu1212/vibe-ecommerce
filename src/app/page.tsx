import { HeroSlider } from "@/src/components/home/HeroSlider";
import { FeaturedProducts } from "@/src/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/src/components/home/CategoryShowcase";
import { PromoSection } from "@/src/components/home/PromoSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroSlider />
      </section>

      {/* Promo Features */}
      <PromoSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Đăng ký nhận thông tin ưu đãi
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên khi đăng ký nhận tin
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
