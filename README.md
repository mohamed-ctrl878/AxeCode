# 📑 AxeCode Documentation
### **[🏠 Home](./README.md)** | [🏗️ Architecture](./file_structure_analysis.md) | [🔄 Data Flow](./data_process_flow_analysis.md)
---

# AxeCode Frontend Application

AxeCode is a modern, high-performance web platform designed for developers and learners. Built with **React 19** and **Vite**, the application follows a strict **Clean Architecture** to ensure scalability, testability, and a clean separation of concerns.

---

## 🛠️ Tech Stack

### Core
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Routing**: [React Router 6.27](https://reactrouter.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)

### UI & Styling
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Icons**: Lucide React & FontAwesome 6/7
- **Editor**: Monaco Editor & Tiptap (Rich Text)
- **Visuals**: @xyflow/react (Interactive Flow Diagrams)
- **Toasts**: React Hot Toast

### Communication & Content
- **API**: Axios (abstracted via ApiClient)
- **Sockets**: Socket.io-client
- **Video/Live**: Video.js, HLS.js, Agora RTC
- **Validation**: Validator & Zod (via DTOs)

### Testing
- **Runner**: Vitest
- **Library**: React Testing Library

---

## 🏗️ Architecture Overview

The project is structured according to **Clean Architecture** principles:

- **`src/domain`**: The core business logic. Contains Entities, Use Cases, and Mappers. No dependencies on UI or APIs.
- **`src/infrastructure`**: Handles external communications. Contains Repository implementations, DTOs, and global stores.
- **`src/presentation`**: The UI layer. Divided into `feature` (business modules) and `shared` (reusable components/layouts).
- **`src/core`**: Common utilities, hooks, constants, and global configuration.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher (Recommended v20+)
- **npm**: v9 or higher

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Create a `.env` file in the root directory (you can use `.env.example` as a template).
2. Configure the Backend URL and API endpoints:
   ```env
   VITE_API_BASE_URL=http://localhost:1338
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Build & Preview
Build the production-ready bundle:
```bash
npm run build
```
Preview the local build:
```bash
npm run preview
```

### Testing & Linting
Run unit tests with Vitest:
```bash
npm run test
```
Run ESLint:
```bash
npm run lint
```

---

## 🤝 Contributing Guidelines

We welcome contributions! Please follow these rules to maintain code quality:

1. **Layer Separation**: Never import from `presentation` into `domain` or `infrastructure`.
2. **UseCases**: All logic involving data fetching or complex business rules must reside in a `UseCase`.
3. **DTOs & Mappers**: Always use DTOs for outgoing data and Mappers for incoming data to ensure the UI stays decoupled from backend schema changes.
4. **Styling**: Use Tailwind CSS utility classes and aim for a consistent design system.
5. **Testing**: Write unit tests for new `UseCases` or critical `Utils`.

---

## 📄 Documentation
For a deeper dive into the architecture, check out:
- [File Structure Analysis](./file_structure_analysis.md)
- [Data & Process Flow Analysis](./data_process_flow_analysis.md)
