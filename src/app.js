const express = require("express");
const cors = require("cors");
const { query } = require("express");

// const { validate: isUuid } = require("uuid");
 const { v4: uuid, validate: isUuid } = require('uuid');
// const { v4: uuidv4, validate} = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
   return response.json(repositories)
});

app.post("/repositories", (request, response) => {
   const {title, url, techs}  = request.body;

   const repository = {
      id: uuid(), 
      title, 
      url, 
      techs, 
      likes : 0,
   };

   repositories.push(repository)

   return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params

    if(!isUuid(id)) {
      return response.status(400).json({error : 'Invalid id format'})
    }

    const projectId = repositories.findIndex(project => project.id === id)

    if(projectId < 0) {
      return response.status(400).json({error : 'Repository not found.'})
    }

    const {title, url, techs} = request.body

    repositoryToBeLiked = repositories.find(repository => repository.id === id);

    repositoryToBeLiked.title = title
    repositoryToBeLiked.url = url
    repositoryToBeLiked.techs = techs
   
    repositories[projectId] = repositoryToBeLiked

    return response.json(repositoryToBeLiked);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
  const projectId = repositories.findIndex(project => project.id === id)

  if(!isUuid(id)) {
    return response.status(400).json({error : 'Invalid id format'})
  }
  
  if(projectId < 0) {
    return response.status(400).json({error : 'Repository not found.'})
  }

  repositories.splice(projectId, 1)

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params 
  const repositoryFound = repositories.findIndex(repository => repository.id === id);

  if(!isUuid(id)) {
    return response.status(400).json({error : 'Invalid id format'})
  }
  
  if(repositoryFound < 0) {
    return response.status(400).json({error : 'Repository not found.'})
  }
  
  repositoryToBeLiked = repositories.find(repository => repository.id === id);
  repositoryToBeLiked.likes += 1  

  return response.json(repositoryToBeLiked);
});

module.exports = app;
