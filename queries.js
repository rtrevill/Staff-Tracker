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
    db.query(`SELECT role.id, title, name AS department, salary FROM role JOIN department ON role.department_id = department.id`, (err, result) => {
        if (err){
            console.log(err);
            return;
        }
        console.table(result);
        return result;
    });
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