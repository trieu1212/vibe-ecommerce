You are a senior Fullstack Engineer working on a Next.js (App Router) fullstack project using sqlite with Prisma ORM.

## Goal
First, design a plan to create/update the database model. **Do not add any extra fields beyond what is required by the template and the provided model fields.**
For now, **only create one file**: `tracking_task.md`, following exactly the structure of `template_tracking_task.md` located in the project folder.

- If `tracking_task.md` already exists, **delete it and recreate it** from scratch following the template.
- **No implementation is needed at this stage.** Only planning and specification.

---

## Required Behavior

### 1. Analyze existing codebase
- Check whether the target model already exists in the Prisma schema.
- If the model exists:
  - Compare the current fields with the required fields.
  - **Identify missing fields only** (do not modify or rename existing fields).
- Update the plan to include adding **only the missing fields**.

---

### 2. Strict API component structure (Next.js fullstack – server side)

In the tracking plan, you MUST adhere to and rigorously follow the structure and notes for these components, implemented in **Next.js App Router style**:

#### Server-side components
- **Route (API handler)**  
  - `src/app/api/<resource>/route.ts`  
    - GET (list)
    - POST (create)
  - `src/app/api/<resource>/[id]/route.ts`  
    - GET (detail)
    - PATCH (update)
    - DELETE (soft or hard delete – specify in plan)

- **Schema / Validation**
  - Zod schemas for:
    - create payload
    - update payload
    - query params (if applicable)

- **Repo**
  - Pure data access layer
  - Calls Prisma Client only
  - No business logic
  - One responsibility per function

- **Service**
  - Business logic layer
  - Calls repo
  - Handles:
    - transactions
    - invariants
    - cross-entity validation
  - No HTTP / request knowledge

- **Serializer / Mapper**
  - Maps Prisma models → API response DTO
  - Maps input DTO → Prisma input where necessary
  - Ensures response shape stability

> ⚠️ **Important**
> - Only PLAN these components inside `tracking_task.md`
> - Do NOT write any code
> - Only describe responsibilities, file paths, and data flow

---

### 3. Client-side handling (Next.js App Router – REQUIRED ADDITION)

The tracking plan MUST also include **client-side handling strategy**, strictly at a **planning level only**.

#### Client responsibilities to be included in `tracking_task.md`
- Data fetching strategy:
  - Server Components vs Client Components
  - When to use:
    - `fetch()` with caching
    - `cache: 'no-store'`
    - `revalidate`
- Mutation strategy:
  - Create / Update / Delete via API routes
  - Optimistic vs non-optimistic updates (decision documented)
- State handling:
  - Local state (useState)
  - Form state (React Hook Form or equivalent – planning only)
- Validation:
  - Zod schema reuse (shared or duplicated – decision documented)
- Error handling:
  - API error mapping
  - User-facing error display strategy
- UI responsibilities:
  - List view
  - Detail view
  - Create / Edit form
  - Loading & empty states

> ⚠️ Constraints:
> - Do NOT create React components
> - Do NOT write JSX
> - Only describe **what will exist**, **where**, and **why**

---

## Project Folder Structure Guidance (must be used in the plan)

Use the following folder layout for **planning only** (do not create files):

### Backend / Server
- `prisma/schema.prisma`
- `src/lib/db.ts`
- `src/server/<module>/`
  - `repo.ts`
  - `service.ts`
  - `schemas.ts`
  - `serializer.ts`
- `src/app/api/<resource>/route.ts`
- `src/app/api/<resource>/[id]/route.ts`

### Client
- `src/app/<resource>/page.tsx` (list view – Server Component)
- `src/app/<resource>/[id]/page.tsx` (detail view – Server Component)
- `src/app/<resource>/create/page.tsx` (create form – Client Component)
- `src/app/<resource>/[id]/edit/page.tsx` (edit form – Client Component)
- `src/components/<resource>/` (shared UI components – planned only)
- `src/hooks/` (data fetching & mutation hooks – planned only)

---

## Output Requirement

Create **ONLY**:
- `tracking_task.md`

The content MUST follow `template_tracking_task.md` **exactly**.

The file MUST include:
- Model analysis (exists? missing fields?)
- Prisma model plan (fields, relations, nullability)
- Planned API surface (routes & responsibilities)
- Planned server module structure (repo / service / schemas / serializer)
- Planned client-side handling strategy
- Step-by-step checklist in the template format

❌ No implementation  
❌ No extra files  
❌ No additional fields  
❌ No deviation from template structure
