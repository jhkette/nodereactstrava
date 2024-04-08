beforeEach(() => {
  cy.visit("http://localhost:8080/");
});

// nb these tests run against a local site - password is for local site obviously
// login test - goes to login - types in credentials
it("should be able to login", () => {
  // viewport size
  cy.viewport(1200, 1000);
  // got to commonlinks and login
  cy.get(".p-8.opacity-70.rounded-md.bg-blue-100 > button")
    .contains("Authorise")
    .click();
  cy.origin("https://www.strava.com", () => {
    cy.get("#email").click().type("jkette01@student.bbk.ac.uk", { delay: 100 });
    cy.get("#password").click().type("test1234", { delay: 100 });
    cy.get("#login-button").click();
  });
  cy.url().should("include", "localhost:8080");
  cy.get("h1").should(($h1) => {
    // make sure the first contains some text content
    expect($h1.first()).to.contain("Calender");
  });

  cy.get("nav").contains("Cycling").click();
  cy.url().should("include", "/cycling");

  cy.get("nav").contains("Running").click();
  cy.url().should("include", "/running");
});
