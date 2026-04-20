import { Metadata } from "next";

export const metadata: Metadata = { title: "Nike Pegasus 41" };

export default function ShoeDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-xs text-[#888580] uppercase tracking-widest mb-3">Shoe detail</p>
        <h1 className="font-serif text-4xl mb-2">/{params.slug}</h1>
        <p className="text-[#888580]">Full shoe detail page — built in Phase 1 as HTML prototype.</p>
        <p className="text-[#888580] text-sm mt-1">Will be converted to this Next.js route next.</p>
      </div>
    </div>
  );
}
