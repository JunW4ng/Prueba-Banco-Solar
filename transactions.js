const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "Junjie1995",
  database: "bancosolar",
  port: 5432,
};

const pool = new Pool(config);

//? Registro de transferencia
const registroTransferencias = async (datos) => {
  try {
    const fecha = new Date();
    const consultaEmisor = {
      text: "SELECT id FROM usuarios WHERE nombre = $1",
      values: [datos[0]],
    };
    const consultaIdEmisor = await pool.query(consultaEmisor);
    const idEmisor = consultaIdEmisor.rows[0].id;
    const consultaReceptor = {
      text: "SELECT id FROM usuarios WHERE nombre = $1",
      values: [datos[1]],
    };
    const consultaIdReceptor = await pool.query(consultaReceptor);
    const idReceptor = consultaIdReceptor.rows[0].id;
    const consultaRegistro = {
      text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4) RETURNING *;",
      values: [idEmisor, idReceptor, datos[2], fecha],
    };
    await pool.query(consultaRegistro);
  } catch (err) {
    console.log("registroTransferencia", err.code);
    return err;
  }
};

//? Transferencia de balance
const transferencia = async (datos) => {
  pool.connect(async (err_conexion, client, release) => {
    if (err_conexion) return console.log(err_conexion.code);
    try {
      await registroTransferencias(datos);
      await client.query("BEGIN");
      const descontar = {
        text: "UPDATE usuarios SET balance = balance - $2 WHERE nombre = $1 RETURNING *;",
        values: [datos[0], datos[2]],
      };
      await client.query(descontar);
      const acreditar = {
        text: "UPDATE usuarios SET balance = balance + $2 WHERE nombre = $1 RETURNING *;",
        values: [datos[1], datos[2]],
      };
      await client.query(acreditar);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      console.log("Error codigo: " + err.code);
      console.log("Detalle del error" + err.detail);
      console.log("Tabla originaria del error: " + err.table);
      console.log("Restriccion violada en el campo: " + err.constraint);
    }
    release();
    pool.end();
  });
};

module.exports = { transferencia };
