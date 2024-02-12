#!/usr/bin/env node
import { setBenchmarkResult, writeBenchmarkResultsToFile } from '../js-lib/index.js'
import fs from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import * as math from 'lib0/math'

const filesToAdd = process.argv.slice(2)

const currDir = process.cwd()
const pkg = JSON.parse(fs.readFileSync(currDir + '/package.json', 'utf8'))
const name = pkg.name.match(/(.*)-benchmarks$/)[1]

const addedFileSizes = filesToAdd.map(file => fs.statSync(join(currDir, file)).size).reduce(math.add, 0)
const gzAddedFileSizes = filesToAdd.map(file => {
  execSync(`gzip -c ${file} > dist/tmp.gz`)
  const gz = fs.statSync(join(currDir, '/dist/tmp.gz')).size
  execSync('rm dist/tmp.gz')
  return gz
}).reduce(math.add, 0)

console.log({ addedFileSizes, gzAddedFileSizes })

const bundleSize = fs.statSync(join(currDir, '/dist/bundle.js')).size + addedFileSizes
const gzBundleSize = fs.statSync(join(currDir, '/dist/bundle.js.gz')).size + gzAddedFileSizes

console.log(pkg.dependencies, name)
const mainDepName = Object.keys(pkg.dependencies)[0]
let mainDep
try {
  mainDep = JSON.parse(fs.readFileSync(currDir + `/../../node_modules/${mainDepName}/package.json`, 'utf8'))
} catch (e) {
  mainDep = JSON.parse(fs.readFileSync(currDir + `/node_modules/${mainDepName}/package.json`, 'utf8'))
}

setBenchmarkResult(name, 'Version', mainDep.version)
setBenchmarkResult(name, 'Bundle size', `${bundleSize} bytes`)
setBenchmarkResult(name, 'Bundle size (gzipped)', `${gzBundleSize} bytes`)
writeBenchmarkResultsToFile('../results.json', () => true)
