import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../config/app.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/user.model.js";
import { Post } from "../models/Post.model.js";
import { Session } from "../models/session.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let mongo;
let user;
let posts = [];

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, { dbName: "Test" });
});

beforeEach(async () => {
    posts = [];

    user = await User.create({
        username: "TestUser",
        email: "user@fake.test",
        password: await bcrypt.hash("12345678", 10),
        isVerified: true,
    });

    posts.push(await Post.create({
        author: user._id,
        title: "Test title",
        description: "Test description",
        category: "Test",
        thumbnailUrl: "test.img",
    }));

    posts.push(await Post.create({
        author: user._id,
        title: "Test title 2",
        description: "Test description 2",
        category: "Test 2",
        thumbnailUrl: "test2.img",
    }));
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

// == Проверка получение постов ==
describe("GET /api/posts возвращает массив с объектам постов", () => {
    // == Проверка запроса ==
    test("должен вернуть массив с постами", async () => {
        const response = await request(app)
            .get("/api/posts");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toMatchObject({
            author: expect.any(Object),
            title: expect.any(String),
            description: expect.any(String),
            category: expect.any(String),
            createdAt: expect.any(String),
            thumbnailUrl: expect.any(String),
        });
    });

    // == Получение последних постов ==
    test("должен вернуть массив с новейшими постами", async () => {
        const response = await request(app)
            .get("/api/posts/latest");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const latestPost = posts[posts.length - 1];
        expect(response.body[0]).toMatchObject({
            author: expect.any(Object),
            title: latestPost.title,
            description: latestPost.description,
            category: latestPost.category,
            createdAt: new Date(latestPost.createdAt).toISOString(),
            thumbnailUrl: latestPost.thumbnailUrl,
        });
    });

    // == Получение поста по идентификатору ==
    test("должен вернут конкретный пост с переданным идентификатором", async () => {
        const post = posts[0];

        const response = await request(app)
            .get(`/api/posts/${post._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            author: expect.any(Object),
            title: post.title,
            description: post.description,
            category: post.category,
            createdAt: new Date(post.createdAt).toISOString(),
            thumbnailUrl: post.thumbnailUrl,
        });
    });
});

// == Проверка создание поста ==
describe("POST /api/posts создаёт новый пост и возвращает его", () => {
    // == Проверка запроса с файлом ==
    test("должен вернуть созданный пост", async () => {
        const imagePath = path.resolve(__dirname, "fixtures", "test.jpg");

        const session = await Session.create({
            userId: user._id,
            expiresAt: new Date(Date.now() + 3_600_000),
        });

        const response = await request(app)
            .post("/api/posts")
            .set("Cookie", `sessionId=${session._id}`)
            .field("title", "Test title")
            .field("description", "Test description")
            .field("category", "Test")
            .attach("thumbnail", imagePath);

        expect(response.statusCode).toBe(201);
    });
});