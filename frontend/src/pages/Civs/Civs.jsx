import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from '../../components/Spinner';
import { Link } from 'react-router-dom';

import { HiPencilSquare } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi2";
import { HiPlusCircle } from "react-icons/hi2";
import { HiQuestionMarkCircle } from "react-icons/hi2";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Civs = () => {
    const [civs, setCivs] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiBaseUrl}/civs`, {
                withCredentials: true
            })
            .then((response) => {
                setCivs(response.data.data);
                //console.log(response.data.data)
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
                    All Civs
                </h1>
                <Link to='/civs/create'>
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
                            <th className=''>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {civs.map((civ, index) =>
                            <tr key={civ._id} className='h-8'>
                                <td className='text-center'>
                                    {index + 1}
                                </td>
                                <td className='text-center'>
                                    {civ.name}
                                </td>
                                <td className='text-center'>
                                    {civ.description}
                                </td>
                                <td className='text-center'>
                                    <div className='flex justify-center gap-x-4'>
                                        <Link to={`/civs/details/${civ._id}`}>
                                        <HiQuestionMarkCircle className='text-2xl text-sky-500' />
                                        </Link>
                                        <Link to={`/civs/edit/${civ._id}`}>
                                          <HiPencilSquare className='text-2xl text-orange-500' />
                                        </Link>
                                        <Link to={`/civs/delete/${civ._id}`}>
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

export default Civs