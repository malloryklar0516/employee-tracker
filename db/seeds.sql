INSERT INTO department (dept_name)
VALUES
    ("Human Resources"),
    ("Finance"),
    ("Accounting"),
    ("Compliance"),
    ("Legal"),
    ("Marketing"),
    ("IT");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES
("HR Associate", 90000.00, 1),
("Finance Analyst", 120000.00, 2),
("Accounting VP", 200000.00, 3), 
("Compliance Associate", 170000.00, 4),
("Marketing Analyst", 60000, 6),
("Senior Software Engineer", 180000,7),
("General Counsel", 300000.00, 5),
("Audit Analyst",80000.00,3),
("Legal Associate", 140000.00,5),
("Finance Director", 250000.00,2), 
("General Manager", 150000.00, 1);


SELECT * FROM role;
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
("Will", "Smith", 2, 11),
("Hannah", "Wales", 1, 4),
("Julia", "Cohen", 3, 11),
("Max", "Samuels", 4, 11),
("Scott", "Daniels", 10, 11),
("Daniel", "Brooks", 7, 11),
("Meredith", "Gray",9, 7),
("Sydney", "Green", 8, 3), 
("Justin", "Swift", 6, 11), 
("Heather", "Hane", 5, 11),
("Mike", "Miller", 10, 11);
