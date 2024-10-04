"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from '../src/auth/auth.routes.js';
import postRoutes from '../src/modules/post/post.routes.js';
import commentRoutes from "../src/modules/comment/comment.routes.js";
import jobRoutes from "../src/modules/job/job.routes.js";
import applicationRoutes from "../src/modules/application/application.routes.js";
import messageRoutes from '../src/modules/message/message.routes.js'; // Importa las rutas de mensajes
import requestRoutes from '../src/modules/request/request.routes.js';
import { createUserDefault } from "./default-conf.js";
import { dbConnection } from "./mongo.js";

class Server {
  constructor() {
    this.notes();
    this.app = express();
    this.port = process.env.PORT || 3000; // Proporciona un valor predeterminado
    this.authPath = '/practica/v1/auth';
    this.postPath = '/practica/v1/post';
    this.commentPath = '/practica/v1/comment';
    this.jobPath = '/practica/v1/job';
    this.applicationPath = '/practica/v1/application';
    this.messagePath = '/practica/v1/message'; // Ruta para mensajes
    this.requestPath = '/practica/v1/request';
    this.middlewares();
    this.conectDB();
    this.routes();
  }

  async conectDB() {
    try {
      await dbConnection();
      await createUserDefault();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  routes() {
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.postPath, postRoutes);
    this.app.use(this.requestPath, requestRoutes);
    this.app.use(this.commentPath, commentRoutes);
    this.app.use(this.jobPath, jobRoutes);
    this.app.use(this.applicationPath, applicationRoutes);
    this.app.use(this.messagePath, messageRoutes); // Agrega la ruta para mensajes

    // Middleware para manejar errores 404
    this.app.use((req, res, next) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });

    // Middleware para manejar errores generales
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ success: false, message: "Something went wrong" });
    });
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  notes() {
    console.log("");
    console.log("");
    console.log("NOTE: Server constructor called!");
    console.log("if port 3000 is in use:");
    console.log("netstat -ano | findstr :3000");
    console.log("taskkill /PID <PID> /F");
    console.log("");
  }
}

export default Server;
