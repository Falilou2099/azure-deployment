const request = require('supertest');
const { app, resetTodos } = require('./app');

// Remet les todos à zéro avant chaque test pour garantir l'isolation
beforeEach(() => {
  resetTodos();
});

// --- GET /health ---
describe('GET /health', () => {
  test('répond 200 avec status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

// --- GET /todos ---
describe('GET /todos', () => {
  test('retourne une liste vide au départ', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('retourne les todos créés', async () => {
    await request(app).post('/todos').send({ title: 'Tâche 1' });
    const res = await request(app).get('/todos');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Tâche 1');
  });
});

// --- POST /todos ---
describe('POST /todos', () => {
  test('crée un todo et retourne 201', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Acheter du pain' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: 'Acheter du pain', done: false });
  });

  test('retourne 400 si title est manquant', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.statusCode).toBe(400);
  });

  test('retourne 400 si title est vide', async () => {
    const res = await request(app).post('/todos').send({ title: '   ' });
    expect(res.statusCode).toBe(400);
  });
});

// --- DELETE /todos/:id ---
describe('DELETE /todos/:id', () => {
  test('supprime un todo existant et retourne 204', async () => {
    await request(app).post('/todos').send({ title: 'À supprimer' });
    const res = await request(app).delete('/todos/1');
    expect(res.statusCode).toBe(204);
  });

  test('retourne 404 si le todo n\'existe pas', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.statusCode).toBe(404);
  });
});
