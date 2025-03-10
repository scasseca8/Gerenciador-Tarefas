import React, { useState, useEffect } from "react";

export default function SearchBar({ onSearch, statusFilter, onStatusFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeFilter, setActiveFilter] = useState(statusFilter);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");


  useEffect(() => {
    if (searchTerm === "") {
      setDebouncedSearchTerm("");
      onSearch("");
      setIsSearching(false);
      return;
    }
    
    setIsTyping(true);
    setIsSearching(true);
    
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      onSearch(searchTerm);
      setIsTyping(false);
      
      setTimeout(() => {
        setIsSearching(false);
      }, 300);
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleFilterClick = (filter) => {

    setIsSearching(true);
    setActiveFilter(filter);
    onStatusFilterChange(filter);
    

    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="search-filters-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquisar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${isTyping ? 'typing' : ''}`}
        />
        {searchTerm && (
          <button 
            className="clear-search" 
            onClick={() => setSearchTerm("")}
            aria-label="Limpar pesquisa"
          >
            &times;
          </button>
        )}
        <div className="search-icon">
          {isSearching ? (
            <div style={{ width: "18px", height: "18px" }}>
              <div className="spinner spinner-small"></div>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          )}
        </div>
        {debouncedSearchTerm && !isTyping && (
          <div className="results-count">
            Pesquisando por: "{debouncedSearchTerm}"
          </div>
        )}
      </div>
      
      <div className="status-filter">
        <span>Filtrar por status:</span>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${activeFilter === "Pendente" ? "active" : ""}`}
            onClick={() => handleFilterClick("Pendente")}
          >
            Pendentes
          </button>
          <button 
            className={`filter-btn ${activeFilter === "Concluído" ? "active" : ""}`}
            onClick={() => handleFilterClick("Concluído")}
          >
            Concluídas
          </button>
        </div>
      </div>
    </div>
  );
}