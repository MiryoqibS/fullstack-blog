import { MongoMemoryServer } from "mongodb-memory-server"
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../config/app.js";

import { Session } from "../models/session.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/Post.model.js";

let mongo;
let user;
let session;
let post;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, { dbName: "Test" });
});

beforeEach(async () => {
    // Создаём пользователя для теста
    user = await User.create({
        username: "TestUser",
        email: "user@fake.test",
        password: await bcrypt.hash("12345678", 10),
        isVerified: true,
    });

    // Создаём сессию для для входа
    session = await Session.create({
        userId: user._id,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    });

    // Создаём пост для тестов
    post = await Post.create({
        author: user._id,
        title: "Test title",
        description: "Test description",
        category: "Test",
        thumbnailUrl: "TestUrl",
    });
})

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

// == Проверка получение постов ==
describe("GET /api/comments/:id возвращает массив комментариев поста", () => {
    // == Проверка запроса ==
    test("должен вернуть массив комментариев", async () => {
        await Comment.create([
            {
                postId: post._id,
                author: user._id,
                text: "Коммент 1"
            },
        ]);

        const response = await request(app).get(`/api/comments/${post._id.toString()}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty("text", "Коммент 1");
    })
});

// == Проверка добавление комментария ==
describe("POST /api/comments/:id создаёт новый комментарий в посте", () => {
    // == Проверка запроса ==
    test("должен вернуть новый объект комментария", async () => {
        const response = await request(app)
            .post(`/api/comments/${post._id.toString()}`)
            .set("Cookie", [`sessionId=${session._id}`])
            .send({ text: "Новый комментарий" });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("text", "Новый комментарий");
        expect(response.body).toHaveProperty("author");
        expect(response.body.author).toBe(String(user._id));

        const comments = await Comment.find();
        expect(comments).toHaveLength(1);
    });

    // == Проверка запроса без куки ==
    test("должен вернуть статус 401 и объект с сообщением", async () => {
        const response = await request(app)
            .post(`/api/comments/${post._id.toString()}`)
            .send({ text: "Новые комментарий" });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty("message", "не авторизован");
    });

    // == Проверка запроса без текста ==
    test("должен вернуть статус 400 и объект с сообщением", async () => {
        const response = await request(app)
            .post(`/api/comments/${post._id.toString()}`)
            .set("Cookie", [`sessionId=${session._id}`])
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "текст комментария не передан")
    })

    // == Отправка запроса на не существующий пост ==
    test("должен вернуть статус 400 и объект с сообщением", async () => {
        const response = await request(app)
            .post("/api/comments/test")
            .set("Cookie", [`sessionId=${session._id}`])
            .send({ text: "тестовый комментарий" });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "такого поста не существует");
    })
});

// == Проверка добавления ответа комментарию ==
describe("POST /api/comments/reply/:id", () => {
    // == Проверка запроса ==
    test("должен вернуть статус код 201 и объект с сообщением", async () => {
        const fakeComment = await Comment.create({
            author: user._id,
            text: "Test comment",
            postId: post._id,
        });

        const response = await request(app)
            .post(`/api/comments/reply/${fakeComment._id}`)
            .set("Cookie", [`sessionId=${session._id}`])
            .send({ text: "Test comment", postId: post._id });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("message", "ваш комментарий добавлен");
    });
});