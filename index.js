const mysql = require('mysql2');
const inquirer = require('inquirer');

const Queries = require('./files/queries');
const Questions = require('./files/questions');
const SourceArrays = require('./files/source-arrays')
const Implement = require('./files/implement');


const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '{rgh>fl@YOkUPL3O>+SN',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );


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
    // (selection === "View employees by manager") ? query.viewByMan():
    (selection === "View All Departments") ? query.viewDeparts():
    (selection === "View All Roles") ? query.viewRoles(): console.log('No Return 1');
    setTimeout(() => questions(), 200);
    return;
    }
    (selection === "Employees by department") ? linkOne.getDeptDetails('Three'):
    (selection === "find total wages for department") ? linkOne.getDeptDetails('Four'):
    (selection === "Employees by manager") ? linkOne.employeesManagers('Three'):
    (selection === "Delete Employee") ? linkOne.employeesManagers('Two'):
    (selection === "Add Department") ? new Implement.Functions().addDepartment():
    (selection === "Add Role") ? linkOne.getDeptDetails('One'):
    (selection === "Delete Department") ? linkOne.getDeptDetails('Two'):
    (selection === "Add Employee") ? linkOne.roleAndManagerDetails('One'):
    (selection === "Delete Role") ? linkOne.roleAndManagerDetails('Two'):
    (selection === "Update Employee Role") ? linkOne.roleAndManagerDetails('Three'): 
    (selection === "Update employee managers") ? linkOne.employeesManagers('One'): console.log('No Return 2');
    return;
};


exports.questions = questions;
module.exports = db;
global.db = db;