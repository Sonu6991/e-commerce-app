"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("Product API", () => {
    (0, globals_1.it)("GET /v1/products --> array products", () => {
        //   return request(app)
        //     .get("/products")
        //     //   .expect("Content-Type", /json/)
        //     //   .expect(200)
        //     .then((res: any) => {
        //       // console.log("res.body", res);
        //       expect(res.statusCode).toBe(200)
        //       // expect(res.body).toEqual(
        //       //   expect.arrayContaining([
        //       //     expect.objectContaining({
        //       //       name: expect.any(String),
        //       //       price: expect.any(Number),
        //       //       category: expect.any(String),
        //       //       stock: expect.any(Number),
        //       //       description: expect.any(String),
        //       //     }),
        //       //   ])
        //       // );
        //     });
        // request(app).get('/api/v1/products')
        //   .set('Accept', 'application/json')
        //   .expect('Content-Type', /json/)
        //   .then((res: any) => {
        //     console.log("res", res.body)
        //     return done();
        //   })
        //   .catch((error: any) => {
        //     console.log("err........", error)
        //     done(error)
        //   });
    });
    // it("GET /products/id  -->  specific product by id", () => { });
    // it("GET /products/id  -->  404 if product not found", () => { });
    // it("POST /products  -->  Create product", () => { });
    // it("GET /products  ->  validate request body", () => { });
});
