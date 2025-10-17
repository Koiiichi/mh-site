# Agent Instructions for Portfolio Site Updates

## Overview
This document provides specific instructions for implementing comprehensive updates to the Muneeb Hassan portfolio site based on user feedback and requirements.

## Critical Changes Required

### 1. Hero Section Content Update
**Location**: `app/(components)/hero.tsx`

**Current**: "Design engineer crafting tactile software..."
**New**: 
- Title: I am a "Software Engineer" (italicized with quotes, theme-consistent font)
- Subtitle: with experience building across web, backend, ML, and embedded systems.
- Description: I've worked on projects spanning scalable platforms, data pipelines, and real-time firmware — while also exploring new areas like frontend engineering and AI-driven agents. Currently a  CS & Stats student at the University of Waterloo and a Firmware Developer with the Midnight Sun Solar Car Team. 

### 2. Projects Carousel Overhaul
**Location**: `app/(components)/projects-carousel/`

**Problem**: Scroll gets stuck on "Selected work - Scroll through the timeline" section
**Solution**: Replace with simplified project tiles

**New Design**:
- Small project tiles with one-liner descriptions
- Click-to-expand functionality with translucent overlay
- Project details in modal format with structured content (see project templates below)

**Project Content Templates**:

#### CoCode Modal Content:
```
## CoCode

### Overview
CoCode is a collaborative, web-based code editor designed for real-time programming and team workflows. Inspired by the simplicity of Google Docs and the familiarity of desktop IDEs, it combines multi-user concurrency, conflict resolution, and project persistence with a VS Code–like interface powered by Monaco Editor. What started as a "glorified Notepad++ online" grew into a fully featured development platform for teams.

### Architecture
- Frontend: TypeScript, React, Tailwind CSS for scalable UI/UX
- Editor Core: Monaco Editor integration providing syntax highlighting, auto-detection of languages, and a VS Code–like editing experience
- Backend & Persistence: Firebase Realtime Database for live synchronization and Firestore/Storage for structured persistence
- Authentication: Firebase Authentication supporting Google, GitHub, and email login
- Collaboration Features: Live cursors, session presence tracking, tabbed file navigation, and cross-user project sync
- Deployment: Vercel-hosted with GitHub workflows for CI/CD

### Timeline
October 2024 – June 2025

### Tools
TypeScript · React · Tailwind CSS · Firebase (Realtime DB, Firestore, Storage, Authentication) · Monaco Editor · Bash · GitHub Workflows · Vercel

### Links
[Visit Website →] https://co-c0de.vercel.app/
[View Source →] https://github.com/Koiiichi/CoCode
```

#### MLOX Modal Content:
```
## MLOX

### Overview
MLOX is a custom interpreted programming language built in C, extending the Lox language from Crafting Interpreters with modern runtime features. Designed as both a learning project and a language playground, MLOX introduces ternary operators, object-oriented primitives, native string methods, mathematical operations, and file I/O.

### Architecture
- Core Interpreter: Written in C with a focus on performance and clarity
- Parsing: Recursive descent parser extended to handle ternary operators and new language constructs
- Bytecode VM: Stack-based virtual machine handling execution with dispatch loops and dynamic memory management
- Object-Oriented Primitives: Extended value system to support class-like structures, methods, and property access
- Native Methods: Implemented standard library features for string manipulation, file I/O, and math operations
- Documentation: Doxygen-style wiki generated directly from annotated C source

### Timeline
June 2025 – August 2025

### Tools
C · Make · Doxygen · Vim · GCC/Clang

### Links
[View Source →] https://github.com/Koiiichi/mlox
[Documentation →] Generate via `make docs` (see GitHub instructions)
```

#### Harmonics Modal Content:
```
## Harmonics

### Overview
Project Harmonics is a data sonification tool that transforms particle physics datasets into sound, creating auditory representations of scientific phenomena. Originally developed in 2023 as a scientific outreach initiative, it maps collision data to musical parameters such as pitch, velocity, and timing using MIDI-based outputs.

### Architecture
- Data Processing: Python + Pandas to clean and structure physics datasets
- Mapping Engine: Converts attributes (particle type, momentum, angle) into musical values (pitch, velocity, timing)
- MIDI Generation: Outputs portable MIDI files for use in DAWs (Digital Audio Workstations)
- Pipeline: sonify_dataset.py transforms raw CSV physics data into playable .mid files

### Timeline
March 2023 – Present (Ongoing Expansion)

### Tools
Python · Pandas · MIDI Libraries · Digital Audio Workstation (DAW)

### Links
[View Source →] https://github.com/Koiiichi/project-harmonics/tree/main
[Listen Demo →] https://projectharmonics.wixsite.com/about/method
```

#### ChabaCrunch Modal Content:
```
## ChabaCrunch

### Overview
ChabaCrunch is a data science project built during the TouchBistro x UW Hackathon (Feb 2025) that analyzed over 8 million restaurant transactions across Canada and the U.S. The system unified messy bill- and venue-level datasets into an analysis-ready pipeline, enabling insights into tipping culture across cities, venue concepts, and order types.

### Architecture
- Data Integration: Merged bills.csv and venues.csv on venue_xref_id to build a unified dataset
- Data Cleaning: Tagged transactions as refunds vs. sales, removed invalid rows, applied concept-based outlier capping
- Feature Engineering: Derived tip percentage per transaction, aggregated venue-level features
- Modeling: Used tuned Random Forest to impute missing venue concepts (22% missing) with ~85% accuracy
- Exploratory Data Analysis: Visualized average tip percentages and amounts by city

### Timeline
February 2025

### Tools
Python · Pandas · scikit-learn · NumPy · Matplotlib · Seaborn · Google Colab

### Links
[Devpost →] https://devpost.com/software/chabacrunch
[View Source →] https://github.com/Koiiichi/ChabaCrunch-CXC2025
```

### 3. Clock & Location Updates
**Location**: `app/(components)/footer-clock.tsx`

**Changes**:
- Change location from "Karachi" to "Waterloo"
- Instead of current location, show "location of last visit to the site"
- Convert to analog clock design (simple, clean)
- Place only at end of page

### 4. Mouse Interaction Enhancement
**Location**: Create new component `app/(components)/cursor-halo.tsx`

**Requirements**:
- Subtle halo/brighter region that follows mouse pointer
- Not a light, but brightened area around cursor
- Keep subtle and tasteful

### 5. Background Cleanup
**Location**: `app/(components)/hero-background.tsx`

**Change**: Remove mathematical function-generated shapes from hero background

### 6. Section Removal
**Remove these sections**:
- Writing section
- Building now/concurrent threads section
- Keep site simpler and more focused

### 7. Favicon Fix
**Location**: `app/icon.svg` and related favicon files

**Issue**: Favicon isn't the right one
**Action**: Ensure proper favicon implementation and cache busting by using favicon in public/favicon.svg

### 8. Button Sizing Fix
**Location**: Check homepage buttons

**Issue**: "View selected work" and "Connect with me" buttons are different sizes
**Action**: Ensure consistent button sizing

### 9. Performance Optimization
**Focus Areas**:
- Faster loading times
- Image optimization
- Bundle size reduction
- Critical CSS inlining

### 10. External Link Buttons Enhancement
**Location**: Connect with me section, project external links

**Requirements**:
- Add relevant logos before text in buttons
- Format: [LOGO] TEXT IN CAPS
- Examples: GitHub logo + "GITHUB", LinkedIn logo + "LINKEDIN"

### 11. Footer Enhancements
**Location**: Footer component

**Add**:
- "Last updated" timestamp
- Status LED indicator
- Keep minimal and clean

### 12. Header Navigation
**Location**: `app/(components)/hero.tsx` or create new nav component

**Add**: Quick links to:
- Projects section
- Other relevant sections
- Keep simple and clean

### 13. URL/Routing Fix
**Issue**: Default URL goes to `#mlox` instead of root
**Action**: Fix routing to ensure clean URLs without hash fragments

## Critical Errors to Fix

### Console Errors:
1. **404 Errors**: Missing media files
   - `media/mlox-poster.svg`
   - `media/harmonics-poster.svg` 
   - `media/chabacrunch-poster.svg`
   - `media/cocode-poster.svg`

2. **React Errors**: 
   - Minified React error #425
   - Minified React error #418
   - Minified React error #423

3. **Navigation Throttling**: History API flooding protection triggered

### Immediate Actions:
1. Create missing poster SVG files in `public/media/`
2. Debug React hydration errors
3. Fix navigation/routing issues causing history API flooding
4. Optimize performance to reduce bundle size

## Implementation Priority:
1. Fix critical errors and missing files
2. Update hero section content
3. Rebuild projects carousel with modal system
4. Implement UI/UX improvements (buttons, clock, navigation)
5. Performance optimizations
6. Polish features (cursor halo, logos, timestamps)

## Data Updates Required:
Update `data/projects.json` to include new project descriptions and ensure all projects have corresponding poster images in `public/media/`.