import React, { useEffect, useState } from "react";
import "./newTicket.css";

function NewTicket() {
  const [allData, setAllData] = useState([]);
  let fieldNameArray = [];
  let fieldValueArray = [];

  useEffect(() => {
    async function getData() {
      let res = await fetch("http://localhost:4000/api/ticket/model");
      let data = await res.json();
      //console.log(data);
      setAllData(data);
    }
    getData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault()
    e.target.reset(); // TODO: change this so redirected
    // TODO: Set up fetch for post request to send body to the create-ticket endpoint
    let body = {}
    function createBody() {
      for (let i = 0; i < fieldNameArray.length; i++) {
        body[fieldNameArray[i]] = fieldValueArray[i]
      }
    }
    createBody()

  }

  console.log(allData);
  return (
    <div>
      <h2>new</h2>
      <form onSubmit={handleSubmit} >
        {allData.map((field) => {
          fieldNameArray.push(field.name)
          console.log(fieldNameArray)
          return (
            <label
              key={field.name}
              htmlFor={field.name}>
              {field.name}
              <input
                type={
                  field.type === "String" || field.type === "Number"
                    ? "text"
                    : "checkbox"
                }
                onChange={e => { fieldValueArray[fieldNameArray.indexOf(field.name)] = e.target.value; console.log(fieldValueArray) }}
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
