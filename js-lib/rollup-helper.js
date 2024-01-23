import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import { terser } from 'rollup-plugin-terser'
import { wasm } from '@rollup/plugin-wasm';

const terserPlugin = terser({
  module: true,
  compress: {
    hoist_vars: true,
    module: true,
    passes: 1,
    pure_getters: true,
    unsafe_comps: true,
    unsafe_undefined: true
  },
  mangle: {
    toplevel: true
  }
})

export default [{
  input: './run.js',
  output: {
    file: './dist/benchmark-browser.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      fs: 'window',
      util: 'window',
      path: 'window'
    }
  },
  plugins: [
    wasm(),
    nodeResolve({
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs()
  ],
  external: ['fs', 'util', 'path']
}, {
  input: './run.js',
  output: {
    file: './dist/benchmark-node.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main']
    }),
    commonjs()
  ],
  external: ['isomorphic.js']
},
{
  input: './bundle.js',
  output: {
    dir: './dist',
    format: 'iife'
  },
  plugins: [
    wasm(),
    nodeResolve({
      mainFields: ['main', 'module', 'main'],
      preferBuiltins: false
    }),
    commonjs(),
    builtins(),
    globals(),
    terserPlugin
  ]
}]
