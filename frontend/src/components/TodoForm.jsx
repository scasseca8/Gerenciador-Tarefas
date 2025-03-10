import React, { useState } from "react";
import api from "../services/api";

export default function TodoForm({ onTaskAdded, showToast }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusTask, setStatusTask] = useState("Pendente");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setFileNames(selectedFiles.map(file => file.name));
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    const updatedNames = [...fileNames];
    updatedNames.splice(index, 1);
    setFileNames(updatedNames);
  };

  async function createTasks(e) {
    e.preventDefault();
    
    if (!title.trim()) {
      showToast("O título da tarefa é obrigatório.", "error");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", statusTask);

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      await api.post("/tasks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setTitle("");
      setDescription("");
      setStatusTask("Pendente");
      setFiles([]);
      setFileNames([]);

      onTaskAdded();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      showToast("Erro ao adicionar tarefa. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={createTasks} className="todo-form">
      <div className="form-group">
        <label htmlFor="title">Título*</label>
        <input 
          type="text" 
          name="title" 
          id="title" 
          placeholder="Digite o título da tarefa" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          name="description"
          id="description"
          placeholder="Descrição detalhada da tarefa"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select 
          name="status" 
          id="status"
          value={statusTask} 
          onChange={(e) => setStatusTask(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="Pendente">Pendente</option>
          <option value="Concluído">Concluído</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="files">Anexos</label>
        <div className="file-input-container">
          <label htmlFor="files" className="file-input-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            Selecionar arquivos
          </label>
          <input 
            type="file" 
            id="files" 
            accept=".png,.jpg,.pdf" 
            multiple 
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="file-input"
          />
        </div>
        
        {fileNames.length > 0 && (
          <div className="selected-files">
            <p>Arquivos selecionados:</p>
            <ul className="file-list">
              {fileNames.map((name, index) => (
                <li key={index} className="file-item">
                  <span>{name}</span>
                  <button 
                    type="button" 
                    className="remove-file-btn"
                    onClick={() => removeFile(index)}
                    disabled={isSubmitting}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span>Adicionando...</span>
          </>
        ) : (
          "Adicionar Tarefa"
        )}
      </button>
    </form>
  );
}