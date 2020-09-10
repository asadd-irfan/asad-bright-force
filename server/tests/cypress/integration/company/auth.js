it('company registration and login', () => {
    // clear the database before testing
    cy.task('clearDatabase');
    // test registration
    cy.visit(`/company/register`);

    cy.get('input#name').type('Test Company');
    cy.get('input#companyName').type('Test Company');
    cy.get('input#phone').type('0541234567');
    cy.get('input#email').type('Test@gmail.com');
    cy.get('input#password').type('!@123456');
    cy.get('input#confirm').type('!@123456');
    cy.get('input#agreement').check();
    cy.get('button[type="submit"]').click();

    cy.location('pathname').should('eq', '/company');
    // remove token
    cy.clearLocalStorage();
    // test login
    cy.visit(`/company/login`);

    cy.login('test@gmail.com', '!@123456');

    cy.location('pathname').should('eq', '/company');
});
