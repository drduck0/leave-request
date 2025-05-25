import { useEffect, useState } from 'react'
import api from '@/api'

const ManagerView = () => {
  const [data, setData] = useState([])

  const fetchData = async () => {
    const user: any = JSON.parse(localStorage.getItem('data') || '')
    try {
      const response = await api.post('approve-leave', user)
      console.log(response.data)
      setData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleStatusChange = async (leaveId: string, newStatus: string) => {
    try {
      await api.post('/update-leave-status', {
        id: leaveId,
        status: newStatus,
      })

      setData((prev : any) =>
        prev.map((leave: any) =>
          leave.id === leaveId ? { ...leave, status: newStatus } : leave
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="flex flex-col min-h-[90svh] w-full items-center gap-5 p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-4">Manager View</h1>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Message</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((leave: any, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{leave.email}</td>
              <td className="border border-gray-300 px-4 py-2">{leave.date}</td>
              <td className="border border-gray-300 px-4 py-2">{leave.message}</td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={leave.status}
                  onChange={e => handleStatusChange(leave.id, e.target.value)}
                  className=' w-full'
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManagerView
