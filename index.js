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

function addDepartment(){
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'newDepart',
            message: 'What is the name of the department?'
        }

    ])
    .then((answer) => {
        console.log(answer)
        const deptName = answer.newDepart;
        db.query(`INSERT INTO department (name) VALUES ("${deptName}")`);
        console.log(`added ${deptName} to the database`);
        questions();
    })
    .catch((err) => {
        console.log(err)
    })

}

function addRole(){
    let departmentArray = [];
    let deptDetails = [];
    let deptChoices = db.query(`SELECT id, name FROM department`, (err, result) => {
        if (result){
            deptDetails = [...result];
            console.log(deptDetails);
            result.forEach(element => {
                let x = element.name;
                departmentArray.push(x);
                console.log(departmentArray);                
            });
            return departmentArray;
        }
        else
            console.log(err)
    });
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'roleDept',
            message: 'Which department does the role belong to?',
            choices: departmentArray
        }
    ])
    .then((answer) => {
        console.log(answer)
        const roleName = answer.newRole;
        const roleSal = answer.roleSalary;
        const roleDept = answer.roleDept;
        let roleID;
        deptDetails.forEach(entry => {
            if (roleDept === entry.name){
                roleID = entry.id
                console.log(roleID)
            };
        });
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${roleName}",${roleSal},${roleID})`);
        console.log(`added ${roleName} to the database`);
        questions();
    })
    .catch((err) => {
        console.log(err)
    })

}

function addEmployee(){
    let departmentArray = [];
    let deptDetails = [];
    let deptChoices = db.query(`SELECT id, name FROM department`, (err, result) => {
        if (result){
            deptDetails = [...result];
            console.log(deptDetails);
            result.forEach(element => {
                let x = element.name;
                departmentArray.push(x);
                console.log(departmentArray);                
            });
            return departmentArray;
        }
        else
            console.log(err)
    });
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'roleDept',
            message: 'Which department does the role belong to?',
            choices: departmentArray
        }
    ])
    .then((answer) => {
        console.log(answer)
        const roleName = answer.newRole;
        const roleSal = answer.roleSalary;
        const roleDept = answer.roleDept;
        let roleID;
        deptDetails.forEach(entry => {
            if (roleDept === entry.name){
                roleID = entry.id
                console.log(roleID)
            };
        });
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${roleName}",${roleSal},${roleID})`);
        console.log(`added ${roleName} to the database`);
        questions();
    })
    .catch((err) => {
        console.log(err)
    })

}

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
    console.log(selection);
    if (selection === "View All Employees"){
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
    if (selection === "View All Departments"){
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
    if (selection === "View All Roles"){
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
    if (selection === "Add Department"){
        console.log("New Dept selected");
        addDepartment();
    }
    if (selection === "Add Role"){
        console.log("New Role selected");
        addRole();
    }
    if (selection === "Add Role"){
        console.log("New Role selected");
        addRole();
    }


    else {
        console.log('No return')
    }
};