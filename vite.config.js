import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";


// تحويل import.meta.url إلى dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],


  // --- الجزء الجديد المضاف هنا ---
  server: {
    host: '0.0.0.0', // يسمح بالوصول من أي جهاز في الشبكة
    port: 5173,      // التأكد من تثبيت المنفذ
    hmr: {
      host: '192.168.1.5', // عنوان IP الخاص بجهازك (الذي استخرجناه من ipconfig)
    },
  },
  // ----------------------------

  resolve: {
    alias: {
      // Core Technical Layer
      "@core": path.resolve(__dirname, "src/core"),
      "@core/API": path.resolve(__dirname, "src/core/API"),
      "@core/utils": path.resolve(__dirname, "src/core/utils"),
      "@API": path.resolve(__dirname, "src/API"),

      // Infrastructure Layer (Technicall Implementation)
      "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
      "@infrastructure/store": path.resolve(__dirname, "src/infrastructure/store"),
      "@infrastructure/repository": path.resolve(__dirname, "src/infrastructure/repository"),
      "@infrastructure/DTO": path.resolve(__dirname, "src/infrastructure/DTO"),

      // Domain Layer (Business Logic & Entities)
      "@domain": path.resolve(__dirname, "src/domain"),
      "@domain/entity": path.resolve(__dirname, "src/domain/entity"),
      "@domain/interface": path.resolve(__dirname, "src/domain/interface"),
      "@domain/mapper": path.resolve(__dirname, "src/domain/mapper"),
      "@domain/useCase": path.resolve(__dirname, "src/domain/useCase"),

      // Presentation Layer (UI & UX)
      "@presentation": path.resolve(__dirname, "src/presentation"),
      "@presentation/shared": path.resolve(__dirname, "src/presentation/shared"),
      "@presentation/styles": path.resolve(__dirname, "src/presentation/styles"),
    },

  },
  css: {
    modules: {
      // دعم CSS Modules مع aliases
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});