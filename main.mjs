#!/usr/bin/node

// cSpell:ignore unplugin

import fs from 'node:fs'
import path from 'node:path'
import { argv } from 'node:process'

import { expCollector } from 'unplugin-export-collector/core'



// ------------------------------------------------------------------------------------------------
function ignore(fileName) {
  const ignoredFiles = ['index.js', 'index.mjs', 'main.js', 'main.mjs', 'serviceWorker.js']

  const justFile = path.basename(fileName)
  return (ignoredFiles.indexOf(justFile) > -1)
}

// ------------------------------------------------------------------------------------------------
function getFunctionName(line) {
  const word = line.split(' ')[2]  // get 3rd word
  const i = word.indexOf('(')
  return (i != -1) ? word.substr(0,i) : word.trim()
}

// ------------------------------------------------------------------------------------------------
function processJsx(fileName) {
  const names = fs.readFileSync(fileName,{ encoding : 'utf8' })
      .split('\n')
      .filter( line => line.includes('export '))
      .filter( line => !line.includes('export default'))
      .map(line => getFunctionName(line))

  return names.sort()
}

console.log(`
// cSpell:ignore

`)

const dir = (argv.length > 0) ? argv[2] : '.'

console.log('// scanning', dir)

// As of Node 20, fs.readdir has a { recursive: true } option
const files = await fs.promises.readdir(dir, { recursive: true })

const srcFiles = files
              .filter(fn => (fn.endsWith('.js') || fn.endsWith('.jsx') || fn.endsWith('.mjs')) )
              .filter(fn => !ignore(fn))
              .filter(fn => fn.indexOf('.test.') == -1)
              .filter(fn => fn.indexOf('.spec.') == -1)
              .filter(fn => fn.indexOf('node_modules') == -1)

let ans = await Promise.all( srcFiles.map( async (fname) => {
  const file = path.join(dir, fname)
  let names = []

    if (file.endsWith('.jsx')) {
      names = processJsx(file)
    } else {
      try {
        names = await expCollector(file)
      } catch (error) {
        console.log('// Error parsing', file)
      }
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

