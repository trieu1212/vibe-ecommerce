# 📋 VIBE E-COMMERCE - CHECKLIST DỰ ÁN

## 🎯 Tổng quan dự án
Dự án E-commerce fullstack sử dụng:
- **Frontend**: Next.js 14+ (App Router), TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: SQLite với Prisma ORM
- **Authentication**: NextAuth.js / Custom JWT

---

## ✅ PHASE 1: SETUP & CONFIGURATION

### 1.1 Khởi tạo dự án
- [ ] Tạo Next.js project với App Router
- [ ] Cài đặt TailwindCSS
- [ ] Setup Shadcn UI
- [ ] Cấu hình TypeScript
- [ ] Setup ESLint & Prettier

### 1.2 Database Setup
- [ ] Cài đặt Prisma
- [ ] Cấu hình SQLite database
- [ ] Tạo file `prisma/schema.prisma`
- [ ] Setup Prisma Client
- [ ] Tạo database connection helper (`src/lib/db.ts`)

### 1.3 Project Structure
- [ ] Tạo cấu trúc thư mục server modules
- [ ] Tạo cấu trúc thư mục client components
- [ ] Setup middleware cho authentication
- [ ] Cấu hình environment variables

---

## ✅ PHASE 2: DATABASE MODELS

### 2.1 Thiết kế Prisma Schema
- [ ] **User Model**
  - id, email, password (hashed), name, role, avatar
  - createdAt, updatedAt
  
- [ ] **Category Model**
  - id, name, slug, description, image
  - parentId (self-relation cho nested categories)
  - createdAt, updatedAt

- [ ] **Product Model**
  - id, name, slug, description, price, comparePrice
  - images (JSON array), stock, sku
  - categoryId (relation to Category)
  - isActive, isFeatured
  - createdAt, updatedAt

- [ ] **Cart Model**
  - id, userId
  - createdAt, updatedAt

- [ ] **CartItem Model**
  - id, cartId, productId, quantity
  - createdAt, updatedAt

- [ ] **Order Model**
  - id, userId, orderNumber
  - status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
  - totalAmount, shippingAddress, billingAddress
  - createdAt, updatedAt

- [ ] **OrderItem Model**
  - id, orderId, productId
  - quantity, price (snapshot giá tại thời điểm đặt hàng)
  - createdAt, updatedAt

### 2.2 Database Migration
- [ ] Chạy `prisma migrate dev` để tạo migration đầu tiên
- [ ] Seed data mẫu (users, categories, products)

---

## ✅ PHASE 3: BACKEND - SERVER MODULES

### 3.1 Auth Module (`src/server/auth/`)
- [ ] `schemas.ts` - Zod schemas cho login, register
- [ ] `repo.ts` - User CRUD operations
- [ ] `service.ts` - Business logic (hash password, verify, JWT)
- [ ] `serializer.ts` - Map User model → safe response (exclude password)
- [ ] `src/app/api/auth/register/route.ts` - POST register
- [ ] `src/app/api/auth/login/route.ts` - POST login
- [ ] `src/app/api/auth/logout/route.ts` - POST logout
- [ ] `src/app/api/auth/me/route.ts` - GET current user

### 3.2 User Module (`src/server/user/`)
- [ ] `schemas.ts` - Zod schemas cho update profile
- [ ] `repo.ts` - User queries
- [ ] `service.ts` - Profile update logic
- [ ] `serializer.ts` - User response DTO
- [ ] `src/app/api/users/route.ts` - GET list (admin only)
- [ ] `src/app/api/users/[id]/route.ts` - GET, PATCH, DELETE

### 3.3 Category Module (`src/server/category/`)
- [ ] `schemas.ts` - Zod schemas cho create/update category
- [ ] `repo.ts` - Category CRUD
- [ ] `service.ts` - Business logic (slug generation, hierarchy)
- [ ] `serializer.ts` - Category response DTO
- [ ] `src/app/api/categories/route.ts` - GET list, POST create
- [ ] `src/app/api/categories/[id]/route.ts` - GET, PATCH, DELETE

### 3.4 Product Module (`src/server/product/`)
- [ ] `schemas.ts` - Zod schemas cho create/update product
- [ ] `repo.ts` - Product CRUD, filtering, pagination
- [ ] `service.ts` - Business logic (stock management, slug)
- [ ] `serializer.ts` - Product response DTO
- [ ] `src/app/api/products/route.ts` - GET list (with filters), POST create
- [ ] `src/app/api/products/[id]/route.ts` - GET, PATCH, DELETE

### 3.5 Cart Module (`src/server/cart/`)
- [ ] `schemas.ts` - Zod schemas cho add/update cart items
- [ ] `repo.ts` - Cart & CartItem CRUD
- [ ] `service.ts` - Business logic (calculate total, stock validation)
- [ ] `serializer.ts` - Cart response DTO (include products)
- [ ] `src/app/api/cart/route.ts` - GET cart, POST add item
- [ ] `src/app/api/cart/items/[id]/route.ts` - PATCH quantity, DELETE item
- [ ] `src/app/api/cart/clear/route.ts` - DELETE all items

### 3.6 Order Module (`src/server/order/`)
- [ ] `schemas.ts` - Zod schemas cho create order, update status
- [ ] `repo.ts` - Order & OrderItem CRUD
- [ ] `service.ts` - Business logic (create from cart, status transitions)
- [ ] `serializer.ts` - Order response DTO
- [ ] `src/app/api/orders/route.ts` - GET list, POST create (checkout)
- [ ] `src/app/api/orders/[id]/route.ts` - GET detail, PATCH status
- [ ] `src/app/api/orders/[id]/cancel/route.ts` - POST cancel order

---

## ✅ PHASE 4: FRONTEND - CLIENT PAGES & COMPONENTS

### 4.1 Authentication Pages
- [ ] `src/app/(auth)/login/page.tsx` - Login form
- [ ] `src/app/(auth)/register/page.tsx` - Register form
- [ ] `src/components/auth/LoginForm.tsx` - Client component
- [ ] `src/components/auth/RegisterForm.tsx` - Client component
- [ ] `src/hooks/useAuth.ts` - Auth state management

### 4.2 Layout & Navigation
- [ ] `src/app/layout.tsx` - Root layout với providers
- [ ] `src/components/layout/Header.tsx` - Header với search, cart icon, user menu
- [ ] `src/components/layout/Sidebar.tsx` - Navigation sidebar
- [ ] `src/components/layout/Footer.tsx` - Footer
- [ ] `src/components/layout/MobileNav.tsx` - Mobile navigation

### 4.3 Home Page
- [ ] `src/app/page.tsx` - Home page (Server Component)
- [ ] `src/components/home/HeroSlider.tsx` - Hero slider với animations
- [ ] `src/components/home/FeaturedProducts.tsx` - Featured products grid
- [ ] `src/components/home/CategoryShowcase.tsx` - Category cards
- [ ] `src/components/home/PromoSection.tsx` - Promotional banners

### 4.4 Product Pages
- [ ] `src/app/products/page.tsx` - Product listing (Server Component)
- [ ] `src/app/products/[slug]/page.tsx` - Product detail page
- [ ] `src/components/products/ProductCard.tsx` - Product card component
- [ ] `src/components/products/ProductGrid.tsx` - Grid layout
- [ ] `src/components/products/ProductFilters.tsx` - Filters sidebar
- [ ] `src/components/products/ProductGallery.tsx` - Image gallery với zoom
- [ ] `src/components/products/AddToCartButton.tsx` - Add to cart action
- [ ] `src/hooks/useProducts.ts` - Product data fetching

### 4.5 Category Pages
- [ ] `src/app/categories/page.tsx` - Category listing
- [ ] `src/app/categories/[slug]/page.tsx` - Products by category
- [ ] `src/components/categories/CategoryCard.tsx` - Category card

### 4.6 Cart & Checkout
- [ ] `src/app/cart/page.tsx` - Shopping cart page
- [ ] `src/app/checkout/page.tsx` - Checkout form
- [ ] `src/components/cart/CartItem.tsx` - Cart item row
- [ ] `src/components/cart/CartSummary.tsx` - Order summary
- [ ] `src/components/checkout/CheckoutForm.tsx` - Checkout form
- [ ] `src/components/checkout/OrderSummary.tsx` - Final order review
- [ ] `src/hooks/useCart.ts` - Cart state management

### 4.7 Order Pages
- [ ] `src/app/orders/page.tsx` - Order history
- [ ] `src/app/orders/[id]/page.tsx` - Order detail
- [ ] `src/components/orders/OrderCard.tsx` - Order card
- [ ] `src/components/orders/OrderStatus.tsx` - Status badge

### 4.8 Profile Pages
- [ ] `src/app/profile/page.tsx` - User profile
- [ ] `src/app/profile/edit/page.tsx` - Edit profile
- [ ] `src/components/profile/ProfileInfo.tsx` - Profile display
- [ ] `src/components/profile/ProfileForm.tsx` - Edit form

### 4.9 Admin Pages (Management)
- [ ] `src/app/admin/layout.tsx` - Admin layout
- [ ] `src/app/admin/dashboard/page.tsx` - Dashboard overview
- [ ] `src/app/admin/products/page.tsx` - Product management list
- [ ] `src/app/admin/products/create/page.tsx` - Create product
- [ ] `src/app/admin/products/[id]/edit/page.tsx` - Edit product
- [ ] `src/app/admin/categories/page.tsx` - Category management
- [ ] `src/app/admin/categories/create/page.tsx` - Create category
- [ ] `src/app/admin/categories/[id]/edit/page.tsx` - Edit category
- [ ] `src/app/admin/orders/page.tsx` - Order management
- [ ] `src/components/admin/DataTable.tsx` - Reusable data table
- [ ] `src/components/admin/ProductForm.tsx` - Product form
- [ ] `src/components/admin/CategoryForm.tsx` - Category form

---

## ✅ PHASE 5: SHARED COMPONENTS & UTILITIES

### 5.1 UI Components (Shadcn)
- [ ] Install & configure: Button, Input, Card, Dialog, Dropdown
- [ ] Install & configure: Table, Badge, Avatar, Tabs
- [ ] Install & configure: Form, Select, Checkbox, Radio
- [ ] Install & configure: Toast/Sonner for notifications
- [ ] Install & configure: Sheet (for mobile menu)
- [ ] Install & configure: Carousel (for sliders)

### 5.2 Custom Components
- [ ] `src/components/ui/LoadingSpinner.tsx`
- [ ] `src/components/ui/EmptyState.tsx`
- [ ] `src/components/ui/ErrorMessage.tsx`
- [ ] `src/components/ui/ImageUpload.tsx`
- [ ] `src/components/ui/SearchBar.tsx`
- [ ] `src/components/ui/Pagination.tsx`

### 5.3 Utilities & Helpers
- [ ] `src/lib/utils.ts` - Common utilities (cn, formatPrice, etc.)
- [ ] `src/lib/api-client.ts` - API client wrapper
- [ ] `src/lib/validators.ts` - Shared Zod schemas
- [ ] `src/lib/constants.ts` - App constants
- [ ] `src/lib/auth-helpers.ts` - Auth utilities
- [ ] `src/middleware.ts` - Route protection middleware

---

## ✅ PHASE 6: STYLING & DESIGN

### 6.1 Design System
- [ ] Define color palette trong `tailwind.config.ts`
- [ ] Setup custom fonts (Google Fonts)
- [ ] Define spacing, shadows, borders
- [ ] Create design tokens

### 6.2 Responsive Design
- [ ] Mobile-first approach
- [ ] Tablet breakpoints
- [ ] Desktop optimization
- [ ] Test trên các devices

### 6.3 Animations & Interactions
- [ ] Hover effects cho buttons, cards
- [ ] Smooth transitions
- [ ] Loading states với skeleton
- [ ] Micro-animations (Framer Motion nếu cần)

---

## ✅ PHASE 7: TESTING & OPTIMIZATION

### 7.1 Testing
- [ ] Test API endpoints với Postman/Thunder Client
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test cart & checkout flow
- [ ] Test responsive design

### 7.2 Performance
- [ ] Image optimization (next/image)
- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Database query optimization
- [ ] Caching strategy

### 7.3 Security
- [ ] Password hashing (bcrypt)
- [ ] JWT token security
- [ ] Input validation (Zod)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection
- [ ] CSRF protection

---

## ✅ PHASE 8: DEPLOYMENT PREPARATION

### 8.1 Environment Setup
- [ ] Setup `.env.example`
- [ ] Document environment variables
- [ ] Setup production database

### 8.2 Documentation
- [ ] README.md với hướng dẫn setup
- [ ] API documentation
- [ ] Component documentation

### 8.3 Build & Deploy
- [ ] Test production build
- [ ] Setup deployment (Vercel/Railway)
- [ ] Configure CI/CD

---

## 📊 PROGRESS TRACKING

- **Phase 1**: ⬜ 0% (Setup & Configuration)
- **Phase 2**: ⬜ 0% (Database Models)
- **Phase 3**: ⬜ 0% (Backend Modules)
- **Phase 4**: ⬜ 0% (Frontend Pages)
- **Phase 5**: ⬜ 0% (Shared Components)
- **Phase 6**: ⬜ 0% (Styling & Design)
- **Phase 7**: ⬜ 0% (Testing & Optimization)
- **Phase 8**: ⬜ 0% (Deployment)

---

## 🎨 DESIGN PRIORITIES

### UI/UX Requirements:
1. **Modern & Premium Design**
   - Gradient backgrounds
   - Glassmorphism effects
   - Smooth animations
   - Professional typography

2. **Hero Slider**
   - Auto-play với controls
   - Smooth transitions
   - Responsive images
   - Call-to-action buttons

3. **Product Cards**
   - Hover effects
   - Quick view
   - Add to cart animation
   - Wishlist icon

4. **Navigation**
   - Sticky header
   - Mega menu cho categories
   - Search autocomplete
   - Cart preview dropdown

5. **Mobile Experience**
   - Bottom navigation
   - Swipeable galleries
   - Touch-friendly buttons
   - Optimized performance

---

## 📝 NOTES

- Sử dụng **Server Components** cho data fetching khi có thể
- Sử dụng **Client Components** chỉ khi cần interactivity
- Implement **optimistic updates** cho cart operations
- Sử dụng **React Hook Form** + **Zod** cho form validation
- Implement **infinite scroll** hoặc **pagination** cho product listing
- Sử dụng **next/image** cho tất cả images
- Setup **error boundaries** cho error handling
- Implement **loading states** cho tất cả async operations

---

**Last Updated**: 2026-01-19
**Version**: 1.0.0
