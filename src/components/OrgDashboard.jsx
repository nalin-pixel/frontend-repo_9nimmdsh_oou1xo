import { useState } from 'react'

export default function OrgDashboard({ orgs, activeOrg, onCreateOrg, onSelectOrg, projects, onCreateProject }){
  const [orgName, setOrgName] = useState('')
  const [projectName, setProjectName] = useState('')

  return (
    <section className="rounded-2xl bg-slate-800 border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Organizasyonlar ve Projeler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-white font-medium mb-2">Organizasyonlarım</h3>
          <div className="flex gap-2 mb-3">
            <input value={orgName} onChange={e=>setOrgName(e.target.value)} placeholder="Yeni organizasyon adı" className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100" />
            <button onClick={()=>{ if(orgName.trim()) { onCreateOrg(orgName.trim()); setOrgName('') } }} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Oluştur</button>
          </div>
          <div className="space-y-2">
            {orgs.map(o => (
              <button key={o._id} onClick={()=>onSelectOrg(o._id)} className={`w-full text-left px-3 py-2 rounded-lg border ${activeOrg===o._id? 'bg-blue-600/20 border-blue-600 text-white':'bg-slate-900 border-slate-700 text-slate-200'}`}>{o.name}</button>
            ))}
            {!orgs.length && <div className="text-slate-400 text-sm">Henüz organizasyon yok. Bir tane oluşturun.</div>}
          </div>
        </div>
        <div>
          <h3 className="text-white font-medium mb-2">Projeler</h3>
          <div className="flex gap-2 mb-3">
            <input value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="Yeni proje adı" className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100" />
            <button disabled={!activeOrg} onClick={()=>{ if(projectName.trim() && activeOrg){ onCreateProject(projectName.trim()); setProjectName('') } }} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50">Ekle</button>
          </div>
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p._id} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">{p.name}</div>
            ))}
            {!projects.length && <div className="text-slate-400 text-sm">Bu organizasyonda proje yok.</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
