import ingredients from '../fixtures/ingredients.json';

describe('Интеграционные тесты Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: { success: true, order: { number: 12345 } }
    }).as('createOrder');
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: { success: true, user: { name: 'Alex', email: '123@mail.ru' } }
    }).as('getUser');
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
    cy.setCookie('accessToken', 'fakeAccessToken123');
    window.localStorage.setItem('refreshToken', 'fakeRefreshToken123');
  });
  it('добавить ингредиент в конструктор', () => {
    cy.contains(ingredients.data[0].name)
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });
    cy.contains(ingredients.data[1].name)
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', ingredients.data[0].name)
      .and('contain', ingredients.data[1].name);
  });
  it('открытие и закрытие модального окна информации об ингредиенте', () => {
    cy.get(`[data-testid="ingredient-${ingredients.data[0].name}"]`).click();
    cy.get('[data-testid="modal-Детали ингредиента"]').should('be.visible');
    cy.get('[data-testid="modal-close"]').click(); // Закрытие модального окна по клику на кнопку
    cy.get('[data-testid="modal-Детали ингредиента"]').should('not.exist');

    cy.get(`[data-testid="ingredient-${ingredients.data[0].name}"]`).click();
    cy.get('[data-testid="modal-Детали ингредиента"]').should('be.visible');
    cy.get('[data-testid="modal-overlay"]').click({ force: true }); // Закрытие модального окна по клику на overlay
    cy.get('[data-testid="modal-Детали ингредиента"]').should('not.exist');
  });
  it('создание и отображение номера заказа', () => {
    cy.contains(ingredients.data[1].name)
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });
    cy.contains(ingredients.data[0].name)
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });
    cy.get('[data-testid="order-button"] button').click();
    cy.wait('@createOrder');
    cy.get('[data-testid="modal-"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal-"]').should('not.exist');
    cy.get('[data-testid="burger-constructor"]')
      .should('not.contain', ingredients.data[0].name)
      .and('not.contain', ingredients.data[1].name);

    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
