import React, {useState } from 'react'
import BackButton from '../../components/BackButton';
import { Spinner } from '../../components/Spinner';;
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteUnit = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();
    const handleDeleteUnit = () => {
        setLoading(true);
        axios
            .delete(`http://localhost:5555/units/${id}`, {
                withCredentials: true
            })
            .then(() => {
                setLoading(false);
                navigate('/units')
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Check Console for details.');
                console.log(error);
            })
    }
  return (
    <div className='p-4'>
        <BackButton destination='/units' />
        <h1 className='text-3xl my-4'>Delete Unit</h1>
        {loading ? <Spinner /> : ''}
        <div className='flex flex-col items-center w-[600px] p-8 mx-auto'>
            <h2 className='text-2xl'>Are you sure you want to delete this unit?</h2>
            <button 
                className='p-4 bg-red-500 text-white m-8 w-full'
                onClick={handleDeleteUnit}>
                Confirm Delete
            </button>
        </div>
    </div>
  )
}

export default DeleteUnit