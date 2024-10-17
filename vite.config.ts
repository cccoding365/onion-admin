import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";

import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ["vue", "vue-router"],
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            dirs: ["src/components"],
            extensions: ["vue"],
            dts: "src/components.d.ts"
        })
    ],
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer]
        }
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@element-plus/icons-vue": resolve(__dirname, "./node_modules/@element-plus/icons-vue")
        }
    },
    server: {
        open: true,
        port: 3000
    }
});
