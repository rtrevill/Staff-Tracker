//Use the inquirer npm package
const inquirer = require('inquirer');

// import links to other related files  
const Queries = require('./files/queries');
const Questions = require('./files/questions');
const SourceArrays = require('./files/source-arrays')
const Implement = require('./files/implement');
const db = require('./db/server')

//Initial questions when starting the application
function questions(){
    inquirer
        .prompt(new Questions().listQuestions())
        .then((answer) => {
            viewRequests(answer)
        })
        .catch((err) => {
            console.log(err)
        })
};

questions();


// Function directing the requests to the appropriate sql query function, or to a function to get the required arrays for the request. 
function viewRequests(request){
    const linkOne = (new SourceArrays.BaseInformation());
    const query = (new Queries.sqlQueries())
    const selection = request.options;

    if (selection === "Quit"){
        console.log("Goodbye");
        process.exit();
    }
    const viewCheck = new RegExp('View*');
    if (viewCheck.test(selection)){
    (selection === "View All Employees") ? query.viewEmployees():
    (selection === "View All Departments") ? query.viewDeparts():
    (selection === "View All Roles") ? query.viewRoles(): console.log('No Return 1');
    setTimeout(() => questions(), 200);
    return;
    }
    (selection === "Find employees by department") ? linkOne.getDeptDetails(3):
    (selection === "Find total wages for department") ? linkOne.getDeptDetails(4):
    (selection === "Find employees by manager") ? linkOne.employeesManagers(3):
    (selection === "Delete Employee") ? linkOne.employeesManagers(2):
    (selection === "Add Department") ? new Implement.Functions().addDepartment():
    (selection === "Add Role") ? linkOne.getDeptDetails(1):
    (selection === "Delete Department") ? linkOne.getDeptDetails(2):
    (selection === "Add Employee") ? linkOne.roleAndManagerDetails(1):
    (selection === "Delete Role") ? linkOne.roleAndManagerDetails(2):
    (selection === "Update Employee Role") ? linkOne.roleAndManagerDetails(3): 
    (selection === "Update employee managers") ? linkOne.employeesManagers(1): console.log('No Return 2');
    return;
};


exports.questions = questions;
module.exports = db;
global.db = db;