import React from 'react'
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';

const BackButton = ({destination = '/'}) => {
  return (
    <div className='flex'>
        <Link to={destination} className='bg-sky-500 text-white px-4 py-1 rounded-lg w-fit'>
            <HiArrowLeft />
        </Link>
    </div>
  )
}

export default BackButton