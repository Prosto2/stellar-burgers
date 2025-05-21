import ingredients from '../fixtures/ingredients.json';
import order from '../fixtures/order.json';
import user from '../fixtures/user.json';

const MODAL_DETAILS_SELECTOR = '[data-testid="modal-Детали ингредиента"]';
const INGREDIENT_SELECTOR = (name: string) =>
  `[data-testid="ingredient-${name}"]`;
const MODAL_CLOSE_SELECTOR = '[data-testid="modal-close"]';
const MODAL_OVERLAY_SELECTOR = '[data-testid="modal-overlay"]';
const MODAL_ORDER_SELECTOR = '[data-testid="modal-"]';

describe('Интеграционные тесты Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: order
    }).as('createOrder');
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: user
    }).as('getUser');
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
    cy.setCookie('accessToken', 'fakeAccessToken123');
    window.localStorage.setItem('refreshToken', 'fakeRefreshToken123');
  });
  it('добавить ингредиент в конструктор', () => {
    cy.get('[data-testid="burger-constructor"]')
      .should('not.contain', ingredients.data[0].name)
      .and('not.contain', ingredients.data[1].name);

    cy.contains(ingredients.data[0].name)
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.get('[data-testid="burger-constructor"]').should(
      'contain',
      ingredients.data[0].name
    );

    cy.contains(ingredients.data[1].name)
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.get('[data-testid="burger-constructor"]')
      .should('contain', ingredients.data[1].name);
  });
  it('открытие и закрытие модального окна информации об ингредиенте', () => {
    cy.get(MODAL_DETAILS_SELECTOR).should('not.exist');

    cy.get(INGREDIENT_SELECTOR(ingredients.data[0].name)).click();
    cy.get(MODAL_DETAILS_SELECTOR).as('modal');

    cy.get('@modal')
      .should('be.visible')
      .should('contain', ingredients.data[0].name);

    cy.get(MODAL_CLOSE_SELECTOR).click();
    cy.get('@modal').should('not.exist');

    cy.get(INGREDIENT_SELECTOR(ingredients.data[0].name)).click();
    cy.get(MODAL_DETAILS_SELECTOR).as('modal');

    cy.get('@modal')
      .should('be.visible')
      .should('contain', ingredients.data[0].name);

    cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });
    cy.get('@modal').should('not.exist');
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
    cy.get(MODAL_ORDER_SELECTOR).should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');
    cy.get('[data-testid="modal-close"]').click();
    cy.get(MODAL_ORDER_SELECTOR).should('not.exist');
    cy.get('[data-testid="burger-constructor"]')
      .should('not.contain', ingredients.data[0].name)
      .and('not.contain', ingredients.data[1].name);

    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
