
const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');
const testUser = {username: "test", password: "test"};
// const { expect, it } = require('@jest/globals');
// const { add, find, findby, findbyId } = require('./users-model.js');
// const users = require('./users-model.js');

describe("server", () => {
    describe("send a GET request", () => {
        it("should return an error if not logged in", async () => {
            const res = await request(server).get("/api/jokes")
            expect(res.status).toBe(401)
        });
        it("should return json", async () => {
            const res = await request(server).get("/api/jokes");
            expect(res.type).toBe("application/json")
        });
    });
    describe("register a new user", () => {
        it("should return with a status code of 201", async () => {
            await db("users").truncate();
            const res = await request(server).post("/api/auth/register/").send(testUser);
            expect(res.status).toBe(201);
        });
        it("should return an error on on user with name aleady in database", async () => {
            const res = await request(server).post("/api/auth/register/").send(testUser);
            expect(res.status).toBe(500);
        });
    });
    describe("login user", () => {
        it("should return a status code of 200", async () => {
            const res = await request(server).post("/api/auth/login").send(testUser);
            expect(res.status).toBe(200);
        });
        it("should return with a status code of 401 when given a user not in database", async () => {
            const res = await request(server).post("/api/auth/login").send({username:"notvalid", password:"notvalid"});
            expect(res.status).toBe(401);
        });
    })
});
