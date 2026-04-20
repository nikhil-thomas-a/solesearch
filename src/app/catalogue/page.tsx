import { Metadata } from "next";

export const metadata: Metadata = { title: "Catalogue" };

export default function CataloguePage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar filters */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 p-6 gap-6"
        style={{ borderRight: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 56, alignSelf: "flex-start", maxHeight: "calc(100vh - 56px)", overflowY: "auto" }}
      >
        <div>
          <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-3">Category</p>
          {["Road running","Trail running","Basketball","Sneakers","Hiking","Gym + training","Walking","Boots","Wide fit"].map(c => (
            <label key={c} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <input type="checkbox" className="accent-[#E8FF4A] w-3 h-3" />
              <span className="text-sm text-[#888580] group-hover:text-[#F0EEE8] transition-colors">{c}</span>
            </label>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
          <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-3">Brand</p>
          {["Nike","ASICS","Brooks","Saucony","New Balance","Hoka","On","Salomon"].map(b => (
            <label key={b} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <input type="checkbox" className="accent-[#E8FF4A] w-3 h-3" />
              <span className="text-sm text-[#888580] group-hover:text-[#F0EEE8] transition-colors">{b}</span>
            </label>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
          <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-3">Price range</p>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" className="input-ss w-full" />
            <input type="number" placeholder="Max" className="input-ss w-full" />
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
          <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-3">Min CoreScore</p>
          <input type="range" min={0} max={100} defaultValue={70} className="w-full accent-[#E8FF4A]" />
          <span className="font-mono text-xs text-[#888580]">70+</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
          <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-3">Heel drop (mm)</p>
          {["Zero drop (0mm)","Low drop (1–4mm)","Moderate (5–8mm)","High drop (9mm+)"].map(d => (
            <label key={d} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <input type="checkbox" className="accent-[#E8FF4A] w-3 h-3" />
              <span className="text-sm text-[#888580] group-hover:text-[#F0EEE8] transition-colors">{d}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#888580]">1,213 shoes</span>
            <span className="text-[rgba(255,255,255,0.1)]">·</span>
            <span className="font-mono text-xs text-[#E8FF4A]">No filters active</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[#888580]">Sort by</span>
            <select className="input-ss !w-auto !py-1.5 text-xs" style={{ background: "#111111" }}>
              <option>Best score</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
              <option>Lightest</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px p-0" style={{ background: "rgba(255,255,255,0.08)" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-[#0A0A0A] p-5 group hover:bg-[#111111] transition-colors cursor-pointer">
              {/* Shoe image placeholder */}
              <div className="aspect-[4/3] flex items-center justify-center mb-4 rounded-sm" style={{ background: "#111111" }}>
                <div className="w-20 h-10 rounded-full opacity-10" style={{ background: "#E8FF4A" }} />
              </div>
              <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest">Nike</p>
              <p className="font-serif text-lg mt-0.5 group-hover:text-[#E8FF4A] transition-colors">Pegasus {41 + i}</p>
              <div className="flex justify-between items-baseline mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-semibold">${110 + i * 5}</span>
                <span className="font-mono text-xs" style={{ color: "#E8FF4A" }}>{85 + (i % 10)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-10">
          {[1,2,3,"...",24].map((p, i) => (
            <button key={i} className={`font-mono text-xs w-8 h-8 rounded-sm transition-colors ${p === 1 ? 'bg-[#E8FF4A] text-[#0A0A0A]' : 'text-[#888580] hover:text-[#F0EEE8]'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
