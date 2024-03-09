import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Spinner } from '../../components/Spinner';
import { Link } from 'react-router-dom';

import { HiPencilSquare } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi2";
import { HiPlusCircle } from "react-icons/hi2";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { FaSort } from "react-icons/fa";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Units = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ column: 'building', direction: 'asc' });
    const [showUnique, setShowUnique] = useState(true);
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiBaseUrl}/units`, {
                withCredentials: true
            })
            .then((response) => {
                setUnits(response.data.data);
                console.log(units);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const requestSort = (column) => {
        let direction = 'asc';
        if (sortConfig.column === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ column, direction });
    };

    const sortedUnits = useMemo(() => {
        let sortableItems = [...units];
        if (!showUnique) { // Change this line
            sortableItems = sortableItems.filter(unit => !unit.isUnique); // Change this line
        }
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.column] < b[sortConfig.column]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.column] > b[sortConfig.column]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [units, sortConfig, showUnique]);

    return (
        <div className='p-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl my-8'>
                    All Units
                </h1>
                <div>
                    <Link to='/units/create'>
                        <HiPlusCircle className='text-green-500 text-7xl mx-7' />
                    </Link>
                </div>
            </div>
            <div>
                <label className='text-xl text-gray-500'>
                    <input
                        type="checkbox"
                        checked={showUnique}
                        onChange={e => setShowUnique(e.target.checked)}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                    />
                    Show Unique Units
                </label>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className='w-full border-separate border-spacing-2'>
                    <thead>
                        <tr>
                            <th className=''>#</th>
                            <th className=''>Image</th>
                            <th className=''>
                                <div className='flex items-center justify-center'>
                                    Name 
                                    <button onClick={() => requestSort('name')}><FaSort className='text-xl ml-1' /></button>
                                </div>
                            </th>
                            <th className=''>
                                <div className='flex items-center justify-center'>
                                    Gold Unit 
                                    <button onClick={() => requestSort('isGoldUnit')}><FaSort className='text-xl ml-1' /></button>
                                </div>
                            </th>
                            <th className=''>
                                <div className='flex items-center justify-center'>
                                    Building 
                                    <button onClick={() => requestSort('building')}><FaSort className='text-xl ml-1' /></button>
                                </div>
                            </th>
                            <th className=''>
                                <div className='flex items-center justify-center'>
                                    Unique 
                                    <button onClick={() => requestSort('isUnique')}><FaSort className='text-xl ml-1' /></button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUnits.map((unit, index) =>
                            <tr key={unit._id} className='h-8'>
                                <td className='text-center'>
                                    {index + 1}
                                </td>
                                <td className='text-center'>
                                    <img src={unit.image} alt={unit.name} className='w-20 h-20 mx-auto' />
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
                                    {unit.isUnique ? 'Yes' : 'No'}
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