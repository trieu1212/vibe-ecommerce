import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

async function getPrismaClient() {
  return new PrismaClient();
}

async function main() {
  const prisma = await getPrismaClient();
  
  try {
    console.log("🌱 Starting seed...");

    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const admin = await prisma.user.create({
      data: {
        email: "admin@vibe.com",
        password: hashedPassword,
        name: "Admin User",
        role: "ADMIN",
      },
    });

    const user = await prisma.user.create({
      data: {
        email: "user@vibe.com",
        password: hashedPassword,
        name: "John Doe",
        role: "USER",
      },
    });

    console.log("✅ Created users");

    // Create categories
    const electronics = await prisma.category.create({
      data: {
        name: "Điện tử",
        slug: "dien-tu",
        description: "Thiết bị điện tử và công nghệ",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      },
    });

    const fashion = await prisma.category.create({
      data: {
        name: "Thời trang",
        slug: "thoi-trang",
        description: "Quần áo và phụ kiện thời trang",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      },
    });

    const home = await prisma.category.create({
      data: {
        name: "Nhà cửa & Đời sống",
        slug: "nha-cua-doi-song",
        description: "Đồ dùng gia đình và trang trí",
        image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
      },
    });

    const sports = await prisma.category.create({
      data: {
        name: "Thể thao",
        slug: "the-thao",
        description: "Dụng cụ và trang phục thể thao",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
      },
    });

    console.log("✅ Created categories");

    // Create products
    const products = [
      // Electronics
      {
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        description: "Điện thoại thông minh cao cấp với chip A17 Pro, camera 48MP và màn hình Super Retina XDR",
        price: 29990000,
        comparePrice: 34990000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1678652197950-d4c0e0e58f6f?w=800",
          "https://images.unsplash.com/photo-1678652197969-72e4c7c0e0e0?w=800",
        ]),
        stock: 50,
        sku: "IP15PM-256-TIT",
        categoryId: electronics.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "MacBook Pro 14\" M3",
        slug: "macbook-pro-14-m3",
        description: "Laptop chuyên nghiệp với chip M3, màn hình Liquid Retina XDR và thời lượng pin lên đến 18 giờ",
        price: 45990000,
        comparePrice: 52990000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        ]),
        stock: 30,
        sku: "MBP14-M3-512",
        categoryId: electronics.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "AirPods Pro (Gen 2)",
        slug: "airpods-pro-gen-2",
        description: "Tai nghe không dây với chống ồn chủ động, âm thanh không gian và hộp sạc MagSafe",
        price: 6490000,
        comparePrice: 7490000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
        ]),
        stock: 100,
        sku: "APP-GEN2-USB",
        categoryId: electronics.id,
        isActive: true,
        isFeatured: false,
      },
      {
        name: "iPad Air M2",
        slug: "ipad-air-m2",
        description: "Máy tính bảng mạnh mẽ với chip M2, màn hình Liquid Retina 11 inch",
        price: 16990000,
        comparePrice: 18990000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
        ]),
        stock: 40,
        sku: "IPA-M2-256",
        categoryId: electronics.id,
        isActive: true,
        isFeatured: true,
      },

      // Fashion
      {
        name: "Áo Polo Nam Premium",
        slug: "ao-polo-nam-premium",
        description: "Áo polo nam chất liệu cotton cao cấp, form dáng hiện đại, nhiều màu sắc",
        price: 450000,
        comparePrice: 650000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800",
        ]),
        stock: 200,
        sku: "POLO-M-BLK-L",
        categoryId: fashion.id,
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Quần Jean Slim Fit",
        slug: "quan-jean-slim-fit",
        description: "Quần jean nam form slim fit, chất liệu denim co giãn thoải mái",
        price: 590000,
        comparePrice: 790000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
        ]),
        stock: 150,
        sku: "JEAN-M-BLU-32",
        categoryId: fashion.id,
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Váy Maxi Hoa Nhí",
        slug: "vay-maxi-hoa-nhi",
        description: "Váy maxi nữ họa tiết hoa nhí, chất liệu voan mềm mại, phù hợp dạo phố",
        price: 680000,
        comparePrice: 890000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        ]),
        stock: 80,
        sku: "DRESS-W-FLR-M",
        categoryId: fashion.id,
        isActive: true,
        isFeatured: true,
      },

      // Home & Living
      {
        name: "Bộ Chăn Ga Gối Cotton",
        slug: "bo-chan-ga-goi-cotton",
        description: "Bộ chăn ga gối 4 món chất liệu cotton 100%, mềm mại, thoáng mát",
        price: 890000,
        comparePrice: 1290000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        ]),
        stock: 60,
        sku: "BED-SET-Q-BLU",
        categoryId: home.id,
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Đèn Ngủ Thông Minh",
        slug: "den-ngu-thong-minh",
        description: "Đèn ngủ LED thông minh, điều khiển qua app, 16 triệu màu",
        price: 350000,
        comparePrice: 550000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
        ]),
        stock: 120,
        sku: "LAMP-SMART-RGB",
        categoryId: home.id,
        isActive: true,
        isFeatured: false,
      },

      // Sports
      {
        name: "Giày Chạy Bộ Nike Air Zoom",
        slug: "giay-chay-bo-nike-air-zoom",
        description: "Giày chạy bộ Nike Air Zoom Pegasus, đệm khí êm ái, độ bám cao",
        price: 2890000,
        comparePrice: 3490000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        ]),
        stock: 75,
        sku: "NIKE-RUN-BLK-42",
        categoryId: sports.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Thảm Yoga Cao Cấp",
        slug: "tham-yoga-cao-cap",
        description: "Thảm yoga TPE cao cấp, chống trượt, thân thiện môi trường",
        price: 450000,
        comparePrice: 650000,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
        ]),
        stock: 90,
        sku: "YOGA-MAT-PUR-6MM",
        categoryId: sports.id,
        isActive: true,
        isFeatured: false,
      },
    ];

    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    console.log("✅ Created products");

    // Create cart for user
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: [
            {
              productId: (await prisma.product.findFirst({ where: { slug: "iphone-15-pro-max" } }))!.id,
              quantity: 1,
            },
          ],
        },
      },
    });

    console.log("✅ Created cart");
    console.log("🎉 Seed completed successfully!");
    
    await prisma.$disconnect();
  } catch (e) {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
