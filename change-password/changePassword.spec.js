/// <reference types="cypress" />

const utility = require('../../../support/utility')
const route = require('../../../support/route')

describe('Saipos - Alterar senha de outro usuário',() => {
    before(() => {
        utility.clear()
        utility.login()
    })

    it('Deve alterar a senha de algum usuário',() => {
        cy.get('[data-qa="menu-trigger"]').click('center')
        cy.get('[data-ui-sref="app.store.users"]').click('center')
        cy.get('[data-qa="user-permissions-email"]').contains('raphaelluiz128@hotmail.com')
            .parent('td').siblings().within(() => {
                cy.get('[data-qa="user-permissions-change-password"]').click('center')
            }
        )
        cy.get('[data-qa="modal-title-change-password"]').should('have.text', 'Informe sua nova senha')
        
        cy.wait(2500)

        cy.get('[data-qa="new-password"]').type('123mudar')
        cy.get('[data-qa="new-password-confirm"]').type('123mudar')
        cy.get('[data-qa="change-password-user-store"]').click('center')

        cy.wait('@postChangePassword').then((xhr) => {
            expect([200]).to.include(xhr.status)
      
            if (xhr.status === 200) {
              cy.get('.uk-notify-message.alert-success > div')
                .should('have.text', 'Senha alterada com sucesso.')
            }
        })
    })

    it('Deve informar senhas diferentes, sistema emite mensagem senhas não correspondem',() => {
        cy.get('[data-qa="menu-trigger"]').click('center')
        cy.get('[data-ui-sref="app.store.users"]').click('center')
        cy.get('[data-qa="user-permissions-email"]').contains('mudinha@tuamaeaquelaursa.com')
            .parent('td').siblings().within(() => {
                cy.get('[data-qa="user-permissions-change-password"]').click('center')
            }
        )
        cy.get('[data-qa="modal-title-change-password"]').should('have.text', 'Informe sua nova senha')
        
        cy.wait(2500)

        cy.get('[data-qa="new-password"]').type('123mudar')
        cy.get('[data-qa="new-password-confirm"]').type('1234mudar')
        cy.get('[data-qa="change-password-user-store"]').click('center')

        cy.get('[class*="showSweetAlert"]').within(() => {
            cy.get('.lead').should('have.text', 'As senhas informadas não correspondem.')
        })
    
    })
})
