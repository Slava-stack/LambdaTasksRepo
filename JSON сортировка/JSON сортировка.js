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

// Version 1.0
/* for(let url of urls){
     let p = new  Promise((resolve, reject) => {
         fetch(url)
        .then(data => resolve(data.text()))
     });

     p.then(textData => {
         console.log(url + ':   ' + JSON.stringify(JSON.parse(textData), function (key, value){
             return (key === "" || key === "isDone" || key === "higherEducation" || key === "location") ? value : undefined;
        }));
     }).catch(error => console.log("Ops! Error")
     );
 }
*/

async function myFunction(url){
    try {
        const response = await fetch(url);
        const data = await response.text();
        const isDoneData = await (JSON.stringify(JSON.parse(data), function (key, value){
            return (key === "" || key === "isDone" || key === "higherEducation" || key === "location") ? value : undefined;
        }));    // should I use await here?
        return [url, (JSON.stringify(isDoneData)).includes('true')]; // should I use await here as well?
    } catch(e){
        console.log(`Error ${e}`)
    }
}



/*
const u1 = myFunction(urls[0])
const u2 = myFunction(urls[1])
const u3 = myFunction(urls[2])
const u4 = myFunction(urls[3])
const u5 = myFunction(urls[4])
const u6 = myFunction(urls[5])
const u7 = myFunction(urls[6])
const u8 = myFunction(urls[7])
const u9 = myFunction(urls[8])
const u10 = myFunction(urls[9])
const u11 = myFunction(urls[10])
const u12 = myFunction(urls[11])
const u13 = myFunction(urls[12])
const u14 = myFunction(urls[13])
const u15 = myFunction(urls[14])
const u16 = myFunction(urls[15])
const u17 = myFunction(urls[16])
const u18 = myFunction(urls[17])
const u19 = myFunction(urls[18])
const u20 = myFunction(urls[19])

// two more should be printed and besides that TRUE and FALSE values should be counted
Promise.race([u1,u2,u3,u4,u5,u6,u7,u8,u9,u10,u11,u12,u13,u14,u15,u16,u17,u18,u19,u20])
    .then(data => console.log(`${data[0]}: isDone — ${data[1].toString()[0].toUpperCase() + data[1].toString().slice(1)}`))
*/

//here is a replacements for all the things which I wrote above
Promise.race(urls.map(myFunction))
    .then(data => console.log(`${data[0]}: isDone — ${data[1].toString()[0].toUpperCase() + data[1].toString().slice(1)}`))



// it doesn't work. Since it prints first 3 links out of 3 and I need 3 out of 20 :(
/*
let urlPromList = new Array()
for(let url of urls){
    urlPromList.push(myFunction(url));
};

urlPromList[0].then(data => console.log(`${data[0]}: isDone — ${data[1].toString()[0].toUpperCase() + data[1].toString().slice(1)}`));
urlPromList[1].then(data => console.log(`${data[0]}: isDone — ${data[1].toString()[0].toUpperCase() + data[1].toString().slice(1)}`));
urlPromList[2].then(data => console.log(`${data[0]}: isDone — ${data[1].toString()[0].toUpperCase() + data[1].toString().slice(1)}`));
*/



