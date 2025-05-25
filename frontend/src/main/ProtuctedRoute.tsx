import { Button } from '@/components/ui/button'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('data') || 'null')

  const logout = () => {
    localStorage.clear()
    navigate('/')
    window.location.reload()
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return (
    <>
      <div className=' justify-end flex pt-5 pr-2.5'>
        <Button onClick={logout} variant={'destructive'}>Logout</Button>
      </div>
      <Outlet />
    </>
  )
}

export default ProtectedRoute
