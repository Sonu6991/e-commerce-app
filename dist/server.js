"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const mongooseLeanId = require("mongoose-lean-id");
mongoose_1.default.set('strictQuery', true);
const port = process.env.PORT || 3000;
let server;
if (process.env.NODE_ENV === "production") {
    var options = {
        cert: fs.readFileSync(`${process.env.CERTIFICATE_PATH}`),
        key: fs.readFileSync(`${process.env.PRIVATEKEY_PATH}`),
    };
    server = https.createServer(options, app_1.default).listen(port, () => {
        console.log(`App running on port ${port}...`);
    });
}
else {
    server = http.createServer(app_1.default).listen(port, () => {
        console.log(`App running on port ${port}...`);
    });
}
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect(`${process.env.DB_URL}`, (error) => __awaiter(void 0, void 0, void 0, function* () {
        if (!error) {
            console.log("Connected to MongoDB Successfully");
        }
        else {
            throw error;
        }
    }));
});
connectToMongoDB();
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err);
    server.close(() => {
        process.exit(1);
    });
});
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err);
    server.close(() => {
        process.exit(1);
    });
});
process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        console.log("💥 Process terminated!");
        process.exit(1);
    });
});
exports.default = server;
