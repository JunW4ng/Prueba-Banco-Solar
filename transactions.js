const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "Junjie1995",
  database: "bancosolar",
  port: 5432,
};

const pool = new Pool(config);

//? Elimina el elemento del medio
const eliminarElemento = (a, index) => {
  let newArray = [...a];
  newArray.splice(index, 1);
  //console.log(newArray); //! BORRAR
  return newArray;
};

//? Transferencia de balance
const transferencia = async (datos) => {
  pool.connect(async (err_conexion, client, release) => {
    if (err_conexion) return console.log(err_conexion.code);

    //console.log(datos); //! Borrar
    //console.log(datos.slice(-2)); //! BORRAR

    try {
      await client.query("BEGIN");

      //TODO Colocar logica de registro de transferencias
      //! Cambiar condicion id = id
      const descontar = {
        text: "UPDATE usuarios SET balance = balance - $2 WHERE nombre = $1 RETURNING *;",
        values: eliminarElemento(datos, 1), //TODO datos[0], datos[1], datos[2]
      };
      await client.query(descontar);

      const acreditar = {
        text: "UPDATE usuarios SET balance = balance + $2 WHERE nombre = $1 RETURNING *;",
        values: datos.slice(-2),
      };
      await client.query(acreditar);

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      console.log(err);
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

//? Registra transferencias
//TODO relacionar
/*const registroTransferencia = async (datos) => {
   const consulta = {
    text: "INSERT INTO transferencias (emisor, receptor, monto) VALUES ($1, $2, $3) RETURNING *;",
    values: datos,
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
}; */

//await registroTransferencia(datos); //TODO relacionar
