import { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import api from '../utils/api'

export default function Chat(){
  const [peerId, setPeerId] = useState('')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef(null)

  useEffect(()=>{
    (async ()=>{
      const { default: io } = await import('socket.io-client')
      const s = io(import.meta.env.VITE_API_URL || 'http://localhost:5000')
      socketRef.current = s
      const me = localStorage.getItem('me')
      if (me) s.emit('join', JSON.parse(me)._id)
      s.on('private-message', (msg)=> setMessages(m => [...m, msg]))
    })()
    return ()=> socketRef.current?.disconnect()
  },[])

  async function load(){
    if (!peerId) return
    const { data } = await api.get(`/api/chat/${peerId}`)
    setMessages(data.messages)
  }

  async function send(){
    const me = JSON.parse(localStorage.getItem('me')||'{}')
    socketRef.current?.emit('private-message', { senderId: me._id, receiverId: peerId, message: text })
    setText('')
  }

  return (
    <div>
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="card mb-4 flex gap-2">
          <input placeholder="Peer userId" className="p-3 rounded-lg border flex-1" value={peerId} onChange={e=>setPeerId(e.target.value)} />
          <button className="btn-primary" onClick={load}>Load</button>
        </div>
        <div className="card h-[50vh] overflow-y-auto">
          {messages.map((m,i)=> (
            <div key={i} className="mb-2"><span className="font-semibold">{m.senderId===peerId?'Them':'You'}:</span> {m.message}</div>
          ))}
        </div>
        <div className="card mt-4 flex gap-2">
          <input placeholder="Type a message" className="p-3 rounded-lg border flex-1" value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn-primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}
