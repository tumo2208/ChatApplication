// import React, { use, useState } from "react";
// import SockJS from "sockjs-client";
// import {over} from "stompjs";

// var stompClient = null;
// const ChatRoom = () => {
//     const [userData, setUserData] = useState({
//         username: "",
//         receiver: "",
//         connected: false,
//         message: ""
//     })

//     const [publicChats, setPublicChats] = useState([]);
//     const [privateChats, setPrivateChats] = useState(new Map());

//     const [tab, setTab] = useState("CHATROOM");


//     const handleUsername = (event) => {
//         const {value} = event.target;
//         setUserData({...userData, "username": value});
//     }

//     const handleMessage = (event) => {
//         const {value} = event.target;
//         setUserData({...userData, "message": value});
//     }

//     const Register = () => {
//         let sockJS = new SockJS("http://localhost:8080/ws");
//         stompClient = over(sockJS);
//         stompClient.connect({}, onConnected, onError);
//     }

//     const userJoin = () => {
//         let chatMessage = {
//             sender: userData.username,
//             status: "JOIN"
//         };
//         stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
//     }

//     const onConnected = () => {
//         setUserData({...userData, "connected": true});
//         stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
//         stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessageReceived);
//         userJoin();
//     }

//     const onError = (err) => {
//         console.error(err);
//     }

//     const onPublicMessageReceived = (payload) => {
//         let payloadData = JSON.parse(payload.body);
//         switch (payload.status) {
//             case "JOIN":
//                 if (!privateChats.get(payloadData.sender)) {
//                     privateChats.set(payload.sender, []);
//                     setPrivateChats(new Map(privateChats));
//                 }
//                 break;
//             case "MESSAGE": 
//                 publicChats.push(payloadData);
//                 setPublicChats([...payloadData]);
//                 break;
                
//         }
//     }

//     const onPrivateMessageReceived = (payload) => {
//         let payloadData = JSON.parse(payload.body);
//         if (privateChats.get(payloadData.sender)) {
//             privateChats.get(payloadData.sender).push(payloadData);
//             setPrivateChats(new Map(privateChats));
//         } else {
//             let list = [];
//             list.push(payloadData);
//             privateChats.set(payloadData.sender, list);
//             setPrivateChats(new Map(privateChats));
//         }
//     }

//     const sendPublicMessage = () => {
//         if (stompClient) {
//             let chatMessage = {
//                 sender: userData.username,
//                 message: userData.message,
//                 status: "MESSAGE"
//             };
//             stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
//             setUserData({...userData, "message": ""});
//         }
//     }

//     const sendPrivateMessage = () => {
//         if (stompClient) {
//             let chatMessage = {
//                 sender: userData.username,
//                 receiver: tab,
//                 message: userData.message,
//                 status: "MESSAGE"
//             };

//             if (userData.username !== tab) {
//                 privateChats.get(tab).push(chatMessage);
//                 setPrivateChats(new Map(privateChats));
//             }

//             stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
//             setUserData({...userData, "message": ""});
//         }
//     }

//     return (
//         <div className="container">
//             {userData.connected ? 
//             <div className="chat-box">
//                 <div className="member-list">
//                     <ul>
//                         <li onClick={() => {setTab("CHATROOM")}} className={`member ${tab === "CHATROOM" && "active"}`}>ChatRoom</li>
//                         {[...privateChats.keys()].map((name, index) => (
//                             <li onClick={() => {setTab(name)}} className={`member ${tab === name && "active"}`} key={index}>
//                                 {name}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 {tab === "CHATROOM" && <div className="chat-content">
//                     <ul className="chat-message">
//                         {publicChats.map((chat, index) => (
//                             <li className="message" key={index}>
//                                 {chat.sender !== userData.username && <div className="avatar">{chat.sender}</div>} 
//                                 <div className="message-data">{chat.message}</div>
//                                 {chat.sender === userData.username && <div className="avater self">{chat.sender}</div>}    
//                             </li>
//                         ))}
//                     </ul>

//                     <div className="send-message">
//                         <input type="text" className="input-message" placeholder="Enter public message" 
//                         value={userData.message} onChange={handleMessage}/>
//                         <button type="button" className="send-button" onClick={sendPublicMessage}>Send</button>
//                     </div>
                    
//                 </div>}

//                 {tab !== "CHATROOM" && <div className="chat-content">
//                     <ul>
//                         {[...privateChats.get(tab)].map((chat, index) => (
//                             <li className="message" key={index}>
//                                 {chat.sender !== userData.username && <div className="avatar">{chat.sender}</div>} 
//                                 <div className="message-data">{chat.message}</div>
//                                 {chat.sender === userData.username && <div className="avater self">{chat.sender}</div>}    
//                             </li>
//                         ))}
//                     </ul>
                    
//                     <div className="send-message">
//                         <input type="text" className="input-message" placeholder="Enter public message" 
//                         value={userData.message} onChange={handleMessage}/>
//                         <button type="button" className="send-button" onClick={sendPrivateMessage}>Send</button>
//                     </div>
//                 </div>}
//             </div> 
//             : 
//             <div className="register">
//                 <input 
//                 id="user_name"
//                 placeholder="Enter your username"
//                 value={userData.username}
//                 onChange={handleUsername} />

//                 <button type="button" onClick={Register}>
//                     Register    
//                 </button>    
//             </div>}
//         </div>
//     );
// }

// export default ChatRoom;


import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient =null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });
    useEffect(() => {
      console.log(userData);
    }, [userData]);

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{
        connect();
    }
    return (
    <div className="container">
        {userData.connected?
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                </div>
            </div>}
        </div>
        :
        <div className="register">
            <input
                id="user-name"
                placeholder="Enter your name"
                name="userName"
                value={userData.username}
                onChange={handleUsername}
                margin="normal"
              />
              <button type="button" onClick={registerUser}>
                    connect
              </button> 
        </div>}
    </div>
    )
}

export default ChatRoom