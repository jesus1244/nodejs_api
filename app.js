const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./bd");
const { request } = require("express");
const { sendStatus } = require("express/lib/response");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.log("hay un error ", err);
      res.json({
        error: `Hubo un error: ${err}`,
      });
      return;
    }
    
    res.json(results);
  });
});

app.get("/canchas", (req, res) => {
  connection.query("SELECT * FROM canchas", (err, results) => {
    if (err) {
      console.log("hay un error ", err);
      res.json({
        error: `Hubo un error: ${err}`,
      });
      return;
    }
    
    res.json(results);
  });
});

app.get("/admins", (req, res) => {
  connection.query("SELECT * FROM admins", (err, results) => {
    if (err) {
      console.log("hay un error ", err);
      res.json({
        error: `Hubo un error: ${err}`,
      });
      return;
    }
    
    res.json(results);
  });
});

app.post("/login", (req, res) => {
  connection.query(
    "SELECT usuario, password, role FROM admins",
    (err, results) => {
      if (err) {
        console.log("hay un error ", err);
        res.json({
          error: `Hubo un error: ${err}`,
        });
        return;
      }

      const { usuario, password } = req.body;

      results.forEach((Element) => {
        if(Element.usuario == usuario && Element.password ==  password){
          const tokenUser = req.body;
          console.log(tokenUser, Element.role);
          jwt.sign({ user: tokenUser }, "secretkey", (err, token) => {
            res.json({ token });
          });
        }
      });

      console.log(req.body);

      
    }
  );
});

app.post("/post", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (error, authData) => {
    if (error) {
      res.status(401).json("No autorizado");
    } else {
      res.json({
        mensaje: "post siuuu",
        authData,
      });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(401);
  }
}

app.get("/detalle_reserva", (req, res) => {
  connection.query("SELECT * FROM detalle_reserva inner join users on detalle_reserva.id_usuario = users.id inner join admins on detalle_reserva.id_admin = admins.id inner join canchas on detalle_reserva.id_canchas = canchas.id", (err, results) => {
    if (err) {
      console.log("hay un error ", err);
      res.json({
        error: `Hubo un error: ${err}`,
      });
      return;
    }
    
    res.json(results);
  });
});

app.post("/add_reserva", (req, res) => {

  const { id_usuario, id_admin, id_canchas, fecha, hora } = req.body;

  connection.query("INSERT INTO detalle_reserva SET ?", 
  { id_usuario, id_admin, id_canchas, fecha, hora },
  (err, results) => {
    if (err) {
      console.log("hay un error ", err);
      res.json({
        error: `Hubo un error: ${err}`,
      });
      return;
    }
    res.json({ mensaje: "reserva insertado" });
    console.log(results);
  }
  );
  
});

app.delete("/delete_reserva/:id", (req, res) => {

  const { id } = req.params;

  if (id) {
    connection.query("DELETE FROM detalle_reserva WHERE ?", { id_reserva: id }, (err, results) => {
      if (err) {
        console.log("hay un error ", err);
        res.json({
          error: `Hubo un error: ${err}`,
        });
        return;
      }
      res.json({ mensaje: "reserva borrada" });
      console.log(results);
    });
  } else {
    res.json({ mensaje: "reserva no borrada" });
  }
});

app.post("/update_reserva", (req, res) => {

  const { id_reserva, id_usuario, id_admin, id_canchas, fecha, hora } = req.body;

  connection.query(`UPDATE detalle_reserva SET id_usuario = '${id_usuario}', id_admin = '${id_admin}', id_canchas = '${id_canchas}', fecha = '${fecha}', hora = '${hora}'
  WHERE id_reserva = '${id_reserva}'`,
  (err, results) => {
    if (err) {
      console.log("hay un error ", err);
      res.json({
        error: `Hubo un error: ${err}`,
      });
      return;
    }
    res.json({ mensaje: "reserva modificada" });
    console.log(results);
  });
})

app.post("/add", (req, res) => {
  const { nombre, apellidos, tipo_documento, documento, phone, email } =
    req.body;

  console.log(nombre);

  if (
    nombre !== undefined &&
    apellidos !== undefined &&
    tipo_documento !== undefined &&
    documento !== undefined &&
    phone !== undefined &&
    email !== undefined &&
    nombre !== '' &&
    apellidos !== '' &&
    tipo_documento !== '' &&
    documento !== '' &&
    phone !== '' &&
    email !== ''
  ) {
    connection.query(
      "INSERT INTO users SET ?",
      { nombre, apellidos, tipo_documento, documento, phone, email },
      (err, results) => {
        if (err) {
          console.log("hay un error ", err);
          res.json({
            error: `Hubo un error: ${err}`,
          });
          return;
        }
        res.json({ mensaje: "usuario insertado" });
        console.log(results);
      }
    );
  } else {
    res.json({ mensaje: "usuario no insertado" });
  }
});

app.post("/update", (req, res) => {
  const { id, nombre, apellidos, tipo_documento, documento, phone, email } =
    req.body;

  console.log(id);

  if (
    nombre !== undefined &&
    apellidos !== undefined &&
    tipo_documento !== undefined &&
    documento !== undefined &&
    phone !== undefined &&
    email !== undefined &&
    nombre !== '' &&
    apellidos !== '' &&
    tipo_documento !== '' &&
    documento !== '' &&
    phone !== '' &&
    email !== ''
  ) {
    connection.query(
      `UPDATE users SET nombre = '${nombre}', apellidos = '${apellidos}', tipo_documento = '${tipo_documento}', documento = '${documento}', phone = '${phone}', email = '${email}' WHERE id = '${id}'`,
      (err, results) => {
        if (err) {
          console.log("hay un error ", err);
          res.json({
            error: `Hubo un error: ${err}`,
          });
          return;
        }
        res.json({ mensaje: "usuario modificado" });
        console.log(results);
      }
    );
  } else {
    res.json({ mensaje: "usuario no modificado" });
  }
});

app.delete("/delete/:id", (req, res) => {

  const { id } = req.params;

  if (id) {
    connection.query("DELETE FROM users WHERE ?", { id }, (err, results) => {
      if (err) {
        console.log("hay un error ", err);
        res.json({
          error: `Hubo un error: ${err}`,
        });
        return;
      }
      res.json({ mensaje: "usuario borrado" });
      console.log(results);
    });
  } else {
    res.json({ mensaje: "usuario no borrado" });
  }
});

app.listen(3000, () => {
  console.log("Server corriendo en http://localhost:3000");
});
