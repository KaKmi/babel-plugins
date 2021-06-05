const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const fs = require('fs')
const t = require('@babel/types')
const templete = require('@babel/template')
// const code = 'console.log(1)'

const code = fs.readFileSync('./code.js', 'utf-8')

const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
})


const targetCalleeName = ['log','info','error','error'].map(item => `console.${item}`);
traverse(ast, {
    CallExpression(path, state) {
        console.log(state)
        if (path.node.isNew) {
            return;
        }
        console.log(path.get('callee').toString())
        if (targetCalleeName.includes(path.get('callee').toString())
            && path.node.callee.object.name === 'console') {
            const {line, column} = path.node.loc.start;
            const newConsole = templete.expression(`console.log(${line},${column})`)()
            newConsole.isNew = true;

            if (path.findParent(path => path.isJSXElement())) {
                path.replaceWith(t.arrayExpression([newConsole, path.node]))
                path.skip();
            } else {
                path.insertBefore(newConsole);
            }

        }
    },

})


fs.writeFileSync('./code.js', generator(ast).code)




