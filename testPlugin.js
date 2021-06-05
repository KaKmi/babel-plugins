const {transformFromAst} = require('@babel/core')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const fs = require('fs')
const t = require('@babel/types')
const templete = require('@babel/template')
const code = fs.readFileSync('./code.js', 'utf-8')

const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
})

transformFromAst(ast,code,{
    plugins:['./bable-console-plugin.js']
})
