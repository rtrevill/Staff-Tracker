const mysql = require('mysql2');
const Index = require('./index');


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


class sqlQueries {


viewRoles = function(){
    db.promise().query(`SELECT role.id, title, name AS department, salary FROM role JOIN department ON role.department_id = department.id`)
    .then(result => console.table(result[0]))
    .catch(err => console.log(err));
};

viewDeparts = function(){
    db.promise().query(`SELECT * FROM department ORDER BY name ASC`)
    .then(result => console.table(result[0]))
    .catch(err => console.log(err));
};

viewEmployees = function(){
    db.promise().query(`SELECT e.id, e.first_name, e.last_name, title, name AS department, salary, m.first_name AS manager
    FROM employee e 
    LEFT OUTER JOIN employee m ON m.id = e.manager_id
    JOIN role ON e.role_id = role.id 
    JOIN department ON department.id = role.department_id`)
    .then(result => console.table(result[0]))
    .catch(err => console.log(err));
};

upRole = function(roleID, nameID){
    db.promise().query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${nameID}`)
    .then(console.log(`updated employees role`))
    .catch(err => console.log(err));
};

}








function employees(){
    let result = db.query(`SELECT e.id, e.first_name, e.last_name, title, name AS department, salary, m.first_name AS manager
    FROM employee e 
    LEFT OUTER JOIN employee m ON m.id = e.manager_id
    JOIN role ON e.role_id = role.id 
    JOIN department ON department.id = role.department_id`);
    return result;

}





module.exports = {
    sqlQueries,
    employees,
    
}