DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
  departmentId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  departmentName VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  roleId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL UNSIGNED  NOT NULL,
  departmentId INT UNSIGNED,
  -- INDEX department_ind (departmentId),
  -- CONSTRAINT fk_department 
  FOREIGN KEY (departmentId) REFERENCES department(departmentId)
  -- ON DELETE SET NULL
  -- ON UPDATE CASCADE
);

CREATE TABLE employee (
  employeeId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(30) NOT NULL,
  roleId INT UNSIGNED NOT NULL,
  -- INDEX role_ind (roleId),
  -- CONSTRAINT fk_role 
  FOREIGN KEY (roleId) REFERENCES role(roleId) 
  -- ON DELETE CASCADE 
  -- ON UPDATE CASCADE,
  managerId INT UNSIGNED, 
  -- INDEX man_ind (managerId),
  -- CONSTRAINT fk_manager 
  FOREIGN KEY (managerId) REFERENCES employee(employeeId)
  -- ON DELETE SET NULL 
  -- ON UPDATE CASCADE
);

