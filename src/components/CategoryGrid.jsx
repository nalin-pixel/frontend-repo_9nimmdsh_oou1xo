export default function CategoryGrid({ categories, onSelect }){
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map(cat => (
        <button key={cat.slug} onClick={()=>onSelect(cat.slug)} className="group p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/10 transition">
          <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
          <div className="text-slate-100 font-medium group-hover:text-white">{cat.title}</div>
        </button>
      ))}
    </div>
  )
}
