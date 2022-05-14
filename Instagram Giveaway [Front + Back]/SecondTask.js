const fs = require('fs');
const path = require('path');


function uniqueValues(){
    const s = new Set();
    for(let j = 0; j < 20; j++) {
        fs.readFileSync(`${__dirname}${path.sep}out${j}.txt`, 'utf-8').split('\n').forEach( el => s.add(el));
    }
    return `Уникальных словосочетаний: ${s.size}`;
}

function existInAllFiles(){
    let obj = new Object();
    for(let j = 0; j < 20; j++) {
        let s = new Set();
        for(let i of fs.readFileSync(`${__dirname}${path.sep}out${j}.txt`, 'utf-8').split('\n')) {
            s.add(i);
        }
        s.forEach(el => obj[el] = (obj[el] || 0) + 1);
    }
    const amount = Object.values(obj).filter(value => value === 20);
    return  `Словосочетаний, которые есть во всех 20 файлах: ${amount.length}`;
}


function existInAtLeastTen(){
    let obj = new Object();
    for(let j = 0; j < 20; j++) {
        let s = new Set();
        for(let i of fs.readFileSync(`${__dirname}${path.sep}out${j}.txt`, 'utf-8').split('\n')) {
            s.add(i);
        }
        s.forEach(el => obj[el] = (obj[el] || 0) + 1);  // mb should done via cycle if(obj[el] > 10){continue}
    }
    const amount = Object.values(obj).filter(value => value > 9);
    return  `Словосочетаний, которые есть, как минимум, в десяти файлах: ${amount.length}`;
}


console.time("first");
console.log(uniqueValues());        //  129240
console.timeEnd("first");

console.time("second");
console.log(existInAllFiles());     //  441
console.timeEnd("second");

console.time("third");
console.log(existInAtLeastTen());   //  73245
console.timeEnd("third");
