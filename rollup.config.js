import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
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

export default [{
  input: './benchmarks/run.js',
  output: {
    file: './dist/benchmark.cjs',
    format: 'cjs',
    sourcemap: true,
    paths: path => {
      if (/^lib0\//.test(path)) {
        return `lib0/dist/${path.slice(5, -3)}.cjs`
      }
      return path
    }
  }
}, {
  input: './benchmarks/run.js',
  output: {
    file: './dist/benchmark.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'browser', 'main']
    }),
    commonjs()
  ]
}, {
  input: './benchmarks/bundleYjs.js',
  output: {
    file: './dist/bundleYjs.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main']
    }),
    commonjs(),
    terserPlugin
  ]
}, {
  input: './benchmarks/bundleDeltaCrdts.js',
  output: {
    file: './dist/bundleDeltaCrdts.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main'],
      preferBuiltins: false
    }),
    commonjs(),
    builtins(),
    globals(),
    terserPlugin
  ]
}, {
  input: './benchmarks/bundleAutomerge.js',
  output: {
    file: './dist/bundleAutomerge.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main']
    }),
    commonjs(),
    terserPlugin
  ]
}]
