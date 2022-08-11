import React, {useEffect, useState} from 'react'

function newTicket() {
    const [allData, setAllData] = useState()
useEffect(()=>{
    async function getData(){
        let res = await fetch ("http://localhost:4000/api/ticket/model")
    }
}, [])
  return (
    <div>

    </div>
  )
}

export default newTicket