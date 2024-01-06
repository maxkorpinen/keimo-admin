import React, { useState, useEffect } from 'react'
import BackButton from '../components/BackButton';
import { Spinner } from '../components/Spinner';;
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUnit = () => {
    const [units, setUnits] = useState([]);
    const [name, setName] = useState('');
    const [building, setBuilding] = useState('');
    const [isGoldUnit, setIsGoldUnit] = useState(false);
    const [counterOf, setCounterOf] = useState([]);
    const [counteredBy, setCounteredBy] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        let unitUrl = 'http://localhost:5555/units';
        let unitByIdUrl = `http://localhost:5555/units/${id}`;
        const promise1 = axios.get(unitUrl);
        const promise2 = axios.get(unitByIdUrl);
        Promise.all([promise1, promise2])
            .then((response) => {
                setUnits(response[0].data.data)
                setName(response[1].data.name);
                setBuilding(response[1].data.building);
                setIsGoldUnit(response[1].data.isGoldUnit);
                setCounterOf(response[1].data.counterOf);
                setCounteredBy(response[1].data.counteredBy);
                setLoading(false)
            }).catch((error) => {
                setLoading(false);
                alert('An error happened. Check Console for details.');
                console.log(error);
            });
    }, [])
    const handleEditUnit = () => {
        const data = {
            name,
            building,
            isGoldUnit,
            counterOf,
            counteredBy
        };
        setLoading(true);
        axios
            .put(`http://localhost:5555/units/${id}`, data)
            .then(() => {
                setLoading(false);
                navigate('/units');
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Check Console for details.');
                console.log(error);
            })
    };
    const handlecCheckBoxChange = () => {
        setIsGoldUnit(!isGoldUnit);
    };
    // something not working here
    const handleCounterOfChange = (event) => {

        const id_value = event.target.value;

        if (counterOf.includes(id_value)) {
            // If the id is already in the array, remove it
            setCounterOf(counterOf.filter((id) => id !== id_value));
        } else {
            // If the id is not in the array, add it
            setCounterOf([...counterOf, id_value]);
        }
        /* 
                let id_value = id.target.value
                console.log(id_value);
        
                let currentList = counterOf;
        
                function removeCheck(e) {
                    let array = currentList; // make a separate copy of the array
                    let index = array.indexOf(e)
                    if (index !== -1) {
                      array.splice(index, 1);
                      setCounterOf(array);
                    };
                };
        
                function addCheck(e) {
                    let array = counterOf;
                    let newArray = array.concat(e)
                    return newArray
                }
        
                {counterOf.includes(id_value) ? removeCheck(id_value) : setCounterOf(addCheck(id_value))} */
    }

    const handleCounteredByChange = (event) => {

        const id_value = event.target.value;

        if (counteredBy.includes(id_value)) {
            // If the id is already in the array, remove it
            setCounteredBy(counteredBy.filter((id) => id !== id_value));
        } else {
            // If the id is not in the array, add it
            setCounteredBy([...counteredBy, id_value]);
        }
    }

    return (
        <div className='p-4'>
            <BackButton destination='/units' />
            <h1 className='text 3xl my-4'>Edit Unit</h1>
            {loading ? <Spinner /> : ''}
            <div className='flex flex-col w-[600px] p-4 mx-auto'>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Name</label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Building</label>
                    <input
                        type='text'
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>
                <div className='my-4'>
                    <input
                        type='checkbox'
                        value={'Gold Unit'}
                        checked={isGoldUnit}
                        onChange={handlecCheckBoxChange}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                    />
                    <label className='text-xl text-gray-500'>This is a gold unit</label>
                </div>
                <div className='my-4'>
                    <p className='text-xl mr-4 text-gray-500'>Unit is <b>strong against</b> the following units:</p>
                    {units.map((unit) =>
                        <div key={unit._id}>
                            <input
                                type='checkbox'
                                value={unit._id}
                                checked={counterOf.includes(unit._id)}
                                onChange={handleCounterOfChange}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                            />
                            <label className='text-xl text-gray-500'>{unit.name}</label>
                        </div>
                    )}
                </div>
                <div className='my-4'>
                    <p className='text-xl mr-4 text-gray-500'>Unit is <b>weak against</b> the following units:</p>
                    {units.map((unit) =>
                        <div key={unit._id}>
                            <input
                                type='checkbox'
                                value={unit._id}
                                checked={counteredBy.includes(unit._id)}
                                onChange={handleCounteredByChange}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                            />
                            <label className='text-xl text-gray-500'>{unit.name}</label>
                        </div>
                    )}
                </div>
                <button className='w-full p-2 bg-sky-500 text-white mt-4' onClick={handleEditUnit}>
                    Save
                </button>
            </div>
        </div>
    )
}

export default EditUnit