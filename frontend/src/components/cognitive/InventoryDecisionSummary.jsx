import { useState } from "react";
import { Search, RefreshCw, ChevronRight, ShieldCheck } from "lucide-react";
import "./cognitive.css";

/*
  InventoryDecisionSummary + SupplierOrderPreview — illustrative Cognitive AI
  decision scene. Mechanics absorbed from a trading-summary / receipt
  reference (search, filters, row selection, animated trend, detail panel,
  paper-slide reveal) — content and semantics fully replaced: no trades, no
  PnL, no dollars. Inventory attention -> proposed supplier action -> order
  preview -> approval required. Nothing here implies an automatic purchase.
*/

const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const ITEMS = [
  {
    sku: "SKU-184", name: "Running shoe", location: "Hyderabad DC", tag: "REORDER REVIEW",
    stock: 42, demand: 210, incoming: 0, supplier: "Northline Components",
    order: { units: 240, unitPrice: 200 },
    trend: [38, 44, 40, 30, 24, 18, 14],
  },
  {
    sku: "SKU-209", name: "Travel bag", location: "Bengaluru", tag: "SUPPLIER DELAY",
    stock: 76, demand: 140, incoming: 60, supplier: "Northline Components",
    order: { units: 120, unitPrice: 230 },
    trend: [60, 62, 58, 64, 70, 74, 76],
  },
  {
    sku: "SKU-372", name: "Core tee", location: "Mumbai", tag: "STOCK IMBALANCE",
    stock: 310, demand: 95, incoming: 200, supplier: "Northline Components",
    order: { units: 0, unitPrice: 0 },
    trend: [90, 140, 190, 240, 280, 300, 310],
  },
];

const Sparkline = ({ points, active }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = points.map((p) => (max === min ? 0.5 : (p - min) / (max - min)));
  const d = norm.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (norm.length - 1)) * 60} ${20 - v * 16}`).join(" ");
  return (
    <svg viewBox="0 0 60 20" className="w-[52px] h-[16px]" aria-hidden="true">
      <path d={d} fill="none" stroke={active ? "#ff4d0a" : "rgba(255,255,255,.35)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function InventoryDecisionSummary({ autoAdvance = false }) {
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const item = selected != null ? ITEMS[selected] : null;

  const selectRow = (i) => {
    setSelected(i);
    setPreviewOpen(false);
    setTimeout(() => setPreviewOpen(true), 260);
  };

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="axc-scene" data-testid="inventory-decision-summary">
      <div className="axc-panel">
        <div className="axc-panel__head">
          <div>
            <p className="axc-eyebrow">Today · 09 AUG</p>
            <p className="axc-title">Inventory attention</p>
          </div>
          <div className="axc-headctl">
            <button type="button" className="axc-iconbtn" aria-label="Search" data-testid="axc-search-btn"><Search size={13} /></button>
            <button type="button" className="axc-iconbtn" aria-label="Refresh" onClick={refresh} data-testid="axc-refresh-btn">
              <RefreshCw size={13} className={refreshing ? "axc-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="axc-rows">
          {ITEMS.map((it, i) => (
            <button
              type="button"
              key={it.sku}
              className={`axc-row ${selected === i ? "is-selected" : ""}`}
              onClick={() => selectRow(i)}
              data-testid={`axc-row-${it.sku}`}
            >
              <span className="axc-row__id">
                <span className="axc-sku">{it.sku}</span>
                <span className="axc-name">{it.name} · {it.location}</span>
              </span>
              <Sparkline points={it.trend} active={selected === i} />
              <span className="axc-tag" data-selected={selected === i}>{it.tag}</span>
              <ChevronRight size={14} className="axc-row__chevron" aria-hidden="true" />
            </button>
          ))}
        </div>

        {item && (
          <div className="axc-detail" data-testid="axc-detail">
            <div className="axc-detail__grid">
              <div><span className="axc-detail__k">Current stock</span><span className="axc-detail__v">{item.stock} units</span></div>
              <div><span className="axc-detail__k">Expected demand</span><span className="axc-detail__v">{item.demand} units</span></div>
              <div><span className="axc-detail__k">Incoming</span><span className="axc-detail__v">{item.incoming} units</span></div>
              <div><span className="axc-detail__k">Supplier</span><span className="axc-detail__v">{item.supplier}</span></div>
            </div>
          </div>
        )}

        <p className="axc-illustrative">Illustrative product demonstration — no real inventory data.</p>
      </div>

      {item && item.order.units > 0 && (
        <SupplierOrderPreview item={item} open={previewOpen} />
      )}
    </div>
  );
}

function SupplierOrderPreview({ item, open }) {
  const subtotal = item.order.units * item.order.unitPrice;
  return (
    <div className={`axc-receipt ${open ? "is-open" : ""}`} data-testid="supplier-order-preview">
      <div className="axc-receipt__head">
        <span className="axc-receipt__label">Supplier order preview</span>
        <span className="axc-receipt__supplier">{item.supplier}</span>
      </div>
      <div className="axc-receipt__line">
        <span>{item.sku} · {item.order.units} units</span>
        <span>{inr(subtotal)}</span>
      </div>
      <div className="axc-receipt__subtotal">
        <span>Subtotal</span>
        <span>{inr(subtotal)}</span>
      </div>
      <div className="axc-receipt__status">
        <ShieldCheck size={13} aria-hidden="true" />
        Prepared for approval
      </div>
    </div>
  );
}
