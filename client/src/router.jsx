import React, { useContext, useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import CreateUser from "./components/CU/createuser";
import Login from "./components/Login/Login";
import NewTicket from "./components/NewTicket/NewTicket";
import AllTickets from "./components/AllTickets/AllTickets";
import OneTicket from "./components/OneTicket/OneTicket";
import { LoginContext } from './index';
import AddCustomField from './components/AddCustomField/AddCustomField';

//* THIS IS HOW TO AUTHENTICATE ROUTES *\\
//this returns a "pass-through" component that takes:
//? permittedRoles <Array>
//and compares them. If the comparison fails, it redirects to "/"
function RequireAuth(props) {
  const { sessionRole, sessionToken } = useContext(LoginContext);
  const [auth, setAuth] = useState(props.permittedRoles.includes(sessionRole));
  let location = useLocation();
  //check for a stale token, and alert/re-route the user if its found
  useEffect(() => {
    async function checkin(){
      if(sessionRole){
        try {
          fetch('http://localhost:4000/api/user/check-in', {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: sessionToken,
            }),
          })
          .then(res => {
            if(!res.ok){
              if(res.status === 406 && location.pathname !== '/'){
                window.alert('Your token has expired, please log in again to continue.')
                setAuth(false)
              }
            } 
          })
        } catch (error) {
          console.log(`check-in failed`)
          console.log(error)
        }
      } else {
        setAuth(false)
      }
    }
    checkin()
  }, [])

  if (!auth) {
    if(location.pathname === '/'){
      return null
    } else {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }
  /*
   * the props object includes a few internal properties
   * in addition to the ones we define.
   * One of these is props.children, which includes all the JSX
   * components that are children of this component.
   * In the following example:
   * <ThisComponent>
   *  <ChildOne />
   *  <ChildTwo />
   *  <ChildThree />
   * </ThisComponent>
   * props.children would look like:
   *  [RenderChildOne(), RenderChildTwo(), RenderChildThree()]
   * By retruning them on the next line, we allow React to render
   * the RequireAuth's children ONLY WHEN THE PERMITTED ROLES MATCH UP!
   */
  return props.children;
}

function Router() {
  const { sessionRole, sessionToken, sessionId } = useContext(LoginContext);
  const [ticketID, setTicketID] = useState("");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/createuser"
        element={
          <RequireAuth permittedRoles={["2", "4"]}>
            <CreateUser sessionToken={sessionToken} sessionRole={sessionRole} />
          </RequireAuth>
        }
      />
      <Route path="/newticket" element={
        <RequireAuth permittedRoles={["1", "2", "3", "4"]}>
          <NewTicket />
        </RequireAuth>
      }
      />
      <Route
        path="/alltickets"
        element={
          <RequireAuth permittedRoles={["1", "2", "3", "4"]}>
            <AllTickets setTicketID={setTicketID} sessionRole={sessionRole} />
          </RequireAuth>
        }
      />
      <Route path="/oneticket" element={<OneTicket ticketID={ticketID} sessionId={sessionId} />} />
      <Route path=
        '/add-custom-field'
        element={
          <RequireAuth permittedRoles={["4"]}>
            <AddCustomField />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default Router;
