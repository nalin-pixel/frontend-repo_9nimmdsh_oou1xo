import { useState } from 'react'

export default function AuthModal({ mode, onClose, onSuccess }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const base = import.meta.env.VITE_BACKEND_URL

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const url = mode==='login'? '/auth/login' : '/auth/signup'
      const body = mode==='login' ? {email, password} : {name, email, password}
      const res = await fetch(`${base}${url}`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
      if(!res.ok){ throw new Error('Auth failed') }
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onSuccess(data)
      onClose()
    }catch(err){
      alert('Hata: ' + err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{mode==='login'? 'Giriş Yap' : 'Kayıt Ol'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode==='signup' && (
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ad Soyad" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100" />
          )}
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="E-posta" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100" />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Şifre" className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100" />
          <button disabled={loading} className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50">{loading? 'Bekleyin...' : 'Devam'}</button>
        </form>
      </div>
    </div>
  )
}
