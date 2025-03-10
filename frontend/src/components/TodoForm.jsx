import React, { useState } from "react";

export default function TodoForm() {

  return (
    <form action="">
      <input type="text" />
      <textarea></textarea>
      <select name="" id="">
        <optgroup label="Estados">
          <option value="Pendente"> Pendente
          </option>
          <option value="Concluído"> Concluído
          </option>
        </optgroup>
      </select>
      <input type="file" />
      <button>Adicionar Tarefas</button>
    </form>
  );
}