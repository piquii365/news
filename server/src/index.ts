import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/routes.ts";
import { generalLimiter } from "./middleware/limit.middleware.ts";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "http://localhost:7153"],
        objectSrc: ["'none'"],
        connectSrc: ["'self'", "ws:", "wss:", "http://localhost:7153"],
      },
    },
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(generalLimiter);
app.use("/api", routes());

const PORT = process.env.PORT || 3500;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
