import { useContext } from "react";
import ProtectedRoute from "../../components/ProtectedRoute"
import User from "../../components/user/User"



const index = () => {

  return (
    <div>
      <ProtectedRoute >
        <div>
          <h1>Bienvenue sur votre Dashboard</h1>
          <User />
        </div>
      </ProtectedRoute>
    </div>
  )
}

export default index
