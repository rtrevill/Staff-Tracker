const mysql = require('mysql2');
const index = require('./index');
const table = require('table').table;


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


function displaytable(data){
    let newArray = [];
    let arrayTitles = [];

    arrayTitles = Object.keys(data[0]);
    newArray.push(arrayTitles);

    for (i=0; i<data.length; i++){
        let ary = Object.values(data[i])
        newArray.push(ary);
    };

console.log(table(newArray));
   
};
  



class sqlQueries {

viewRoles = function(){
    db.promise().query(`SELECT role.id, title, name AS department, salary FROM role JOIN department ON role.department_id = department.id`)
    .then(result => displaytable(result[0]))
    .catch(err => console.log(err));

};

viewDeparts = function(){
    db.promise().query(`SELECT * FROM department ORDER BY name ASC`)
    .then(result => displaytable(result[0]))
    .catch(err => console.log(err));
};

viewEmployees = function(){
    db.promise().query(`SELECT e.id, e.first_name, e.last_name, title, name AS department, salary, m.first_name AS manfirst, m.last_name AS manlast
    FROM employee e 
    LEFT OUTER JOIN employee m ON m.id = e.manager_id
    JOIN role ON e.role_id = role.id 
    JOIN department ON department.id = role.department_id`)
    .then(result => {
        const newArray = result[0].map(({id, first_name, last_name, title, department, salary, manfirst, manlast}) =>
        ({  'id': id,
            'first_name': first_name,
            'last_name': last_name,
            'title': title,
            'department': department,
            'salary': salary,
            'manager': manfirst + " " + manlast}))
        newArray.forEach(element => {
            if (element.manager === 'null null'){
                element.manager = null;
            };
        });
        
        displaytable(newArray);
    
    })
    .catch(err => console.log(err));
};

upRole = function(roleID, nameID){
    db.promise().query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${nameID}`)
    .then(console.log(`updated employees role`))
    .catch(err => console.log(err));
};

addDept = function(response){
    const deptName = response.newDepart;
    db.query(`INSERT INTO department (name) VALUES ("${deptName}")`);
    console.log(`added ${deptName} to the database`);
};

newRole = function(roleName, roleSal, roleID){
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${roleName}",${roleSal},${roleID})`);
    console.log(`added ${roleName} to the database`);
};

newEmployee = function(fName, lName, roleID, manID){
    db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${fName}", "${lName}",${roleID},${manID})`)
    .then(console.log(`added ${fName} ${lName} to the database`))
    .catch(err => console.log(err));
};

upMan = function(idOfOne, idOfTwo){
    db.promise().query(`UPDATE employee SET manager_id = ${idOfTwo} WHERE id= ${idOfOne}`)
    .then(console.log('Manager updated'))
    .catch(err => console.log(err));
}

viewByMan = function(){
    db.promise().query(`SELECT e.first_name, e.last_name, m.first_name AS manfirst, m.last_name AS manlast
                        FROM employee e
                        LEFT OUTER JOIN employee m
                        ON m.id = e.manager_id
                        ORDER BY m.first_name ASC`)
    .then(result => {
        const newArray = result[0].map(({first_name, last_name, manfirst, manlast}) =>
        ({  'first_name': first_name,
            'last_name': last_name,
            'manager': manfirst + " " + manlast}))
        newArray.forEach(element => {
            if (element.manager === 'null null'){
                element.manager = null;
            };
        })
        displaytable(newArray);
        })
    .catch(err => console.log(err));
};

viewByDepart = function(){
    db.promise().query(`SELECT first_name, last_name, name AS department
                        FROM employee
                        JOIN role
                        ON role.id = employee.role_id
                        JOIN department
                        ON role.department_id = department.id
                        ORDER BY name ASC`)
    .then(result => displaytable(result[0]))
    .catch(err => console.log(err));
};


};

module.exports = {  sqlQueries };
