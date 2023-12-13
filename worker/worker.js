import { createClient as createRedisClient } from "redis";
import pg from "pg";

const redisClient = await createRedisClient({ url: "redis://redis:6379" })
    .on("error", (err) => {
        console.log("Redis Client Error", err);
    })
    .connect();

const pgClient = new pg.Client({
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
});

pgClient.connect((err) => {
    if (err) console.log(err);
});

async function processTask() {
    const serializedTask = await redisClient.blPop("taskQueue", 0);
    const task = JSON.parse(serializedTask.element);
    await pgClient.query(`UPDATE catdog SET ${task.value} = ${task.result}`);
    console.log("Task processed", task);
}

async function startProcessing() {
    console.log("processing the queue");
    while (true) {
        await processTask();
    }
}

startProcessing();
