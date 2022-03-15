require("dotenv").config()
const PORT = process.env.PORT || 3001;
const mysql = require('mysql2');
const inquirer = require("inquirer")

const connection = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.PASSWORD,
    database: 'employees',
    port: '8889'
  }
)


// ARRAYS TO HOLD CONST VALUES
let roleArr = [];
let managerArr = [];
let employeesArr = [];
let departmentArr = [];



const getEmployees = () => {
  return connection.query(
    "SELECT firstName, lastName, employeeId FROM employee WHERE managerId IS NOT NULL",
    (err, res) => {
      if (err) throw err;
      res.forEach((employee) => {
        employeesArr.push({
          name: `${employeesArr.firstName} ${employeesArr.lastName}`,
          value: employeesArr.employeeId,
        });
      });
    }
  );
};
// BEGIN INQUIRER PROMPTS
const runApp = () => {
// update arrays with current data
getEmployees();
getRole();
getManager();
getDept();
console.log(roleArr, managerArr, departmentArr, employeesArr)

// call inquirer prompts
return inquirer
  .prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
      "Department Options",
      "Role Options",
      "Employee Options",
      "End",
    ],
  }).then(answer => {  
    switch (answer.action) {
        case "Department Options":
          return inquirer
            .prompt({
              name: "department_options",
              type: "rawlist",
              message: "DEPARTMENTS:  What would you like to do?",
              choices: [
                "View all departments",
                "Add a department",
                "Delete a department",
                "Go back"],
              // *** department options logic
            })
            .then((answer) => {
              switch (answer.department_options) {
                case "View all departments":
                  viewDepartments();
                  break;

                case "Add a department":
                  addDepartment();
                  break;

                case "Delete a department":
                  deleteDepartment();
                  break;

                case "Go back":
                  runApp();
                  break;
              }
            });
// ***** Role Options
     case "Role Options":
      return inquirer
        .prompt({
          name: "role_options",
          type: "rawlist",
          message: "ROLES:  What would you like to do?",
          choices: [
            "View all roles",
            "Add a role",
            "Go back",
          ],
        })
        .then((answer) => {
          switch (answer.role_options) {
            case "View all roles":
              viewRoles();
              break;
            case "Add a role":
              addRole();
              break;
            case "Go back":
              runApp();
              break;
          }
        });
// Employee Options
case "Employee Options":
  return inquirer
    .prompt({
      name: "employee_options",
      type: "rawlist",
      message: "EMPLOYEES:  What would you like to do?",
      choices: [
        "View all employees",
        "View all employees by role",
        "View employees by manager",
        "Add an employee",
        "Update an employee's role",
        "Go back",
      ],
      // *** Employee options logic
    })
    .then((answer) => {
      switch (answer.employee_options) {
        case "View all employees":
          viewEmployees();
          break;

        case "View all employees by role":
          viewEmplByRole();
          break;

        case "View employees by manager":
          viewEmplByManager();
          break;
        case "Add an employee":
          addEmployee();
          break;

        case "Update an employee's role":
          updateEmployee();
          break;

        case "Go back":
          runApp();
          break;
      }
    });
  case "End":
    return 0;
  }
  }).catch(err => console.log(err))
};

connection.connect(
  function(e){
    if (e) console.log(e)
    return runApp()
    .then(res=> {
      console.log(res)
      if (res === 0){
      process.exit(0)}
    })
  }
) 


// FUNCTIONS TO PULL/EDIT DATA FROM TABLES

// ** Department functions **
const getDept = () => {
  return connection.query(
    "SELECT * FROM department",
    (err, res) => {
      if (err) throw err;
      console.log(res)
      res.forEach((department) => {
        console.log(department)
        departmentArr.push({
          name: `${department.departmentName}`,
          value: department.departmentId,
        });
      });
    }
  );
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department;", (err, res) => {
    if (err) throw err;
    console.log(`\nDepartments:\n`);
    console.table(res);
    runApp();
  });
};

const addDepartment = () => {
  // prompt user to enter new department info
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the department's name?",
      },
    ])
    .then((res) => {
      connection.query(
        "INSERT INTO department SET ? ",
        {
          departmentName: res.name,
        },
        (err) => {
          if (err) throw err;
          console.log(`\nNew Department added! Values are:\n`);
          console.table(res);
          runApp();
        }
      );
    });
};
const deleteDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "name",
          type: "list",
          message: "What is the department's name?",
          choices: departmentArr,
        },
      ])
      .then((res) => {
        connection.query(
          "DELETE FROM department WHERE ? ",
          {
            name: res.name,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`\nDepartment deleted!\n`);
            runApp();
          }
        );
      });
  });
};



// ** Role functions **
// view roles in a table
const viewRoles = () => {
  connection.query("SELECT * FROM role;", (err, res) => {
    if (err) throw err;
    console.log(`\nRoles:\n`);
    console.table(res);
    runApp();
  });
};
// push roles into the roleArr
const getRole = () => {
  return connection.query("SELECT * FROM role;", (err, res) => {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
};
const addRole = () => {
  // prompt user to enter new role
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the role's title?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the role's salary?",
      },
      {
        name: "department_id",
        type: "list",
        message: "What is the role's department?",
        choices: departmentArr,
      },
    ])
    .then((res) => {
      connection.query(
        "INSERT INTO role SET ? ",
        {
          title: res.title,
          salary: res.salary,
          departmentId: res.departmentId,
        },
        (err) => {
          if (err) throw err;
          console.log(`\nNew Role added! Values are:\n`);
          console.table(res);
          runApp();
        }
      );
    });
};
const getManager = () => {
 return  connection.query(
    "SELECT firstName, lastName, employeeId FROM employee WHERE managerId IS NULL",
    (err, res) => {
      if (err) throw err;
      res.forEach((manager) => {
        managerArr.push({
          name: `${manager.firstName} ${manager.lastName}`,
          value: manager.employeeId,
        });
      });
    }
  );
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employees's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employees's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employees's role?",
        choices: roleArr,
      },
      {
        name: "manager_choice",
        type: "list",
        message:
          "Who is the employees's manager? Keep blank if this employee is a manager.",
        choices: [...managerArr, { name: 'None', value: null } ],
      },
    ])
    .then((res) => {
      const manager = managerArr.length ? res.manager_choice : null
     console.log(res.manager_choice)
      console.log(manager)
      connection.query(
        "INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES (?, ?, ?, ?);",
        [
          res.firstName,
          res.lastName,
          roleArr.indexOf(res.role) + 1,
          manager,
        ],
        (err, res) => {
          if (err) throw err;
          console.log(`\nEmployee added!\n`);
          runApp();
        }
      );
    });
};

