"use client"
import { useState } from "react"

export default function Home() {
  const [tab, setTab] = useState("home")
  return (
    <div style={{maxWidth:"480px",margin:"0 auto",minHeight:"100vh",background:"#F5F5F7"}}>
      <div style={{background:"white",padding:"0 16px",height:"60px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(0,0,0,.07)",position:"sticky",top:0,zIndex:50}}>
        <span style={{fontSize:"20px",fontWeight:800,color:"#1C1C1E"}}>Kurd<span style={{color:"#FF6B35"}}>Link</span></span>
      </div>
      <div style={{padding:"20px 16px"}}>
        <h1 style={{fontSize:"24px",fontWeight:800,color:"#1C1C1E",marginBottom:"16px"}}>Find trusted Kurdish professionals</h1>
      </div>
    </div>
  )
}
