import React, { useContext } from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../index';

/**
 * Global Nav element that should be visible on all pages.
 * It's unopinionated to the user's role and will function for all roles
 * but change its appearance / allowed links depending on Role
 * @returns {JSX Component} 
 */
function GlobalNav() {
  const {logoutAndClearSession, sessionRole } = useContext(LoginContext)
  // const [active, setActive] = useState(true)
  const navigate = useNavigate()
  const logout = (e) => {
    e.preventDefault()
    logoutAndClearSession()
    navigate('/')
  }
  return (
    <Nav tabs>
      {
        /* Add/Modify/Delete custom Fields -- requires Role 4 */
        ["4"].includes(sessionRole) ?
          <NavItem >
            <NavLink onClick={
              () => navigate('/add-custom-field')
            }>
              Modify Ticket Fields
            </NavLink>
          </NavItem>
        :
          null
      }
      {
        /* Add/Modify User -- requires Role 2 or Role 4 */
        ["2", "4"].includes(sessionRole) ?
          <NavItem 
            active={true}
          >
            <NavLink onClick={() => navigate('/createuser')}>
              Users
            </NavLink>
          </NavItem>
        :
          null
      }
      {
        /* View and Add Tickets -- requires ANY session Role [1-4] */
        sessionRole !== undefined ?
          <>
          <NavItem>
            <NavLink onClick={() => navigate('/alltickets')}>
              View Tickets
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => navigate('/newticket')}>
              New Ticket
            </NavLink>
          </NavItem>
          </>
        : 
          null
      }
      {/* Logout Button */}
      <NavItem>
        <NavLink 
          onClick={logout}
          href="#"
        > 
          Logout 
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default GlobalNav