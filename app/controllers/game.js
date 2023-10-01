const gameRouter = require("express").Router();
const Game = require("../models/game");

gameRouter.get("/", (request, response) => {
  Game.find({}).then((games) => {
    response.json(games);
  });
});

gameRouter.get("/:id", (request, response, next) => {
  Game.findById(request.params.id)
    .then((game) => {
      if (game) {
        response.json(game);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

gameRouter.post("/", (request, response, next) => {
  const body = request.body;
  const game = new Game({
    player1Id: body.player1Id,
    player2Id: body.player2Id,
    searching: body.searching,
  });
  game
    .save()
    .then((savedGame) => {
      response.json(savedGame);
    })
    .catch((error) => next(error));
});

gameRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const game = {
    player1Id: body.player1Id,
    player2Id: body.player2Id,
    searching: body.searching,
  };
  Game.findByIdAndUpdate(request.params.id, game, { new: true })
    .then((updatedGame) => {
      response.json(updatedGame);
    })
    .catch((error) => next(error));
});

gameRouter.delete("/:id", (request, response, next) => {
  Game.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = gameRouter;
