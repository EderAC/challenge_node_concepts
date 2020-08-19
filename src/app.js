const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID' });
  }
  return next();
}

// app.use('/repositories/:id/like', validateProjectId)


app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryFound = repositories.find(repository => repository.id === id);

  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes: repositoryFound.likes
  }

  repositories[repositoryFound] = repositoryUpdated;

  return response.json(repositoryUpdated);

});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()

});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryFound = repositories.find(repository => repository.id === id);

  repositoryFound.likes += 1;

  return response.json(repositoryFound)
});

module.exports = app;
