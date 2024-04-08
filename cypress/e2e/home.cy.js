// import 'cypress-axe';



// describe('user journeys', () => {
// 	// visit website before each test
// 	beforeEach(() => {
// 		cy.visit('http://localhost:8080/');
// 	});
//     // check for charset
// 	it('cy.document() - get the document object', () => {
// 		// https://on.cypress.io/document
// 		cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
// 	});
//      // check for title
// 	it('cy.document() - get the document object', () => {
// 		// https://on.cypress.io/document
// 		cy.document().should('have.property', 'title');
// 		cy.visit('https://titan.dcs.bbk.ac.uk/~jkette01/wswdemo/activities/');
// 		cy.document().should('have.property', 'title');
// 	});
//      // check for user journey. 
// 	it('a user journey to cyclocross events', () => {
// 		cy.viewport(1200, 1000);
// 		cy.get('#menu-menu-2').contains('Events').click();
// 		cy.url().should('include', '/events');
// 		cy.get('.nav-links').contains('Cyclocross').click();
// 		cy.url().should('include', '/cyclocross');
// 	});
//     // check for journey to activities
// 	it('a user journey to actvities then triathlon', () => {
// 		cy.viewport(1200, 1000);
// 		cy.get('#menu-menu-2').contains('Activities').click();
// 		cy.url().should('include', '/activities');
// 		cy.get('.nav-links').contains('Triathlon').click();
// 		cy.url().should('include', '/triathlon');
// 	});
//      // check for journey to events
// 	it('a mobile user journey to events', () => {
// 		cy.viewport('ipad-mini');
// 		cy.get('#nav-icon1').click();
// 		cy.get('#mobile-nav').contains('Events').click();
// 		cy.url().should('include', '/events');
// 	});
//      // mobile user journey to news
// 	it('a mobile user journey to news', () => {
// 		cy.viewport('ipad-mini');
// 		cy.get('#nav-icon1').click();
// 		cy.get('#mobile-nav').contains('News').click();
// 		cy.url().should('include', '/news');
// 	});
// });