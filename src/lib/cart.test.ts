import { describe, expect, it } from "vitest";
import { calculateCartTotal, type CartItem } from "./cart";

describe("calculateCartTotal", () => {
  it("applies a standard percentage discount correctly", () => {
    const items: CartItem[] = [
      { price: 50, quantity: 1 },
      { price: 25, quantity: 2 },
    ]; // subtotal = 100
    expect(calculateCartTotal(items, 20)).toBe(80);
  });

  it("clamps discount above 100 to 100 and returns 0", () => {
    const items: CartItem[] = [{ price: 100, quantity: 1 }];
    expect(calculateCartTotal(items, 150)).toBe(0);
    expect(calculateCartTotal(items, 101)).toBe(0);
    expect(calculateCartTotal(75.5, 200)).toBe(0);
  });

  it("clamps negative discount to 0 without inflating price", () => {
    const items: CartItem[] = [{ price: 100, quantity: 1 }];
    expect(calculateCartTotal(items, -25)).toBe(100);
    expect(calculateCartTotal(50, -0.5)).toBe(50);
  });

  it("returns unchanged subtotal when discount is 0%", () => {
    const items: CartItem[] = [{ price: 42.5, quantity: 2 }];
    expect(calculateCartTotal(items, 0)).toBe(85);
    expect(calculateCartTotal(42.5, 0)).toBe(42.5);
  });

  it("returns 0 when discount is exactly 100%", () => {
    const items: CartItem[] = [{ price: 99.99, quantity: 1 }];
    expect(calculateCartTotal(items, 100)).toBe(0);
  });

  it("rounds result correctly to 2 decimal places", () => {
    // 49.99 * (1 - 0.15) = 42.4915 -> 42.49
    expect(calculateCartTotal(49.99, 15)).toBe(42.49);

    // 10 * (1 - 0.3333) = 6.667 -> 6.67
    expect(calculateCartTotal(10, 33.33)).toBe(6.67);

    // 19.99 * 3 = 59.97; 59.97 * (1 - 0.125) = 52.47375 -> 52.47
    const items: CartItem[] = [{ price: 19.99, quantity: 3 }];
    expect(calculateCartTotal(items, 12.5)).toBe(52.47);
  });

  it("handles items without explicit quantity as quantity of 1", () => {
    const items: CartItem[] = [
      { price: 20 },
      { price: 30, quantity: 2 },
    ]; // 20 + 60 = 80
    expect(calculateCartTotal(items, 10)).toBe(72);
  });

  it("handles empty cart or zero subtotal gracefully", () => {
    expect(calculateCartTotal([], 20)).toBe(0);
    expect(calculateCartTotal(0, 10)).toBe(0);
  });
});
