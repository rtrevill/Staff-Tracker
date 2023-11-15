const mysql = require('mysql2');
const Implement = require('./implement')
const index = require('../index');

const funcLink = (new Implement.Functions());

class BaseInformation{

getDeptDetails = function(number){
    let departmentArray = [];
    let deptDetails = [];
    db.promise().query(`SELECT id, name FROM department`)
    .then((result) => {
            deptDetails = [...result[0]];
            result[0].forEach(departm => {
                let x = departm.name;
                departmentArray.push(x);
            })
            console.log("");
            (number === 'One') ? funcLink.addRole(departmentArray, deptDetails):
            (number === 'Two') ? funcLink.deleteDepartment(departmentArray, deptDetails):
            (number === 'Three') ? funcLink.employeesByDept(departmentArray, deptDetails):
            console.log("Bad Reference");
            })
    .catch(err => console.log(err));
};


roleAndManagerDetails = function(number){
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
                console.log('');
                (number=== 'One') ? funcLink.addEmployee(roleArray, roleDetails, manArray, manDetails):
                (number=== 'Two') ? funcLink.deleteRole(roleArray, roleDetails):
                (number=== 'Three') ? funcLink.updateRole(manArray, manDetails, roleArray, roleDetails):
                console.log('Bad Reference');
                })
    .catch(err => console.log(err));
};   


employeesManagers = function(number){
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
        console.log("");
    (number === 'One') ? funcLink.chooseNewMan(employeeResults, fullNames):
    (number === 'Two') ? funcLink.deleteEmployee(employeeResults, fullNames):
    (number === 'Three') ? funcLink.viewByManQuest(employeeResults, fullNames):
    console.log('Bad reference');
    })
    .catch(err => console.log(err));
};

};


module.exports = {
    BaseInformation
}