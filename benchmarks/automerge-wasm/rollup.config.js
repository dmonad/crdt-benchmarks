import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import { terser } from 'rollup-plugin-terser'

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

export default [
  {
    input: './bundle.js',
    output: {
      dir: './dist',
      format: 'es'
    },
    plugins: [
      nodeResolve({
        mainFields: ['main', 'module'],
        preferBuiltins: false
      }),
      commonjs(),
      builtins(),
      globals(),
      terserPlugin
    ]
  }]
