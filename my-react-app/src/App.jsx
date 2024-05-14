import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Input expenses</h1>
      <div className="card">
        {/* <form action="http://localhost:8000/" method="post"> */}
        <form id="page-form">
          <label htmlFor="input-type">Input type:</label><br></br>
          <select id="input-type" name="input-type">
            <option value="tangerine">Tangerine</option>
            <option value="etransfer">E-Transfer</option>
            <option value="watcard">Watcard</option>
          </select><br></br>
          <label htmlFor="ibox">Input text:</label><br></br>
          <textarea type="text" id="ibox" name="name" rows={10} cols={50}></textarea ><br></br>
          <input type="reset" value="Submit" onClick={async (e) => {
            e.preventDefault();
            let inputType = document.getElementById('input-type').value;
            let inputBox = document.getElementById('ibox');
            let data = inputBox.value;
            data = data.replaceAll('\n', '\\n');
            data = data.replaceAll('\t', '\\t');
            data = data.replaceAll('/', '\\/');
            // console.log(data)
            console.log(inputType)
            const response = await fetch("http://localhost:8000/", {
              method: "POST",
              body: `{"inputType":"${inputType}", "data": "${data}"}`
            }).then(response => response.text()).then((body) => console.log(body))
            inputBox.value = '';
          }}></input>
        </form>
      </div>
    </>
  )
}

export default App
