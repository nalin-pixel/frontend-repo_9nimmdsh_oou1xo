export default function ProductList({ products, onOpenOffers, onFav }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.sku} className="rounded-xl bg-slate-800 border border-slate-700 p-4">
          {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded-lg mb-3" />}
          <div className="text-white font-semibold mb-1">{p.title}</div>
          <div className="text-slate-400 text-sm mb-3">{p.brand || 'Marka'}</div>
          <div className="flex items-center justify-between">
            <button onClick={()=>onOpenOffers(p)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Fiyatları Gör</button>
            <button onClick={()=>onFav(p)} className="text-slate-300 hover:text-white">❤️</button>
          </div>
        </div>
      ))}
    </div>
  )
}
