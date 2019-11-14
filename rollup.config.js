import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import liveServer from 'rollup-plugin-live-server';
import path from 'path';
import glob from 'glob';
import fs from 'fs';

const root = process.cwd();
const production = !process.env.ROLLUP_WATCH;
const input = path.resolve(root, 'src', 'index.js');


(function() {
  const files = glob.sync('src/**/*.spec.js').sort();
  const output = files.map(file => `import '../${file}';`).join('\n');
  fs.writeFileSync('./src/tests.js', output);
})();

const browserEsm = {
  input,
  output: {
    sourcemap: true,
    format: 'esm',
    file: path.resolve(root, 'dist', 'finance-js.esm.js')
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    !production && liveServer({
      file: 'index.html',
      logLevel: 2,
      mount: [[ '/dist', './dist' ], [ '/src', './src' ], [ '/node_modules', './node_modules' ], [ '/demo', './demo' ]],
      open: false,
      port: 5004,
      root: 'demo',
      verbose: false,
      wait: 500
    }),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};

const testConfig = {
  input: path.resolve(root, 'src/tests.js'),
  output: {
    file: path.resolve(root, 'demo', 'tests.js'),
    format: 'esm'
  }
};

const browserEs5 = {
  input,
  output: {
    name: 'finance',
    sourcemap: true,
    format: 'iife',
    file: path.resolve(root, 'dist', 'finance-js.iife.js')
  }
};

const serverCjs = {
  input,
  output: {
    format: 'cjs',
    file: path.resolve(root, 'index.js')
  }
};

const serverEsm = {
  input,
  output: {
    format: 'esm',
    file: path.resolve(root, 'index.mjs')
  }
};

const configs = [ browserEsm, browserEs5, serverCjs, serverEsm, testConfig ];

export default configs;

