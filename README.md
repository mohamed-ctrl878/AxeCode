# AxeCode Frontend

AxeCode is a professional learning platform built with a modular architecture and futuristic design. This project follows strict engineering disciplines to ensure scalability, maintainability, and visual excellence.

## Features

- Courses: Comprehensive learning paths and modules.
- Problems: Interactive coding challenges and judging system.
- Roadmaps: Guided learning journeys.
- Feed: Community interaction and updates.
- Articles: Technical knowledge base and blogs.
- Live Streams: Real-time educational sessions.
- Media Assets: Centralized resource management.
- Messaging: Secure communication hub.

## Architecture

This project implements Clean Architecture principles to separate concerns and ensure testability.

### Layers

- Domain: Contains entities, use cases, and repository interfaces. This is the core business logic, independent of any external frameworks.
- Infrastructure: Implements repository interfaces, manages data flow (DTOs), and handles state management (Redux).
- Presentation: contains the UI logic, components, and design system implementation.
- Core: Shared utilities, API wrappers, and validation logic.

### Pattern: Facades and Services

Complex operations are orchestrated through Facades in the domain layer, while specific functionalities are encapsulated within Services.

## Engineering Discipline

We adhere to the following principles for high-quality software development:

- SOLID Principles: Strict compliance with Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- Clean Code: Meaningful naming, small functions, and comprehensive JSDoc documentation.
- DRY (Don't Repeat Yourself): Extraction of common logic into utilities or shared services.
- KISS (Keep It Simple, Stupid): Prioritizing simplicity in implementation.
- YAGNI (You Ain't Gonna Need It): Avoiding premature optimization or unnecessary features.
- Fail Fast: Early validation of inputs and immediate error handling.

## Design System: Antigravity Core

The UI follows the Antigravity Core design philosophy:

- Theme: Futuristic Minimalist / Dark SaaS.
- Layout: Bento Grid patterns for modular content presentation.
- Visuals: Clean lines, high contrast, and weightless transitions.
- Typography: Precision-focused sans-serif and monospace fonts.

## Tech Stack

- Framework: React 19
- Build Tool: Vite 7
- State Management: Redux Toolkit
- Styling: Tailwind CSS 4
- Icons: FontAwesome 6 & Lucide
- Editor: Monaco Editor
- Routing: React Router Dom 6
- Testing: Vitest & React Testing Library

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Project Structure

```text
src/
├── core/           # Shared utilities and API configurations
├── domain/         # Business logic: Entities, Interfaces, UseCases
├── infrastructure/ # Data layer: DTOs, Repositories, Redux Store
├── presentation/   # UI layer: Components, Features, Design System
└── main.jsx        # Application entry point
```
