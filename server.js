const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const SECRET = "mysecretkey";

const user = {
  username: "admin",
  password: "1234"
};

app.get("/", (req, res) => {
  res.send("API Running");
});

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (
    username === user.username &&
    password === user.password
  ) {

    const token = jwt.sign(
      { username },
      SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  }

  res.status(401).json({
    message: "Invalid credentials"
  });
});

function verifyToken(req, res, next) {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(403).json({
      message: "Token required"
    });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, SECRET, (err, decoded) => {

    if (err) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    req.user = decoded;

    next();
  });
}

app.get("/tasks", verifyToken, (req, res) => {

  res.json([
    {
      id: 1,
      task: "Complete Assignment"
    }
  ]);

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});