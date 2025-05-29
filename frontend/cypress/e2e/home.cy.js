describe('Login', () => {
  it('debe iniciar sesión correctamente con credenciales válidas', () => {
    cy.visit('http://localhost:5173/');

 
    cy.get('input[type="email"]').type('osvaldo@gmail.com');

   
    cy.get('input[type="password"]').type('keosherme');

    
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/panel-clinica');

    cy.wait(1000);

      cy.visit('http://localhost:5173/mascotas');
  });
});
