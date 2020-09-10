describe('Talent Login Page', () => {
  it('Visits Talent Log In', () => {
    // cy.visit('http://localhost:3000/talent/login') 
    cy.visit('talent/login')     

    cy.get('.talent-email')
    .type('testtalent@gmail.com')
    // .should('have.value', 'talent1@gmail.com')
    cy.get('.talent-password')
    .type('Talent@123')
    cy.get('.talent-remember').click()
    cy.get('.talent-login').click()
    cy.url().should('include', '/talent/profile')


  })
})
