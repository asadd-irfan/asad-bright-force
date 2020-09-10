it('talent registration and login', () => {
    // clear the database before testing
    cy.task('clearDatabase');
    // test registration
    cy.visit('/talent/register');

    cy.get('input#name').type('Test Talent');
    cy.get('input#email').type('Test@gmail.com');
    cy.get('input#password').type('!@123456');
    cy.get('input#confirm').type('!@123456');
    cy.get('input#agreement').check();
    cy.get('button[type="submit"]').click();

    cy.location('pathname').should('eq', '/talent');
    // remove token
    cy.clearLocalStorage();
    // test login
    cy.visit('/talent/login');

    cy.login('test@gmail.com', '!@123456');

    cy.location('pathname').should('eq', '/talent');
});
