import Task from "../models/Task.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


async function getTasks(request, response) {
  const tasks = await Task.find();
  return response.status(200).json(tasks);
}

async function getTaskById(request, response) {
  const { id }= request.params;
  const task = await Task.findById(id);

  if (!task) {
    return response.status(404).json({ error: "Tarefa não encontrada" });
  }
  return response.status(200).json(task);
}

async function createTask(request, response) {
  console.log("Dados recebidos no backend:", request.body);
  console.log("Arquivo recebido:", request.file);

  if (!request.body.title) {
    return response.status(400).json({ error: "O título é obrigatório" });
  }

  try {
    const task = new Task({
      title: request.body.title,
      description: request.body.description,
      status: request.body.status,
      files: []
    });

    if (request.files && request.files.length > 0) {
      for (const file of request.files) {
        const filePath = path.resolve(__dirname, "..", "uploads", file.filename);
        task.files.push({
          filename: file.filename,
          path: filePath
        });
      }
    }

    await task.save();
    
    return response.status(201).json(task);
  } catch (error) {
    console.error("Erro ao criar a tarefa:", error);
    return response.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updateTask(request, response) {
  const { id } = request.params;
  
  try {
    const task = await Task.findById(id);
    
    if (!task) {
      return response.status(404).json({ error: "Tarefa não encontrada" });
    }
    
    task.title = request.body.title || task.title;
    task.description = request.body.description || task.description;
    task.status = request.body.status || task.status;
    
    if (request.files && request.files.length > 0) {
      for (const file of request.files) {
        const filePath = path.resolve(__dirname, "..", "uploads", file.filename);
        task.files.push({
          filename: file.filename,
          path: filePath
        });
      }
    }
    
    await task.save();
    
    return response.status(200).json(task);
  } catch (error) {
    console.error("Erro ao atualizar a tarefa:", error);
    return response.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteTask(request, response) {
  const { id } = request.params;

  try {
    const task = await Task.findById(id);
    
    if (!task) {
      return response.status(404).json({ error: "Tarefa não encontrada" });
    }
    
    for (const file of task.files) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Erro ao deletar arquivo:", err);
      }
    }
    
    await Task.findByIdAndDelete(id);
    
    return response.status(200).json({ message: "Tarefa eliminada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar a tarefa:", error);
    return response.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function uploadFile(request, response) {
  const { id } = request.params;
  const task = await Task.findById(id);

  if (!task) {
    return response.status(404).json({ error: "Tarefa não encontrada" });
  }

  if (!request.files || request.files.length === 0) {
    return response.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  for (const file of request.files) {
    const filePath = path.resolve(__dirname, "..", "uploads", file.filename);
    task.files.push({
      filename: file.filename,
      path: filePath
    });
  }
  
  await task.save();

  return response.status(200).json({ message: "Upload realizado com sucesso", task });
}

async function listFiles(request, response) {
  const { id } = request.params;
  const task = await Task.findById(id);

  if (!task) {
    return response.status(404).json({ error: "Tarefa não encontrada" });
  }

  return response.status(200).json({ files: task.files });
}

async function deleteFile(request, response) {
  const { id, fileId } = request.params;
  const task = await Task.findById(id);

  if (!task) {
    return response.status(404).json({ error: "Tarefa não encontrada" });
  }

  const fileIndex = task.files.findIndex((file) => file._id.toString() === fileId);
  if (fileIndex === -1) {
    return response.status(404).json({ error: "Arquivo não encontrado" });
  }

  const filePath = path.resolve(task.files[fileIndex].path);

  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Erro ao deletar o arquivo:", err);
  }

  task.files.splice(fileIndex, 1);
  await task.save();

  return response.status(200).json({ message: "Arquivo removido com sucesso" });
}
  

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  uploadFile,
  listFiles,
  deleteFile,
};
