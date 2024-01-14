import React, {useState} from 'react'
import BackButton from '../../components/BackButton';
import { Spinner } from '../../components/Spinner';;
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateUnit = () => {
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [isGoldUnit, setIsGoldUnit] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSaveUnit = () => {
    const data = {
      name,
      building,
      isGoldUnit
    };
    setLoading(true);
    axios
      .post('http://localhost:5555/units', data)
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
  return (
    <div className='p-4'>
      <BackButton destination='/units' />
      <h1 className='text 3xl my-4'>Create Unit</h1>
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
        <button className='w-full p-2 bg-sky-500 text-white mt-4' onClick={handleSaveUnit}>
          Save
        </button>
      </div>
    </div>
  )
}

export default CreateUnit