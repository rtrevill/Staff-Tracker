
class Questions{

listQuestions = function(){
    const mainQList = [
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

};


module.exports = Questions