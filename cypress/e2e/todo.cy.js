// Tests E2E — simulent un parcours utilisateur réel via HTTP
// L'app doit tourner avant de lancer ces tests

describe('API Todo — parcours complet', () => {

  // --- Disponibilité de l'application ---
  it('GET /health répond 200', () => {
    cy.request('GET', '/health').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal({ status: 'ok' });
    });
  });

  // --- Parcours utilisateur complet ---
  it('peut créer une tâche et la retrouver dans la liste', () => {
    // Crée une tâche
    cy.request('POST', '/todos', { title: 'Apprendre CI/CD' }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.title).to.eq('Apprendre CI/CD');
      expect(res.body.done).to.eq(false);
    });

    // Vérifie qu'elle apparaît dans la liste
    cy.request('GET', '/todos').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.length.greaterThan(0);
      const titles = res.body.map(t => t.title);
      expect(titles).to.include('Apprendre CI/CD');
    });
  });

  it('retourne 400 si on crée une tâche sans titre', () => {
    cy.request({
      method: 'POST',
      url: '/todos',
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
    });
  });

  it('peut supprimer une tâche existante', () => {
    // Crée d'abord une tâche
    cy.request('POST', '/todos', { title: 'À supprimer' }).then((res) => {
      const id = res.body.id;

      // Supprime la tâche
      cy.request('DELETE', `/todos/${id}`).then((delRes) => {
        expect(delRes.status).to.eq(204);
      });
    });
  });

  it('retourne 404 si on supprime une tâche inexistante', () => {
    cy.request({
      method: 'DELETE',
      url: '/todos/99999',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});
