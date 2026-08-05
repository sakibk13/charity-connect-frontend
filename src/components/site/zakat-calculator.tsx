"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCurrency } from "@/components/site/currency-context";
import { CURRENCIES } from "@/lib/currency";

const ASSET_FIELDS = [
  { id: "cash", label: "Cash & Bank Accounts", icon: "fa-wallet", helper: "Total cash in hand, savings, checking, and current accounts." },
  { id: "gold", label: "Gold Value", icon: "fa-gem", helper: "Weight in grams × current market rate. Include jewelry intended for investment." },
  { id: "silver", label: "Silver Value", icon: "fa-ring", helper: "Weight in grams × current market rate." },
  { id: "business", label: "Business Inventory", icon: "fa-store", helper: "Merchandise, stock-in-trade, raw materials held for sale." },
  { id: "investments", label: "Investments", icon: "fa-chart-line", helper: "Stocks, mutual funds, ETFs, cryptocurrency, and other liquid investments." },
  { id: "other", label: "Other Zakatable Assets", icon: "fa-hand-holding-dollar", helper: "Rental income receivable, outstanding loans you've given, and similar receivables." },
] as const;

const LIABILITY_FIELDS = [
  { id: "debt", label: "Short-Term Debts", icon: "fa-money-bill-transfer", helper: "Personal loans, installments, and debts due within the next 12 months." },
  { id: "credit", label: "Credit Card Balances", icon: "fa-credit-card", helper: "Outstanding balances on all credit cards as of today." },
  { id: "otherLiab", label: "Other Deductible Liabilities", icon: "fa-receipt", helper: "Taxes owed, wages payable, and other immediate financial obligations." },
] as const;

type FieldState = Record<string, number>;

const ZAKAT_RATE = 0.025;

function formatNum(n: number, fractionDigits: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
}

export function ZakatCalculator({ nisab }: { nisab: number }) {
  const [assets, setAssets] = useState<FieldState>({});
  const [liabilities, setLiabilities] = useState<FieldState>({});
  const { currency } = useCurrency();
  const { symbol, fractionDigits } = CURRENCIES[currency];
  const placeholder = fractionDigits > 0 ? "0.00" : "0";

  const { totalAssets, totalLiabilities, netWealth, zakatDue, zakatAmount, progress } =
    useMemo(() => {
      const totalAssets = Object.values(assets).reduce((sum, v) => sum + (v || 0), 0);
      const totalLiabilities = Object.values(liabilities).reduce((sum, v) => sum + (v || 0), 0);
      const netWealth = Math.max(0, totalAssets - totalLiabilities);
      const zakatDue = netWealth >= nisab;
      const zakatAmount = zakatDue ? netWealth * ZAKAT_RATE : 0;
      const progress = nisab > 0 ? Math.min(100, (netWealth / nisab) * 100) : 0;
      return { totalAssets, totalLiabilities, netWealth, zakatDue, zakatAmount, progress };
    }, [assets, liabilities, nisab]);

  const progressColor = zakatDue
    ? "linear-gradient(90deg, #22c55e, #16a34a)"
    : "linear-gradient(90deg, var(--pt-accent), #d97706)";

  return (
    <div className="zakat-layout">
      <div>
        <div className="zakat-section-card">
          <div className="zakat-section-header">
            <div className="zakat-section-icon assets"><i className="fa-solid fa-coins" /></div>
            <div>
              <h3>Your Assets</h3>
              <p>Enter the current value of each asset category</p>
            </div>
          </div>
          {ASSET_FIELDS.map((f) => (
            <div key={f.id} className="zakat-field">
              <label className="zakat-field-label" htmlFor={`asset-${f.id}`}>
                <i className={`fa-solid ${f.icon}`} /> {f.label}
              </label>
              <div className="zakat-field-helper">{f.helper}</div>
              <div className="zakat-input-wrap">
                <span className="currency-symbol">{symbol}</span>
                <input
                  id={`asset-${f.id}`}
                  type="number"
                  className="zakat-input"
                  placeholder={placeholder}
                  min={0}
                  step="any"
                  onChange={(e) => setAssets((prev) => ({ ...prev, [f.id]: Number(e.target.value) || 0 }))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="zakat-section-card">
          <div className="zakat-section-header">
            <div className="zakat-section-icon liabilities"><i className="fa-solid fa-file-invoice-dollar" /></div>
            <div>
              <h3>Your Liabilities</h3>
              <p>Deductible debts and obligations due within the year</p>
            </div>
          </div>
          {LIABILITY_FIELDS.map((f) => (
            <div key={f.id} className="zakat-field">
              <label className="zakat-field-label" htmlFor={`liab-${f.id}`}>
                <i className={`fa-solid ${f.icon}`} /> {f.label}
              </label>
              <div className="zakat-field-helper">{f.helper}</div>
              <div className="zakat-input-wrap">
                <span className="currency-symbol">{symbol}</span>
                <input
                  id={`liab-${f.id}`}
                  type="number"
                  className="zakat-input"
                  placeholder={placeholder}
                  min={0}
                  step="any"
                  onChange={(e) => setLiabilities((prev) => ({ ...prev, [f.id]: Number(e.target.value) || 0 }))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="zakat-results-panel">
        <div className="zakat-results-card">
          <div className="zakat-results-header">
            <h3><i className="fa-solid fa-calculator" style={{ marginRight: 8 }} /> Zakat Summary</h3>
            <p>Nisab: {symbol}{formatNum(nisab, fractionDigits)}</p>
          </div>
          <div className="zakat-results-body">
            <div className="zakat-result-row">
              <span className="label">Total Assets</span>
              <span className="value positive">{symbol}{formatNum(totalAssets, fractionDigits)}</span>
            </div>
            <div className="zakat-result-row">
              <span className="label">Total Liabilities</span>
              <span className="value negative">−{symbol}{formatNum(totalLiabilities, fractionDigits)}</span>
            </div>
            <div className="zakat-result-row" style={{ borderBottom: "2px solid var(--pt-border)", paddingBottom: 16 }}>
              <span className="label" style={{ fontWeight: 700, color: "var(--pt-text)" }}>Net Zakatable Wealth</span>
              <span className="value" style={{ fontSize: "1.1rem" }}>{symbol}{formatNum(netWealth, fractionDigits)}</span>
            </div>

            <div className="zakat-nisab-section">
              <div className="zakat-nisab-labels">
                <span>Your Wealth</span>
                <span>Nisab: {symbol}{formatNum(nisab, fractionDigits)}</span>
              </div>
              <div className="zakat-progress-track">
                <div className="zakat-progress-fill" style={{ width: `${progress}%`, background: progressColor }} />
              </div>
              <div className="zakat-nisab-status" style={{ color: zakatDue ? "#22c55e" : "var(--pt-text-muted)" }}>
                {zakatDue ? (
                  <><i className="fa-solid fa-circle-check" style={{ marginRight: 4 }} /> Your wealth meets the Nisab threshold</>
                ) : (
                  <><i className="fa-solid fa-circle-info" style={{ marginRight: 4 }} /> {progress > 0 ? `${Math.round(progress)}% towards Nisab` : "Enter your assets above"}</>
                )}
              </div>
            </div>

            {zakatDue ? (
              <div className="zakat-amount-display">
                <div className="label-small">Your Zakat Due</div>
                <div className="big-amount">{symbol}{formatNum(zakatAmount, fractionDigits)}</div>
                <div className="rate-note">2.5% of net zakatable wealth</div>
              </div>
            ) : (
              <div className="zakat-not-due">
                <i className="fa-solid fa-hand-holding-heart" />
                <p>Zakat is not obligatory on your current wealth. You may still give voluntary Sadaqah to earn reward.</p>
              </div>
            )}

            {zakatDue ? (
              <Link href="/donate" className="zakat-donate-btn active">
                <i className="fa-solid fa-hand-holding-heart" /> Donate My Zakat Now
              </Link>
            ) : (
              <button type="button" className="zakat-donate-btn disabled" disabled>
                <i className="fa-solid fa-hand-holding-heart" /> Donate My Zakat Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
