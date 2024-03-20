const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function calculate(expression) {
    // Removing whitespace
    expression = expression.replace(/\s/g, '');

    // Regular expression to match numbers, operators, and parentheses
    const pattern = /(\d+(\.\d+)?|[\+\-\*\/\^()])/g;
    const tokens = expression.match(pattern);

    // Operator precedence
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3
    };

    function applyOperator(operator, b, a) {
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            case '^': return Math.pow(a, b);
        }
    }

    function evaluate(tokens) {
        const operators = [];
        const operands = [];

        tokens.forEach(token => {
            if (/\d/.test(token)) {
                operands.push(parseFloat(token));
            } else if (token === '(') {
                operators.push(token);
            } else if (token === ')') {
                while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                    const operator = operators.pop();
                    const b = operands.pop();
                    const a = operands.pop();
                    operands.push(applyOperator(operator, b, a));
                }
                operators.pop(); // Pop '('
            } else {
                while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[token]) {
                    const operator = operators.pop();
                    const b = operands.pop();
                    const a = operands.pop();
                    operands.push(applyOperator(operator, b, a));
                }
                operators.push(token);
            }
        });

        while (operators.length > 0) {
            const operator = operators.pop();
            const b = operands.pop();
            const a = operands.pop();
            operands.push(applyOperator(operator, b, a));
        }

        return operands.pop();
    }

    return evaluate(tokens);
}

rl.question('Enter expression to evaluate: ', (expression) => {
    try {
        const result = calculate(expression);
        console.log('Result:', result);
    } catch (error) {
        console.error('Invalid expression:', error.message);
    }
    rl.close();
});
