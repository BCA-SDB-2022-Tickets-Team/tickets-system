import React, { useEffect, useState } from "react";
import "./newTicket.css";

function NewTicket() {
  const [allData, setAllData] = useState([]);
  // let fieldNameArray = [];
  // let fieldValueArray = [];
  let newTicketBody={}

  useEffect(() => {
    async function getData() {
      let res = await fetch("http://localhost:4000/api/ticket/req/model");
      let data = await res.json();
      //console.log(data);
      setAllData(data);
    }
    getData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault()
    e.target.reset(); // TODO: change this so redirected
    // TODO: Set up fetch for post request to send newTicketBody to the create-ticket endpoint
    console.log(newTicketBody)
    fetch('http://localhost:4000/api/ticket/create',
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      method: "POST",
      body: JSON.stringify({
       newTicketBody
      }),
    })
    .then((res)=>{
      if (!res.ok){
      return res.json()
    } else {
      console.log('ticket created')
    }
  })
  .then(error=>{
    console.log(error)
  })

  .catch((error)=>{
    // error.json()
    // .then(err=>console.log(err))
    console.log(error)
  })
  }

  console.log(allData);
  return (
    <div>
      <h2>new</h2>
      <form onSubmit={handleSubmit} >
        {allData.map((field) => {
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
                onChange={e => { 
                  newTicketBody[field.name] = e.target.value
                }}
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
