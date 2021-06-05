const targetCalleeName = ['log','info','error','error'].map(item => `console.${item}`);
module.exports = function ({types, template}) {
    return {
        visitor: {
            CallExpression(path, state) {
                if (path.node.isNew) {
                    return;
                }
                if (targetCalleeName.includes(path.get('callee').toString())
                    && path.node.callee.object.name === 'console') {
                    const {line, column} = path.node.loc.start;
                    const newConsole = template.expression(`console.log(${line},${column})`)()
                    newConsole.isNew = true;

                    if (path.findParent(path => path.isJSXElement())) {
                        path.replaceWith(types.arrayExpression([newConsole, path.node]))
                        path.skip();
                    } else {
                        path.insertBefore(newConsole);
                    }

                }
            },
        }
    }
}
