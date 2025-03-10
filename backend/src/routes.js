import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  uploadFile,
  listFiles,
  deleteFile,
} from "./controllers/TaskController.js";
import upload from "./config/multerConfig.js"; 


const routes = Router();

// Tarefas
routes.get("/tasks", getTasks);
routes.get("/tasks/:id", getTaskById);
routes.post("/tasks", upload.array("files", 5), createTask);
routes.put("/tasks/:id", upload.array("files", 5), updateTask);
routes.delete("/tasks/:id", deleteTask);

// Upload de Arquivos
routes.post("/tasks/:id/upload", upload.single("file", 5), uploadFile);
routes.get("/tasks/:id/files", listFiles);
routes.delete("/tasks/:id/files/:fileId", deleteFile);

export default routes;
