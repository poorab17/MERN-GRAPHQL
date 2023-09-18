import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='d-flex flex-column justify-content-center align-items-center mt-5'>
            <FaExclamationTriangle className='text-danger' size='5em'></FaExclamationTriangle>
            <h1>404</h1>
            <p className='lead'> Sorry, this page does not Exist</p>
            <Link to='/' className='btn btn-primary'> go back</Link>

        </div>
    )
}

export default NotFound
