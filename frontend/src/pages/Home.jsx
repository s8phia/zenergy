import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [username, setUsername] = useState('')
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

  useEffect(() => {
    fetchUser()
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