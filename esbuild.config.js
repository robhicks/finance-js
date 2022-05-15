import esbuildServe from "esbuild-serve";
import glob from "glob";

const entryPoints = glob.sync("./src/**/*.ts");

esbuildServe(
  {
    entryPoints,
    format: "esm",
    outdir: "dist",
    target: ["es2020"],
    bundle: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded: ⚡ Done", result);
      },
    }, 
  },
  {
    port: 7000,
    root: ".",
  }
);
