const mysql = require('mysql');
const inquirer = require('inquirer');


function questions(){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'what would you like to do? (Use arrow keys)',
                choices: [
                    "View All Employees",
                    "Add Employee",
                    "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Quit"
                ]
            }

        ])
        .then((answer) => {
            console.log(answer)
            viewRequests(answer)
        })
        .catch((err) => {
            console.log(err)
        })

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
    if (request = "View All Employees"){
        db.query(`SELECT employee.id, first_name, last_name, title, name AS department, salary, manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id`, (err, result) => {
            if (err){
                console.log(err);
                return;
            }
            console.table(result);
            questions();
            return;
        });
    }
    if (request = "View All Departments"){
        db.query(`SELECT * FROM department ORDER BY name ASC`, (err, result) => {
            if (err){
                console.log(err);
                return;
            }
            console.table(result);
            questions();
            return;
        });
    }
    if (request = "View All Roles"){
        db.query(`SELECT role.id, title, name AS department, salary FROM role JOIN department ON role.department_id = department.id`, (err, result) => {
            if (err){
                console.log(err);
                return;
            }
            console.table(result);
            questions();
            return;
        });
    }
    else {
        console.log('No return')
    }
};