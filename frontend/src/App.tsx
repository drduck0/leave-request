import { Route, Routes } from 'react-router-dom'
import Login from './auth/Login'
import LeavePage from './components/LeavePage'
import ManagerView from './components/ManagerView'
import ProtectedRoute from './main/ProtuctedRoute'
import Unauthorized from './main/Unauthorized'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />}/>
      
      <Route element={<ProtectedRoute allowedRoles={['user', 'manager']} />}>
        <Route path='/apply-leave' element={<LeavePage />}/>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route path='/approve-leave' element={<ManagerView />}/>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  )
}

export default App
