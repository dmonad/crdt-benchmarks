import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import builtins from 'rollup-plugin-node-builtins'
// import globals from 'rollup-plugin-node-globals'
import { terser } from 'rollup-plugin-terser'
import { wasm } from '@rollup/plugin-wasm'

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
  input: './bundle.js',
  output: {
    dir: './dist',
    format: 'esm'
  },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs(),
    wasm(),
    terserPlugin
  ]
}, {
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
    nodeResolve({
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs(),
    wasm()
  ],
  external: ['fs', 'util', 'path']
}]
