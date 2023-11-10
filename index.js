const mysql = require('mysql');
const inquirer = require('inquirer');


function questions(){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'Please choose one of the following',
                choices: [
                    "option1",
                    "option2",
                    "option3"
                ]
            }

        ])
        .then((answer) => {
            console.log(answer)
        })
        .catch((err) => {
            console.log(err)
        })

};

questions();