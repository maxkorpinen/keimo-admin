import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from '../../components/Spinner';
import { Link } from 'react-router-dom';

import { HiPencilSquare } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi2";
import { HiPlusCircle } from "react-icons/hi2";
import { HiQuestionMarkCircle } from "react-icons/hi2";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Units = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiBaseUrl}/units`, {
                withCredentials: true
            })
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
                <HiPlusCircle className='text-green-500 text-7xl mx-7' />
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
                            <th className=''>Gold Unit</th>
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
                                    {(unit.isGoldUnit) ? 'Yes' : 'No'}
                                </td>
                                <td className='text-center'>
                                    {unit.building}
                                </td>
                                <td className='text-center'>
                                    <div className='flex justify-center gap-x-4'>
                                        <Link to={`/units/details/${unit._id}`}>
                                        <HiQuestionMarkCircle className='text-2xl text-sky-500' />
                                        </Link>
                                        <Link to={`/units/edit/${unit._id}`}>
                                          <HiPencilSquare className='text-2xl text-orange-500' />
                                        </Link>
                                        <Link to={`/units/delete/${unit._id}`}>
                                            <HiTrash className='text-2xl text-red-500' />
                                        </Link>
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

export default Units