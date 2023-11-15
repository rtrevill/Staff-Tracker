const mysql = require('mysql2');

//Enables mysql to communicate with the employees_db database

const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '{rgh>fl@YOkUPL3O>+SN',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  module.exports = connection;