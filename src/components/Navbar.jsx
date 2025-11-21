import { useState, useEffect } from 'react'

export default function Navbar({ user, onLoginClick, onSignupClick, onLogout, onSearch, favoritesCount }) {
  const [q, setQ] = useState('')

  function submit(e){
    e.preventDefault()
    onSearch(q)
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="text-white font-bold text-xl">FiyatBul</div>
        <form onSubmit={submit} className="flex-1">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ürün ara..." className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </form>
        <div className="flex items-center gap-3">
          <button className="text-slate-300 hover:text-white" title="Favoriler">
            ❤️ <span className="ml-1 text-sm">{favoritesCount}</span>
          </button>
          {!user && (
            <>
              <button onClick={onLoginClick} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700">Giriş</button>
              <button onClick={onSignupClick} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Kayıt</button>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 hidden sm:inline">{user.name}</span>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700">Çıkış</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
