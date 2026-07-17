const {
  applyFee,
  toCents,
  validateAmount,
  computeInterest,
  toUnits,
} = require("../../src/services/money");
const { createAccount } = require("../../src/services/accounts.service");

describe("Regresion (defectos historicos que no deben reaparecer)", () => {
  test("BUG-089: applyFee con feeBps=0 ya no produce NaN", () => {
    expect(applyFee(10000, 0)).toBe(10000);
    expect(Number.isNaN(applyFee(10000, 0))).toBe(false);
  });

  test("BUG-104: toCents ya no trunca importes con tres decimales", () => {
    expect(toCents(19.999)).toBe(2000);
  });

  test("BUG-118: validateAmount ya no acepta cadenas numericas como centimos validos", () => {
    expect(() => validateAmount("100")).toThrow("centimos enteros");
  });

  test("BUG-126: computeInterest ya no retorna un valor negativo con tasa cero", () => {
    const interes = computeInterest(100000, 0, 30);
    expect(interes).toBe(0);
  });

  test("BUG-133: applyFee ya no redondea hacia abajo comisiones fraccionarias mayores a 0.5", () => {
    expect(applyFee(1000, 55)).toBe(1006);
  });

  test("BUG-141: validateAmount ya no permite Infinity como monto valido", () => {
    expect(() => validateAmount(Infinity)).toThrow();
  });

  // CORRECCIÓN: Implementar tests pendientes de regresion
  // test.todo("BUG-152: verificar que toUnits ya no pierde precision con centimos superiores a 10 millones");
  test("BUG-152: verificar que toUnits ya no pierde precision con centimos superiores a 10 millones", () => {
    // 10000001 centimos = 100000.01
    expect(toUnits(10000001)).toBe(100000.01);
  });

  // test.todo("BUG-160: verificar que un titular con espacios al inicio y al final ya no genera cuentas duplicadas logicamente distintas");
  test("BUG-160: verificar que un titular con espacios al inicio y al final ya no genera cuentas duplicadas logicamente distintas", async () => {
    const mockPool = {
      query: jest.fn().mockResolvedValue({
        rows: [{ id: 1, owner: "Juan", balance: 0, currency: "PEN" }]
      })
    };
    await createAccount(mockPool, { owner: "  Juan  " });
    // Verificamos que el primer parametro en el array de valores fue trimmed
    expect(mockPool.query.mock.calls[0][1][0]).toBe("Juan");
  });
});
