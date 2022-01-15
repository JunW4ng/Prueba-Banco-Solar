const http = require("http");
const fs = require("fs");
const url = require("url");
const port = 3000;
const { insertar, consulta, editar, eliminar } = require("./userQuery");
const { transferencia } = require("./transactions");
const { registroTablaTransferencia } = require("./tableTransactions");

http
  .createServer(async (req, res) => {
    //? Levanta la pagina
    if (req.url == "/" && req.method == "GET") {
      res.writeHeader(200, "content-type", "text/html");
      fs.readFile("index.html", "utf8", (err, appBanco) => {
        err
          ? console.log("Error al cargar la pagina")
          : console.log("Pagina OK");
        res.end(appBanco);
      });
    }

    //? Agrega nombre y balance
    if (req.url == "/usuario" && req.method === "POST") {
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const respuesta = await insertar(datos);
        res.end(JSON.stringify(respuesta));
      });
    }

    //? Muestra usuarios con sus balances
    if (req.url == "/usuarios" && req.method === "GET") {
      const registros = await consulta();
      res.end(JSON.stringify(registros));
    }

    //? Edita usuarios con sus balances
    if (req.url.startsWith("/usuario?") && req.method === "PUT") {
      const { id } = url.parse(req.url, true).query;
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const respuesta = await editar(datos, id);
        res.end(JSON.stringify(respuesta));
      });
    }

    //? Elimina un usuario y sus datos
    if (req.url.startsWith("/usuario?") && req.method === "DELETE") {
      const { id } = url.parse(req.url, true).query;
      const registros = await eliminar(id);
      res.end(JSON.stringify(registros));
    }

    //? Realiza una transferencia
    if (req.url == "/transferencia" && req.method === "POST") {
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const respuesta = await transferencia(datos);
        res.end(JSON.stringify(respuesta));
      });
    }

    //? Mostrar tabla transferencias
    if (req.url == "/transferencias" && req.method === "GET") {
      const registros = await registroTablaTransferencia();
      res.end(JSON.stringify(registros));
    }
  })
  .listen(port, () => console.log(`Escuchando port ${port}`));
