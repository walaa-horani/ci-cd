export interface CartItem {
  id?: string;
  name?: string;
  price: number;
  quantity?: number;
}

export type CartInput = CartItem[] | number;

/**
 * Calculates the total cost of a cart after applying a percentage discount.
 *
 * Requirements:
 * - The discount is clamped between 0 and 100.
 * - The result is rounded to 2 decimal places.
 * - Supports an array of cart items or a direct subtotal number.
 *
 * @param cart - Array of cart items (price & quantity) or direct subtotal number
 * @param discountPercentage - Percentage discount to apply (clamped between 0 and 100)
 * @returns Final total rounded to 2 decimal places
 */
export function calculateCartTotal(
  cart: CartInput,
  discountPercentage: number = 0
): number {
  const rawSubtotal =
    typeof cart === "number"
      ? cart
      : cart.reduce((sum, item) => {
        const qty = item.quantity ?? 1;
        return sum + item.price * qty;
      }, 0);

  const subtotal = Math.max(0, Number.isFinite(rawSubtotal) ? rawSubtotal : 0);
  const safeDiscount = Number.isFinite(discountPercentage) ? discountPercentage : 0;
  const clampedDiscount = Math.min(100, Math.max(0, safeDiscount));

  const total = subtotal * (1 - clampedDiscount / 100);
  return Math.round((total + Number.EPSILON) * 100) / 100;
}
