import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import CategoryGrid from './components/CategoryGrid'
import ProductList from './components/ProductList'
import Pricing from './components/Pricing'
import OrgDashboard from './components/OrgDashboard'

const base = import.meta.env.VITE_BACKEND_URL

function App(){
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [query, setQuery] = useState('')

  const [orgs, setOrgs] = useState([])
  const [activeOrg, setActiveOrg] = useState(null)
  const [plans, setPlans] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(()=>{
    const u = localStorage.getItem('user')
    if(u){ setUser(JSON.parse(u)) }
    refreshFavorites()
    loadCategories()
    loadProducts()
    loadPlans()
    if(localStorage.getItem('token')){
      loadOrgs()
    }
  },[])

  async function loadCategories(){
    const res = await fetch(`${base}/categories?limit=24`)
    const data = await res.json()
    setCategories(data.items || [])
  }

  async function loadProducts(params={}){
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(`${base}/products?limit=24${qs? '&'+qs:''}`)
    const data = await res.json()
    setProducts(data.items || [])
  }

  function onSearch(q){
    setQuery(q)
    loadProducts({ q, category_slug: selectedCategory||'' })
  }

  function onSelectCategory(slug){
    setSelectedCategory(slug)
    loadProducts({ q: query||'', category_slug: slug })
  }

  function onAuthSuccess({user}){
    setUser(user)
    refreshFavorites()
    loadOrgs()
  }

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null)
    setFavoritesCount(0)
    setOrgs([])
    setActiveOrg(null)
    setProjects([])
  }

  async function refreshFavorites(){
    const token = localStorage.getItem('token')
    if(!token){ setFavoritesCount(0); return }
    const res = await fetch(`${base}/favorites`, {headers:{'Authorization':`Bearer ${token}`}})
    if(res.ok){
      const data = await res.json()
      setFavoritesCount((data.items||[]).length)
    }
  }

  async function addFav(p){
    const token = localStorage.getItem('token')
    if(!token){ setShowLogin(true); return }
    const res = await fetch(`${base}/favorites`, {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify({product_sku: p.sku})})
    if(res.ok){ refreshFavorites() }
  }

  // SaaS functions
  async function loadPlans(){
    const res = await fetch(`${base}/plans`)
    const data = await res.json()
    setPlans(data.items || [])
  }

  async function loadOrgs(){
    const token = localStorage.getItem('token')
    if(!token) return
    const res = await fetch(`${base}/orgs`, {headers:{'Authorization':`Bearer ${token}`}})
    if(res.ok){
      const data = await res.json()
      setOrgs(data.items||[])
      setActiveOrg(data.items?.[0]?._id || null)
      if(data.items?.[0]?._id){
        loadProjects(data.items[0]._id)
      }
    }
  }

  async function createOrg(name){
    const token = localStorage.getItem('token')
    const res = await fetch(`${base}/orgs`, {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify({name})})
    if(res.ok){ loadOrgs() }
  }

  async function loadProjects(org_id){
    const token = localStorage.getItem('token')
    const res = await fetch(`${base}/projects?org_id=${org_id}`, {headers:{'Authorization':`Bearer ${token}`}})
    if(res.ok){
      const data = await res.json()
      setProjects(data.items||[])
    }
  }

  async function createProject(org_id, name){
    const token = localStorage.getItem('token')
    const res = await fetch(`${base}/projects`, {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify({org_id, name})})
    if(res.ok){ loadProjects(org_id) }
  }

  async function subscribe(org_id, plan_key){
    const token = localStorage.getItem('token')
    const res = await fetch(`${base}/subscriptions`, {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify({org_id, plan_key})})
    if(res.ok){ /* no-op */ }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar user={user} onLoginClick={()=>setShowLogin(true)} onSignupClick={()=>setShowSignup(true)} onLogout={logout} onSearch={onSearch} favoritesCount={favoritesCount} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <section className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">SaaS Platform – Proje ve Organizasyon Yönetimi</h1>
          <p className="text-slate-300 mt-2">Organizasyon oluşturun, ekipleri davet edin, projeler açın ve plan seçerek ölçeklenin.</p>
        </section>

        <Pricing plans={plans} onSelect={(p)=> user ? subscribe(activeOrg, p.key) : setShowLogin(true)} />

        {user && (
          <OrgDashboard
            orgs={orgs}
            activeOrg={activeOrg}
            onCreateOrg={createOrg}
            onSelectOrg={(id)=>{ setActiveOrg(id); loadProjects(id) }}
            projects={projects}
            onCreateProject={(name)=> createProject(activeOrg, name)}
          />
        )}

        <section>
          <h2 className="text-xl text-white font-semibold mb-4">Kategoriler</h2>
          {categories.length ? (
            <CategoryGrid categories={categories} onSelect={onSelectCategory} />
          ) : (
            <div className="text-slate-400">Kategori yok. Başlangıç için birkaç kategori ekleyin.</div>
          )}
        </section>

        <section>
          <h2 className="text-xl text-white font-semibold mb-4">Örnek Ürünler</h2>
          {products.length ? (
            <ProductList products={products} onOpenOffers={(p)=>window.alert('Fiyat karşılaştırma örnek: API /offers/'+p.sku)} onFav={addFav} />
          ) : (
            <div className="text-slate-400">Ürün bulunamadı.</div>
          )}
        </section>
      </main>

      {showLogin && <AuthModal mode="login" onClose={()=>setShowLogin(false)} onSuccess={onAuthSuccess} />}
      {showSignup && <AuthModal mode="signup" onClose={()=>setShowSignup(false)} onSuccess={onAuthSuccess} />}
    </div>
  )
}

export default App
