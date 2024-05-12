import {GoogleSpreadsheet} from "google-spreadsheet";
import {useState, useEffect, useMemo} from "react";

function App() {
    const [sender, setSender] = useState('')
    const [receiverList, setReceiverList] = useState([])
    const [amount, setAmount] = useState(1)
    
    const creds = require('./aptos-transfer-0ba8b9517ba6.json')
    const doc = useMemo(() => {
        return new GoogleSpreadsheet('1pihEm3KoWyoBHQTr9neVAxqsOkNB3Hw8Rj1pJjqJcqk')
    }, [])

    const connectWallet = async () => {
        if(!window.aptos){
            console.error('petra is not installed')
            return
        }
        const wallet = await window.aptos.connect()

        setSender(wallet.address)
    }

    const disconnectWallet = async () => {
        if(!window.aptos){
            console.error('petra is not installed')
            return
        }
        await window.aptos.disconnect()
        setSender('')
    }

    const sendAptos = async () => {
        const test = [...receiverList]
        if(!sender) return
        for(const receiver of test) {
            if(receiver.version) {
                continue
            }
            const transaction = {
                type:'entry_function_payload',
                function: '0x1::aptos_account::transfer_coins',
                type_arguments: ['0x1::aptos_coin::AptosCoin'],
                arguments: [receiver.address, amount * 100000000]
            }
        
            const result = await window.aptos.signAndSubmitTransaction(transaction)
            receiver.version = result.version
        
        }

        console.log(test)
        await doc.useServiceAccountAuth(creds)
        await doc.loadInfo()
        const sheet = doc.sheetsByIndex[0]
        await sheet.clearRows()
        await sheet.addRows(test)
        console.log(sheet)
    }

    const transferedStyle = {
        textDecoration: 'line-through'
    }
    
    useEffect(() => {
        const load= async () => {
            const test = []
            await doc.useServiceAccountAuth(creds)
            await doc.loadInfo()
            const sheet = doc.sheetsByIndex[0]
            const rows = await sheet.getRows()
            rows.forEach(row => {
                test.push({
                    address: row["address"],
                    version: row["version"]
                })
            })
            setReceiverList(test)
        }

        load()
    }, [creds, doc])
    
    
  return (
    <div className="App">
      <h1>앱토스 트랜스퍼 페이지</h1>
      <a href="https://docs.google.com/spreadsheets/d/1pihEm3KoWyoBHQTr9neVAxqsOkNB3Hw8Rj1pJjqJcqk/edit?usp=sharing" target="_blank" rel="noreferrer">시트 링크</a>
      <br />
      <strong>※ 네트워크는 지갑의 네트워크를 따라갑니다. 실제로 보내기 전에 충분히 테스트해보시길 추천드립니다.<br/>(해당 페이지는 테스트넷으로만 테스트해보았기 때문에, 메인넷도 테스트가 필요합니다.)<br />추가로 시트에서 version이 있는 어드레스는 이미 보낸 것으로 간주하여 보내는 과정을 생략하기 때문에 테스트 후에는 version 열의 내용을 빈 값으로 비워주세요.</strong>
      <div>
        <p>발신자 주소:{sender}</p>
        <span>보낼 양: </span>
        <input value={amount} onChange={e => setAmount(e.target.value)} /> APT
        </div>
        <div>
        <button onClick={connectWallet}>지갑 연결</button>
        <button onClick={disconnectWallet}>지갑 연결 해제</button>
        <button onClick={sendAptos}>보내기</button>
      </div>
      <span>당첨자 지갑 주소 리스트</span>
      <ol>
        {receiverList[0] && receiverList.map((receiver, index) => {
            return <li style={receiver.version && transferedStyle} key={index}>{receiver.address}</li>
        })}
      </ol>
    </div>
  );
}

export default App;
