let GBP;

describe("Test account system", () => {
  it("Switches account", () => {
    cy.visit("http://localhost:3000");
    cy.contains("User details")
      .parent()
      .contains("User:")
      .parent()
      .find("select")
      .select("Elliott")
      .should("have.value", "Elliott");
  });
  it("Tops up/withdraw GBP", () => {
    //cy.visit("http://localhost:3000");
    cy.contains("User details")
      .parent()
      .contains("GBP:")
      .wait(1000)
      .then(($GBP) => {
        GBP = $GBP.text().replace("GBP: ", "");

        cy.contains("User details")
          .parent()
          .contains("Amount:")
          .parent()
          .find("input")
          .type("50");

        cy.contains("Top Up")
          .click()
          .then(() => {
            cy.log(GBP);
          });

        cy.contains("User details")
          .parent()
          .contains("GBP: " + (Number(GBP) + 50));
      });

    cy.contains("User details")
      .parent()
      .contains("Amount:")
      .parent()
      .find("input")
      .type("50");

    cy.contains("Withdraw").click();
  });
});

describe("Test order system", () => {
  it("Adds order", () => {
    cy.visit("http://localhost:3000");
    cy.contains("User details")
      .parent()
      .contains("User:")
      .parent()
      .find("select")
      .select("Elliott")
      .should("have.value", "Elliott")
      .wait(1000);

    cy.contains("User details").parent().contains("GBP:");

    cy.contains("Order Form")
      .parent()
      .contains("Price")
      .parent()
      .find("input")
      .type(1);

    cy.contains("Order Form")
      .parent()
      .contains("Volume")
      .parent()
      .find("input")
      .type(1);

    cy.contains("Submit").click();

    cy.contains("Personal order book").parent().contains("Buy");

    cy.contains("User details")
      .parent()
      .contains("GBP: " + (Number(GBP) - 1));
  });

  it("Cancels order", () => {
    cy.contains("Personal order book")
      .parent()
      .contains("Buy")
      .parent()
      .find("button")
      .click();
    cy.contains("User details")
      .parent()
      .contains("GBP: " + GBP);
    cy.contains("Personal order book")
      .parent()
      .contains("Buy")
      .should("not.exist");
  });
  it("Makes a trade", () => {
    cy.contains("Order Form")
      .parent()
      .contains("Action")
      .parent()
      .find("select")
      .select("Sell");

    cy.contains("Order Form")
      .parent()
      .contains("Price")
      .parent()
      .find("input")
      .type(4);

    cy.contains("Order Form")
      .parent()
      .contains("Volume")
      .parent()
      .find("input")
      .type(1);

    cy.contains("Submit").click();

    cy.contains("Trade history").parent().find(".listItem:first").contains("4");
  });
});
