describe('Company Login Page', () => {
  it('Visits Company Log In', () => {
    cy.visit('company/login') 

    cy.get('.company-email')
    .type('companyuser@gmail.com')

    cy.get('.company-password')
    .type('User@123')
    cy.get('.company-remember').click()
    cy.get('.company-login').click()
    cy.url().should('include', '/company/home')


  })
})
