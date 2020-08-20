
import { setBenchmarkResult } from './utils.js'

if (typeof global !== 'undefined' && typeof window === 'undefined') {
  const fs = require('fs')
  const pkgLock = JSON.parse(fs.readFileSync(__dirname + '/../package-lock.json', 'utf8'))

  const yjsBundleSize = fs.statSync(__dirname + '/../dist/bundleYjs.js').size
  const otBundleSize = fs.statSync(__dirname + '/../dist/bundleOT.js').size
  const deltaCrdtsBundleSize = fs.statSync(__dirname + '/../dist/bundleDeltaCrdts.js').size
  const automergeBundleSize = fs.statSync(__dirname + '/../dist/bundleAutomerge.js').size
  const yjsGzBundleSize = fs.statSync(__dirname + '/../dist/bundleYjs.js.gz').size
  const otGzBundleSize = fs.statSync(__dirname + '/../dist/bundleOT.js.gz').size
  const deltaCrdtsGzBundleSize = fs.statSync(__dirname + '/../dist/bundleDeltaCrdts.js.gz').size
  const automergeGzBundleSize = fs.statSync(__dirname + '/../dist/bundleAutomerge.js.gz').size

  const yjsVersion = pkgLock.dependencies.yjs.version
  const otVersion = pkgLock.dependencies['ot-text-unicode'].version
  const deltaCrdtsVersion = pkgLock.dependencies['delta-crdts'].version
  const automergeVersion = pkgLock.dependencies.automerge.version

  setBenchmarkResult('yjs', 'Version', yjsVersion)
  setBenchmarkResult('OT', 'Version', otVersion)
  setBenchmarkResult('delta-crdts', 'Version', deltaCrdtsVersion)
  setBenchmarkResult('automerge', 'Version', automergeVersion)

  setBenchmarkResult('yjs', 'Bundle size', `${yjsBundleSize} bytes`)
  setBenchmarkResult('OT', 'Bundle size', `${otBundleSize} bytes`)
  setBenchmarkResult('delta-crdts', 'Bundle size', `${deltaCrdtsBundleSize} bytes`)
  setBenchmarkResult('automerge', 'Bundle size', `${automergeBundleSize} bytes`)
  setBenchmarkResult('yjs', 'Bundle size (gzipped)', `${yjsGzBundleSize} bytes`)
  setBenchmarkResult('OT', 'Bundle size (gzipped)', `${otGzBundleSize} bytes`)
  setBenchmarkResult('delta-crdts', 'Bundle size (gzipped)', `${deltaCrdtsGzBundleSize} bytes`)
  setBenchmarkResult('automerge', 'Bundle size (gzipped)', `${automergeGzBundleSize} bytes`)
}
