const data = {
    employees: require('../models/employees.json'),
    setEmployees: function (data) { this.employees = data }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(404).json({ "message": "Employee not found." })
    }
    res.status(200).json({
        "message": "Employee found",
        data: employee
    })
};

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees.length ? data.employees[data.employees.length - 1].id + 1 : 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    if (!newEmployee.firstName || !newEmployee.lastName) {
        return res.status(400).json({ "message": "First and last names are required." })
    }

    const duplicate = data.employees.find(emp => emp.firstname === newEmployee.firstName && emp.lastname === newEmployee.lastName);
    if (duplicate) {
        return res.status(409).json({ "message": "Employee already exists." })
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json({
        "message": "New employee successfully added",
        "data": data.employees,
    })
};

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(404).json({ "message": "Employee does not exist." })
    }

    const { firstName, lastName } = req.body
    if (firstName) {
        employee.firstName = firstName
    }
    if (lastName) {
        employee.lastName = lastName
    }

    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a, b) => a.id - b.id));
    res.status(200).json({
        "message": "Employee data successfully updated",
        "data": data.employees,
    })
};

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(404).json({ "message": "Employee does not exist." })
    }
    const filteredArr = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees(filteredArr);

    res.status(200).json({
        "message": "Successfully removed employee data",
        "data": data.employees,
    })
};

module.exports = {
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
}