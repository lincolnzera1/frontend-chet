import React, { useEffect, useState, useRef } from 'react'
import './Chat.css'
import { v4 as uuidv4 } from "uuid";

import io from "socket.io-client"
const socket = io.connect("https://backendjdiwqodwq.herokuapp.com") // conexão com o backend
socket.on('connect', () => console.log("A new user has been connected"))

const myId = uuidv4()

const Chat = () => {

    const [message, setMessage] = useState("")
    const [lista, setLista] = useState([])
    const [limite, setLimite] = useState(20)
		const messagesEndRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()  
        
        if(message.trim()){
            socket.emit("send.message", {
                id: myId,
                message
            })
        }

       /*   setLista([... lista, {
            id: myId,
            message
        }])  */
        setMessage("")
    }

    const handleInputChange = (e) => {
        setMessage(e.target.value)
        if(message.length >= limite){
            setLimite(limite + 20)
            console.log("esse é o limite: " + limite)
            setMessage(message+"\n")
        }
    }

    
    useEffect(() => {
        console.log("alou")

        const handleNewMessage = newMessage =>
            setLista([...lista, newMessage])
        
            console.log("A lista é: " + lista)
        socket.on('send.message', handleNewMessage)
        return () => socket.off('send.message', handleNewMessage)
    }, [lista])

		useEffect(() => {
			messagesEndRef.current?.scrollIntoView()
		}, [lista])

  return (
    <div>
        
        
       
       <div className='container'>
           <div className="quadrado">
                <ul className='uele'>
                        {lista.map((item, index) => (
                            <li key={index} className={item.id === myId ? "list-mine" : "list-other"}>
                                <span className={item.id === myId ? "mine" : "other"}>{item.message}</span>
                            </li>
                        ))}
												<div ref={messagesEndRef} />
                </ul>
           </div>
       </div>
       <footer className="footer">
					<form onSubmit={handleSubmit}>
						<input type="text" name="nome" id="nome" onChange={handleInputChange} value={message}/>
						<input type="submit" value="Send Message" onSubmit={handleSubmit}/>
					</form>
			 </footer>
    </div>
  )
}

export default Chat