# AI Coding Assistant Instructions for Muneeb Hassan Portfolio

## Project Overview
This is a Next.js 14 portfolio site using the App Router with TypeScript, Tailwind CSS, Framer Motion, and next-themes. It showcases projects through an interactive scroll-based carousel and maintains a design engineering aesthetic with precise animations and typography.

## Architecture & File Organization

### Component Architecture
- **Route Groups**: Components live in `app/(components)/` using Next.js route groups to organize without affecting URLs
- **Feature Folders**: Complex components like `projects-carousel/` and `hold-preview/` are grouped with their hooks and utilities
- **Client Components**: Most interactive components use `'use client'` for animations and state management

### Data Management
- **Static JSON**: Project and building data stored in `data/*.json` with TypeScript types in `lib/types.ts`
- **Type Safety**: Strict typing with `Project`, `BuildingItem`, and `ProjectMedia` union types
- **Data Flow**: JSON imports cast as types: `projectsData as unknown as Project[]`

### Theme System
- **CSS Variables**: Theme colors defined as CSS custom properties (`--bg`, `--surface`, `--text`, etc.)
- **Theme Provider**: Custom wrapper around `next-themes` with `defaultTheme="dark"` and `enableSystem={false}`
- **Storage Key**: Uses `"muneeb-theme"` for theme persistence

## Component Patterns

### Animation Conventions
- **Framer Motion**: Extensive use with `useScroll`, `useTransform`, and scroll-triggered animations
- **Reduced Motion**: Always check `useReducedMotion()` and provide fallbacks: `[0, 0]` transforms
- **Scroll Binding**: Components bind animations to scroll progress using `offset` arrays like `['start end', 'end start']`

### Custom Hooks Pattern
```typescript
// Example: useCarousel.ts returns state + actions
const { sectionRef, activeIndex, setActiveIndex, goTo, isManualScroll } = useCarousel(slugs);
```

### Component Structure
- Components export named functions: `export function Hero() {}`
- Props use inline types: `{ children }: { children: React.ReactNode }`
- Refs for scroll targets: `const containerRef = useRef<HTMLDivElement | null>(null)`

## Styling & Design System

### Tailwind Configuration
- **Custom Colors**: Semantic color system using CSS variables for theme switching
- **Typography**: Two font families via CSS variables: `--font-sans` (Inter) and `--font-mono` (IBM Plex Mono)
- **Spacing**: Uses large gaps (16, 24) and rounded corners (`rounded-[2.5rem]`, `rounded-[2.75rem]`)

### Visual Patterns
- **Cards**: Consistent pattern with `border border-subtle bg-surface/80 shadow-[...]`
- **Typography Hierarchy**: 
  - Section labels: `font-mono text-xs uppercase tracking-[0.3em] text-muted`
  - Headings: `text-3xl font-semibold tracking-tight sm:text-4xl`
- **Gradients**: Radial gradients for backgrounds: `bg-[radial-gradient(circle_at_top,_rgba(107,193,255,0.2),_transparent_70%)]`

## Key Development Workflows

### Static Generation
- Project pages use `generateStaticParams()` to create routes from `data/projects.json`
- Metadata generated dynamically with `generateMetadata()` function
- Images optimized with Next.js `Image` component

### Carousel Implementation
- Scroll-driven with `useScroll` hook bound to section height
- Manual navigation overrides scroll with `isManualScroll.current` ref
- Dynamic height calculation: `calc(${projects.length * 0.8} * 100vh + 100vh)`

### Hold-to-Preview Feature
- Custom `useLongPress` hook with configurable delay (500ms)
- Context provider pattern for global hold preview state
- Event prevention on touch devices: `e.preventDefault()` in handlers

## Content Management

### Adding Projects
1. Add entry to `data/projects.json` with required fields: `slug`, `title`, `summary`, `tags`, `links`, `media`
2. Place media assets in `public/media/` following naming convention: `{slug}-poster.{ext}`
3. Routes auto-generate via `generateStaticParams()`

### Building Items
- Managed in `data/building.json` with progress tracking (0-1 scale)
- Status types: `'Active' | 'Paused' | 'Exploring'`
- Optional collaborators boolean for UI indicators

## Testing & Development

### Commands
- `pnpm dev` - Development server
- `pnpm build` - Production build  
- `pnpm lint` - ESLint check
- `pnpm format` - Prettier formatting

### Font Loading
- Next.js font optimization with `display: 'swap'` for performance
- CSS variables set in root layout for consistent font access

## Common Patterns to Follow

1. **Always** use TypeScript with strict typing from `lib/types.ts`
2. **Import paths** use `@/` alias for clean imports
3. **Animations** should respect `useReducedMotion()` preferences
4. **Component names** use PascalCase with descriptive, feature-based naming
5. **Event handlers** prevent default on touch devices for custom interactions
6. **CSS classes** follow semantic naming with Tailwind utilities
7. **Data updates** require JSON file changes and type verification