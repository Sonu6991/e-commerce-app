import server from './server'
console.log("port 1", port)
beforeAll(done => {
    /*db.sequelize.sync({ force: true, logging: console.log }).then(() => {
    //server.listen(port);
    done();
    });*/

    console.log("port", port)
    server.listen(port);
    done();
});
afterAll(async () => {
    await server.close();
});