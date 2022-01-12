const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "Junjie1995",
  database: "bancosolar",
  port: 5432,
};

const pool = new Pool(config);

//? Agrega nuevo usuario
const insertar = async (datos) => {
  const consulta = {
    text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *;",
    values: datos,
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (err) {
    console.log(`ERROR CODIGO: ${err.code},`, err);
    return err;
  }
};

//? Muestra usuarios con sus balances
const consulta = async () => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    return result.rows;
  } catch (err) {
    console.log(err.code);
    return err;
  }
};

//? Edita datos de usuario y balance
const editar = async (datos, id) => {
  const consulta = {
    text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = ${id} RETURNING *;`,
    values: datos,
  };
  try {
    const result = await pool.query(consulta);
    console.log(result.rows[0]);
  } catch (err) {
    console.log(err.code);
    return err;
  }
};

module.exports = { insertar, consulta, editar };
