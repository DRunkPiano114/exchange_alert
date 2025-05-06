'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [alerts, setAlerts] = useState([])
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('AUD')
  const [threshold, setThreshold] = useState('')
  const [emailTo, setEmailTo] = useState('')

  useEffect(() => {
    fetch('/api/alerts').then(res => res.json()).then(setAlerts)
  }, [])

  async function handleSubmit(e: any) {
    e.preventDefault()
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromCurrency: from, toCurrency: to, threshold: parseFloat(threshold), emailTo })
    })
    location.reload()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">添加汇率提醒</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input className="border p-2 w-full" placeholder="From Currency (e.g. USD)" value={from} onChange={e => setFrom(e.target.value)} />
        <input className="border p-2 w-full" placeholder="To Currency (e.g. AUD)" value={to} onChange={e => setTo(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Threshold (e.g. 1.50)" value={threshold} onChange={e => setThreshold(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Alert Email" value={emailTo} onChange={e => setEmailTo(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">添加提醒</button>
      </form>

      <h2 className="text-xl mt-6 mb-2 font-semibold">已有提醒</h2>
      <ul className="list-disc pl-4">
        {alerts.map((a: any, i) => (
          <li key={i}>{a.fromCurrency} → {a.toCurrency} <span className="text-sm">(阈值 {a.threshold})</span></li>
        ))}
      </ul>
    </div>
  )
}