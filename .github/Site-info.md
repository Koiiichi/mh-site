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

## Project Backgrounds

### CoCode
CoCode is a collaborative, web-based code editor designed for real-time programming and team workflows. Inspired by the simplicity of Google Docs and the familiarity of desktop IDEs, it combines multi-user concurrency, conflict resolution, and project persistence with a VS Code–like interface powered by Monaco Editor. What started as a "glorified Notepad++ online" grew into a fully featured development platform for teams.

**Background**: The idea began with the frustration of juggling local editors and external collaboration tools for quick coding sessions. The vision was to create a browser-based environment that felt as effortless as sharing a Google Doc — open a link, start coding, and see changes sync live. As the project grew, the focus shifted from a lightweight text editor into a scalable IDE-like system with persistent projects, structured file management, secure authentication, and real-time collaboration.

**Architecture**: TypeScript/React frontend with Tailwind CSS, Monaco Editor integration, Firebase Realtime Database for live sync, Firestore/Storage for persistence, Firebase Authentication, and Vercel deployment with GitHub workflows.

### MLOX
MLOX is a custom interpreted programming language built in C, extending the Lox language from *Crafting Interpreters* with modern runtime features. Designed as both a learning project and a language playground, MLOX introduces ternary operators, object-oriented primitives, native string methods, mathematical operations, and file I/O.

**Background**: The motivation came from studying *Crafting Interpreters* by Bob Nystrom and wanting to go beyond simply replicating Lox. The curiosity was in exploring "what if this language felt more practical and closer to what developers expect today?" This led to experimenting with runtime enhancements and understanding parser design, bytecode execution, and virtual machine architecture.

**Architecture**: Core interpreter written in C, recursive descent parser extended for ternary operators, stack-based virtual machine, extended value system for OOP primitives, native methods for string/file I/O operations, and Doxygen-generated documentation.

### Harmonics
Project Harmonics is a data sonification tool that transforms particle physics datasets into sound, creating auditory representations of scientific phenomena. Originally developed in 2023 as a scientific outreach initiative, it maps collision data to musical parameters such as pitch, velocity, and timing using MIDI-based outputs.

**Background**: The project began with the goal of making particle physics more accessible, particularly to audiences who benefit from non-visual learning. By mapping data attributes such as particle IDs, momentum, and scattering angles into musical parameters, Harmonics introduced a new medium for engagement. Used in outreach sessions with the Rising Sun Foundation, teaching electron–proton scattering to 30+ differently abled students.

**Architecture**: Python + Pandas for data processing, mapping engine converting physics attributes to musical values, MIDI generation for DAW compatibility, with planned real-time interaction and advanced data processing features.

### ChabaCrunch
ChabaCrunch is a data science project built during the TouchBistro x UW Hackathon (Feb 2025) that analyzed over 8 million restaurant transactions across Canada and the U.S. The system unified messy bill- and venue-level datasets into an analysis-ready pipeline, enabling insights into tipping culture across cities, venue concepts, and order types.

**Background**: Inspired by shared interest in machine learning and data visualization, the team saw an opportunity to answer fundamental questions about tipping behaviors: Do Canadians and Americans tip differently? How do venue concepts affect tipping? What role does order type play? The messy, large-scale data provided the perfect challenge to explore these ideas while developing expertise in pipeline design and ML-driven imputation.

**Architecture**: Data integration merging bills.csv and venues.csv, comprehensive data cleaning and feature engineering, tuned Random Forest for imputing missing venue concepts (~85% accuracy), exploratory data analysis with visualizations, built iteratively in Google Colab for reproducibility and collaboration.

## Common Patterns to Follow

1. **Always** use TypeScript with strict typing from `lib/types.ts`
2. **Import paths** use `@/` alias for clean imports
3. **Animations** should respect `useReducedMotion()` preferences
4. **Component names** use PascalCase with descriptive, feature-based naming
5. **Event handlers** prevent default on touch devices for custom interactions
6. **CSS classes** follow semantic naming with Tailwind utilities
7. **Data updates** require JSON file changes and type verification