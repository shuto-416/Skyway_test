import React, {useEffect, useState} from 'react';
import './App.css';
import Peer, {DataConnection} from 'skyway-js'

const peer = new Peer({ key: 'cdfbd8a5-dd57-4ded-a1a0-5c6c546da072' })

function App() {
  const [myId, setMyId] = useState<string>('')
  const [chatId, setChatId] = useState<string>('')
  const [myChat, setMyChat] = useState<string>('')
  const [history, setHistory] = useState<Array<string>>([])
  const [dataConnection, setDataConnection] = useState<DataConnection>()

  useEffect(() => {
    peer.on('open', () => {
      console.log('Peer open', peer.id)
      setMyId(peer.id)
    })
  }, [peer])

  const connectChat = () => {
    const dataConn = peer.connect(chatId)
    dataConn.on('open', () => {
      console.log('data connection open')
      setDataConnection(dataConn)
    })

    dataConn.on('data', (chat: any) => {
      console.log('data', chat)
      history.push(chat)
      setHistory(history)
    })
  }

  useEffect(() => {
    peer.on("connection", (data) => {
      data.on('open', () => {
        console.log('data connection open')
        setDataConnection(data)
      })

      data.on('data', (chat: any) => {
        console.log('data', chat)
        history.push(chat)
        setHistory(history)
      })
    })
  }, [peer])

  const sendChat = () => {
    if (dataConnection) {
      console.log('send chat', myChat)
      dataConnection.send(myChat)
    }
  }



  return (
    <div className="App">
      <div>my peer ID: {myId}</div>
      <label htmlFor="example">connect</label>
      <input type="text" name="text" onChange={(e) => setChatId(e.target.value)}/>
      <button onClick={(e) => connectChat()}>connect</button>
      <div>
        <input type='text' onChange={(e) => setMyChat(e.target.value)}/>
        <button onClick={(e) => sendChat()}>send</button>
      </div>
      <div>
        {history.length !==0 && history.map((his, i) => (
          <p key={i}>
            {his}<br />
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
