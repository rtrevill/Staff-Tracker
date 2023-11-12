const mysql = require('mysql2');
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
            viewRequests(answer)
        })
        .catch((err) => {
            console.log(err)
        })

};

function getArray1(){
    let nameA = [];
    let nameA2 = [];
    let nameB = [];
    let nameB2 = [];
    let nameC = [];
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, result) => {
            if (result){
                nameA2 = [...result];
                result.forEach(item => {
                    let x = (item.first_name + " " + item.last_name);
                    nameA.push(x);
                })
                return;
            }
            else
            console.log(err);
        });
    db.query(`SELECT id, title FROM role`, (err, result) => {
        if (result){
            nameB2 = [...result];
            result.forEach(item => {
                let x = (item.title);
                nameB.push(x);
            })
            if ((nameA)&&(nameB)){
                nameC.push(nameA, nameA2, nameB, nameB2);
                updateRole(nameC);
            }
        
            return;
        }
        else
        console.log(err);
    });


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
    let roleArray = [];
    let roleDetails = [];
    let manArray = [];
    let manDetails = [];

    let roleChoices = db.query(`SELECT id, title FROM role`, (err, result) => {
        if (result){
            roleDetails = [...result];
            result.forEach(element => {
                let x = element.title;
                roleArray.push(x);
            });
            return roleArray;
        }
        else
            console.log(err)
    });

    let manChoices = db.query(`SELECT id, first_name, last_name FROM employee`, (err, result) => {
        if (result){
            manDetails = [...result];
            result.forEach(item => {
                let x = (item.first_name + " " + item.last_name);
                manArray.push(x);
            })
            return;
        }
        else
        console.log(err);
    });

    inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?'
        },
        {
            type: 'list',
            name: 'employRole',
            message: "What is the employee's role?",
            choices: roleArray
        },
        {
            type: 'list',
            name: 'employMan',
            message: "Who is the employee's manager?",
            choices: manArray
        }
    ])
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
        db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${fName}", "${lName}",${roleID},${manID})`)
        .then(console.log(`added ${fName} ${lName} to the database`))
        questions()
        .catch(console.log(err));
    })
    .catch((err) => {
        console.log(err)
    })

}

function updateRole(roley){
    let fullNames = roley[0];
    let namesData = roley[1];
    let roleArray = roley[2];
    let rolesData = roley[3];
    console.log(fullNames,roleArray);
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'fullName',
            message: "Which employee's role do you want to update?",
            choices: fullNames
        },
        {
            type: 'list',
            name: 'newRole',
            message: "Which role do you want to assign to the selected employee?",
            choices: roleArray
        }
    ])
    .then((answer) => {
        console.log(answer)
        const selectName = answer.fullName;
        const selectRole = answer.newRole;
        let nameID;
        namesData.forEach(entry => {
            if (selectName === (entry.first_name + " " + entry.last_name)){
                nameID = entry.id
                console.log(nameID)
            };
        });
        let roleID;
        rolesData.forEach(entry => {
            if (selectRole === (entry.title)){
                roleID = entry.id
                console.log(roleID)
            };
        });

        db.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${nameID}`);
        console.log(`updated employees role`);
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
  
function viewEmployees(){
    db.query(`SELECT e.id, e.first_name, e.last_name, title, name AS department, salary, m.first_name AS manager
                FROM employee e 
                LEFT OUTER JOIN employee m ON m.id = e.manager_id
                JOIN role ON e.role_id = role.id 
                JOIN department ON department.id = role.department_id`
                , (err, result) => {
        if (err){
            console.log(err);
            return;
        }
        console.table(result);
        questions();
});

}

function viewRequests(request){
    const selection = request.options;
    if (selection === "View All Employees"){
        viewEmployees()
        return;
        };
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
    if (selection === "Add Employee"){
        console.log("New Employee selected");
        addEmployee();
    }
    if (selection === "Update Employee Role"){
        console.log("Updating employee");
        let roles = getArray1()
        console.log(roles);
        // updateRole(roles);
    }
    if (selection === "Quit"){
        console.log("Goodbye")
        return;
    }


    else {
        console.log('No return')
    }
};