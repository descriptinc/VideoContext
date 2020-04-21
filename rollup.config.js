// rollup.config.js
import pkg from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@wessberg/rollup-plugin-ts";
import glslify from "rollup-plugin-glslify";

export default {
    input: "src/index.ts",
    plugins: [commonjs(), resolve(), glslify(), typescript({ exclude: "**/*.test.ts" })],
    output: [
        {
            file: pkg.main,
            sourcemap: true,
            sourcemapExcludeSources: true,
            format: "cjs"
        },
        {
            file: pkg.module,
            sourcemap: true,
            sourcemapExcludeSources: true,
            format: "esm"
        }
    ],
    external: Object.keys(pkg.dependencies || {})
};
