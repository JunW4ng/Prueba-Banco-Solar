const http = require("http");
const fs = require("fs");
const url = require("url");
const { insertar } = require("./consultas");

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

    //? Agregar datos
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
  })
  .listen(3000, () => console.log("Server ON"));
