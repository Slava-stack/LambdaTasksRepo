const readline = require('readline');
require('colors');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('close', () => console.log('Good bye! Come back again'.blue));

rl.question(`Hello! Please enter words ${'or/and'.brightGreen} digits separated by spaces: `, answer => {
    if (answer.toLowerCase().trim() === 'exit') rl.close()
    else {
        rl.question(`${'How would you like to sort values?'.blue.bold}
${'1)'.blue.italic.bold} Words by name (from A to Z)
${'2)'.blue.italic.bold} Show digits in ascending order
${'3)'.blue.italic.bold} Show digits in descending order
${'4)'.blue.italic.bold} Words by quantity of letters
${'5)'.blue.italic.bold} Only unique words
${'6)'.blue.italic.bold} Only unique values

Select ${'(1 - 6)'.blue.bold} and press ${'ENTER'.blue.bold}: `, number => {
            answer = answer.trim().split(' ');
            let result;
            switch (number.toLowerCase().trim()) {
                case '1':
                    console.log(answer.filter(el => {
                        if (isNaN(Number(el))) return el;
                    }).sort());
                    break;
                case '2':
                    console.log(answer.filter(el => {
                        if (!isNaN(Number(el))) return el;
                    }).sort((a, b) => a - b));
                    break;
                case '3':
                    console.log(answer.filter(el => {
                        if (!isNaN(Number(el))) return el;
                    }).sort((a, b) => b - a));
                    break;
                case '4':
                    console.log(answer.filter(el => {
                        if (isNaN(Number(el))) return el;
                    }).sort((a, b) => a.length - b.length));
                    break;
                case '5':
                    console.log([...new Set(answer.filter(el => {
                        if (isNaN(Number(el))) return el;
                    }))]);
                    break;
                case '6':
                    console.log([...new Set(answer)]);
                    break;
                case 'exit':
                    rl.close();
                    break;
                default:
                    rl.setPrompt('Enter the number according to the list of actions: '.red);
                    rl.prompt();
            }
        });
    }
});