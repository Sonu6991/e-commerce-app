"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const request = require("supertest");
(0, globals_1.describe)("Auth API", () => {
    (0, globals_1.it)("POST /v1/auth/login --> sucessfully logged in", () => {
        //     const reqBody = {
        //         "email": "sonu@yopmail.com",
        //         "password": "Sonu@123"
        //     }
        //     //     // const result = await request(app).post('/auth/login').send(reqBody)
        //     //     // console.log("login res...........", result.body)
        //     //     // // getting error :   Cannot log after tests are done. Did you forget to wait for something async in your test?
        //     //     // return request(app).post('/api/v1/auth/login').send(reqBody).set('Accept', 'application/json').then((res: any) => {
        //     //     //     console.log(res.body)
        //     //     // }).catch((err: any) => {
        //     //     //     console.log("err", err)
        //     //     // })
        //     //     // // getting output : login res........... { status: 'error', message: 'off' }
        //     //     // const result = await request(app).post('/api/v1/auth/login').send(reqBody)
        //     //     // console.log("login res...........", result.body)
        //     //     // done()
        //     //     // getting output : login res........... { status: 'error', message: 'off' }
        //     request(app).post('/api/v1/auth/login').send(reqBody).set('Accept', 'application/json')
        //         .expect('Content-Type', /json/)
        //         .expect(200)
        //         .then((res: any) => {
        //             console.log("res", res.body)
        //             return done();
        //         }).catch((err: any) => {
        //             console.log("err", err)
        //             return done(err);
        //         });
        //     //         .end(function (err: any, res: any) {
        //     //             console.log("err........", err)
        //     //             if (err) return done(err);
        //     //             console.log("res", res.body)
        //     //             return done();
        //     //         });
    });
});
