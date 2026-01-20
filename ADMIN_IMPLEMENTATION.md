# ADMIN PANEL IMPLEMENTATION PLAN

## 🎯 Objective
Create complete admin panel with CRUD operations for Products, Categories, Reviews, and Users with soft delete support.

## ✅ Phase 1: Database Schema (IN PROGRESS)
- [x] Add `deletedAt` field to User model
- [ ] Add `deletedAt` field to Product model  
- [ ] Add `deletedAt` field to Category model
- [ ] Run migration: `npm run db:push && npm run db:generate`

## 📋 Phase 2: Server-side (API & Repositories)
### Admin Middleware
- [ ] Create admin auth middleware
- [ ] Protect admin routes

### Product Admin API
- [ ] GET /api/admin/products (list with soft-deleted)
- [ ] POST /api/admin/products (create)
- [ ] PUT /api/admin/products/:id (update)
- [ ] DELETE /api/admin/products/:id (soft delete)
- [ ] POST /api/admin/products/:id/restore (restore)

### Category Admin API
- [ ] GET /api/admin/categories (list with soft-deleted)
- [ ] POST /api/admin/categories (create)
- [ ] PUT /api/admin/categories/:id (update)
- [ ] DELETE /api/admin/categories/:id (soft delete)
- [ ] POST /api/admin/categories/:id/restore (restore)

### User Admin API
- [ ] GET /api/admin/users (list with soft-deleted)
- [ ] POST /api/admin/users (create)
- [ ] PUT /api/admin/users/:id (update role, etc)
- [ ] DELETE /api/admin/users/:id (soft delete)
- [ ] POST /api/admin/users/:id/restore (restore)

### Review Admin API
- [ ] GET /api/admin/reviews (list all)
- [ ] DELETE /api/admin/reviews/:id (hard delete - already exists)

## 🎨 Phase 3: Admin UI Pages
### Layout
- [ ] Create /admin layout with sidebar
- [ ] Admin navigation menu
- [ ] Protected route (admin only)

### Dashboard
- [ ] /admin - Overview with stats
- [ ] Total products, users, orders, reviews
- [ ] Recent activities

### Product Management
- [ ] /admin/products - List products (table with filters)
- [ ] /admin/products/new - Create product form
- [ ] /admin/products/[id]/edit - Edit product form
- [ ] Soft delete & restore buttons
- [ ] Show deleted items toggle

### Category Management
- [ ] /admin/categories - List categories
- [ ] /admin/categories/new - Create category
- [ ] /admin/categories/[id]/edit - Edit category
- [ ] Soft delete & restore
- [ ] Hierarchical view (parent/child)

### User Management
- [ ] /admin/users - List users
- [ ] /admin/users/[id]/edit - Edit user (role, etc)
- [ ] Soft delete & restore
- [ ] Role management

### Review Management
- [ ] /admin/reviews - List all reviews
- [ ] Delete reviews (with cascade)
- [ ] Filter by product/user

## 🔐 Phase 4: Authorization
- [ ] Admin middleware check
- [ ] Redirect non-admin users
- [ ] Protect all admin routes

## 📊 Phase 5: Features
- [ ] Pagination for all lists
- [ ] Search & filters
- [ ] Bulk actions
- [ ] Export data (CSV)
- [ ] Image upload for products

## 🎯 Current Status: Phase 1 - Database Schema
Next: Add deletedAt to Product and Category models
