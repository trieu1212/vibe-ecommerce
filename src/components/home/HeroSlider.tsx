"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    subtitle: "Titan. Mạnh mẽ. Đẳng cấp.",
    description: "Chip A17 Pro. Camera 48MP. Màn hình Super Retina XDR",
    image: "https://images.unsplash.com/photo-1678652197950-d4c0e0e58f6f?w=1200&q=80",
    cta: "Khám phá ngay",
    href: "/products/iphone-15-pro-max",
    gradient: "from-purple-600/90 to-blue-600/90",
  },
  {
    id: 2,
    title: "MacBook Pro M3",
    subtitle: "Sức mạnh. Hiệu suất. Hoàn hảo.",
    description: "Chip M3 thế hệ mới. Màn hình Liquid Retina XDR",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    cta: "Mua ngay",
    href: "/products/macbook-pro-14-m3",
    gradient: "from-slate-600/90 to-gray-800/90",
  },
  {
    id: 3,
    title: "Thời trang hè 2026",
    subtitle: "Phong cách. Tự tin. Nổi bật.",
    description: "Bộ sưu tập mới nhất với thiết kế hiện đại",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    cta: "Xem bộ sưu tập",
    href: "/categories/thoi-trang",
    gradient: "from-pink-600/90 to-rose-600/90",
  },
];

export function HeroSlider() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-2xl">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
                />

                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-2xl space-y-4 md:space-y-6 text-white">
                      <div className="space-y-2">
                        <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider opacity-90">
                          {slide.subtitle}
                        </h2>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                          {slide.title}
                        </h1>
                      </div>
                      <p className="text-base md:text-lg lg:text-xl opacity-90">
                        {slide.description}
                      </p>
                      <Link href={slide.href}>
                        <Button
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-gray-100 group"
                        >
                          {slide.cta}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-2 md:left-4 h-10 w-10 md:h-12 md:w-12 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" />
        <CarouselNext className="right-2 md:right-4 h-10 w-10 md:h-12 md:w-12 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" />
      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              current === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
