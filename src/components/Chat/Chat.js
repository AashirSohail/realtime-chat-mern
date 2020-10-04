import React, {useState, useEffect} from 'react';
import socketio from 'socket.io-client';
import queryString from 'query-string';
import './chat.css';

import InfoBar from '../Infobar/infobar';
import Input from '../Input/input';
import Messages from '../Messages/messages';



let socket;

const Chat = () => {
//State
const [name, setName] = useState('');
const [room, setRoom] = useState('');
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);


const Endpoint = 'https://aashir-realtime-chat.herokuapp.com/'
const Path = window.location.search;
useEffect(()=> {
    const {name,room} = queryString.parse(Path);
    setName(name);
    setRoom(room);
    
    //socket
    socket = socketio(Endpoint);

    //Events
    socket.emit('join',{name,room},(error)=>{
        if (error)console.log(error);
    });

    //disconncet
    return () => {
        socket.emit('disconnect');
        socket.off();
    }
},[Endpoint,Path])

useEffect(()=> {
    //messages from server
    socket.on('message', (message)=> {
        setMessages([...messages,message]);
    })

},[messages])

const sendMessage = (event) =>{
    event.preventDefault();
    if(message){
        socket.emit('sendMessage', message, ()=> setMessage(''))
    }
}

return(
    <div className = "outerContainer">
        <div className = "container">
            <InfoBar room = {room} />
            <Messages messages = {messages} names = {name}  />
            <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage} />
        </div>
    </div>
)
}

export default Chat;