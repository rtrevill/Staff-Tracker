const mysql = require('mysql2');
const inquirer = require('inquirer');

const Queries = require('./queries');
const Questions = require('./questions');


function questions(){
    inquirer
        .prompt(new Questions().listQuestions())
        .then((answer) => {
            viewRequests(answer)
        })
        .catch((err) => {
            console.log(err)
        })

};

function employeeAndRole(){
    let nameArray = [];
    let nameDetails = [];
    let roleArray = [];
    let roleDetails = [];
    let array2Send = [];
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, result) => {
            if (result){
                nameDetails = [...result];
                result.forEach(item => {
                    let fullName = (item.first_name + " " + item.last_name);
                    nameArray.push(fullName);
                })
                return;
            }
            else
            console.log(err);
        });
    db.query(`SELECT id, title FROM role`, (err, result) => {
        if (result){
            roleDetails = [...result];
            result.forEach(item => {
                let roleTitle = (item.title);
                roleArray.push(roleTitle);
            })
            if ((nameArray)&&(roleArray)){
                array2Send.push(nameArray, nameDetails, roleArray, roleDetails);
                updateRole(array2Send);
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
        const deptName = answer.newDepart;
        db.query(`INSERT INTO department (name) VALUES ("${deptName}")`);
        console.log(`added ${deptName} to the database`);
        questions();
    })
    .catch((err) => {
        console.log(err)
    })

};


function getDeptDetails(){
    let departmentArray = [];
    let deptDetails = [];
    db.query(`SELECT id, name FROM department`, (err, result) => {
        if (result){
            deptDetails = [...result];
            result.forEach(departm => {
                let x = departm.name;
                departmentArray.push(x);
            });
            let completeDeptArray = [];
            completeDeptArray.push(departmentArray, deptDetails);
            addRole(completeDeptArray);
            return;
        }
        else
            console.log(err);
    });
};


function addRole(deptArrays){
    const[departmentArray, deptDetails] = deptArrays;
    

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
        const roleName = answer.newRole;
        const roleSal = answer.roleSalary;
        const roleDept = answer.roleDept;
        let roleID;
        deptDetails.forEach(entry => {
            if (roleDept === entry.name){
                roleID = entry.id
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


function roleAndManagerDetails(){
    let roleArray=[];
    let roleDetails=[];
    let manArray=[];
    let manDetails=[];
    let arrayToSend=[];

    db.query(`SELECT id, title FROM role`, (err, result) => {
        if (result){
            roleDetails = [...result];
            result.forEach(element => {
                let x = element.title;
                roleArray.push(x);
            });
            return;
        }
        else
            console.log(err);
    })

    db.query(`SELECT id, first_name, last_name FROM employee`, (err, result) => {
        if (result){
            manDetails = [...result];
            result.forEach(item => {
                let x = (item.first_name + " " + item.last_name);
                manArray.push(x);
                })
                if ((roleArray)&&(manArray)){
                    arrayToSend.push(roleArray, roleDetails, manArray, manDetails);
                    addEmployee(arrayToSend);   
                }   
            return;
        }
        else
        console.log(err);
    })

};



function addEmployee(data){
    const [roleArray, roleDetails, manArray, manDetails] = data;

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
        .then(questions())
        .catch(err => console.log(err));
    })
    .catch((err) => {
        console.log(err)
    });

};

function updateRole(data){
    const [nameArray, nameDetails, roleArray, roleDetails] = data;

    inquirer
    .prompt([
        {
            type: 'list',
            name: 'fullName',
            message: "Which employee's role do you want to update?",
            choices: nameArray
        },
        {
            type: 'list',
            name: 'newRole',
            message: "Which role do you want to assign to the selected employee?",
            choices: roleArray
        }
    ])
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

        db.promise().query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${nameID}`)
        .then(console.log(`updated employees role`))
        .then(questions())
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
    
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
  
function viewEmployees(){

    // const employ = queries.employees()
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
        new Queries.sqlQueries().viewRoles()
        setTimeout(() => questions(),100);
        return;       
    }
    if (selection === "Add Department"){
        addDepartment();
        return;
    }
    if (selection === "Add Role"){
        getDeptDetails();
        return;
    }
    if (selection === "Add Employee"){
        roleAndManagerDetails();
        return;
    }
    if (selection === "Update Employee Role"){
        employeeAndRole()
        return;
    }
    if (selection === "Quit"){
        console.log("Goodbye");
        process.exit();
    }
    else {
        console.log('No return')
    }
    return;
}

module.exports = {
    addRole,
    questions
}