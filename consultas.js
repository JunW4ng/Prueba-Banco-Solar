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

module.exports = { insertar };
