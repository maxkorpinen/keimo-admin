import React, { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton';
import { Spinner } from '../../components/Spinner';;
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditCiv = () => {
  const [allUnits, setAllUnits] = useState([])
  const [civUnits, setCivUnits] = useState([])
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [imageUploadCompleted, setImageUploadCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    let unitUrl = 'http://localhost:5555/units';
    let civById = `http://localhost:5555/civs/${id}`;
    const promise1 = axios.get(unitUrl);
    const promise2 = axios.get(civById);
    Promise.all([promise1, promise2])
      .then((response) => {
        setAllUnits(response[0].data.data)
        setName(response[1].data.name);
        setDescription(response[1].data.description);
        setCivUnits(response[1].data.units)
        setImageUrl(`http://localhost:5555/civs/${id}/image`);
        setLoading(false)
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Check Console for details.');
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    if (imageUploadCompleted && image) {
      setImageUrl(`http://localhost:5555/civs/${id}/image?t=${new Date().getTime()}`);
      setImageUploadCompleted(false); // Reset the flag
    }
  }, [id, imageUploadCompleted, image]);

  const handleEditCiv = () => {
    const data = {
      name,
      description,
      units: civUnits
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/civs/${id}`, data)
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

  const uploadImage = async (uploadedImage) => { // Pass the image directly
    try {
        setLoading(true)
        const formData = new FormData();
        formData.append('image', uploadedImage);

        const response = await axios.put(`http://localhost:5555/civs/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response.data.message);
        setUploadStatus('Image uploaded successfully');
        setImageUploadCompleted(true); // Set flag only if upload is successful
    } catch (error) {
        console.error('Error uploading image:', error.response ? error.response.data.message : error.message);
        setUploadStatus('Failed to upload image');
    }
    setLoading(false)
};

  /* const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.put(`http://localhost:5555/civs/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data.message);
      setUploadStatus('Image uploaded successfully');
      setImageUrl(`http://localhost:5555/civs/${id}/image?t=${new Date().getTime()}`);
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data.message : error.message);
      setUploadStatus('Failed to upload image');
    }
    setUploadStatus('Image uploaded successfully');
    setImageUploadCompleted(true); // Set the flag indicating upload is complete
  }; */

  const handleAvailableUnitsChange = (event) => {
    const id_value = event.target.value;

    // Check if the unit is already in the array
    const index = civUnits.findIndex(unit => unit.unit === id_value);

    if (index === -1) {
      // Unit is not in the array, add it
      setCivUnits([...civUnits, { unit: id_value, powerModifier: 0 }]);
    } else {
      // Unit is in the array, remove it
      setCivUnits(civUnits.filter((_, i) => i !== index));
    }
  };

  const handlePowerModifierChange = (unitId, modifierValue) => {
    setCivUnits(civUnits.map(unit => {
      if (unit.unit === unitId) {
        return { ...unit, powerModifier: modifierValue };
      }
      // console.log(`Modifier changed for Unit ID: ${unitId}, New Value: ${modifierValue}`);
      return unit;
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        const selectedImage = e.target.files[0];
        setImage(selectedImage); // Set the image state
        uploadImage(selectedImage); // Call uploadImage with the selected image
    }
};

  return (
    <div className='p-4'>
      <BackButton destination='/civs' />
      <h1 className='text 3xl my-4'>Edit Civilization</h1>
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
          {allUnits.map((unit) => (
            <div key={unit._id} className='flex justify-between'>
              <div>
                <input
                  type="checkbox"
                  value={unit._id}
                  checked={civUnits.some(u => u.unit === unit._id)}
                  onChange={handleAvailableUnitsChange}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                />
                <label className='text-xl text-gray-500'>{unit.name}</label>
              </div>
              <select
                value={civUnits.find(u => u.unit === unit._id)?.powerModifier || ''}
                onChange={(e) => handlePowerModifierChange(unit._id, parseInt(e.target.value, 10))}
                disabled={!civUnits.some(u => u.unit === unit._id)}
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
          ))}
        </div>
        <button className='w-full p-2 bg-sky-500 text-white mt-4' onClick={handleEditCiv}>
          Save
        </button>
      </div>
    </div>
  )
}

export default EditCiv