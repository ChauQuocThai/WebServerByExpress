// index.js
const express = require("express");
const bodyParser = require("body-parser");
const mygroup = require("./models/mygroup");

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Hàm log để hiển thị thông tin request lên console
function log(req) {
  console.log(`${req.method} request to ${req.url}`);
}

// Endpoint / trả về thông tin mygroup dưới dạng JSON
app.get("/", (req, res) => {
  log(req);
  res.json(mygroup);
});

// Endpoint /<MSSV>/<id>
app.route("/:MSSV/:id")
  .get((req, res) => {
    log(req);
    const { MSSV, id } = req.params;
    const student = mygroup.find(item => item.id === MSSV);

    if (student && student.id === id) {
      res.json(student);
    } else {
      res.json({ error: "Not valid" });
    }
  })
  .post((req, res) => {
    log(req);
    const { MSSV, id } = req.params;
    const newItem = req.body;

    if (MSSV === newItem.id && !mygroup.some(item => item.id === MSSV)) {
      mygroup.push(newItem);
      res.json(newItem);
    } else {
      res.json({ error: "Not valid" });
    }
  });

// Endpoint /message/<id>
app.get("/message/:id", (req, res) => {
  log(req);
  const { id } = req.params;

  if (id) {
    const student = mygroup.find(item => item.id === id);
    if (student) {
      res.send(`<html><body><ul><li>${student.name}</li></ul></body></html>`);
    } else {
      res.send("Not valid");
    }
  } else {
    const studentNames = mygroup.map(student => student.name);
    res.send(`<html><body><ul>${studentNames.map(name => `<li>${name}</li>`).join("")}</ul></body></html>`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
