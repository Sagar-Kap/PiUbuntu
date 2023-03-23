const redis = require("redis");
const { promisify } = require("util");
const REDIS_URL = "redis://localhost:6379";
const { Todo } = require("../mongo");

let getAsync;
let setAsync;

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log("No REDIS_URL set, Redis is disabled");
    return null;
  };
  getAsync = redisIsDisabled;
  setAsync = redisIsDisabled;
} else {
  const client = redis.createClient({
    url: REDIS_URL,
  });

  (async () => {
    const count = await Todo.countDocuments();
    client.set("todocounter", count);
  })();

  getAsync = promisify(client.get).bind(client);
  setAsync = promisify(client.set).bind(client);
}

module.exports = {
  getAsync,
  setAsync,
};
