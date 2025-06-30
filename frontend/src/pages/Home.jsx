import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import PomodoroTimer from '../components/pomodoro.jsx';
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
  const [chatInput, setChatInput] = useState('');
const [chatResponse, setChatResponse] = useState('');
const [isLoading, setIsLoading] = useState(false);

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
  const handleComplete = async (taskId, currentCompleted) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/tasks/${taskId}/complete`, 
        { completed: currentCompleted ? 0 : 1 },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
        setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: currentCompleted ? 0 : 1 } : task
        )
      );
    } catch (err) {
      console.error('Error marking task as complete:', err);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: chatInput,
        tasks,         
        username       
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setChatResponse(res.data.choices[0].message.content);
    } catch (err) {
      console.error('Chat error:', err);
      setChatResponse('Sorry, something went wrong.');
    }
    setIsLoading(false);
    setChatInput('');
  };
  
  
  
  useEffect(() => {
    fetchUser()
    fetchTasks()
  }, [])

  return (
   <div className='bg-gradient-to-b from-slate-200 via-orange-400 to-rose-300 min-h-screen  flex flex-col justify-between '>
    <div className = "pt-16">
    <div className = "w-fit mx-auto flex-col justify-center items-center border border-black rounded-3xl shadow-lg p-4 mt-10 mb-5 bg-pink-100">
      <div className = "justify-center item-center text-3xl font-bold">Hello, {username}! </div>
      <div className="text-sm">Welcome to your space for balance, focus, and flow</div>
    </div>
    <div>
      <div className = "container px-5 py-7 mx-auto p-4 border rounded-2xl shadow-lg bg-gray-200 border-black">
        <h1 className = "text-2xl font-bold mb-4 font-style: italic ">
          Your Tasks
        </h1>
        <div className="overflow-auto max-h-64">
          <button className="bg-gradient-to-r from-amber-500 to-pink-300 hover:from-pink-500 hover:to-red-400 text-white px-4 py-2 rounded mb-4 transition-all duration-300 ease-in-out" onClick={openAddPopup}>Add Task</button>
          <ul className='space-y-4'>
            {tasks.map(task => (
              <li key={task.id} className="bg-white mb-4 border p-4 rounded-3xl shadow flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed === 1}
                    onChange={() => handleComplete(task.id, task.completed)}
                  />
                  <div>
                    <h2 className={task.completed ? 'line-through font-semibold' : 'font-semibold'}>
                      {task.title}
                    </h2>
                    <p className={task.completed ? 'line-through' : ''}>{task.description}</p>
                    <p className="text-sm text-gray-500">Energy Level: {task.energy_level}</p>
                    <button onClick={() => openEditPopup(task)} className="mt-3 mr-2 bg-pink-300 text-white px-3 py-1 rounded-full transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-amber-500">Edit</button>
                    <button onClick={() => handleDelete(task.id)} className="mt-3 mr-2 bg-pink-300 text-white px-3 py-1 rounded-full transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-amber-500">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-pink-100 border border-black p-6 rounded-3xl w-96">
                <h2 className = 'text-xl font-bold mb-4'>{isEditMode? 'Edit Task' : 'Add Task'}</h2>

                <input
                  type= 'text'
                  placeholder= 'Title'
                  value={title}
                  onChange={(e)=> setTitle(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-xl mb-2"
                />
                <textarea
                  placeholder='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-xl mb-2"
                />

                <select className='w-full border border-gray-300 p-2 rounded-xl mb-2' value={energy} onChange={(e) => setEnergy(e.target.value)}>
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
    <div className ='w-full text-center mt-4'>
    <div className="chatbot-container inline-block align-top mr-6 mb-10 border rounded-2xl p-4 mt-6 max-w-full  shadow bg-gray-200 border-black" style={{ width: '45%' }}>
    <h3 className="font-bold text-xl mb-2 p-2 font-style: italic ">Zenbot</h3>
  <textarea
    value={chatInput}
    onChange={(e) => setChatInput(e.target.value)}
    placeholder="Ask about your tasks energy or how to get started..."
    rows={3}
    className="w-full border rounded p-2"
  />
  <button
    onClick={handleChatSubmit}
    disabled={isLoading}
    className="mr-2 bg-pink-300 text-white px-3 py-1 rounded-full transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-amber-500"
  >
    {isLoading ? 'Thinking...' : 'Ask'}
  </button>

  {chatResponse && (
    <div className="mt-4 p-3 bg-gray-100 rounded whitespace-pre-line">
      <strong>Response:</strong> <br />
      {chatResponse}
    </div>
  )}
</div>
  <div className = 'inline-block align-top w-[280px]'>
  <PomodoroTimer  />
  </div>
  </div>

   </div>
   </div>

  )
}

export default Home