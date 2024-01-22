import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import { Spinner } from '../../components/Spinner';

const apiBaseUrl = import.meta.env.VITE_API_URL;

const ShowUnit = () => {
    const [unit, setUnit] = useState({});
    const [loading, setLoading] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiBaseUrl}/units/${id}`, {
                withCredentials: true
            })
            .then((response) => {
                setUnit(response.data);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
  return (
    <div className='p-4'>
        <BackButton destination='/units'/>
        <h1 className='text-3xl my-4'>Show Unit</h1>
        {loading ? (
            <Spinner />
        ) : (
            <div className='flex flex-col w-fit p-4'>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Id</span>
                    <span>{unit._id}</span>
                </div>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Name</span>
                    <span>{unit.name}</span>
                </div>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Building</span>
                    <span>{unit.building}</span>
                </div>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Gold unit</span>
                    <span>{(unit.isGoldUnit) ? 'Yes' : 'No'}</span>
                </div>
                <div>
                    <span className='text-xl mr-4 text-gray-500'>Last Updated</span>
                    <span>{new Date(unit.updatedAt).toString()}</span>
                </div>
            </div>  
        )}
    </div>
  )
}

export default ShowUnit