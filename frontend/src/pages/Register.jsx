import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [values, setValues] = useState({
        username:'',
        email:'',
        password:''
    })
    const handleChanges =(e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5000/auth/register', values)
            console.log(response)
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='shadow-lg px-8 py-5 border w-96'>
                <h2 className='text-lg font-bold mb-4'>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor="username" className='block text-gray-700'>Username</label>
                        <input type="text" placeholder='Enter username' className='w-full px-3 py-2 border'
                        name='username' onChange={handleChanges} />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="email" className='block text-gray-700'>Email</label>
                        <input type="email" placeholder='Enter email' className='w-full px-3 py-2 border'
                        name='email' onChange={handleChanges} />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="password" className='block text-gray-700'>Password</label>
                        <input type="password" placeholder='Enter password' className='w-full px-3 py-2 border'
                        name='password' onChange={handleChanges}/>
                    </div>
                    <button className='w-full bg-pink-400 text-white py-2 border px-3'>Submit</button>
                </form>
                <div className="text-center mt-3">
                    <span>Already have an account?</span>
                    <Link to="/login" className='text-pink-400'>Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;