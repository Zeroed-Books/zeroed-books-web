/**
 * Build script for the zeroed books web app.
 */

import { promises as fs } from "fs";
import path from "path";

import * as esbuild from "esbuild";

const PUBLIC_DIR = "public";
const BUNDLE_DIR = "js";
const BUILD_DIR = "dist";

const ENTRY_POINT = "src/index.tsx";
const ENTRY_POINT_REFERENCE = path.resolve(BUILD_DIR, "index.html");

const rmDir = async (target: string): Promise<void> => {
  await fs.rm(target, { force: true, recursive: true });
};

const copyDir = async (src: string, dest: string): Promise<void> => {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Allow for awaits in a loop because copying a file depends on its
    // directory existing.

    if (entry.isDirectory()) {
      console.log("Recursing into directory:", srcPath);
      // eslint-disable-next-line no-await-in-loop
      await copyDir(srcPath, destPath);
    } else {
      console.log(`Copying '${srcPath}' to '${destPath}'`);
      // eslint-disable-next-line no-await-in-loop
      await fs.copyFile(srcPath, destPath);
    }
  }
};

const replaceEntryPointReference = async (
  referencingFile: string,
  targetScript: string,
  newPath: string
) => {
  const relativeScriptPath = path.relative(BUILD_DIR, newPath);

  let referenceContent = await fs.readFile(referencingFile, "utf8");
  referenceContent = referenceContent.replace(targetScript, relativeScriptPath);

  await fs.writeFile(referencingFile, referenceContent, "utf8");

  console.log(
    `[${referencingFile}] Replaced reference to '${targetScript}' with built reference '${relativeScriptPath}'`
  );
};

const defaultBuildOptions = (): esbuild.BuildOptions => ({
  bundle: true,
  entryPoints: [ENTRY_POINT],
  format: "esm",
  logLevel: "info",
  sourcemap: true,
  splitting: true,
});

const build = async (): Promise<void> => {
  try {
    console.log("Cleaning existing build directory...");
    await rmDir(BUILD_DIR);
    console.log("Build directory cleaned.\n");

    console.log("Copying public files to build directory...");
    await copyDir(PUBLIC_DIR, BUILD_DIR);
    console.log("Public files copied.\n");

    console.log("Building with esbuild...");
    const buildResult = await esbuild.build({
      ...defaultBuildOptions(),
      define: {
        "process.env.NODE_ENV": "'production'",
      },
      entryNames: "[dir]/[name]-[hash]",
      metafile: true,
      minify: true,
      outdir: `${BUILD_DIR}/${BUNDLE_DIR}`,
    });
    console.log("Build complete.\n");

    console.log("Replacing output references...");

    for (const [outfile, output] of Object.entries(
      buildResult.metafile.outputs
    )) {
      if (output.entryPoint === ENTRY_POINT) {
        // We can't run these operations concurrently in case multiple entry
        // points are referenced in the same file.
        // eslint-disable-next-line no-await-in-loop
        await replaceEntryPointReference(
          ENTRY_POINT_REFERENCE,
          "js/index.js",
          outfile
        );
      }
    }
    console.log("Finished replacing output references.\n");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const serveRequestHandler = (request: esbuild.ServeOnRequestArgs) => {
  console.log(
    `${request.remoteAddress} - "${request.method} ${request.path}" ${request.status} [${request.timeInMS}ms]`
  );
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
        ...defaultBuildOptions(),
        define: {
          "process.env.API_ROOT": `"${process.env.API_ROOT}"`,
        },
        outdir: `${PUBLIC_DIR}/${BUNDLE_DIR}`,
      }
    );
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
};

// Remove `node` and the script name from the arguments before parsing.
run(process.argv.slice(2));
