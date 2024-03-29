import { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton';
import { Spinner } from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_URL;

const EditCiv = () => {
  const [allUnits, setAllUnits] = useState([])
  const [civUnits, setCivUnits] = useState({
    feudal: [],
    castle: [],
    imperial: []
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  // const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    let unitUrl = `${apiBaseUrl}/units`;
    let civById = `${apiBaseUrl}/civs/${id}`;
    const promise1 = axios.get(unitUrl, {
      withCredentials: true
    });
    const promise2 = axios.get(civById, {
      withCredentials: true
    });
    Promise.all([promise1, promise2])
      .then((response) => {
        setAllUnits(response[0].data.data)
        setName(response[1].data.name);
        setDescription(response[1].data.description);
        setCivUnits(response[1].data.units)
        setImageUrl(response[1].data.image);
        console.log(response[1].data.image);
        setLoading(false);
        console.log(response[1].data.units);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Check Console for details.');
        console.log(error);
      });
  }, [id]);

  const handleEditCiv = () => {
    const data = {
      name,
      description,
      units: civUnits
    };
    setLoading(true);
    axios
      .put(`${apiBaseUrl}/civs/${id}`, data, {
        withCredentials: true
      })
      .then(() => {
        setLoading(false);
        navigate('/civs');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Check Console for details.');
        console.log(error);
      })
  };

  const uploadImage = async (uploadedImage) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', uploadedImage);

      const response = await axios.put(`${apiBaseUrl}/civs/${id}/image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update the imageUrl state with the new image URL provided by the backend
      if (response.data.imageUrl) {
        setImageUrl(response.data.imageUrl);
      }

      console.log(response.data.message);
      // Removed setUploadStatus call
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data.message : error.message);
      // Removed setUploadStatus call
    } finally {
      setLoading(false);
    }
  };

  const handleAvailableUnitsChange = (unitId, age, isChecked) => {
    setCivUnits(prevState => ({
      ...prevState,
      [age]: isChecked
        ? [...prevState[age], { unit: unitId, powerModifier: 0 }]
        : prevState[age].filter(unit => unit.unit !== unitId)
    }));
  };

  const handlePowerModifierChange = (unitId, modifierValue, age) => {
    setCivUnits(prevState => ({
      ...prevState,
      [age]: prevState[age].map(unit => {
        if (unit.unit === unitId) {
          return { ...unit, powerModifier: modifierValue };
        }
        return unit;
      })
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      uploadImage(selectedImage); // Call uploadImage with the selected image
    }
  };

  return (
    <div className='p-4'>
      <BackButton destination='/civs' />
      <h1 className='text 3xl my-4'>Edit Civilization</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col p-4 mx-auto'>
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
          <label className='text-xl mr-4 text-gray-500'>Description</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div>
          {/* ... other component elements ... */}
          {imageUrl && <img src={imageUrl} alt="Civ" />}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Civ Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <p className='text-xl mr-4 text-gray-500'>Units</p>
          <table className='table-auto w-full'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left'>Unit</th>
                <th className='px-4 py-2 text-left'>Feudal Age</th>
                <th className='px-4 py-2 text-left'>Castle Age</th>
                <th className='px-4 py-2 text-left'>Imperial Age</th>
              </tr>
            </thead>
            <tbody>
              {allUnits.map((unit) => (
                <tr key={unit._id}>
                  <td className='px-4 py-2'>
                    <label className='text-xl text-gray-500'>{unit.name}</label>
                  </td>
                  {['feudal', 'castle', 'imperial'].map(age => (
                    <td key={age} className='px-4 py-2'>
                      <div className='flex items-center'>
                        <input
                          type="checkbox"
                          value={unit._id}
                          checked={civUnits[age].some(u => u.unit === unit._id)}
                          onChange={(e) => handleAvailableUnitsChange(unit._id, age, e.target.checked)}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                        />
                        <select
                          value={civUnits[age].find(u => u.unit === unit._id)?.powerModifier || ''}
                          onChange={(e) => handlePowerModifierChange(unit._id, parseInt(e.target.value, 10), age)}
                          disabled={!civUnits[age].some(u => u.unit === unit._id)}
                          className='border-2 border-gray-500 px-1 mx-2 self-end disabled:border-gray-100'
                        >
                          <option value=""></option>
                          <option value="7">S - Very Strong</option>
                          <option value="6">A+ - Strong</option>
                          <option value="5">A - Above average</option>
                          <option value="4">B+ - Average</option>
                          <option value="3">B - Below Average</option>
                          <option value="2">C+ - Poor</option>
                          <option value="1">C - Horse Crap</option>
                        </select>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className='w-full p-2 bg-sky-500 text-white mt-4' onClick={handleEditCiv}>
          Save
        </button>
      </div>
    </div>
  )
}

export default EditCiv