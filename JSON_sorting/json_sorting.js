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
    Object.keys(object).some((k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if(object[k] && typeof object[k] === 'object') {
            value = findVal(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}

const getJson = async (link) => {
    for(let i=0; i<3; i++){
        try{
            const {data:  body} = await axios.get(link);
            return [link, body];
        }catch(e){
            if(e.response.status >= 400 && i === 2) throw new Error(`${link}: — ${e.response.status} status :(`);
        }
    }
}

(async function printValues (){
    let falseTrueValues = [];
    await Promise.all(urls.map(async (url) =>
        {
            try{
                const jsonData = await getJson(url)
                const keyValue = findVal(jsonData[1], 'isDone');
                console.log(`${jsonData[0]}:  isDone — ${keyValue}`);
                falseTrueValues.push(keyValue);
            }catch(e) {console.log(e.message)}
        }
    ))
    const values = falseTrueValues.reduce((arr, el) => {
        arr[el] = (arr[el] || 0) + 1;
        return arr;
    }, {})
    console.log(`
Значение True: ${values[true]},
Значение False: ${values[false]}`);
})()