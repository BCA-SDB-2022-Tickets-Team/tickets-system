import React, { useEffect, useState } from "react";
import "./newTicket.css";

function NewTicket() {
  const [allData, setAllData] = useState([]);
  let newTicketBody = {}

  useEffect(() => {
    async function getData() {
      let res = await fetch("http://localhost:4000/api/ticket/req/model", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        })
      });
      let data = await res.json();
      setAllData(data);
    }
    getData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault()
    e.target.reset(); // TODO: change this so redirected instead of just form reset

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
      .then((res) => {
        if (!res.ok) {
          return res.json()
        } else {
          console.log('ticket created')
        }
      })

      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div>
      <h2>new</h2>
      <form onSubmit={handleSubmit}>
        {allData.map((field) => {

          if (!field.enum) {
            return (
              <label key={field.name} htmlFor={field.name}>
                {field.name}{': '}
                <input
                  onChange={(e) => {
                    newTicketBody[field.name] = e.target.value;
                  }}
                />
              </label>
            );
          } else {
            return (
              <label key={field.name} htmlFor={field.name}>
                {field.name}{': '}

                <select
                  onChange={(e) => {
                    newTicketBody[field.name] = e.target.value;
                  }}
                >
                  {
                    field.enum.map((item) => {
                      return (
                        <option value={item}>{item}</option>
                      )
                    })
                  }

                </select>
              </label>
            );
          }
        })}
        <input type="submit" />
      </form>
    </div>
  );
}

export default NewTicket;
