const express = require("express");
const { response } = require("express");
const app = express();
const cors = require("cors");
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.locals.pets = [
  { id: "1", name: "Lola", type: "dog" },
  { id: "2", name: "Bean", type: "cat" },
];

app.set("port", process.env.PORT || 3000);
app.locals.title = "Pet Box";

app.get("/", (request, response) => {
  response.send("Hello, Pet Box!");
});

app.get("/api/v1/pets/:name", (request, response) => {
  const { name } = request.params;
  const pet = app.locals.pets.find((pet) => pet.name === name);
  if (!pet) {
    return response.sendStatus(404);
  }
});

app.post("/api/vi/pets", (request, response) => {
  const id = Date.now();
  const pet = request.body;
  for (let requiredParameter of ["name", "type"]) {
    if (!pet[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: {name: <String>, type: <String>. You are missing a "${requiredParameter}" property.`,
      });
    }
  }
  const { name, type } = pet;
  app.locals.pets.push({ name, type, id });
  response.status(201).json({ name, type, id });
});

app.delete("/api/v1/pets/:name", (request, response) => {
  const name = request.params;
  app.locals.pets = app.locals.pets.filter((pet) => pet.name !== name);
  response.status(200).json(pet);
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});
