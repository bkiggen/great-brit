"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_swc_1 = __importDefault(require("@vitejs/plugin-react-swc"));
// https://vitejs.dev/config/]
const path = require("path");
exports.default = (0, vite_1.defineConfig)({
    base: "./",
    plugins: [(0, plugin_react_swc_1.default)()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
