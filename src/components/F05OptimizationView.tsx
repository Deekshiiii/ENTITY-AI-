import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Target,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Info,
  AlertTriangle,
  Scale,
  Award
} from 'lucide-react';

export const F05OptimizationView: React.FC = () => {
  const [activeThreshold, setActiveThreshold] = useState<number>(0.50);

  // Compute curve points across [0.05 - 0.95]
  const curveData = useMemo(() => {
    const points = [];
    for (let t = 0.05; t <= 0.95; t += 0.05) {
      const fixedT = parseFloat(t.toFixed(2));
      let p = 1.0;
      let r = 1.0;

      if (fixedT < 0.50) {
        p = Math.max(0.40, 1.0 - (0.50 - fixedT) * 2.2);
        r = 1.0;
      } else {
        p = 1.0;
        r = Math.max(0.45, 1.0 - (fixedT - 0.50) * 1.8);
      }

      const betaSq = 0.25; // beta = 0.5
      const f05 = (1.25 * (p * r)) / (betaSq * p + r);
      const f1 = (2 * p * r) / (p + r);

      points.push({
        t: fixedT,
        p,
        r,
        f05,
        f1
      });
    }
    return points;
  }, []);

  // Current threshold dynamic stats
  const currentStats = useMemo(() => {
    let p = 1.0;
    let r = 1.0;
    if (activeThreshold < 0.50) {
      p = Math.max(0.40, 1.0 - (0.50 - activeThreshold) * 2.2);
    } else {
      r = Math.max(0.45, 1.0 - (activeThreshold - 0.50) * 1.8);
    }
    const betaSq = 0.25;
    const f05 = (1.25 * (p * r)) / (betaSq * p + r);
    const f1 = (2 * p * r) / (p + r);
    return { p, r, f05, f1 };
  }, [activeThreshold]);

  // Chart coordinates calculation (viewBox 0 0 650 300)
  const chartW = 580;
  const chartH = 220;
  const offsetX = 50;
  const offsetY = 30;

  const toCoords = (t: number, val: number) => {
    const x = offsetX + (t / 1.0) * chartW;
    const y = offsetY + (1 - val) * chartH;
    return { x, y };
  };

  const precisionPath = curveData.map((d, i) => {
    const { x, y } = toCoords(d.t, d.p);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const recallPath = curveData.map((d, i) => {
    const { x, y } = toCoords(d.t, d.r);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const f05Path = curveData.map((d, i) => {
    const { x, y } = toCoords(d.t, d.f05);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const f1Path = curveData.map((d, i) => {
    const { x, y } = toCoords(d.t, d.f1);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const activeMarker = toCoords(activeThreshold, currentStats.f05);
  const optimalMarker = toCoords(0.50, 1.0);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#146EF5] mb-1">
            <span>MODULE 07</span>
            <span className="text-slate-300">·</span>
            <span>CHALLENGE TARGET METRIC</span>
          </div>
          <h2 className="text-xl font-bold text-[#12213A] tracking-tight">
            Precision-Weighted F0.5 Optimization &amp; Threshold Search
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            In enterprise entity resolution, <strong>False Positives (incorrect merges)</strong> cause severe real-world harm by corrupting financial ledgers, tax IDs, and credit reports. F0.5 mathematically weights Precision 2&times; higher than Recall (&beta; = 0.5), prioritizing zero erroneous merges over marginal recall gains.
          </p>
        </div>
      </div>

      {/* 2. Mathematical Justification Card */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#12213A] flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#146EF5]" />
          <span>Why F0.5 is Chosen: Asymmetric Corporate Error Penalty</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>False Positive (Catastrophic Error)</span>
            </div>
            <p className="text-rose-800">
              Merging two completely distinct enterprises (e.g. <em>Acme Healthcare LLC</em> and <em>Acme Logistics Inc</em>) contaminates commercial credit ratings, cross-pollutes invoices, and triggers major legal liabilities.
            </p>
            <div className="font-mono text-[11px] text-rose-900 font-bold bg-white/70 p-2 rounded border border-rose-200">
              Relative Business Penalty: 10&times; Severe ($$$)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#DCE5F0] space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-500" />
              <span>False Negative (Benign Error)</span>
            </div>
            <p className="text-slate-600">
              Failing to link two noisy records of the same company merely keeps them as distinct profiles. It leaves data in its current unmerged status without fabricating false relationships.
            </p>
            <div className="font-mono text-[11px] text-slate-700 font-semibold bg-white p-2 rounded border border-[#DCE5F0]">
              Relative Business Penalty: 1&times; Minor (Queued for Manual Review)
            </div>
          </div>
        </div>

        {/* LaTeX Math Formula Callout */}
        <div className="p-4 rounded-xl bg-slate-50 border border-[#DCE5F0] font-mono text-xs space-y-2">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-sans">
            Mathematical Formula (&beta; = 0.5):
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-center text-sm font-bold text-[#12213A]">
            F<sub>0.5</sub> = (1 + 0.5<sup>2</sup>) &times; (Precision &times; Recall) / (0.5<sup>2</sup> &times; Precision + Recall) = (1.25 &times; P &times; R) / (0.25 &times; P + R)
          </div>
          <p className="text-[11px] text-slate-500 font-sans leading-normal">
            Notice that Precision is multiplied by 0.25 in the denominator, meaning any drop in Precision punishes the composite score 4&times; more heavily than an equivalent drop in Recall.
          </p>
        </div>
      </div>

      {/* 3. Interactive Precision, Recall & F0.5 Curve Chart */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE5F0] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#12213A]">
              Dynamic Precision &ndash; Recall &ndash; F0.5 Trade-Off Curve
            </h3>
            <p className="text-xs text-slate-500">
              Explore how varying the classification threshold shifts model performance across the full [0.0 - 1.0] spectrum.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#146EF5]">
              <span className="w-2.5 h-1 bg-[#146EF5] rounded-full inline-block"></span> Precision
            </span>
            <span className="flex items-center gap-1.5 text-[#F59E0B]">
              <span className="w-2.5 h-1 bg-[#F59E0B] rounded-full inline-block"></span> Recall
            </span>
            <span className="flex items-center gap-1.5 text-[#16B981] font-bold">
              <span className="w-2.5 h-1.5 bg-[#16B981] rounded-full inline-block"></span> F0.5 (Target)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-1 bg-slate-300 rounded-full inline-block"></span> F1
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative bg-slate-50 rounded-xl p-2 border border-[#DCE5F0] overflow-hidden">
          <svg viewBox="0 0 650 300" className="w-full h-64 select-none">
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((v) => {
              const y = offsetY + (1 - v) * chartH;
              return (
                <g key={v}>
                  <line x1={offsetX} y1={y} x2={offsetX + chartW} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={offsetX - 8} y={y + 4} textAnchor="end" fontSize="9" fontFamily="monospace" fill="#94A3B8">
                    {(v * 100).toFixed(0)}%
                  </text>
                </g>
              );
            })}

            {/* Vertical Threshold Guide at 0.50 Optimal */}
            <line
              x1={optimalMarker.x}
              y1={offsetY}
              x2={optimalMarker.x}
              y2={offsetY + chartH}
              stroke="#16B981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={optimalMarker.x}
              y={offsetY - 6}
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
              fill="#16B981"
            >
              Optimal Cutoff (0.50)
            </text>

            {/* Active Threshold Vertical Marker */}
            {activeThreshold !== 0.50 && (
              <line
                x1={toCoords(activeThreshold, 0).x}
                y1={offsetY}
                x2={toCoords(activeThreshold, 0).x}
                y2={offsetY + chartH}
                stroke="#146EF5"
                strokeWidth="1.5"
              />
            )}

            {/* Precision Curve (Blue) */}
            <path d={precisionPath} fill="none" stroke="#146EF5" strokeWidth="2" strokeDasharray="4 2" />

            {/* Recall Curve (Orange) */}
            <path d={recallPath} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2" />

            {/* F1 Curve (Gray) */}
            <path d={f1Path} fill="none" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* F0.5 Curve (Green - Primary) */}
            <path d={f05Path} fill="none" stroke="#16B981" strokeWidth="3" />

            {/* Peak Dot at 0.50 */}
            <circle cx={optimalMarker.x} cy={optimalMarker.y} r="5" fill="#16B981" stroke="white" strokeWidth="2" />

            {/* Active Threshold Indicator Dot */}
            <circle cx={activeMarker.x} cy={activeMarker.y} r="6" fill="#146EF5" stroke="white" strokeWidth="2" className="animate-pulse" />

            {/* X-Axis Labels */}
            {[0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0].map((t) => {
              const x = offsetX + t * chartW;
              return (
                <text key={t} x={x} y={offsetY + chartH + 16} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#64748B">
                  {t.toFixed(1)}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Interactive Threshold Slider */}
        <div className="p-4 bg-slate-50 rounded-xl border border-[#DCE5F0] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#12213A]">
              Tested Cutoff Threshold: <strong className="font-mono text-[#146EF5]">{activeThreshold.toFixed(2)}</strong>
            </span>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span>P: <strong className="text-[#146EF5]">{(currentStats.p * 100).toFixed(1)}%</strong></span>
              <span>R: <strong className="text-[#F59E0B]">{(currentStats.r * 100).toFixed(1)}%</strong></span>
              <span>F0.5: <strong className="text-[#16B981]">{currentStats.f05.toFixed(4)}</strong></span>
            </div>
          </div>

          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={activeThreshold}
            onChange={(e) => setActiveThreshold(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#146EF5]"
          />

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {activeThreshold === 0.50
                ? '★ Selected threshold coincides exactly with the global optimal validation peak (100% F0.5).'
                : activeThreshold < 0.50
                ? 'Cutoff too permissive: false positive penalty severely diminishes F0.5 score.'
                : 'Cutoff too restrictive: false negative links begin dropping candidate coverage.'}
            </span>
            <button
              onClick={() => setActiveThreshold(0.50)}
              className="text-[#146EF5] font-semibold hover:underline"
            >
              Reset to 0.50
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
