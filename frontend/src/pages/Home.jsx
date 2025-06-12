import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const [username, setUsername] = useState('')
  const [tasks, setTasks] = useState([])
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
    setEnergy(task.energy_level)
    setEditTaskId(task.id)
    setIsEditMode(true)
    setShowPopup(true)
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    const url = isEditMode
      ? `http://localhost:5000/tasks/${editTaskId}`
      : 'http://localhost:5000/tasks'

    const method = isEditMode ? 'patch' : 'post'
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
    <div className = "w-fit mx-auto flex-col justify-center items-center border rounded-3xl shadow-lg p-4 mt-10 mb-5">
      <div className = "justify-center item-center text-3xl font-bold mb-2">Hello, {username}! </div>
      <div className="text-sm">Welcome to your space for balance, focus, and flow</div>
    </div>
    <div>
      <div className = "container px-5 py-7 mx-auto p-4 border rounded-2xl shadow-lg overflow-auto max-h-80">
        <h1 className = "text-2xl font-bold mb-4">
          Your Tasks
        </h1>
        <div>
          <button onClick={openAddPopup}>Add Task</button>
          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <div>
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                  <p>Energy Level: {task.energy_level}</p>
                  <button onClick={() => openEditPopup(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="big-white p-6 reounded w-96">
                <h2>{isEditMode? 'Edit Task' : 'Add Task'}</h2>

                <input
                  type= 'text'
                  placeholder= 'Title'
                  value={title}
                  onChange={(e)=> setTitle(e.target.value)}
                />
                <textarea
                  placeholder='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
                  <option value="">Select Energy Level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowPopup(false)}>Cancel</button>
                  <button onClick={handleSubmit}>{isEditMode ? 'Update Task' : 'Add Task'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
   </div>

  )
}

export default Home