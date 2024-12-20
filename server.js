const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json()); //display data in json format

//Middleware
app.use(cors());

//Creating connection with MYSQL
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'lolboynoob12',
    database: 'HrSystem'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});


app.get('/', (req,res) => {
    const sql = "SELECT * FROM employee";
    db.query(sql, (err, data) => {
        if(err) return res.json(err); //if condition(err) is true, so give err in response
        return res.json(data); //else give data in response
    })
}); //API to get data from database

app.post('/add-employee', (req, res) => {
    const sql = "INSERT INTO employee(`first_name`, `last_name`, `em_email`, `em_address`, `em_status`, `em_gender`, `em_phone`, `em_birthday`, `em_salary`) VALUES (?)";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.address,
        req.body.status,
        req.body.gender,
        req.body.number,
        req.body.dateSelected,
        req.body.salary
    ]
    db.query(sql, [values], (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
}); //API to submit data into the database

app.put('/update/:id', (req, res) => {
    const sql = "UPDATE employee set `first_name` = ?, `last_name` = ?, `em_email` = ?, `em_address` = ?, `em_status` = ?, `em_gender` = ?, `em_phone` = ?, `em_birthday` = ?, `em_salary` = ? WHERE employee_id = ?";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.address,
        req.body.status,
        req.body.gender,
        req.body.number,
        req.body.dateSelected,
        req.body.salary
    ]
    const id = req.params.id;

    db.query(sql, [...values, id], (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
}); //API to update data into the database

app.delete('/employee/:id', (req, res) => {
    const sql = "DELETE from employee WHERE employee_id = ?";

    const id = req.params.id;

    db.query(sql, [id], (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.get('/show/:id', (req,res) => {
    const sql = "SELECT * FROM employee WHERE employee_id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if(err) return res.json(err); //if condition(err) is true, so give err in response
        return res.json(data); //else give data in response
    })
}); //API to get data from database

//employee salary
app.get('/invoice/:id', (req, res) => {
    // Query to get employee's base salary, paid and unpaid leaves
    const sql = `SELECT employee_id, first_name, last_name, em_salary, paid_leaves, unpaid_leaves
                 FROM employee WHERE employee_id = ?`;
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (data.length > 0) {
            return res.json(data[0]); // Send back the first row (since it should only return one employee)
        } else {
            return res.status(404).json({ message: "Employee not found" });
        }
    });
});



//search employee
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    const sql = "SELECT * FROM employee WHERE first_name LIKE ? OR last_name LIKE ? OR em_email LIKE ? OR employee_id LIKE ?";
    const values = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


app.listen(3000, () => {
    console.log("Listening..");
});