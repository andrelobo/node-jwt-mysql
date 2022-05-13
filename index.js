const express = require("express");
const app = express();
const db = require("./models");
const { Users, Todos } = require("./models");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("./JWT");

app.use(express.json());
app.use(cookieParser());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    })
      .then(() => {
        res.json("USER REGISTERED");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.status(400).json({ error: "Usuário não existe" });

  const dbPassword = user.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Combinação de usuário e senha está errada!" });
    } else {
      const accessToken = createTokens(user);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      res.json("Usuário Logado!");
    }
  });
});



app.get("/allusers", validateToken, (req, res) => {

  Users.findAll().then((data) => {
    res.json(data);
  });
});



/////////////////TODO ROUTES/////////////////////////////



app.post("/createtodo", validateToken, (req, res) => {
  const { descricao, prazo, userid } = req.body;
  
    Todos.create({  
      descricao: descricao,
      prazo: prazo,
      userid: userid,
    })
      .then(() => {
        res.json("Todo criado!");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  });

app.get("/todos", validateToken, (req, res) => {

  Todos.findAll().then((data) => {
    res.json(data);
  });
});

app.get("/todos/:id", validateToken, (req, res) => {

  Todos.findOne({ where: { id: req.params.id } }).then((data) => {
    res.json(data);
  });

  
});


app.patch("/todos/:id", validateToken, (req, res) => {

  Todos.update(
    {
      descricao: req.body.descricao,
      prazo: req.body.prazo,
    },
    { where: { id: req.params.id } }
  ).then((data) => {
    res.json(data);
  }
  )
  
});



app.get("/profile", validateToken, (req, res) => {
  res.json("profile");
});
app.get("/profile", validateToken, (req, res) => {
  res.json("profile");
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("SERVER RUNNING ON PORT 3001");
  });
});
