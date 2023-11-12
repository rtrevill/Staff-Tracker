const index = require('./index');

class Questions{

listQuestions = function(){
    const mainQList = [
        {
            type: 'list',
            name: 'options',
            message: 'what would you like to do? (Use arrow keys)',
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]
        }
    ]
    return mainQList;
};





};


module.exports = Questions