import { useEffect, useState } from 'react'
import {Calendar} from './ui/calendar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import api from '@/api'

const LeavePage = () => {

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [reason, setReason] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [data, setData] = useState([])

    async function fetchdata() {
    const user : any = JSON.parse(localStorage.getItem("data") || '')
    try {
      const response = await api.post("approve-leave", user)
      setData(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])

    const onSubmit = async () => {
        const user : any = JSON.parse(localStorage.getItem("data") || '')
        if (!reason) {
            setError('Fill the form');
            return;
        }

        const procDate = date?.toISOString().split('T')[0];
        const data = {
            date : procDate,
            email : user?.email,
            message : reason
        }
        
        await api.post('/leave-apply', data)
        .then(res => console.log(res))
        .catch(err => console.log(err))

        setDate(new Date());
        setReason('');
        setError('');
        alert('Request Submited')
        fetchdata()
    }

  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center gap-5 p-6 md:p-10">
        <h1 className=' text-3xl font-medium'>Apply for Leave</h1>
        <div className="w-full flex shadow-2xl p-1 gap-1">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
            />
            <Textarea placeholder='Please Enter Your Reason' value={reason} onChange={e => setReason(e.target.value)} required/>
        </div>
        <p className=' text-red-700'>{error ? error : ''}</p>
        <Button onClick={onSubmit} type='submit'>Submit</Button>

        <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Message</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                </tr>
            </thead>
            <tbody>
                {data.map((leave : any, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{leave.date}</td>
                      <td className="border border-gray-300 px-4 py-2">{leave.message}</td>
                      <td className="border border-gray-300 px-4 py-2">{leave.status[0].toUpperCase() + leave.status.slice(1)}</td>
                  </tr>
                ))}
            </tbody>
        </table>

    </div>
  )
}

export default LeavePage
