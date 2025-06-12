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
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTaskId, setEditTaskId] = useState(null)

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

  const openAddPopup = () => {
    setTitle('')
    setDescription('')
    setEnergy('')
    setIsEditMode(false)
    setShowPopup(true)
  }

  const openEditPopup = (task) => {
    setTitle(task.title)
    setDescription(task.description)
    setEnergy(task.energy)
    setEditTaskId(task._id)
    setIsEditMode(true)
    setShowPopup(true)
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const url = isEditMode
      ? `http://localhost:5000/tasks/${editTaskId}`
      : 'http://localhost:5000/tasks'

    const method = isEditMode ? 'put' : 'post'
    try {
      await axios[method](url, {
        title, 
        description,
        energy_level: energy
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    fetchTasks()
    setShowPopup(false)
    setTitle('')
    setDescription('')
    setEnergy('')
    setIsEditMode(false)
    setEditTaskId(null)

    }catch(err){
      console.error('Error submitting task:', err)
    }
  }

  const handleDelete = async (id) => {
    try{
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTasks()
    } catch (err){
      console.error('Error deleting task:', err)
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