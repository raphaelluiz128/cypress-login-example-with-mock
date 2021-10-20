const route = require('../../support/route')
const utility = require('../../support/utility')
const mock = require('./login.mock.json')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Login', function() {
  before (function(){
    utility.clear()

    route.load()

    cy.visit('/')
  })

  it('Login - Saipos', function () {
    cy.url().should('include', '/#/access/login')
      
    cy.get('[ng-model="lctrl.account.email"]')
      .type(mock.users.userSuccess.login)
      // .should('have.value', mock.login)
      .should('have.value', mock.users.userSuccess.login)
    
    cy.get('[ng-model="lctrl.account.password"]')
      .type(mock.users.userSuccess.password)
      .should('have.value', mock.users.userSuccess.password)
      
    cy.get('[ng-click="lctrl.login()"]').click('center')

    cy.wait('@postLogin').then((xhr) => {
      expect([200, 401]).to.include(xhr.status)

      if (xhr.status === 200) {
        cy.get('.uk-notify-message.alert-success > div')
          .should('have.text', 'Login realizado com sucesso.')
      } else if (xhr.status === 401) {
          cy.get('.lead').should('have.text', 'Este usuário já está conectado em outro computador. Deseja desconectá-lo?')
        
          cy.wait(2000)
          
          cy.get('.confirm').click('center')
            
          cy.wait(2000)

          cy.get('.uk-notify-message.alert-success > div').should('have.text', 'Login realizado com sucesso.')
      }
     
      cy.wait(6000)

      cy.url().should('include', '/#/app/')  
      
      cy.wait(5000)
    })
  })
})