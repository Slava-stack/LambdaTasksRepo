function add_dots(x){
    let final = []
    if(x.length <= 1){
        return x
    }else{
        for(let i of add_dots(x.slice(1,))){
            final.push(x[0] + i)
            final.push(x[0] + "." + i)
        }
        return final
    }
}

console.log(add_dots('abcd'));