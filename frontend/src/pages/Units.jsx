import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox } from 'react-icons/md';


const Home = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/units')
            .then((response) => {
                setUnits(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [])
    return (
        <div className='p-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl my-8'>
                    All Units
                </h1>
                <Link to='/units/create'>
                    <MdOutlineAddBox className='text-sky-800 text-4xl' />
                </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className='w-full border-separate border-spacing-2'>
                    <thead>
                        <tr>
                            <th className=''>#</th>
                            <th className=''>Name</th>
                            <th className=''>Building</th>
                        </tr>
                    </thead>
                    <tbody>
                        {units.map((unit, index) =>
                            <tr key={unit._id} className='h-8'>
                                <td className='text-center'>
                                    {index + 1}
                                </td>
                                <td className='text-center'>
                                    {unit.name}
                                </td>
                                <td className='text-center'>
                                    {unit.building}
                                </td>
                                <td className='text-center'>
                                    <div className='flex justify-center gap-x-4'>
                                        <Link to={`/units/details/${unit._id}`}>
                                            <BsInfoCircle className='text-2x1 text-green-900' />
                                        </Link>
                                        <Link to={`/units/edit/${unit._id}`}>
                                            <AiOutlineEdit className='text-2x1 text-blue-900' />
                                        </Link>
                                        <MdOutlineAddBox className='text-2x1 text-red-900' />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Home