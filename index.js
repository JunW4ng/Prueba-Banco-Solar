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
        try {
          const datos = Object.values(JSON.parse(body));
          const respuesta = await insertar(datos);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(respuesta));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end("Error de servidor");
        }
      });
    }

    //? Muestra usuarios con sus balances
    if (req.url == "/usuarios" && req.method === "GET") {
      try {
        const registros = await consulta();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(registros));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        console.log("ERROR AL MOSTRAR USUARIOS");
      }
    }

    //? Edita usuarios con sus balances
    if (req.url.startsWith("/usuario?") && req.method === "PUT") {
      const { id } = url.parse(req.url, true).query;
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        try {
          res.writeHead(201, { "Content-Type": "application/json" });
          const datos = Object.values(JSON.parse(body));
          const respuesta = await editar(datos, id);
          res.end(JSON.stringify(respuesta));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end();
        }
      });
    }

    //? Elimina un usuario y sus datos
    if (req.url.startsWith("/usuario?") && req.method === "DELETE") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        const { id } = url.parse(req.url, true).query;
        const registros = await eliminar(id);
        res.end(JSON.stringify(registros));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end("Error de servidor");
      }
    }

    //? Realiza una transferencia
    if (req.url == "/transferencia" && req.method === "POST") {
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        try {
          res.writeHead(201, { "Content-Type": "application/json" });
          const datos = Object.values(JSON.parse(body));
          const respuesta = await transferencia(datos);
          res.end(JSON.stringify({ status: "OK" }));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end("Error de servidor");
        }
      });
    }

    //? Mostrar tabla transferencias
    if (req.url == "/transferencias" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        const registros = await registroTablaTransferencia();
        res.end(JSON.stringify(registros));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end("Error de servidor");
      }
    }
  })
  .listen(port, () => console.log(`Escuchando port ${port}`));
