describe('Admin Login Page', () => {
  it('Visits Admin Log In', () => {
    cy.visit('admin/login')     

    cy.get('.admin-email')
    .type('admin@gmail.com')

    cy.get('.admin-password')
    .type('123456')
    cy.get('.admin-remember').click()
    cy.get('.admin-login').click()
    cy.url().should('include', '/admin/talents')

  })
})
