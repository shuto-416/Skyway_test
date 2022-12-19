import React, {useEffect, useState} from 'react';
import './App.css';
import Peer, {DataConnection} from 'skyway-js'

const peer = new Peer({ key: 'cdfbd8a5-dd57-4ded-a1a0-5c6c546da072' })

function App() {
  const [myId, setMyId] = useState<string>('')
  const [chatId, setChatId] = useState<string>('')
  const [myChat, setMyChat] = useState<string>('')
  const [history, setHistory] = useState<Array<any>>([])
  const [file, setFile] = useState<File | null>(null)
  const [dataConnection, setDataConnection] = useState<DataConnection>()

  useEffect(() => {
    peer.on('open', () => {
      console.log('Peer open', peer.id)
      setMyId(peer.id)
    })

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

  }, [])

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

  const sendChat = () => {
    if (dataConnection) {
      console.log('send chat', myChat)
      dataConnection.send(myChat)
    }
  }

  const sendFile = async () => {
    if (dataConnection && file) {
      console.log('send chat', file)
      const blob = new Blob([file])
      const link = URL.createObjectURL(blob)
      dataConnection.send({ link, name: file.name, })
    }
  }

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  const downLoadFile = (sunFile: File) => {
    console.log('sended', sunFile)
    const blob = new Blob([sunFile]) // Blob オブジェクトの作成
    const link = document.createElement('a')
    link.download = sunFile.name; // ダウンロードファイル名称
    link.href = URL.createObjectURL(blob); // オブジェクト URL を生成
    link.click(); // クリックイベントを発生させる
    URL.revokeObjectURL(link.href)
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
        <input name="file" type="file" onChange={onChangeFile} />
        <input type="button" disabled={!file} value="送信" onClick={sendFile} />
      </div>
      <div>
        {history.length !==0 && history.map((his, i) => (
          // <p key={i}>
          //   {his}<br />
          //   <button key={i} onClick={() => downLoadFile(his)}>ダウンロード</button>
            <a key={i} download={his.name} href={his.link}>ダウンロード</a>
          // </p>
        ))}
      </div>
    </div>
  )
}

export default App;
