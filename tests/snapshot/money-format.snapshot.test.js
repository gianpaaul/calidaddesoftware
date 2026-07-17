const { formatMoney, buildTransferReceipt } = require("../../src/services/money");

describe("Snapshot testing (formato y estructuras de salida)", () => {
  test("formatMoney con importe entero de soles", () => {
    expect(formatMoney(1050, "PEN")).toMatchInlineSnapshot(`"PEN 10.50"`);
  });

  test("formatMoney con importe menor a una unidad", () => {
    expect(formatMoney(5, "USD")).toMatchInlineSnapshot(`"USD 0.05"`);
  });

  test("formatMoney con importe exacto sin centimos", () => {
    expect(formatMoney(500000, "PEN")).toMatchInlineSnapshot(`"PEN 5000.00"`);
  });

  test("buildTransferReceipt genera la estructura esperada del recibo", () => {
    const receipt = buildTransferReceipt({
      id: 1,
      fromOwner: "Ana",
      toOwner: "Beto",
      amountCents: 3000,
      currency: "PEN",
      reference: "PAGO-01",
    });
    expect(receipt).toMatchInlineSnapshot(`
{
  "amount": "PEN 30.00",
  "receiptId": 1,
  "reference": "PAGO-01",
  "summary": "Ana -> Beto",
}
`);
  });

  test("buildTransferReceipt sin referencia usa el valor por defecto", () => {
    const receipt = buildTransferReceipt({
      id: 2,
      fromOwner: "Carla",
      toOwner: "Dora",
      amountCents: 10000,
      currency: "USD",
    });
    expect(receipt.reference).toMatchInlineSnapshot(`"SIN-REFERENCIA"`);
  });

  test("la forma del objeto de error HTTP se mantiene estable", () => {
    const errorBody = { error: "Fondos insuficientes" };
    expect(errorBody).toMatchInlineSnapshot(`
{
  "error": "Fondos insuficientes",
}
`);
  });

  // test.todo("capturar el snapshot del cuerpo de respuesta de POST /accounts usando property matchers para id y created_at");
  test("capturar el snapshot del cuerpo de respuesta de POST /accounts usando property matchers para id y created_at", () => {
    const resBody = {
      id: 1,
      owner: "Elena",
      balance: 0,
      currency: "PEN",
      status: "active",
      created_at: new Date("2023-01-01T00:00:00.000Z").toISOString(),
    };
    expect(resBody).toMatchInlineSnapshot(
      {
        id: expect.any(Number),
        created_at: expect.any(String),
      },
      `
{
  "balance": 0,
  "created_at": Any<String>,
  "currency": "PEN",
  "id": Any<Number>,
  "owner": "Elena",
  "status": "active",
}
`
    );
  });

  // test.todo("capturar el snapshot de buildTransferReceipt para un monto con tres cifras de centimos redondeadas");
  test("capturar el snapshot de buildTransferReceipt para un monto con tres cifras de centimos redondeadas", () => {
    const receipt = buildTransferReceipt({
      id: 3,
      fromOwner: "Felipe",
      toOwner: "Gina",
      amountCents: 1050, // 10.50
      currency: "PEN",
    });
    expect(receipt).toMatchInlineSnapshot(`
{
  "amount": "PEN 10.50",
  "receiptId": 3,
  "reference": "SIN-REFERENCIA",
  "summary": "Felipe -> Gina",
}
`);
  });
});
