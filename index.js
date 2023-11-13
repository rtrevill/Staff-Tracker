const mysql = require('mysql2');
const inquirer = require('inquirer');

const Queries = require('./queries');
const Questions = require('./questions');


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

function employeeAndRole(){
    let nameArray = [];
    let nameDetails = [];
    let roleArray = [];
    let roleDetails = [];
    db.promise().query(`SELECT id, first_name, last_name FROM employee`)
                .then((result) => {
                nameDetails = [...result[0]];
                result[0].forEach(item => {
                    let fullName = (item.first_name + " " + item.last_name);
                    nameArray.push(fullName);
                })})
    db.promise().query(`SELECT id, title FROM role`)
                .then((result) => {
                    // console.log(result);
                    roleDetails = [...result[0]];
                    result[0].forEach(item => {
                        let roleTitle = (item.title);
                        roleArray.push(roleTitle);
                    })})
                .then(result => updateRole(nameArray, nameDetails, roleArray, roleDetails))
                .catch(err => console.log(err));

};

function addDepartment(){
    inquirer
    .prompt(new Questions().addDeptQuestions())
    .then((response) => { 
        new Queries.sqlQueries().addDept(response);
        setTimeout(()=>questions(),200);
    })
    .catch(err => console.log(err))
};


function getDeptDetails(){
    let departmentArray = [];
    let deptDetails = [];
    db.promise().query(`SELECT id, name FROM department`)
    .then((result) => {
            deptDetails = [...result[0]];
            result[0].forEach(departm => {
                let x = departm.name;
                departmentArray.push(x);
            })
            addRole(departmentArray, deptDetails);
            })
    .catch(err => console.log(err));
};


function addRole(departmentArray, deptDetails){

    inquirer
    .prompt(new Questions().addRollQuestions(departmentArray))
    .then((answer) => {
        const roleName = answer.newRole;
        const roleSal = answer.roleSalary;
        const roleDept = answer.roleDept;
        let roleID;
        deptDetails.forEach(entry => {
            if (roleDept === entry.name){
                roleID = entry.id
            };
        });
        new Queries.sqlQueries().newRole(roleName, roleSal, roleID);
        setTimeout(() => questions(),200);
    })
    .catch((err) => {
        console.log(err)
    });
};


function roleAndManagerDetails(){
    let roleArray=[];
    let roleDetails=[];
    let manArray=[];
    let manDetails=[];

    db.promise().query(`SELECT id, title FROM role`)
    .then((result) => {
            roleDetails = [...result[0]];
            result[0].forEach(element => {
                let x = element.title;
                roleArray.push(x);
            })})
    .catch(err => console.log(err));
    
    db.promise().query(`SELECT id, first_name, last_name FROM employee`)
    .then((result) => {
            manDetails = [...result[0]];
            result[0].forEach(item => {
                let x = (item.first_name + " " + item.last_name);
                manArray.push(x);
                })
                addEmployee(roleArray, roleDetails, manArray, manDetails);
                })
    .catch(err => console.log(err));
};   


function employeesManagers(){
    let fullNames = [];
    let employeeResults = [];
    db.promise().query(`SELECT id, first_name, last_name, manager_id FROM employee`)
    .then((result) => {
        employeeResults = [...result[0]];
        result[0].forEach(name =>{
            let fName;
            fName = (name.first_name + " " + name.last_name)
            fullNames.push(fName);
        })
    chooseNewMan(employeeResults, fullNames);
    })
    .catch(err => console.log(err));
};

function chooseNewMan(employeeResults, fullNames){
    inquirer
        .prompt(new Questions().newManagerQuestions(fullNames))
        .then((answer) => {
            const person1 = fullNames.indexOf(answer.employee);
            const person2 = fullNames.indexOf(answer.Manager);
            const idOfOne = employeeResults[person1].id;
            const idOfTwo = employeeResults[person2].id;
            new Queries.sqlQueries().upMan(idOfOne, idOfTwo);
            setTimeout(() => questions(),200);
            })
        .catch(err => console.log(err))
};

function addEmployee(roleArray, roleDetails, manArray, manDetails){
    inquirer
    .prompt(new Questions().addEmployQuestions(roleArray, manArray))
    .then((answer) => {
        const fName = answer.firstName;
        const lName = answer.lastName;
        const eRole = answer.employRole;
        const eMan = answer.employMan;
        let roleID;
        roleDetails.forEach(entry => {
            if (eRole === entry.title){
                roleID = entry.id
            };
        });
        let manID;
        manDetails.forEach(entry => {
            if (eMan === (entry.first_name + " " + entry.last_name)){
                manID = entry.id
            }
        })
        new Queries.sqlQueries().newEmployee(fName, lName, roleID, manID);
        setTimeout(() => questions(),200);
    })
    .catch((err) => {
        console.log(err)
    });

};

function updateRole(nameArray, nameDetails, roleArray, roleDetails){

    inquirer
    .prompt(new Questions().updateRoleQuestions(nameArray, roleArray))
    .then((answer) => {
        const selectName = answer.fullName;
        const selectRole = answer.newRole;
        let nameID;
        nameDetails.forEach(entry => {
            if (selectName === (entry.first_name + " " + entry.last_name)){
                nameID = entry.id
            };
        });
        let roleID;
        roleDetails.forEach(entry => {
            if (selectRole === (entry.title)){
                roleID = entry.id
            };
        });

        new Queries.sqlQueries().upRole(roleID, nameID);
        setTimeout(() => questions(), 200);
    })
    .catch(err => console.log(err));
};


questions();

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
  

function viewRequests(request){
    const selection = request.options;
    if (selection === "Quit"){
        console.log("Goodbye");
        process.exit();
    }
    const viewCheck = new RegExp('View*');
    if (viewCheck.test(selection)){
    (selection === "View All Employees") ? new Queries.sqlQueries().viewEmployees():
    (selection === "View employees by manager") ? new Queries.sqlQueries().viewByMan():
    (selection === "View All Departments") ? new Queries.sqlQueries().viewDeparts():
    (selection === "View All Roles") ? new Queries.sqlQueries().viewRoles(): console.log('No Return 1');
    setTimeout(() => questions(), 200);
    return;
    }
    (selection === "Add Department") ? addDepartment():
    (selection === "Add Role") ? getDeptDetails():
    (selection === "Add Employee") ? roleAndManagerDetails():
    (selection === "Update Employee Role") ? employeeAndRole(): 
    (selection === "Update employee managers") ? employeesManagers(): console.log('No Return 2');
    return;
};


module.exports = {
    addRole,
    questions
}