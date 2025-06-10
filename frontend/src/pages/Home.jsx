import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const [username, setUsername] = useState('')

  const[tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [energy, setEnergy] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const navigate = useNavigate()
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/auth/home', {
        headers: {
          "Authorization" : `Bearer ${token}`
        }
      })
      if(response.status === 201) {
        setUsername(response.data.user.username)
      } else {
        navigate('/login')
      }
    } catch(err){
      navigate('/login')
      console.log(err)
    }
  }

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(response.data.tasks)
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
  }
  
  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/tasks', {
          title,
          description,
          energy
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      if (response.status === 201) {
        setTitle('')
        setDescription('')
        setEnergy('')
        fetchTasks()
      }
      
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }
  useEffect(() => {
    fetchUser()
    fetchTasks()
  }, [])
  return (
    <div>
      <div>
        <h1>Good morning, {username}</h1>
      </div>
      <div>

      </div>

    </div>
  )
}

export default Home