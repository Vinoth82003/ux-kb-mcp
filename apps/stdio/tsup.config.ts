import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "es2022",
  clean: true,
  sourcemap: true,
  // yaml resolves to its ESM build under node; keep it external so esbuild
  // does not inline its CJS entry (which calls require('process')).
  // @prisma/client is loaded lazily only for KB_SOURCE=db and is generated per
  // deployment, so it must not be bundled.
  external: ["yaml", "@prisma/client", ".prisma/client"],
  // @ux-kb/core is a source-only workspace package; bundle it so the built
  // server runs under plain node (no tsx loader) from any working directory.
  noExternal: ["@ux-kb/core"],
});
