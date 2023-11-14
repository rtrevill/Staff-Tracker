const mysql = require('mysql2');
const inquirer = require('inquirer');

const Queries = require('./queries');
const Questions = require('./questions');
const index = require('../index');


class Functions {

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

addEmployee = function(roleArray, roleDetails, manArray, manDetails){
    manArray.push('No Manager');
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
        if (eMan === 'No Manager'){
            manID = null;
        }
        else{
        manDetails.forEach(entry => {
            if (eMan === (entry.first_name + " " + entry.last_name)){
                manID = entry.id
            }
        })}
        new Queries.sqlQueries().newEmployee(fName, lName, roleID, manID);
        setTimeout(() => new index.questions(),200);
    })
    .catch((err) => {
        console.log(err)
    });

};

addDepartment = function(){
    inquirer
    .prompt(new Questions().addDeptQuestions())
    .then((response) => { 
        new Queries.sqlQueries().addDept(response);
        setTimeout(()=> new index.questions(),200);
    })
    .catch(err => console.log(err))
};
    
deleteEmployee = function(employeeResults, fullNames){
    inquirer
    .prompt(new Questions().deleteEmployeeQuestions(fullNames))
    .then((result) => {
        let choice = fullNames.indexOf(result.employee);
        let empID = employeeResults[choice].id;
        db.promise().query(`DELETE FROM employee WHERE id = ${empID}`)
        .then(() => {
            console.log('employee deleted')
            new index.questions()
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

};

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
        let roleID;
        roleDetails.forEach(entry => {
            if (selectRole === (entry.title)){
                roleID = entry.id
            };
        });

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

};

  module.exports = {
    Functions
  }
