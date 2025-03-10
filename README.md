# To-do List (Gerenciador de Tarefas)

Este é um projeto de uma To-do List (Lista de Tarefas) desenvolvido com uma arquitetura separada em backend e frontend. O objetivo é fornecer uma aplicação simples e intuitiva para gestão de tarefas diárias.

## Tecnologias Utilizadas e Justificativa

### Backend:
- **Node.js**: Utilizado por sua eficiência e escalabilidade para aplicações backend.
- **Express.js**: Framework minimalista para Node.js que facilita a criação de APIs REST.
- **MongoDB**: Banco de dados NoSQL escolhido por sua flexibilidade e facilidade de escalabilidade.

### Frontend:
- **React.js**: Biblioteca para criação de interfaces dinâmicas e reativas.
- **Vite**: Ferramenta de build rápida para projetos frontend, melhorando a experiência de desenvolvimento.
- **CSS**: Utilizado para estilização do frontend, sem o uso de frameworks adicionais.

## Estrutura do Projeto

```
/todolist
│── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── multerConfig.js  # Configuração para uploads de arquivos
│   │   ├── controllers/
│   │   │   ├── TaskController.js  # Lógica para manipulação das tarefas
│   │   ├── database/
│   │   │   ├── db.js  # Configuração da conexão com o MongoDB
│   │   ├── models/
│   │   │   ├── Task.js  # Definição do modelo de dados para tarefas
│   │   ├── uploads/  # Diretório onde os arquivos enviados são armazenados
│   │   ├── index.js  # Ponto de entrada do backend
│   │   ├── routes.js  # Definição das rotas da API
│
│── frontend/
│   ├── src/
│   │   ├── assets/  # Recursos estáticos como imagens e estilos globais
│   │   ├── components/
│   │   │   ├── ListTask.jsx  # Componente para listar tarefas e editar as tarefas
│   │   │   ├── Modal.jsx  # Componente modal para exibição do formulário para adicionar a tarefa
│   │   │   ├── SearchBar.jsx  # Barra de pesquisa para filtrar tarefas
│   │   │   ├── Spinner.jsx  # Indicador de carregamento
│   │   │   ├── Toast.jsx  # Notificações visuais para feedback ao usuário
│   │   │   ├── TodoForm.jsx  # Formulário para adicionar
│   │   ├── services/
│   │   │   ├── api.js  # Configuração da API para comunicação com o backend
│   │   ├── App.jsx  # Componente principal da aplicação
│   │   ├── index.css  # Estilos globais da aplicação
│   │   ├── main.jsx  # Ponto de entrada do frontend
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
```

## Layout

![TodoList](https://github.com/user-attachments/assets/9de12ca9-e0ae-45e8-812d-f6679795b93d)


## Como Executar o Projeto

### Backend:
1. Acesse a pasta do backend:
   ```sh
   cd backend
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure as credenciais do banco de dados (caso necessário).
4. Inicie o servidor:
   ```sh
   npm start
   ```

### Frontend:
1. Acesse a pasta do frontend:
   ```sh
   cd frontend
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Inicie a aplicação:
   ```sh
   npm run dev
   ```
4. Acesse a aplicação pelo navegador pelo `http://localhost:5173/`.
5. O frontend está disponível em http://localhost:5173 e o backend em http://localhost:3000.


## Funcionalidades
- Adicionar, editar e remover tarefas.
- Marcar tarefas como concluídas.
- Persistência dos dados utilizando MongoDB.

## Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório.
2. Crie uma branch para a sua funcionalidade:
   ```sh
   git checkout -b minha-nova-funcionalidade
   ```
3. Faça commit das suas alterações:
   ```sh
   git commit -m "Adicionando nova funcionalidade"
   ```
4. Envie para o repositório remoto:
   ```sh
   git push origin minha-nova-funcionalidade
   ```
5. Abra um Pull Request.



### Feito Por Santiago Casseca

