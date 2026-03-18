import { useState } from "react";
import axios from "axios";

function App() {

 const [projectId,setProjectId] = useState(1);
 const [key,setKey] = useState("");
 const [value,setValue] = useState("");

 const [valueResult,setValueResult] = useState(null);
 const [table,setTable] = useState([]);

 const createOrUpdate = async () => {

  await axios.post(
   `http://localhost:3000/projects/${projectId}/value`,
   { key,value }
  );

  setValueResult("Saved successfully");
  setTable([]);
 };

 const getValue = async () => {

  const res = await axios.get(
   `http://localhost:3000/projects/${projectId}/value/${key}`
  );

  setValueResult(res.data.value);
  setTable([]);
 };

 const getTable = async () => {

  const res = await axios.get(
   `http://localhost:3000/projects/${projectId}/table`
  );

  setTable(res.data);
  setValueResult(null);
 };

 return (

  <div style={{padding:"40px"}}>

   <h2>Project Portal</h2>

   <input
    placeholder="Project ID"
    onChange={e=>setProjectId(e.target.value)}
   />

   <br/><br/>

   <input
    placeholder="Key String"
    onChange={e=>setKey(e.target.value)}
   />

   <br/><br/>

   <input
    placeholder="Value"
    onChange={e=>setValue(e.target.value)}
   />

   <br/><br/>

   <button onClick={createOrUpdate}>
    Create / Update
   </button>

   <button onClick={getValue}>
    Get Value
   </button>

   <button onClick={getTable}>
    Show Table
   </button>

   <hr/>

   {/* VALUE RESULT */}

   {valueResult !== null && (
    <div>
     <h3>Value Result</h3>
     <p>{valueResult}</p>
    </div>
   )}

   {/* TABLE RESULT */}

   {table.length > 0 && (
    <div>
     <h3>Records</h3>
     <ul>
      {table.map((item,i)=>(
       <li key={i}>
        {item.key_string} : {item.value_int}
       </li>
      ))}
     </ul>
    </div>
   )}

  </div>
 );
}

export default App;