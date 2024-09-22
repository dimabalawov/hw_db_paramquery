const express = require('express');
const sql = require('mssql');

const app = express();
const port = 8080;

const config = {
  user: 'new_user',
  password: 'secure_password',
  server: 'localhost',
  database: 'Library',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};


async function executeQuery(query) {
  try {
    await sql.connect(config);
    const result = await sql.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Error executing query: ', err);
    return [];
  } finally {
    await sql.close();
  }
}


app.get('/api/:action', async (req, res) => {
  const action = req.params.action;
  const param = req.query.param;

  let query = '';

  switch (action) {
    case 'allBooks':
      query = 'SELECT * FROM dbo.Books';
      break;
    case 'booksByAuthor':
      query = `SELECT * FROM dbo.Books WHERE Id_Author= (SELECT ID FROM dbo.Authors WHERE Name = '${param}')`;
      break;
    case 'booksByPress':
      query = `SELECT * FROM dbo.Books WHERE Id_Press = (SELECT ID FROM dbo.Press WHERE Name = '${param}')`;
      break;
    case 'allStudents':
      query = 'SELECT * FROM dbo.Students';
      break;
    case 'studentsByGroup':
      query = `SELECT * FROM dbo.Students WHERE Id_Group = (SELECT ID FROM dbo.Groups WHERE Name = '${param}')`;
      break;
    case 'allTeachers':
      query = 'SELECT * FROM dbo.Teachers';
      break;
    case 'allFaculties':
      query = 'SELECT * FROM dbo.Faculties';
      break;
    default:
      return res.status(400).send('Unknown action');
  }

  const result = await executeQuery(query);
  res.json(result);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
