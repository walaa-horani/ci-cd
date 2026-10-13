"use client";

import { useState } from "react";
import { calculateCartTotal, type CartItem } from "@/lib/cart";

export default function Home() {
  const [items, setItems] = useState<CartItem[]>([
    { id: "2", name: "Build Cache Volume", price: 15.0, quantity: 1 },
    { id: "3", name: "Static Asset CDN", price: 9.95, quantity: 1 },
  ]);

  const [discountInput, setDiscountInput] = useState<number>(15);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );

  const finalTotal = calculateCartTotal(items, discountInput);
  const clampedDiscount = Math.min(100, Math.max(0, discountInput));

  const updateQuantity = (id: string | undefined, qty: number) => {
    if (!id) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, qty) } : item
      )
    );
  };

  const updatePrice = (id: string | undefined, price: number) => {
    if (!id) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: Math.max(0, price) } : item
      )
    );
  };

  const checkHealthEndpoint = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthStatus(JSON.stringify(data));
    } catch (err) {
      setHealthStatus(
        JSON.stringify({ error: err instanceof Error ? err.message : "Failed" })
      );
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="badge">
          <span className="badge-dot" />
          Production-Ready CI/CD Demo
        </div>
        <h1 className="title">Next.js Verification Pipeline</h1>
        <p className="subtitle">
          Minimal, self-contained Next.js App Router application built for
          reliable offline builds and continuous integration.
        </p>
      </header>

      {/* CI/CD Pipeline Steps Overview */}
      <section className="pipeline-card">
        <div className="pipeline-header">
          <div className="pipeline-title">
            <span>CI/CD Pipeline Stages</span>
          </div>
          <code className="pipeline-code">npm run verify</code>
        </div>
        <div className="pipeline-steps">
          <div className="step-item">
            <div className="step-icon">1</div>
            <div className="step-info">
              <span className="step-name">Lint</span>
              <span className="step-cmd">eslint</span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">2</div>
            <div className="step-info">
              <span className="step-name">Typecheck</span>
              <span className="step-cmd">tsc --noEmit</span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">3</div>
            <div className="step-info">
              <span className="step-name">Test</span>
              <span className="step-cmd">vitest run</span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">4</div>
            <div className="step-info">
              <span className="step-name">Build</span>
              <span className="step-cmd">next build</span>
            </div>
          </div>
        </div>
      </section>

      <main className="grid">
        {/* Cart Total Calculation Demo */}
        <section className="card">
          <h2 className="card-title">Cart Discount Calculator</h2>
          <p className="card-desc">
            Powered by pure function <code>calculateCartTotal()</code> with
            guaranteed [0, 100] clamp and 2-decimal rounding.
          </p>

          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price ($)</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      className="item-price-input"
                      value={item.price}
                      onChange={(e) =>
                        updatePrice(item.id, parseFloat(e.target.value) || 0)
                      }
                      aria-label={`${item.name} price`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      className="item-qty-input"
                      value={item.quantity ?? 1}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10) || 0)
                      }
                      aria-label={`${item.name} quantity`}
                    />
                  </td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    ${((item.price * (item.quantity ?? 1))).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="discount-section">
            <label
              htmlFor="discount-input"
              style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}
            >
              Discount Percentage:
            </label>
            <div className="discount-controls">
              <input
                id="discount-input"
                type="number"
                className="discount-input"
                value={discountInput}
                onChange={(e) => setDiscountInput(parseFloat(e.target.value) || 0)}
              />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Clamped value:{" "}
                <strong style={{ color: "var(--text-main)" }}>
                  {clampedDiscount}%
                </strong>
              </span>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                CI edge case presets:
              </div>
              <div className="quick-buttons">
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => setDiscountInput(0)}
                >
                  0%
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => setDiscountInput(20)}
                >
                  20%
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => setDiscountInput(50)}
                >
                  50%
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => setDiscountInput(100)}
                >
                  100%
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => setDiscountInput(150)}
                >
                  150% (Clamped)
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => setDiscountInput(-25)}
                >
                  -25% (Clamped)
                </button>
              </div>
            </div>
          </div>

          <div className="calculation-summary">
            <div className="summary-row">
              <span>Gross Subtotal</span>
              <span>${rawSubtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Applied Discount</span>
              <span>
                -{(rawSubtotal * (clampedDiscount / 100)).toFixed(2)} ({clampedDiscount}%)
              </span>
            </div>
            <div className="summary-total">
              <span>Final Total</span>
              <span className="total-amount">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* API Route & Verification Spec Card */}
        <section className="card">
          <h2 className="card-title">Health API Check</h2>
          <p className="card-desc">
            Tests the Next.js App Router API route at <code>/api/health</code>.
          </p>

          <div className="api-box">
            <div className="api-endpoint">
              <span className="method-badge">GET</span>
              <span className="endpoint-path">/api/health</span>
            </div>
            <div className="api-response">
              {healthStatus ? (
                <code>{healthStatus}</code>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>
                  Click below to ping route handler...
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="test-btn"
            onClick={checkHealthEndpoint}
            disabled={isCheckingHealth}
          >
            {isCheckingHealth ? "Testing Route..." : "Ping Health Route"}
          </button>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Offline Ready Architecture
            </h3>
            <ul
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <li>✓ No external web fonts (pure system fonts)</li>
              <li>✓ Zero remote network calls during build</li>
              <li>✓ No environment variables required</li>
              <li>✓ Deterministic unit & route test suites</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        Next.js CI/CD Demo • Strict TypeScript • App Router • Vitest
      </footer>
    </div>
  );
}
