const inquirer = require('inquirer');
const fs = require('fs')


const nameQuestion = () => {inquirer.prompt(
    {
        type: "input",
        name: "name",
        message: "Enter user's name. To cancel press ENTER:",
    }).then(answer => (answer.name !== '') ? questionsContinuation(answer) : searcher());
}


const questionsContinuation = (objName) => {
    inquirer.prompt([
        {
            type: "list",
            name: "gender",
            message: "Choose your gender:",
            choices: ["male", "female"],
        },
        {
            type: "input",
            name: "age",
            message: "Enter user's age:",
            validate: input => {
                if (isNaN(input)) return "Only numbers";
                return true;
            }
        }
    ]).then(answers => {
        let aboutUser = Object.assign(objName, answers);
        fs.appendFileSync("DB.txt", `${JSON.stringify(aboutUser)}\n`); // may cuz bugs cuz of \r
        nameQuestion();
    })
}


const searcher = () => {
    inquirer.prompt(
        {
            type: "confirm",
            name: "searchInDB",
            message: "Would you like to search values in DB?",
        })
    .then(({searchInDB}) => {
        if(searchInDB){
        const objectsFromDB = fs.readFileSync("DB.txt", "utf8").split('\n').filter(el => el !== '').map(JSON.parse);
        console.log(objectsFromDB);
        findByName(objectsFromDB);
        }
    })
}


const findByName = (objectsFromDB) => {
    inquirer.prompt({
        type: "input",
        name: "userName",
        message: "Enter user's name you wanna find in DB:"
    }).then(({userName}) => {
        const final = objectsFromDB.filter(el => el.name.toLowerCase() === userName.toLowerCase()).map(el => JSON.stringify(el))
        if(final.length) {
            console.log(`User ${userName} was found.`);
            final.forEach(el => console.log(el));
        }
        else console.log("There's no user with such name in DB")
    })
}


nameQuestion();