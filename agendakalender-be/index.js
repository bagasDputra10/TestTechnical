import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Acmilan1899",
  database: "agendakalender",
});

app.get("/agenda", (req, res) => {
  const q = "SELECT * FROM agenda";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});
app.post("/agenda", (req, res) => {
  const q = "INSERT INTO agenda(`agendadate`, `title`) VALUES (?, ?)";
  const values = [req.body.agendadate, req.body.title];

  db.query(q, values, (err, data) => {
      if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(201).json(data);
  });
});

app.put("/agenda/:id", (req, res) => {
  const agendaId = req.params.id;
  const q = "UPDATE agenda SET `agendadate`= ?, `title`= ? WHERE id = ?";

  const values = [
    req.body.agendadate,
    req.body.title,
  ];

  db.query(q, [...values, agendaId], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.listen(3000, () => {
  console.log("Connected to backend!");
});