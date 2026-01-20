# 🛍️ Vibe E-commerce

Modern e-commerce platform built with Next.js 16, featuring a beautiful UI, professional architecture, and seamless shopping experience.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748)

## ✨ Features

### 🎨 Beautiful UI/UX
- Modern gradient design with purple-blue theme
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Glassmorphism effects
- Premium typography with Inter font

### 🔐 Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes
- Role-based access (User/Admin)
- Login/Register with form validation

### 🛒 Shopping Features
- Product listing with filters
- Product detail pages
- Shopping cart (Zustand state management)
- Category browsing
- Search functionality
- Featured products showcase

### 👤 User Management
- User profile page
- Order history
- Account settings
- Quick stats dashboard

### 📦 Order Management
- Order tracking
- Status updates with visual indicators
- Order history
- Mock data ready for API integration

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Carousel**: Embla Carousel

### Backend
- **API**: Next.js API Routes
- **Database**: SQLite with Prisma 7
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **HTTP Client**: Axios

## 📁 Project Structure

```
vibe-ecomerce/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── products/     # Product endpoints
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── profile/          # User profile
│   ├── orders/           # Order history
│   ├── products/         # Product pages
│   ├── categories/       # Category pages
│   └── page.tsx          # Homepage
├── server/                # Server-side logic
│   ├── auth/             # Auth module
│   │   ├── repo.ts       # Database operations
│   │   ├── service.ts    # Business logic
│   │   ├── serializer.ts # Response formatting
│   │   └── schemas.ts    # Validation schemas
│   └── product/          # Product module
├── store/                 # Zustand stores
│   ├── auth.ts           # Auth state
│   └── cart.ts           # Cart state
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts       # Auth hooks
│   └── use-products.ts   # Product hooks
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── home/             # Homepage components
│   ├── products/         # Product components
│   └── ui/               # Shadcn UI components
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   ├── api-client.ts     # Axios instance
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
└── prisma/               # Database
    ├── schema.prisma     # Database schema
    └── seed.ts           # Seed data
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd vibe-ecomerce
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Setup database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database scripts
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

## 🧪 Test Accounts

After running `npm run db:seed`:

**Admin Account:**
- Email: `admin@vibe.com`
- Password: `password123`

**User Account:**
- Email: `user@vibe.com`
- Password: `password123`

## 🎯 Key Pages

- **Homepage**: `/` - Hero slider, featured products, categories
- **Products**: `/products` - All products with filters
- **Product Detail**: `/products/[slug]` - Individual product page
- **Categories**: `/categories` - Browse categories
- **Category Products**: `/categories/[slug]` - Products by category
- **Login**: `/login` - User login
- **Register**: `/register` - User registration
- **Profile**: `/profile` - User profile and stats
- **Orders**: `/orders` - Order history

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[slug]` - Get product by slug

## 🎨 Design System

### Colors
- **Primary**: Purple (#8b5cf6) to Blue gradient
- **Background**: White with subtle grays
- **Accents**: Category-specific colors

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text
- **Body**: Regular weight, good readability

### Components
- Shadcn UI for base components
- Custom styled with TailwindCSS
- Consistent spacing and shadows
- Smooth animations

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ Protected API routes
- ✅ Secure HTTP-only cookies (ready)

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet breakpoints
- ✅ Desktop optimization
- ✅ Touch-friendly UI
- ✅ Adaptive layouts

## 🚧 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Database schema
- [x] Authentication
- [x] Product pages
- [x] Profile & Orders pages

### Phase 2: Shopping (In Progress)
- [ ] Cart page
- [ ] Checkout flow
- [ ] Order creation
- [ ] Payment integration

### Phase 3: Admin
- [ ] Admin dashboard
- [ ] Product management
- [ ] Order management
- [ ] User management

### Phase 4: Enhancement
- [ ] Product search
- [ ] Wishlist
- [ ] Product reviews
- [ ] Email notifications

### Phase 5: Deployment
- [ ] Production build
- [ ] Environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the Vibe team

---

**Status**: 🚀 Active Development
**Version**: 1.0.0
**Last Updated**: January 20, 2026
# vibe-ecommerce
