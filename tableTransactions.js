const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "Junjie1995",
  database: "bancosolar",
  port: 5432,
};

const pool = new Pool(config);

//? Prepared Statement
const generarQuery = (name, rowMode, text, values) => ({
  name,
  rowMode,
  text,
  values,
});

//? Mostrar transferencias en tabla
const registroTablaTransferencia = async () => {
  const sqlQuery =
    "SELECT x.fecha, x.nombre, y.nombre_receptor, y.monto FROM (SELECT * FROM usuarios INNER JOIN transferencias ON usuarios.id = transferencias.emisor) AS x INNER JOIN (SELECT nombre AS nombre_receptor, receptor, monto FROM usuarios INNER JOIN transferencias ON usuarios.id = transferencias.receptor) AS y ON x.emisor != y.receptor";
  const rowMode = "array";
  const values = [];
  try {
    const res = await pool.query(
      generarQuery("consulta_tabla_transferencias", rowMode, sqlQuery, values)
    );
    return res.rows;
  } catch (err) {
    console.log("registroTablaTransferencia", err.code);
    return err;
  }
};

module.exports = { registroTablaTransferencia };
