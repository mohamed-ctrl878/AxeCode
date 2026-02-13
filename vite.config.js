import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// تحويل import.meta.url إلى dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  
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
      // Core
      "@core": path.resolve(__dirname, "src/core"),
      "@core/apienv": path.resolve(__dirname, "src/core/apienv"),
      "@data": path.resolve(__dirname, "src/data"),
      "@data/models": path.resolve(__dirname, "src/data/models"),
      "@data/repositories": path.resolve(__dirname, "src/data/repositories"),
      "@data/storage": path.resolve(__dirname, "src/data/storage"),
      "@data/services": path.resolve(__dirname, "src/data/services"),
      
      "@domain": path.resolve(__dirname, "src/domain"),
      "@domain/entities": path.resolve(__dirname, "src/domain/entities"),
      "@domain/interfaces": path.resolve(__dirname, "src/domain/interfaces"),
      "@domain/usecases": path.resolve(__dirname, "src/domain/usecases"),
      "@core/queries": path.resolve(__dirname, "src/core/queries"),
      "@core/utils": path.resolve(__dirname, "src/core/utils"),

      // Presentation
      "@presentation": path.resolve(__dirname, "src/presentation"),
      "@presentation/assets": path.resolve(
        __dirname,
        "src/presentation/assets"
      ),
      "@presentation/pages": path.resolve(__dirname, "src/presentation/pages"),
      "@presentation/shared": path.resolve(
        __dirname,
        "src/presentation/shared"
      ),
      "@presentation/hooks": path.resolve(__dirname, "src/presentation/hooks"),
      "@presentation/styles": path.resolve(
        __dirname,
        "src/presentation/styles"
      ),

      // Assets عامة
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  css: {
    modules: {
      // دعم CSS Modules مع aliases
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
});