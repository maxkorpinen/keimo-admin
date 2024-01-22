import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import { Spinner } from '../../components/Spinner';

const apiBaseUrl = import.meta.env.VITE_API_URL;

const ShowCiv = () => {
    const [civ, setCiv] = useState({});
    const [loading, setLoading] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiBaseUrl}/civs/${id}`, {
                withCredentials: true
            })
            .then((response) => {
                setCiv(response.data);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
  return (
    <div className='p-4'>
        <BackButton destination='/civs'/>
        <h1 className='text-3xl my-4'>Show Civilization</h1>
        {loading ? (
            <Spinner />
        ) : (
            <div className='flex flex-col w-fit p-4'>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Id</span>
                    <span>{civ._id}</span>
                </div>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Name</span>
                    <span>{civ.name}</span>
                </div>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Description</span>
                    <span>{civ.description}</span>
                </div>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Last Updated</span>
                    <span>{new Date(civ.updatedAt).toString()}</span>
                </div>
            </div>  
        )}
    </div>
  )
}

export default ShowCiv