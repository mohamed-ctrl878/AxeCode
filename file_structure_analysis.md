# AxeCode Frontend Application - Architecture & File Structure Analysis

The AxeCode frontend application follows a **Clean Architecture** pattern, emphasizing separation of concerns and maintainability. It is structured into distinct layers that isolate business logic from UI and infrastructure.

## 📁 Key Directory Structure

```text
src/
├── core/               # Cross-cutting concerns (Utilities, Constants, Hooks)
├── domain/             # Business Logic & Rules (Entities, UseCases, Interfaces)
├── infrastructure/     # External Services & Data Management (Repositories, Stores)
├── presentation/       # User Interface (Features, Components, Styles)
└── API/                # Centralized API endpoints and services
```

---

## 🏗️ Architectural Modeling

### 1. Presentation Layer (`src/presentation`)
The entry point for the user. It is divided into dynamic features and reusable shared components.
- **feature/**: Context-specific modules (e.g., `course`, `profile`, `roadmap`). Each feature contains its own logic, components, and routing.
- **shared/**: Global UI components (buttons, headers, layouts) and shared providers (auth, context).
- **routes/**: Global routing configuration.

### 2. Domain Layer (`src/src/domain`)
The "Heart" of the application, containing purely business logic.
- **entity/**: Domain models (e.g., User, Content, Course).
- **useCase/**: Logic specialized for a single action (e.g., `LoginUseCase`, `EnrollInCourse`).
- **mapper/**: Logic to transform data between the API (DTOs) and the Domain (Entities).
- **interface/**: Contracts defining how other layers should interact with the domain.

### 3. Infrastructure Layer (`src/infrastructure`)
Handles communication with the outside world (APIs, Local Storage).
- **repository/**: Implementation of domain interfaces to fetch/send data (e.g., `UserRepositoryImpl`).
- **DTO/**: Data Transfer Objects—representations of raw API responses.
- **store/**: Global state management implementations (e.g., Zustand/Redux).

### 4. Core Layer (`src/core`)
The foundation of the application, providing tools for all other layers.
- **utils/**: Pure utility functions.
- **hooks/**: Reusable React hooks.
- **constants/**: Global configuration and static strings.
- **validation/**: Schema validations (e.g., Zod schemas).

---

## 🚀 Analysis Summary
- **Strong Decoupling**: Visual components in `presentation` don't know about API details; they interact via `useCases` or `repositories`.
- **Feature-Based UI**: Scaling the app is easy as new features are isolated in the `feature/` directory.
- **Model Consistency**: `mappers` ensure that the UI always works with clean entities, regardless of how the backend API evolves.
