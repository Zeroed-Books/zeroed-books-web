/**
 * Build script for the zeroed books web app.
 */

import { promises as fs } from "fs";
import path from "path";

import * as esbuild from "esbuild";

const PUBLIC_DIR = "public";
const BUNDLE_DIR = "js";
const BUILD_DIR = "dist";

const ENTRY_POINTS = ["src/index.tsx"];

const rmDir = async (target: string): Promise<void> => {
    await fs.rm(target, { force: true, recursive: true });
};

const copyDir = async (src: string, dest: string): Promise<void> => {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            console.log("Recursing into directory:", srcPath);
            await copyDir(srcPath, destPath);
        } else {
            console.log(`Copying '${srcPath}' to '${destPath}'`);
            await fs.copyFile(srcPath, destPath);
        }
    }
}

const build = async (): Promise<void> => {
    try {
        console.log("Cleaning existing build directory...");
        await rmDir(BUILD_DIR);
        console.log("Build directory cleaned.\n");

        console.log("Copying public files to build directory...");
        await copyDir(PUBLIC_DIR, BUILD_DIR);
        console.log("Public files copied.\n");

        console.log("Building with esbuild...");
        await esbuild.build({
            bundle: true,
            entryPoints: ENTRY_POINTS,
            logLevel: "info",
            minify: true,
            outdir: `${BUILD_DIR}/${BUNDLE_DIR}`,
            sourcemap: true,
        });
        console.log("Build complete.\n");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const serveRequestHandler = (request: esbuild.ServeOnRequestArgs) => {
    console.log(`${request.remoteAddress} - "${request.method} ${request.path}" ${request.status} [${request.timeInMS}ms]`);
};

/**
 * Serve the application in development mode.
 */
const serve = async (): Promise<void> => {
    console.log("Serving with esbuild...\n");

    try {
        await esbuild.serve(
            {
                onRequest: serveRequestHandler,
                port: 3000,
                servedir: PUBLIC_DIR,
            },
            {
                bundle: true,
                define: {
                    "process.env.API_ROOT": `"${process.env.API_ROOT}"`,
                },
                entryPoints: ENTRY_POINTS,
                logLevel: "info",
                outdir: `${PUBLIC_DIR}/${BUNDLE_DIR}`,
                sourcemap: true,
            }
        )
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

/**
 * Run the build script.
 *
 * @param args - The arguments for the build script. This should be a single
 * element array containing the build command.
 */
const run = (args: string[]) => {
    switch (args[0]) {
        case undefined:
            build();
            break;

        case "serve":
            serve();
            break;

        default:
            console.error("Unrecognized argument:", args[0]);
            process.exit(1);
    }
}

// Remove `node` and the script name from the arguments before parsing.
run(process.argv.slice(2));
