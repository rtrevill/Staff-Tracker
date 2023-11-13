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


function getDeptDetails(number){
    let departmentArray = [];
    let deptDetails = [];
    db.promise().query(`SELECT id, name FROM department`)
    .then((result) => {
            deptDetails = [...result[0]];
            result[0].forEach(departm => {
                let x = departm.name;
                departmentArray.push(x);
            })
            if (number === 'One'){
                addRole(departmentArray, deptDetails);
            }
            if (number === 'Two'){
                deleteDepartment(departmentArray, deptDetails);
            }
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


function roleAndManagerDetails(number){
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
                (number=== 'One') ? addEmployee(roleArray, roleDetails, manArray, manDetails):
                (number=== 'Two') ? deleteRole(roleArray, roleDetails):
                console.log('Bad Reference');
                })
    .catch(err => console.log(err));
};   


function employeesManagers(number){
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
    (number === 'One') ? chooseNewMan(employeeResults, fullNames):
    (number === 'Two') ? deleteEmployee(employeeResults, fullNames):
    console.log('Bad reference');
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


function deleteEmployee(employeeResults, fullNames){
    inquirer
    .prompt(new Questions().deleteEmployeeQuestions(fullNames))
    .then((result) => {
        let choice = fullNames.indexOf(result.employee);
        let empID = employeeResults[choice].id;
        db.promise().query(`DELETE FROM employee WHERE id = ${empID}`)
        .then(() => {
            console.log('employee deleted')
            questions()
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

};

function deleteRole(roleArray, roleDetails){
    inquirer
    .prompt(new Questions().deleteRoleQuestions(roleArray))
    .then(async (result) => {
        let choice = roleArray.indexOf(result.role);
        let roleID = roleDetails[choice].id;
        await db.promise().query(`DELETE FROM role WHERE id = ${roleID}`)
        console.log('Role deleted');
        questions();
    })
    .catch(err => console.log(err));
};

function deleteDepartment(departmentArray, deptDetails){
    inquirer
    .prompt(new Questions().deleteDepartQuestions(departmentArray))
    .then(async (result) => {
        let choice = departmentArray.indexOf(result.department);
        let departID = deptDetails[choice].id;
        await db.promise().query(`DELETE FROM department WHERE id = ${departID}`)
        console.log('Department deleted');
        questions();
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
    (selection === "View employees by department") ? new Queries.sqlQueries().viewByDepart():
    (selection === "View All Departments") ? new Queries.sqlQueries().viewDeparts():
    (selection === "View All Roles") ? new Queries.sqlQueries().viewRoles(): console.log('No Return 1');
    setTimeout(() => questions(), 200);
    return;
    }
    (selection === "Delete Employee") ? employeesManagers('Two'):
    (selection === "Add Department") ? addDepartment():
    (selection === "Add Role") ? getDeptDetails('One'):
    (selection === "Delete Department") ? getDeptDetails('Two'):
    (selection === "Add Employee") ? roleAndManagerDetails('One'):
    (selection === "Delete Role") ? roleAndManagerDetails('Two'):
    (selection === "Update Employee Role") ? employeeAndRole(): 
    (selection === "Update employee managers") ? employeesManagers('One'): console.log('No Return 2');
    return;
};


module.exports = {
    addRole,
    questions
}