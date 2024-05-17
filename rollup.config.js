import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import "dotenv/config";

function serve() {
  // Keep a reference to a spawned server process
  let server;

  function toExit() {
    // kill the server if it exists
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      // Spawn a child server process
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev", "--single"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      // Kill server on process termination or exit
      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    file: "public/build/bundle.js",
    format: "iife",
    name: "app",
  },
  plugins: [
    svelte({
      include: [
        "src/**/*.svelte",
        "node_modules/svelte-routing/src/**/*.svelte",
      ],
    }),
    resolve({ browser: true }),
    serve(),
    livereload("public"),
    css({
      output: "bundle.css",
    }),
    replace({
      preventAssignment: true,
      "process.env.MAPS_API_KEY": JSON.stringify(process.env.MAPS_API_KEY),
      "process.env.GEOCODING_API_KEY": JSON.stringify(
        process.env.GEOCODING_API_KEY
      ),
      "process.env.CERTIFICATE_PASSPHRASE": JSON.stringify(
        process.env.CERTIFICATE_PASSPHRASE
      ),
    }),
  ],
};
