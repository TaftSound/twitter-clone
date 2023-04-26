import { getAuth } from 'firebase/auth'

import { useNavigate } from "react-router-dom"
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup"


const LogoutPage = (props) => {
  const navigate = useNavigate()

  const logout = () => { getAuth().signOut() }
  const cancelLogout = () => { navigate(-1) }

  return (
    <ConfirmationPopup header="Log out of Tweeter?" 
                       confirmText="Log out"
                       confirmFunction={logout}
                       cancelFunction={cancelLogout}>
      You can always log back in at any time.
      If you just want to switch accounts, 
      you can do that by adding an existing account.
    </ConfirmationPopup>
  )
}

export default LogoutPage