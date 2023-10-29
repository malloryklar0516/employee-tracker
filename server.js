const connection = require('./config/connection.js');
const inquirer = require('inquirer');
// Import and require mysql2
//const mysql = require('mysql2/promise');
//const validate = require ('validate');

// Connect to database
connection.connect();


//prompt user with options
const promptUser = () => {
    inquirer.prompt([
        {
            name: 'choices', 
            type: 'list', 
            message: 'Please select a search filter option',
            choices: [
                'View all employees',
                'View all roles',
                'View all departments',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Update Employee Role'
            ]
        }
    ])
    .then((answers) => {
        const {choices} = answers;
        if (choices === 'View all employees')
        {
            viewAllEmployees();
        }
        if (choices === 'View all departments'){
            viewAllDepartments();
        }
        if (choices === 'View all roles'){
            viewAllRoles();
        }
        if (choices === 'Add Role') {
            addRole();
        }
        if (choices === 'Add Employee') {
            addEmployee();
        }
        if (choices === 'Add Department') {
            addDepartment();
        }
        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }
    })
};
promptUser();
//check
const viewAllEmployees = () => {
    let sql =       `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.dept_name AS 'department', 
                    role.salary, 
                    manager_id
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      console.log(`Current Employees:`);
      console.table(response);
      promptUser();
    });
  };
  //shows user all roles
const viewAllRoles = () => {
    console.log (`Current Roles`);
    let sql = `SELECT role.id, role.title, department.dept_name AS department 
    FROM role 
    INNER JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        response.forEach((role)=> {
            console.log(role.title);
           
        })
        promptUser();
    }) 
  }
  //shows user all departments

  const viewAllDepartments = () => {
    let sql = `SELECT department.id AS id, department.dept_name AS department FROM department`;
    connection.query(sql, (error, response)=> {
        if (error) throw error;
        console.log(`All Departments:`);
        console.table(response);
        promptUser();
    });
  }
  // allows user to add a department 
  const addDepartment = ()=> {
    inquirer.prompt([
        {
            type: 'input', 
            name: 'newDepartment',
            message: 'Enter Department Name:'

        }
    ])
    .then((answer)=>{
        let sql = `INSERT INTO department (dept_name) VALUES (?)`
        connection.query(sql, answer.newDepartment, (error, response)=>{
            if (error) throw error; 
            console.log(answer.newDepartment + ` successfully added to departments`);
            viewAllDepartments();
        })
    })
  };
// adds employee
  const addEmployee = ()=> {
    inquirer.prompt([
        {
            type: 'input', 
            name: 'firstName',
            message: 'Enter Employee First Name:'

        }, 
        {
            type: 'input', 
            name: 'lastName',
            message: 'Enter Employee Last Name:'
 
        }
    ])
    .then((answer)=> {
        const newName = [answer.firstName, answer.lastName];
        let newRoleSql = `SELECT role.id, role.title FROM role`
        connection.query(newRoleSql,(error, response)=> {
            if (error) throw error; 
            const roleData = response.map(({id, title}) => ({name: title, value: id}));
            inquirer.prompt([
                {type: 'list',
                name: 'role',
                message: `What is the employee's role?`,
                choices: roleData
            }
            ])
            .then((employeeRole)=> {
                const role = employeeRole.role; 
                newName.push(role);
                const newManagerSql = `SELECT * FROM employee`; 
                connection.query(newManagerSql, (error, data) => {
                    if (error) throw error; 
                    const employees = data.map(({id, first_name, last_name})=> ({name: first_name + " " + last_name, value: id}));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: employees
                        }
                    ])
                    .then(employeeManager => {
                        const manager = employeeManager.manager;
                        newName.push(manager);
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES (?,?,?,?)`;
                        connection.query(sql, newName, (error) => {
                            if (error) throw error; 
                            console.log("Employee added successfully");
                            viewAllEmployees();
                        })
                    })
                })
                

            })


        })
    })
  }
//prompts for title salary and department for role and adds role to database
  const addRole = () => {
    const sql = `SELECT * FROM department`
    connection.query(sql, async function  (error, response) {
        if (error) throw error;
        let departments = [];
        response.forEach((department)=> {departments.push(department.dept_name)});
        departments.push(`Create Department`);
        inquirer.prompt([
            {type: 'list',
            name: 'departmentName',
        message:'Which department is this new role for?',
        choices: departments
        }
        ])
        .then((answer)=>{
            if(answer.departmentName ==='Create Department'){
                addDepartment();
            }
            else {
                addRole2(answer);
            }
        });
        const addRole2 = (departmentInfo) =>{
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: "What is the name of the role?",
                }, 
                {
                    type: 'input', 
                    name: 'salary',
                    message: "What is the salary?",
                }
            ])
            .then((answer)=> {
                let newRoleName = answer.roleTitle;
                let departmentId;
                response.forEach((department) =>{
                    if(departmentInfo.departmentName === department.dept_name)
                    {departmentId=department.id}
                });
                let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                let roleInfo = [newRoleName, answer.salary, departmentId];
                connection.query(sql, roleInfo, (error)=>{
                    if (error) throw error;
                    console.log(`Role created successfully`);
                    promptUser();
                })

            })
        }
    })}

// updates existing employee role
const updateEmployeeRole= () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role
    WHERE role.id = employee.role_id`;
    connection.query(sql, (error, response)=> {
        if (error) throw error; 
        let namesArray = [];
        response.forEach((employee)=> {namesArray.push(`${employee.first_name} ${employee.last_name}`)});
        console.log(namesArray);
        const employees1 = response.map(({id, first_name, last_name})=> ({name: first_name + " " + last_name, value: id}));
        console.log(employees1);
        let sql = `SELECT role.id, role.title FROM role`;
        
        connection.query(sql, (error, response)=> {
            if (error) throw error;
            let jobs = [];
            response.forEach((role)=> {jobs.push(role.title)});
            console.log(jobs);
            const jobs1 = response.map(({id, title})=> ({name: title, value: id}));
            inquirer.prompt([
                {
                    type: "list", 
                    name: "updateEmp", 
                    message: "Which employee's role are you updating?", 
                    choices: namesArray
                }, 
                {
                    type: 'list',
                    name: 'newRole', 
                    message: 'What is their new role?', 
                    choices: jobs
                }
            ])
             .then((answer)=> {
                let currentEmployee = answer.updateEmp;
                let updatedRole = answer.newRole;
                let empId;
                let newRoleId;
                employees1.forEach((employee)=>{
                    if(currentEmployee === employee.name) {
                         empId = employee.value;

                    }
                });
                jobs1.forEach((role)=>{
                    if(updatedRole === role.name) {
                         newRoleId = role.value;
                    }
                });

                let sql = `UPDATE employee  SET role_id = ${newRoleId} WHERE employee.id =  ${empId}`;
                    connection.query(sql, (error, response) => {
                        if (error) throw error;
                    });
     
           
    

             }
            )
        })
    
    })
    
}