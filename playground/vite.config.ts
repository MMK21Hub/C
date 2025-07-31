import { defineConfig } from "vite"
import voby from "voby-vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [voby(), tailwindcss()],
})
