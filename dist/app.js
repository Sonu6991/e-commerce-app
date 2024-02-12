"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
//@ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errorController_1 = require("./controllers/errorController");
const express_useragent_1 = __importDefault(require("express-useragent"));
const jsend_1 = __importDefault(require("jsend"));
const common_1 = require("./utils/common");
// import { caching } from 'cache-manager';
const get_routes_1 = require("get-routes");
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const cartRouter_1 = __importDefault(require("./routes/cartRouter"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
// declare global variable
// how to get json file and make it globle variable
const i18n = require("./i18n/i18n.config");
// Start express app
const app = (0, express_1.default)();
app.disabled("trust proxy");
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
// Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Development logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// useragent log
app.use(express_useragent_1.default.express());
// Implement CORS
const corsOptions = {
    credentials: true,
    origin: true,
};
app.use((0, cors_1.default)(corsOptions));
// app.use(expressLayouts);
// Limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
app.use(jsend_1.default.middleware);
app.use(function (req, res, next) {
    if (req.headers && req.headers["accept-language"]) {
        i18n.setLocale(req.headers["accept-language"]);
    }
    req.requestTime = new Date().toISOString();
    return next();
});
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: "5120kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "5120kb" }));
app.use((0, cookie_parser_1.default)());
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
//routes
app.use("/api/v1/auth", authRouter_1.default);
app.use("/api/v1/users", userRouter_1.default);
app.use("/api/v1/products", productRouter_1.default);
app.use("/api/v1/cart", cartRouter_1.default);
app.use("/api/v1/orders", orderRouter_1.default);
// app.use("/api/v1/", () => {
//   console.log("calling");
// });
const routeList = (0, get_routes_1.getRoutes)(app);
app.all("*", (0, common_1.handleUnMatchedRoute)(routeList));
app.use(errorController_1.globalErrorHandler);
exports.default = app;
