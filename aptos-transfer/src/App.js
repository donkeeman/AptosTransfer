import {GoogleSpreadsheet} from "google-spreadsheet";
import {JWT} from "google-auth-library";
import {useState} from "react";

const [sender, setSender] = useState('')
const [addressList, setAddressList] = useState([])

const creds = require('./aptos-transfer-0ba8b9517ba6.json')
const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const doc = new GoogleSpreadsheet('1pihEm3KoWyoBHQTr9neVAxqsOkNB3Hw8Rj1pJjqJcqk', serviceAccountAuth)
// const loadSheet = async () => {
//   await doc.loadInfo()
//   const sheet = doc.sheetsByIndex[0]
//   console.log(sheet)
// }


function App() {
  return (
    <div className="App">
      <h1>앱토스 트랜스퍼 페이지</h1>

      <span>보내는 주소</span>

      <span>당첨자 지갑 주소 리스트</span>
    </div>
  );
}

export default App;
