import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: [
        resolve(__dirname, 'src/core.ts'),
        resolve(__dirname, 'src/mat4.ts'),
        resolve(__dirname, 'src/math.ts'),
        resolve(__dirname, 'src/svgtk.ts'),
        resolve(__dirname, 'src/gear-util.ts')
      ],
      name: 'Svgtk',
      fileName: (format, entryName) =>
        format == 'cjs'? `${entryName}.js` :
        format == 'es'? `${entryName}.mjs` :
        `${entryName}.${format}.js`,
      formats: ['cjs', 'es'],
    },
  },
  plugins: [
    dts({
      rollupTypes : true,
    })
  ]
});
