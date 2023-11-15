const inquirer = require('inquirer');

const Queries = require('./queries');
const Questions = require('./questions');
const index = require('../index');

//Class 'Functions' contains functions where extra logic needs to be processed in order to make the final SQL query accurate.
//These often work by refining the arrays produced from the source-arrays.BaseInformation class
class Functions {

// Inquirer workflow for the Add a new role request
addRole = function(departmentArray, deptDetails){

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
        setTimeout(() => new index.questions(),200);
    })
    .catch((err) => {
        console.log(err)
    });
};

// Function that gains the details of a new employee, then assigns a manager_id number instead of a name
addEmployee = function(roleArray, roleDetails, manArray, manDetails){
    manArray.push('No Manager');
    inquirer
    .prompt(new Questions().addEmployQuestions(roleArray, manArray))
    .then((answer) => {
        const fName = answer.firstName;
        const lName = answer.lastName;
        const eRole = answer.employRole;
        const eMan = answer.employMan;
        const roleFind = roleDetails.find(item => item.title === eRole)
        const roleID = roleFind.id
        let manID;
        if (eMan === 'No Manager'){
            manID = null;
        }
        else{
        const manFind = manDetails.find(item => (item.first_name + " " + item.last_name) === eMan)
        manID = manFind.id
        }
        new Queries.sqlQueries().newEmployee(fName, lName, roleID, manID);
        setTimeout(() => new index.questions(),200);
    })
    .catch((err) => {
        console.log(err)
    });

};

// Function for inquirer query to add a new department
addDepartment = function(){
    inquirer
    .prompt(new Questions().addDeptQuestions())
    .then((response) => { 
        new Queries.sqlQueries().addDept(response);
        setTimeout(()=> new index.questions(),200);
    })
    .catch(err => console.log(err))
};
    
// Function that runs inqurer and deletes an employee with an SQL query
deleteEmployee = function(employeeResults, fullNames){
    inquirer
    .prompt(new Questions().deleteEmployeeQuestions(fullNames))
    .then(async (result) => {
        let choice = fullNames.indexOf(result.employee);
        let empID = employeeResults[choice].id;
        await db.promise().query(`DELETE FROM employee WHERE id = ${empID}`)
        console.log('employee deleted')
        new index.questions()
    })
    .catch(err => console.log(err));
};

// Function that runs inqurer and deletes a role with an SQL query
deleteRole = function(roleArray, roleDetails){
    inquirer
    .prompt(new Questions().deleteRoleQuestions(roleArray))
    .then(async (result) => {
        let choice = roleArray.indexOf(result.role);
        let roleID = roleDetails[choice].id;
        await db.promise().query(`DELETE FROM role WHERE id = ${roleID}`)
        console.log('Role deleted');
        new index.questions();
    })
    .catch(err => console.log(err));
};

// Function that runs inqurer and deletes a department with an SQL query
deleteDepartment = function(departmentArray, deptDetails){
    inquirer
    .prompt(new Questions().deleteDepartQuestions(departmentArray))
    .then(async (result) => {
        let choice = departmentArray.indexOf(result.department);
        let departID = deptDetails[choice].id;
        await db.promise().query(`DELETE FROM department WHERE id = ${departID}`)
        console.log('Department deleted');
        new index.questions();
    })
    .catch(err => console.log(err));
};

// function to run inquirer and then use responses to find id's of the selected employee and role
// before requesting to run an SQL query
updateRole = function(nameArray, nameDetails, roleArray, roleDetails){

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
        const roleFind = roleDetails.find(item => selectRole === item.title)
        let roleID = roleFind.id

        new Queries.sqlQueries().upRole(roleID, nameID);
        setTimeout(() => new index.questions(), 200);
    })
    .catch(err => console.log(err));
};



chooseNewMan = function(employeeResults, fullNames){
    const employFullName = [...fullNames];
    const manFullNames = [...fullNames];
    manFullNames.push('No Manager');
    inquirer
        .prompt(new Questions().newManagerQuestions(employFullName, manFullNames))
        .then((answer) => {
            const person1 = fullNames.indexOf(answer.employee);
            const idOfOne = employeeResults[person1].id;
            let idOfTwo;
            if (answer.Manager === 'No Manager'){
                (idOfTwo = null)}
            else{
            const person2 = fullNames.indexOf(answer.Manager);
            idOfTwo = employeeResults[person2].id;}

            new Queries.sqlQueries().upMan(idOfOne, idOfTwo);
            setTimeout(() => index.questions(),200);
            })
        .catch(err => console.log(err))
};


viewByManQuest = function(employeeResults){
    let manIDArray;
    let manFullNames = [];
    let fullnameandID = [];

    db.promise().query(`SELECT manager_id FROM employee`)
    .then((result) =>{
        let trialArray = [];
        result[0].forEach(object =>{
            let x = Object.values(object);
            trialArray.push(x);
        })
        let trialArray2 = trialArray.flat()
        manIDArray = [...new Set(trialArray2)];
    })
    .then(() => {
        employeeResults.forEach(object => {
            let newObj = {id: object.id,
                        fullName: object.first_name + " " + object.last_name}
            fullnameandID.push(newObj);
        })
        manIDArray.forEach(number => {
            const result = fullnameandID.find(item => item.id === number);
            if (result !==undefined){
            const resultName = result.fullName;
            manFullNames.push(resultName);
            }
        })
    })
    .then(() =>{
    inquirer
        .prompt(new Questions().viewByManagerQ(manFullNames))
        .then((response) => {
            const responseFind = fullnameandID.find(item => item.fullName === response.manager);
            const responseID = responseFind.id
            new Queries.sqlQueries().viewByMan(responseID)
        })
    })
    .catch(err => console.log(err));
};

employeesByDept = function(departmentArray, deptDetails){
    inquirer
        .prompt(new Questions().viewbyDeptQ(departmentArray))
        .then((response) => {
            const responseFind = deptDetails.find(item => item.name === response.department);
            const responseID = responseFind.id
            new Queries.sqlQueries().viewByDepart(responseID);
        })
        .catch(err => console.log(err));
};

sumOfSalaries = function(departmentArray, deptDetails){
    inquirer
        .prompt(new Questions().totalSalariesQ(departmentArray))
        .then((response) => {
            const responseFind = deptDetails.find(item => item.name === response.department);
            const responseID = responseFind.id
            new Queries.sqlQueries().salariesTotal(responseID);
            })
        .catch(err => console.log(err));
};

};

  module.exports = {
    Functions
  }
