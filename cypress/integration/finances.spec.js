/// <reference types="cypress"/>

import { format, prepareLocalStorage } from '../support/utils.js';

context('Dev Finances Agilizei', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad: (win) => prepareLocalStorage(win)
        });
        // cy.get('#data-table tbody tr').should('have.length', 2);
    });

    it('Cadastrar Entradas', () => {
        cy.get('#transaction .new').click();
        cy.get('#description').type('Mesada');
        cy.get('#amount').type(12);
        cy.get('#date').type('2021-07-31');
        cy.get('#form .actions button').contains('Salvar').click();

        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    it('Cadastrar Saídas', () => {
        cy.get('#transaction .new').click();
        cy.get('#description').type('Chocolate');
        cy.get('#amount').type(-12);
        cy.get('#date').type('2021-07-31');
        cy.get('#form .actions button').contains('Salvar').click();

        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    it('Remover Entradas e Saídas', () => {
        const entrada = 'Mesada';
        const saida = 'Suco Kapo';

        cy.get('#data-table tbody tr .description')
            .contains(entrada)
            .closest('tr')
            .find('[onclick*="remove"]')
            .click();

        cy.get('#data-table tbody tr').should('have.length', 1);

        cy.get('#data-table tbody tr .description')
            .contains(saida)
            .closest('tr')
            .find('[onclick*="remove"]')
            .click();

        cy.get('#data-table tbody tr').should('have.length', 0);
    });

    it('Validar saldo com diversas transações', () => {
        let incomes = 0;
        let expenses = 0;

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                cy.get($el)
                    .find('.income, .expense')
                    .invoke('text')
                    .then(text => {
                        cy.log(index, text, format(text));

                        if (text.includes('-')) {
                            expenses += format(text);
                        } else {
                            incomes += format(text);
                        }
                    });
            });

        cy.get('#totalDisplay').invoke('text').then((text) => {
            cy.log('valor total', format(text));

            let formattedTotalDisplay = format(text);
            let expectedTotal = incomes + expenses;

            expect(formattedTotalDisplay).to.eq(expectedTotal);

        });

    });

});