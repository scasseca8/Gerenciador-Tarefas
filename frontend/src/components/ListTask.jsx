import React, { useState } from "react";
import api from "../services/api";
import Spinner from "./Spinner";

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted, showToast }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [addingFilesToTaskId, setAddingFilesToTaskId] = useState(null);
  const [filesToAdd, setFilesToAdd] = useState([]);
  
  const [isLoading, setIsLoading] = useState({
    edit: false,
    delete: null,
    addFiles: false,
    deleteFile: null
  });
  

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    visible: false,
    taskId: null,
    taskTitle: ''
  });

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status);
    setNewFiles([]);
    setAddingFilesToTaskId(null);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const startAddingFiles = (taskId) => {
    setAddingFilesToTaskId(taskId);
    setFilesToAdd([]);
    setEditingTaskId(null);
  };

  const cancelAddingFiles = () => {
    setAddingFilesToTaskId(null);
    setFilesToAdd([]);
  };

  const saveFiles = async (taskId) => {
    try {
      if (filesToAdd.length === 0) {
        showToast("Selecione pelo menos um arquivo para adicionar.", "error");
        return;
      }

      setIsLoading(prev => ({ ...prev, addFiles: true }));
      
      const formData = new FormData();

      for (let i = 0; i < filesToAdd.length; i++) {
        formData.append("files", filesToAdd[i]);
      }

      await api.post(`/tasks/${taskId}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(`${filesToAdd.length} arquivo(s) adicionado(s) com sucesso!`, "success");
      setAddingFilesToTaskId(null);
      setFilesToAdd([]);
      onTaskUpdated();
    } catch (error) {
      console.error("Erro ao adicionar arquivos:", error);
      showToast("Erro ao adicionar arquivos. Tente novamente.", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, addFiles: false }));
    }
  };

  const saveTask = async (taskId) => {
    try {
      if (!editTitle.trim()) {
        showToast("O título da tarefa é obrigatório.", "error");
        return;
      }
      
      setIsLoading(prev => ({ ...prev, edit: true }));
      
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      formData.append("status", editStatus);

      if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i++) {
          formData.append("files", newFiles[i]);
        }
      }

      await api.put(`/tasks/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingTaskId(null);
      showToast("Tarefa atualizada com sucesso!", "success");
      onTaskUpdated();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      showToast("Erro ao salvar tarefa. Tente novamente.", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const deleteFile = async (taskId, fileId, fileName) => {
    try {
      setIsLoading(prev => ({ ...prev, deleteFile: fileId }));
      
      await api.delete(`/tasks/${taskId}/files/${fileId}`);
      showToast(`Arquivo ${fileName} excluído com sucesso!`, "success");
      onTaskUpdated();
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      showToast("Erro ao excluir arquivo. Tente novamente.", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, deleteFile: null }));
    }
  };

  const showDeleteConfirmation = (taskId, taskTitle) => {
    setDeleteConfirmation({
      visible: true,
      taskId,
      taskTitle
    });
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({
      visible: false,
      taskId: null,
      taskTitle: ''
    });
  };

  const deleteTask = async (taskId) => {
    try {

      setIsLoading(prev => ({ ...prev, delete: taskId }));
      hideDeleteConfirmation();
      
      await api.delete(`/tasks/${taskId}`);
      showToast("Tarefa excluída com sucesso!", "success");
      onTaskDeleted ? onTaskDeleted() : onTaskUpdated();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      showToast("Erro ao excluir tarefa. Tente novamente.", "error");
    } finally {
      setIsLoading(prev => ({ ...prev, delete: null }));
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="no-tasks-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="15"></line>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
        <p>Nenhuma tarefa encontrada</p>
      </div>
    );
  }

  return (
    <>
      <div className="task-list">
        {tasks.map((task, index) => (
          <div 
            key={task._id} 
            className={`task-item ${task.status === "Concluído" ? "completed" : ""}`}
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {editingTaskId === task._id ? (
  
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  disabled={isLoading.edit}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isLoading.edit}
                ></textarea>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  disabled={isLoading.edit}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Concluído">Concluído</option>
                </select>
                <div className="file-section">
                  <h4>Arquivos existentes:</h4>
                  {task.files.length > 0 ? (
                    <ul>
                      {task.files.map((file) => (
                        <li key={file._id} className="file-item">
                          {file.filename}
                          <button
                            type="button"
                            onClick={() => deleteFile(task._id, file._id, file.filename)}
                            className="delete-file-btn"
                            disabled={isLoading.deleteFile === file._id || isLoading.edit}
                          >
                            {isLoading.deleteFile === file._id ? (
                              <Spinner size="small" />
                            ) : (
                              "Excluir"
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum arquivo anexado</p>
                  )}
                  <h4>Adicionar novos arquivos:</h4>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.pdf"
                    onChange={(e) => setNewFiles(Array.from(e.target.files))}
                    disabled={isLoading.edit}
                  />
                  {newFiles.length > 0 && (
                    <p>Arquivos selecionados: {newFiles.length}</p>
                  )}
                </div>
                <div className="button-group">
                  <button 
                    type="button" 
                    onClick={() => saveTask(task._id)}
                    disabled={isLoading.edit}
                    className="button-with-spinner"
                  >
                    {isLoading.edit ? (
                      <>
                        <Spinner size="small" className="button-spinner" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      "Salvar"
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelEditing}
                    disabled={isLoading.edit}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : addingFilesToTaskId === task._id ? (
  
              <div className="add-files-form">
                <h3>{task.title}</h3>
                <div className="file-section">
                  <h4>Arquivos existentes:</h4>
                  {task.files.length > 0 ? (
                    <ul>
                      {task.files.map((file) => (
                        <li key={file._id} className="file-item">
                          <a
                            href={`/uploads/${file.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.filename}
                          </a>
                          <button
                            type="button"
                            onClick={() => deleteFile(task._id, file._id, file.filename)}
                            className="delete-file-btn"
                            disabled={isLoading.deleteFile === file._id || isLoading.addFiles}
                          >
                            {isLoading.deleteFile === file._id ? (
                              <Spinner size="small" />
                            ) : (
                              "Excluir"
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum arquivo anexado</p>
                  )}
                  <h4>Adicionar novos arquivos:</h4>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.pdf"
                    onChange={(e) => setFilesToAdd(Array.from(e.target.files))}
                    disabled={isLoading.addFiles}
                  />
                  {filesToAdd.length > 0 && (
                    <p>Arquivos selecionados: {filesToAdd.length}</p>
                  )}
                </div>
                <div className="button-group">
                  <button 
                    type="button" 
                    onClick={() => saveFiles(task._id)}
                    disabled={isLoading.addFiles}
                    className="button-with-spinner"
                  >
                    {isLoading.addFiles ? (
                      <>
                        <Spinner size="small" className="button-spinner" />
                        <span>Adicionando...</span>
                      </>
                    ) : (
                      "Adicionar Arquivos"
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelAddingFiles}
                    disabled={isLoading.addFiles}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
    
              <div className="view-mode">
                <div className="status-indicator" title={`Status: ${task.status}`}></div>
                <h3>{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <p className="task-status">
                  <span className={`status-badge ${task.status === "Concluído" ? "status-completed" : "status-pending"}`}>
                    {task.status}
                  </span>
                </p>
                <div className="files">
                  <h4>Arquivos:</h4>
                  {task.files.length > 0 ? (
                    <ul>
                      {task.files.map((file) => (
                        <li key={file._id}>
                          <a
                            href={`/uploads/${file.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.filename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum arquivo anexado</p>
                  )}
                </div>
                <div className="button-group">
                  <button 
                    type="button" 
                    onClick={() => startEditing(task)}
                    disabled={isLoading.delete === task._id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => startAddingFiles(task._id)}
                    className="add-files-btn"
                    disabled={isLoading.delete === task._id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    Anexar
                  </button>
                  <button
                    type="button"
                    onClick={() => showDeleteConfirmation(task._id, task.title)}
                    className="delete-task-btn"
                    disabled={isLoading.delete === task._id}
                  >
                    {isLoading.delete === task._id ? (
                      <div className="button-with-spinner">
                        <Spinner size="small" className="button-spinner" />
                        <span>Excluindo...</span>
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Excluir
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    
    
      {deleteConfirmation.visible && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-content">
            <h3>Excluir Tarefa</h3>
            <p>Tem certeza que deseja excluir a tarefa "{deleteConfirmation.taskTitle}"?</p>
            <p>Esta ação não pode ser desfeita.</p>
            <div className="delete-confirmation-buttons">
              <button 
                className="delete-confirm-button"
                onClick={() => deleteTask(deleteConfirmation.taskId)}
              >
                Sim, Excluir
              </button>
              <button 
                className="delete-cancel-button"
                onClick={hideDeleteConfirmation}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}