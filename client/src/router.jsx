import React, { useContext, useState } from "react";
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
  const { sessionRole } = useContext(LoginContext);
  const [auth] = useState(props.permittedRoles.includes(sessionRole));

  let location = useLocation();

  if (!auth) {
    return <Navigate to="/" replace state={{ from: location }} />;
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
      <Route path="/oneticket" element={<OneTicket ticketID={ticketID} Navigate={Navigate} sessionId={sessionId} />} />
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
