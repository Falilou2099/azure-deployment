const express = require('express');
const app = express();

app.use(express.json());

// Stockage en mémoire (suffisant pour le TP)
let todos = [];
let nextId = 1;

// GET /health — point de vérification pour le healthcheck CI/CD
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// GET /todos — liste toutes les tâches
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// POST /todos — crée une nouvelle tâche
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Le champ title est requis.' });
  }
  const todo = { id: nextId++, title: title.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// DELETE /todos/:id — supprime une tâche
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tâche introuvable.' });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Export pour les tests (sans démarrer le serveur)
module.exports = { app, resetTodos: () => { todos = []; nextId = 1; } };

// Démarrage du serveur uniquement si exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}
