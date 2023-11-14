class Questions{

listQuestions = function(){
    const mainQList = [
        {
            type: 'list',
            name: 'options',
            message: 'what would you like to do? (Use arrow keys)',
            choices: [
                "View All Employees",
                "View employees by manager",
                "View employees by department",
                "Add Employee",
                "Delete Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "Delete Role",
                "View All Departments",
                "Add Department",
                "Delete Department",
                "Update employee managers",
                "Quit"
            ]
        }
    ]
    return mainQList;
};

addEmployQuestions = function(roleArray, manArray){
    const employQuest = [
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
    ]
    return employQuest;
};

addRollQuestions = function(departmentArray){
    const roleQuest = [
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
    ]
    return roleQuest;
};

addDeptQuestions = function(){
    const deptQuest = [
        {
            type: 'input',
            name: 'newDepart',
            message: 'What is the name of the department?'
        }
    ]
    return deptQuest;
};

updateRoleQuestions = function(nameArray, roleArray){
    const upRoleQuest = [
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
    ]
    return upRoleQuest;
};

newManagerQuestions = function(employFullName, manFullNames){
    const updMan = [
        {
            type: 'list',
            name: 'employee',
            message: "Which employee would you like to choose a new manager for?",
            choices: employFullName
        },
        {
            type: 'list',
            name: 'Manager',
            message: 'Who is the new manager?',
            choices: manFullNames
        }
    ]
    return updMan;
};

deleteEmployeeQuestions = function(fullNames){
    const delEmp = [
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to delete?',
            choices: fullNames
        }
    ]
    return delEmp;
};

deleteRoleQuestions = function(roleArray){
    const delRole = [
        {
            type: 'list',
            name: 'role',
            message: 'Which role would you like to delete?',
            choices: roleArray
        }
    ]
    return delRole;
};

deleteDepartQuestions = function(departmentArray){
    const delDep = [
        {
            type: 'list',
            name: 'department',
            message: 'Which department would you like to delete?',
            choices: departmentArray
        }
    ]
    return delDep;
};

};


module.exports = Questions