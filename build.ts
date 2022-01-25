/**
 * Build script for the zeroed books web app.
 */

import * as esbuild from "esbuild";

const PUBLIC_DIR = "public";
const BUILD_DIR = "public/dist";

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
                entryPoints: ["src/index.tsx"],
                logLevel: "info",
                outdir: BUILD_DIR,
                sourcemap: true,
            }
        )
    } catch {
        // Esbuild handles logging of the error, so we can just exit.
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
    if (args[0] === "serve") {
        serve();
    } else {
        console.error("Unrecognized argument:", args[0]);
    }
}

// Remove `node` and the script name from the arguments before parsing.
run(process.argv.slice(2));
