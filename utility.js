const moment = require('moment')
const uuidv1 = require('../../node_modules/uuid')
const route = require('./route')

const clear = () => {
    cy.clearLocalStorage()
    cy.clearCookies()
}

const serviceWorker = async () => {
    if (window.navigator && navigator.serviceWorker) {
        console.log('Service', navigator.serviceWorker)
        navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
                registrations.forEach((registration) => {
                    registration.unregister().then(() =>{
                        console.log('Unregister serviceWorker')
                    })
                })
            })
    }
}

const login = (username, password) => {
    route.load()
    cy.visit('/')
    
    cy.url().should('include', '/#/access/login')
    
    cy.get('[ng-model="lctrl.account.email"]')
        .type('raphael.schettino@hotmail.com')
        .should('have.value', 'raphael.schettino@hotmail.com')
  
    cy.get('[ng-model="lctrl.account.password"]')
        .type('123mudar')
        .should('have.value', '123mudar')
    
    cy.get('[ng-click="lctrl.login()"]').click('center')

    cy.wait('@postLogin').then(verifyLogin)

    function verifyLogin(xhr){
        expect([200, 401]).to.include(xhr.status)
  
        if (xhr.status === 200) {
            Cypress.env('token', xhr.response.body.id)

            cy.get('.uk-notify-message.alert-success > div')
                .should('have.text', 'Login realizado com sucesso.')
        } else if (xhr.status === 401) {
            cy.get('.lead').should('have.text', 'Este usuário já está conectado em outro computador. Deseja desconectá-lo?')
          
            cy.wait(1000)
            
            cy.get('.confirm').click('center')

            cy.wait('@postLogin').then((xhr) => {

                cy.get('.uk-notify-message.alert-success > div').should('have.text', 'Login realizado com sucesso.')
                
                Cypress.env('token', xhr.response.body.id)
            })
        }
    }
}

const selectStore = () => {
    cy.wait(2000)
    cy.get('[ng-model="filtro.id_store"]')
    .type(18)
    .should('have.value', 18);
    cy.wait(2000)
    cy.get('#filteredarray_0').click('center')

    
}

const loginCentralPedidos = (username, password) => {
    route.load()
    cy.visit('')
    
    cy.url().should('include', '/#/access/login')
    
    cy.get('[ng-model="lctrl.account.email"]')
        .type('centraldepedidos1391@saipos.com')
        .should('have.value', 'centraldepedidos1391@saipos.com')
  
    cy.get('[ng-model="lctrl.account.password"]')
        .type('centraldepedidos1391')
        .should('have.value', 'centraldepedidos1391')
    
    cy.get('[ng-click="lctrl.login()"]').click('center')

    cy.wait(4500)

    cy.wait('@postLogin').then(verifyLogin)

    cy.wait(5000)

    function verifyLogin(xhr){
        expect([200, 401]).to.include(xhr.status)
  
        if (xhr.status === 200) {
            Cypress.env('token', xhr.response.body.id)

            cy.get('.uk-notify-message.alert-success > div')
                .should('have.text', 'Login realizado com sucesso.')
        } else if (xhr.status === 401) {
            cy.get('.lead').should('have.text', 'Este usuário já está conectado em outro computador. Deseja desconectá-lo?')
          
            cy.wait(2000)
            
            cy.get('.confirm').click('center')

            cy.wait('@postLogin').then((xhr) => {
                cy.wait(2000)

                cy.get('.uk-notify-message.alert-success > div').should('have.text', 'Login realizado com sucesso.')
                
                Cypress.env('token', xhr.response.body.id)
            })
        }
    }
}

const loginSiteProprio = (username, password) => {
    route.load()

    cy.visit('http://testeautomatizado.saipos.com/')

    cy.url().should('include', '#/inicial/tabs/t0/restaurante/cardapio')

    cy.wait(3500)

    // Clica no botão para realizar 'Login'
    cy.get('[data-qa="come-back"]').click('center')
    cy.get('[data-qa="open-menu"]').click('center')
    cy.get('[data-qa="input-login"]').click('center')

    cy.get('.user > .text-input')
        .type('mudinha@tuamaeaquelaursa.com')
        .should('have.value', 'mudinha@tuamaeaquelaursa.com')

    cy.get('.pass > .text-input')
        .type('Testador@Teste')
        .should('have.value', 'Testador@Teste')

    // Clica no botão 'Entrar'
    cy.get('[data-qa="login"]').click('center')

    cy.get('[class="show-backdrop"]').click('center')
}

const loginCaixa = (username, password) => {
    route.load()
    cy.visit('')
    
    cy.url().should('include', '/#/access/login')
    
    cy.get('[ng-model="lctrl.account.email"]')
        .type('mudinha@tuamaeaquelaursa.com')
        .should('have.value', 'mudinha@tuamaeaquelaursa.com')
  
    cy.get('[ng-model="lctrl.account.password"]')
        .type('123mudar')
        .should('have.value', '123mudar')
    
    cy.get('[ng-click="lctrl.login()"]').click('center')

    cy.wait(4500)

    cy.wait('@postLogin').then(verifyLogin)

    function verifyLogin(xhr){
        expect([200, 401]).to.include(xhr.status)
  
        if (xhr.status === 200) {
            Cypress.env('token', xhr.response.body.id)

            cy.get('.uk-notify-message.alert-success > div')
                .should('have.text', 'Login realizado com sucesso.')
        } else if (xhr.status === 401) {
            cy.get('.lead').should('have.text', 'Este usuário já está conectado em outro computador. Deseja desconectá-lo?')
          
            cy.wait(2000)
            
            cy.get('.confirm').click('center')

            cy.wait('@postLogin').then((xhr) => {
                cy.wait(2000)

                cy.get('.uk-notify-message.alert-success > div').should('have.text', 'Login realizado com sucesso.')
                
                Cypress.env('token', xhr.response.body.id)
            })
        }
    
    }
}

const logout = () => { 
    cy.wait(4000)
    
    // Clica o botão 'Minha Conta'.
    cy.get('[title="Minha conta"] > .dropdown-toggle > .zmdi').click({force:true})
    
    // Clica no botão 'Sair'.
    cy.get('[ng-click="hctrl.logout();"]').click({force:true})

    // Conferência se o usuário realmente retornou a página de 'Login'.   
    cy.url().should('include', '/#/access/login')
}

const logoutSiteProprio = (username, password) => {
    cy.wait(2500)

    
    cy.get('[class="ion-page show-page"]').parent().within(() => {
        cy.get('[class="nav_header header header-md"]').parent().within(() =>{
            cy.get('[class="nav_btn floatLeft"]').click({ multiple: true })
        })
    })
    

    cy.get('[data-qa="open-menu"]').click('center')

    cy.get('[class="icon icon-md ion-md-exit item-icon"]')
        .contains('Sair')
        .click('Center')
}

const aberturaCaixa = () => {
    
    cy.wait(7000)

    cy.url().should('include', '/#/app/sale/delivery/kanban/search-customer')
    
    cy.get('[id="openCashierLabel"]').click('center')
    
    cy.wait('@cashierName').then((xhr) =>{
        expect([200]).to.include(xhr.status)

        if(xhr.response.body && xhr.response.body.length === 0){
            cy.log('Cashier if', xhr.response.body)

            cy.wait('@lastValueCashier')

            cy.get('[id="open_initial_value"]').type('9,99')
                .should('have.value', '9,99')

            cy.get('[ng-model="vm.record.open_notes"]').type('Teste')
                .should('have.value', 'Teste')
            
        } else {
            
            cy.log('Cashier Else', xhr.response.body)
            
            cy.get('[ng-click="vm.openCashier()"]').click('center')

            cy.wait('@lastValueCashier')                

            cy.get('[id="open_initial_value"]').type('8,99')
                .should('have.value', '8,00')

            cy.get('[ng-model="vm.record.open_notes"]').type('Teste')
                .should('have.value', 'Teste')
        
        }
    })    

    cy.get('[ng-click="vm.saveRecord()"]').click('center')
    
    let openCashier = {}
    cy.wait('@postAberturaCaixa').then((xhr) => {
        expect([200]).to.include(xhr.status)

        if(xhr.status === 200){
            
            openCashier = xhr.response.body

            cy.log('Id Caixa', openCashier.id_store_cashier)
            cy.get('.tm-label')
                .should('have.text', 'CAIXA - Gerente')
        }
    })
}

const createGuidReference = (min, max) => {
    return '1' + moment().format('DDMM') + parseInt(Math.random() * (max - min) + min, 10)
}

const createdAt = () => `${moment().utc().format('YYYY-MM-DDTHH:mm:ss')}.426Z`

const createUUID = () => uuidv1()

module.exports = {
    clear,
    serviceWorker,
    login,
    loginCentralPedidos,
    loginSiteProprio,
    loginCaixa,
    logout,
    logoutSiteProprio,
    aberturaCaixa,
    createGuidReference,
    createdAt,
    createUUID,
    selectStore
}
