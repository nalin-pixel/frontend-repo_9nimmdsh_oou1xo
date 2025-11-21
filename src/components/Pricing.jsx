export default function Pricing({ plans=[], onSelect }){
  return (
    <section className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-white text-center mb-6">Planlar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.key} className="rounded-2xl bg-slate-800 border border-slate-700 p-6 flex flex-col">
            <h3 className="text-white text-xl font-semibold">{p.name}</h3>
            <div className="text-slate-300 mt-1">{p.key}</div>
            <div className="text-3xl font-bold text-white mt-4">${p.price_monthly}<span className="text-sm text-slate-400">/ay</span></div>
            <ul className="text-slate-300 mt-4 space-y-2 flex-1">
              {(p.features||[]).map((f,i)=>(<li key={i}>• {f}</li>))}
            </ul>
            <button onClick={()=>onSelect(p)} className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Seç</button>
          </div>
        ))}
      </div>
    </section>
  )
}
