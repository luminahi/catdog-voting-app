import express from "express";
import cors from "cors";
import { createClient as createRedisClient } from "redis";
import pg from "pg";

const app = express();
const port = 3000;

const redisClient = await createRedisClient({ url: "redis://redis:6379" })
    .on("error", (err) => {
        console.log("Redis Client Error", err);
    })
    .connect();

async function enqueueTask(data) {
    const serializedData = JSON.stringify(data);
    await redisClient.rPush("taskQueue", serializedData);
    console.log("Task enqueued: ", data);
}

const pgClient = new pg.Client({
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
});

pgClient.connect((err) => {
    if (err) console.log(err);
});

async function tableCheck() {
    await pgClient.query(
        "CREATE TABLE IF NOT EXISTS catdog ( cat INT NOT NULL, dog INT NOT NULL );"
    );
    const res = await pgClient.query("SELECT cat, dog FROM catdog");
    if (res.rowCount !== 0) return;
    await pgClient.query("INSERT INTO catdog (cat, dog) VALUES (0, 0)");
}

await tableCheck();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:8080", "http://0.0.0.0:8080"],
    })
);

app.post("/app", async (req, res) => {
    const { value } = req.body;
    const result = await redisClient.incr(value);
    await enqueueTask({ value, result });
    res.status(200).send({ value, result });
});

app.get("/results", async (req, res) => {
    const { rows } = await pgClient.query(`SELECT cat, dog FROM catdog`);
    const { cat, dog } = rows[0];
    res.status(200).send({ cat, dog });
});

app.listen(port, () => {
    console.log(`app running at ${3000}`);
});
