const Implement = require('./implement')

const funcLink = (new Implement.Functions());
// Class 'BaseInformation' containing functions that produce the arrays required for further utilisation/processing,
// so an appropriate SQL query can be made 
class BaseInformation{

// Function to produce base arrays relating to departments
// This produces an array with details, and a summarised array to use for inquirer list choices  
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
            (number === 1) ? funcLink.addRole(departmentArray, deptDetails):
            (number === 2) ? funcLink.deleteDepartment(departmentArray, deptDetails):
            (number === 3) ? funcLink.employeesByDept(departmentArray, deptDetails):
            (number === 4) ? funcLink.sumOfSalaries(departmentArray, deptDetails):
            console.log("Bad Reference");
    })
    .catch(err => console.log(err));
};

// Function to produce base arrays relating to roles and employees
// This produces an array for both roles and employees with details, and also summarised arrays to use for inquirer list choices 
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
            (number=== 1) ? funcLink.addEmployee(roleArray, roleDetails, manArray, manDetails):
            (number=== 2) ? funcLink.deleteRole(roleArray, roleDetails):
            (number=== 3) ? funcLink.updateRole(manArray, manDetails, roleArray, roleDetails):
            console.log('Bad Reference');
        })
    .catch(err => console.log(err));
};   

// Function to produce base arrays relating to employees
// This produces an array with full details, and a summarised array to use for inquirer list choices  
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
        (number === 1) ? funcLink.chooseNewMan(employeeResults, fullNames):
        (number === 2) ? funcLink.deleteEmployee(employeeResults, fullNames):
        (number === 3) ? funcLink.viewByManQuest(employeeResults):
        console.log('Bad reference');
    })
    .catch(err => console.log(err));
};

};


module.exports = {
    BaseInformation
}