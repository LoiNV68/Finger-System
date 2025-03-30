const redis = require("redis");

const client = redis.createClient();
client.connect().catch(console.error);

client.on("connect", () => {
  console.log("🟢 Redis connected successfully!");
});
client.on("error", (err) => {
  console.error("🔴 Redis error:", err);
});

module.exports = client;
