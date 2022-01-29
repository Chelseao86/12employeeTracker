require("dotenv").config()
const PORT = process.env.PORT || 3001;
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.PASSWORD,
    database: 'employees'
  }
)


async function start() {
  // Connect to database
  console.log('starting work')
  console.log('we have connected  checking for db');
  db.query(`SELECT *
  FROM information_schema.tables
  WHERE table_schema = employees
  AND table_name = department`, null, (err, res) => {
    if (err) console.log(err)
    else console.log(res)
  });
};

start()

// ARRAYS TO HOLD CONST VALUES
let roleArr = [];
let managerArr = [];
let employeesArr = [];
let departmentArr = [];

// BEGIN INQUIRER PROMPTS
const runApp = () => {
// update arrays with current data
getEmployees();
getRole();
getManager();
getDept();
// call inquirer prompts
inquirer
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
  })

     // ***** Department Options
     .then((answer) => {
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
  return;
}
});
};

// FUNCTIONS TO PULL/EDIT DATA FROM TABLES

// ** Department functions **
const getDepts = () => {
  connection.query(
    "SELECT * FROM department",
    (err, res) => {
      if (err) throw err;
      res.forEach((department) => {
        departmentArr.push({
          name: `${department.name}`,
          value: department.id,
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
          name: res.name,
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
const getRoles = () => {
  connection.query("SELECT * FROM role;", (err, res) => {
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
          department_id: res.department_id,
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
        // "Update employee managers",
        "Add an employee",
        "Update an employee's role",
        // "Delete an employee",
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
  return;
}
});
};


// FUNCTIONS TO PULL/EDIT DATA FROM TABLES
// ** Department functions **
const getDepts = () => {
  connection.query(
    "SELECT * FROM department",
    (err, res) => {
      if (err) throw err;
      res.forEach((department) => {
        departmentArr.push({
          name: `${department.name}`,
          value: department.id,
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
          name: res.name,
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
const getRoles = () => {
  connection.query("SELECT * FROM role;", (err, res) => {
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
          department_id: res.department_id,
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

// ** Employee functions **
const viewEmployees = () => {
  connection.query("SELECT * FROM employee;", (err, res) => {
    if (err) throw err;
    console.log(`\nEmployees:\n`);
    console.table(res);
    runApp();
  });
};

const addEmployee = () => {
  // prompt user to enter new employee info
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employees's first name?",
      },
      {
        name: "last_name",
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
        choices: managersArr,
      },
    ])
    .then((res) => {
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
        // for roles and managers, we get the index value of their appropriate arr and add 1 to get the actual id number
        [
          res.first_name,
          res.last_name,
          roleArr.indexOf(res.role) + 1,
          managersArr.indexOf(res.manager_choice) + 1,
        ],
        (err, res) => {
          if (err) throw err;
          console.log(`\nEmployee added!\n`);
          runApp();
        }
      );
    });
};
const getManagers = () => {
  connection.query(
    "SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL",
    (err, res) => {
      if (err) throw err;
      res.forEach((manager) => {
        managersArr.push({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        });
      });
    }
  );
};

const getEmployees = () => {
  connection.query(
    "SELECT first_name, last_name, id FROM employee WHERE manager_id IS NOT NULL",
    (err, res) => {
      if (err) throw err;
      res.forEach((employee) => {
        employeeArr.push({
          name: `${employeeArr.first_name} ${employeeArr.last_name}`,
          value: employeeArr.id,
        });
      });
    }
  );
};

const viewEmplByRole = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    (err, res) => {
      if (err) throw err;
      console.log(`\nEmployees by Role:\n`);
      console.table(res);
      runApp();
    }
  );
};

const viewEmplByManager = () => {
  getManagers();
  inquirer
    .prompt([
      {
        name: "manager_choice",
        type: "list",
        message: "Which manager?",
        choices: managersArr,
      },
    ])
    .then((res) => {
      connection.query(
        "SELECT employee.first_name, employee.last_name FROM employee WHERE manager_id=? ",
        [res.manager_choice],
        (err, res) => {
          if (err) throw err;
          console.log(`\nEmployees by ${res.manager_choice}:\n`);
          console.table(res);
          runApp();
        }
      );
    });
  };