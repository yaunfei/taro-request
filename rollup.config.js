import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2"; // typescript插件
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
	// 核心选项
	input: "./src/index.ts", // 必须
	output: [
		{
			file: pkg.main,
			format: "es", // ES模块文件
			exports: "auto",
			sourcemap: false,
		},
	],
	plugins: [
		typescript({
			clean: true,
			resolveJsonModule: true,
		}),
		babel({
			exclude: "node_modules/**", // 忽略 node_modules
		}),
		terser(),
	],
};
