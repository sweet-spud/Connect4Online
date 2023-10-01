const NodeCache = require("node-cache");
const cache = new NodeCache();

const setGame = (id, game) => {
  cache.set(id, game);
};

const getGame = (id) => {
  return cache.get(id);
};

const deleteGame = (id) => {
  cache.del(id);
};

const flush = () => {
  cache.flushAll();
};
