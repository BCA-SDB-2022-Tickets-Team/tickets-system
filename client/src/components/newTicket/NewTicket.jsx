import React, { useEffect, useState } from "react";
import "./NewTicket.css";

function NewTicket() {
  const [allData, setAllData] = useState([]);
  
  
  useEffect(() => {
    async function getData() {
      let res = await fetch("http://localhost:4000/api/ticket/model");
      let data = await res.json();
      console.log(data);
      setAllData(data);
    }
    getData();
  }, []);
  // function handleChange(e){
  //   e.target.name = e.target.value
  //   console.log(e.target.name)
  // }
  function handleSubmit(e) {
    e.preventDefault()
    console.log('here')
    console.log(e.target.elements)

  }
  console.log(allData);
  return (
    <div>
      <h2>new</h2>
      <form onSubmit={handleSubmit} >
        {allData.map((field) => {
          return (
            <label
            key={field.name}>
              {field.name}
              <input
              
                type={
                  field.type === "String" || field.type === "Number"
                    ? "text"
                    : "checkbox"
                }
              />
            </label>
          );
        })}
        <input type="submit" 
        
        />
      </form>
    </div>
  );
}

export default NewTicket;
