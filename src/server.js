import express from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import listEndpoints from "express-list-endpoints";
import userRoutes from "./authors/authors.js";
import postRoutes from "./blogPosts/blogPosts.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";
import createError from "http-errors";

const publicFolder = join(dirname(fileURLToPath(import.meta.url)), "../public");

const server = express();
const port = process.env.PORT || 3001;

const whiteList = [
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_CLOUD_URL,
];

const corsOptions = {
  origin: function (origin, next) {
    console.log(origin);
    try {
      if (whiteList.indexOf(origin) !== -1) {
        console.log(origin);
        next(null, true);
      } else {
        next(createError(500, "Origin Problem!"));
      }
    } catch (error) {
      next(error);
    }
  },
};

server.use(express.json());
server.use(express.static(publicFolder));
server.use(cors(corsOptions));

server.use("/authors", userRoutes);
server.use("/blogposts", postRoutes);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);

server.listen(port, () => {
  console.log("server is running port: ", port);
});

console.table(listEndpoints(server));
