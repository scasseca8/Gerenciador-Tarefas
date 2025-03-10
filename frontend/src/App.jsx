import React, { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TaskList from "./components/ListTask";
import Modal from "./components/Modal";
import SearchBar from "./components/SearchBar";
import Toast from "./components/Toast";
import Spinner from "./components/Spinner";
import api from "./services/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  async function getTasks() {
    setLoading(true);
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
      setFilteredTasks(response.data);
      console.log("Tarefas carregadas:", response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      showToast("Erro ao carregar tarefas. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  // Efeito para filtrar tarefas quando os critérios de filtro mudam
  useEffect(() => {
    filterTasks();
  }, [searchTerm, statusFilter, tasks]);

  const filterTasks = () => {
    let result = [...tasks];
    
    // Filtro por termo de pesquisa
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por status
    if (statusFilter !== "all") {
      result = result.filter(task => task.status === statusFilter);
    }
    
    setFilteredTasks(result);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskAdded = () => {
    showToast("Tarefa adicionada com sucesso!", "success");
    getTasks();
    closeModal();
  };

  const handleTaskUpdated = () => {
    showToast("Tarefa atualizada com sucesso!", "success");
    getTasks();
  };

  const handleTaskDeleted = () => {
    showToast("Tarefa excluída com sucesso!", "success");
    getTasks();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className="container">
      <h1>Gerenciador de Tarefas</h1>
      
      <div className="add-task-container">
        <button className="add-task-button" onClick={openModal}>
          + Adicionar Nova Tarefa
        </button>
      </div>
      
      {/* Modal com o formulário */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Adicionar Nova Tarefa</h2>
        <TodoForm onTaskAdded={handleTaskAdded} showToast={showToast} />
      </Modal>
      
      {/* Barra de pesquisa e filtros */}
      <SearchBar 
        onSearch={handleSearch} 
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
      
      <h2>Suas Tarefas {filteredTasks.length !== tasks.length && `(${filteredTasks.length} de ${tasks.length})`}</h2>
      
      {loading ? (
        <div className="loading-container">
          <Spinner size="large" />
          <p>Carregando tarefas...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="no-tasks-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <p>Nenhuma tarefa encontrada</p>
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onTaskUpdated={handleTaskUpdated} 
          onTaskDeleted={handleTaskDeleted}
          showToast={showToast}
        />
      )}

      {/* Toast para mensagens de feedback */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast}
        />
      )}
    </div>
  );
}