#!/usr/bin/node

// cSpell:ignore unplugin

import fs from 'node:fs'
import path from 'node:path'
import { argv } from 'node:process'

import { expCollector } from 'unplugin-export-collector/core'


console.log(`
// cSpell:ignore

`)

const dir = (argv.length > 0) ? argv[2] : '.'

console.log('// scanning', dir)

// As of Node 20, fs.readdir has a { recursive: true } option
const files = await fs.promises.readdir(dir, { recursive: true })

const srcFiles = files
              .filter(fn => (fn.endsWith('.js') || fn.endsWith('.jsx') || fn.endsWith('.mjs')) )
              .filter(fn => fn !== 'gen_named_exports.mjs')
              .filter(fn => fn !== 'index.js')
              .filter(fn => fn !== 'index.mjs')
              .filter(fn => fn !== 'main.js')
              .filter(fn => fn !== 'main.mjs')
              .filter(fn => fn !== 'serviceWorker.js')
              .filter(fn => fn.indexOf('node_modules') == -1)

let ans = await Promise.all( srcFiles.map( async (fname) => {
  const file = path.join(dir, fname)
  let names = []
  try {
    names = await expCollector(file)
  } catch (error) {
    console.log('// Error parsing', file, file+'.jsx')
  }
  return { fname, names }
}))

const weird = ans.filter(f => f.names.length == 0).map(f => f.fname)
if (weird.length >0) {
  console.log('// files with no named exports: ', JSON.stringify(weird))
  console.log('')
}

ans = ans.filter(f => f.names.length>0)             // skip all files with no named exports

ans.forEach(info => {
  const list = info.names.sort().join(', ')
  console.log(`import { ${list} } from './${info.fname}' `)
})

console.log('')
console.log('export {')

ans.forEach(info => console.log(`${info.names},`))

console.log('}')

