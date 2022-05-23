const axios = require('axios').default;
const urls = [
    "https://jsonbase.com/lambdajson_type1/793",
    "https://jsonbase.com/lambdajson_type1/955",
    "https://jsonbase.com/lambdajson_type1/231",
    "https://jsonbase.com/lambdajson_type1/931",
    "https://jsonbase.com/lambdajson_type1/93",
    "https://jsonbase.com/lambdajson_type2/342",
    "https://jsonbase.com/lambdajson_type2/770",
    "https://jsonbase.com/lambdajson_type2/491",
    "https://jsonbase.com/lambdajson_type2/281",
    "https://jsonbase.com/lambdajson_type2/718",
    "https://jsonbase.com/lambdajson_type3/310",
    "https://jsonbase.com/lambdajson_type3/806",
    "https://jsonbase.com/lambdajson_type3/469",
    "https://jsonbase.com/lambdajson_type3/258",
    "https://jsonbase.com/lambdajson_type3/516",
    "https://jsonbase.com/lambdajson_type4/79",
    "https://jsonbase.com/lambdajson_type4/706",
    "https://jsonbase.com/lambdajson_type4/521",
    "https://jsonbase.com/lambdajson_type4/350",
    "https://jsonbase.com/lambdajson_type4/64",
]

function findVal(object, key) {
    let value;
    Object.keys(object).some(function(k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if(object[k] && typeof object[k] === 'object') { // not sure about object[k] mb I should get rid of that
            value = findVal(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}

const getJson = async (link) => {
    // how to get requests upon failure https://qna.habr.com/q/935729
    for(let i=0; i<3; i++){
        try{
            const {data:  body} = await axios.get(link);
            return [link, body];
        }catch(e){
            if(e.response.status >= 400 && i === 2) throw new Error(`${link}: — ${e.response.status} status :(`);
            else if(i === 2) throw new Error(`${link}: — ${e}`);
            // console.log(`${link}: — ${e.response.status} status :(`) // for that I need to use the second version of catch
            // else if(e.request && i === 2) console.log(`${link}: — no answer`)   // not sure about this line since it doesn't work
        }
    }
}

let falseTrueValues = [];
urls.forEach(async url => {
    try{
        const jsonData = await getJson(url)
        const keyValue = findVal(jsonData[1], 'isDone');
        console.log(`${jsonData[0]}:  isDone — ${keyValue}`);
        falseTrueValues.push(keyValue);
        // console.log(falseTrueValues); // must I use setTimeout ????? Another promise???
    }catch(e) {console.log(e.message)}
})


// DUNNO (main code structure)
// let true_false_List = []
// urls.forEach(url => {
//     getJson(url)
//       .then(data => {
//           const keyValue = findVal(data[1], 'isDone');
//           console.log(`${data[0]}:  isDone — ${keyValue}`);
//           true_false_List.push(keyValue);
//       })
//       .catch(e => console.log(e.message))
//     // .catch(e => console.log(e)) the second version of printing an error;
//     // errors handling; no response on request; axios-retry upon failure https://medium.com/nuances-of-programming/%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0-%D0%BE%D1%88%D0%B8%D0%B1%D0%BE%D0%BA-api-%D0%B2-%D0%B2%D0%B5%D0%B1-%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%83%D1%8F-axios-932e9d66a526
// })

// async/await analog of the main code
// let falseTrueValues = [];
// urls.forEach(async url => {
//     try{
//         const jsonData = await getJson(url)
//         const keyValue = findVal(jsonData[1], 'isDone');
//         console.log(`${jsonData[0]}:  isDone — ${keyValue}`);
//         falseTrueValues.push(keyValue);
//         console.log(falseTrueValues);
//     }catch(e) {console.log(e.message)}
// })


// async function bl(){
//     let trueCounter = 0,
//         falseCounter = 0;
//     const x = await urls.forEach(url => {   // hz kak eto napisat cherez await
//     getJson(url)
//       .then(data => {
//           const keyValue = findVal(data[1], 'isDone');
//           console.log(`${data[0]}:  isDone — ${keyValue}`);
//           if(keyValue === false) falseCounter += 1;
//           else if(keyValue === true) trueCounter += 1;
//       })
//       .catch(e => console.log(e.message))
//     })
//     return [trueCounter, falseCounter]
// }
// bl().then(console.log)

// const getValuesAmount = async () =>{
//     let true_false_List = []
//     const values = await urls.forEach(url => {
//             getJson(url)
//               .then(data => {
//                   const keyValue = findVal(data[1], 'isDone');
//                   console.log(`${data[0]}:  isDone — ${keyValue}`);
//                   true_false_List.push(keyValue);
//               })
//               .catch(e => console.log(e.message))
//               // .catch(e => console.log(e)) the second version of printing an error;
//             // errors handling; no response on request; axios-retry upon failure https://medium.com/nuances-of-programming/%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0-%D0%BE%D1%88%D0%B8%D0%B1%D0%BE%D0%BA-api-%D0%B2-%D0%B2%D0%B5%D0%B1-%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%83%D1%8F-axios-932e9d66a526
//         })
//     return true_false_List
// }

// const counter = async () => {
//     let true_false_List = []
//     const x = await urls.forEach(async (url) => {
//         try{
//             const value = await getJson(url)
//             const keyValue = await findVal(value[1], 'isDone');
//             console.log(`${value[0]}:  isDone — ${keyValue}`);
//             true_false_List.push(keyValue);
//         }catch(e) {
//             console.log(e.message)
//         }
//     })
//     return x;
// }
//
// counter().then(data => console.log(data));