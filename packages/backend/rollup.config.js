import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import { defineConfig } from "rollup"
import typescript from "rollup-plugin-typescript2"
// import globals from "rollup-plugin-node-globals"
// import builtin from "rollup-plugin-node-builtins"
// import { terser } from "rollup-plugin-terser"
import replace from "@rollup/plugin-replace"
import dotenv from "dotenv"
import fs from "fs"
import { builtinModules } from "module"
import path from "path"
import polyfillNode from "rollup-plugin-polyfill-node"

const getEnv = () => {
  // Determine environment
  const appEnv = process.env.APP_ENV || "development"

  // .env.production overlayed on .env
  const envFilePath = path.resolve(".env")
  const envProdFilePath = path.resolve(".env.production")

  // Load `secret.env` for secrets
  const secretEnvPath = path.resolve("secrets/.env")

  // Parse and merge the environments
  const baseEnv = dotenv.parse(fs.readFileSync(envFilePath))
  const prodEnv = dotenv.parse(fs.readFileSync(envProdFilePath))
  const secretEnv = dotenv.parse(fs.readFileSync(secretEnvPath))

  // Combine the environments, with `secret.env` taking precedence
  const finalEnv = {
    ...baseEnv,
    ...prodEnv,
    ...secretEnv,
  }

  const env = {}
  // Inject values into `process.env`
  Object.keys(finalEnv).forEach((key) => {
    // Resolve any placeholders in the format `${VAR_NAME}`
    const value = finalEnv[key].replace(
      /\$\{(\w+)\}/g,
      (_, name) => finalEnv[name] || "",
    )
    env[key] = value
  })

  return env
}

export default defineConfig({
  input: "src/main.ts", // Entry point of your application
  output: {
    file: "dist/main.cjs", // Output bundle file
    format: "cjs", // CommonJS format for Node.js
    sourcemap: true, // Include sourcemaps for debugging
  },
  plugins: [
    polyfillNode(),
    typescript({
      tsconfig: "./tsconfig.json", // Path to your tsconfig file
    }),
    resolve({
      preferBuiltins: true, // Use Node.js built-in modules
      // preserveSymlinks: true,
    }),
    commonjs(), // Convert CommonJS to ES modules
    // globals(),
    // builtin(),
    json(), // Support importing JSON files
    // terser(), // Minify the output bundle
    replace({
      preventAssignment: true,
      "import.meta.env": JSON.stringify({
        ...getEnv(),
      }),
    }),
  ],
  external: [
    "sqlite3",
    // Specify modules that should remain external (Node.js built-ins)
    ...builtinModules,
  ],
})
