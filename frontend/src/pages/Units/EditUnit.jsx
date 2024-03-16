import { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton';
import { Spinner } from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUnit = () => {
    const [units, setUnits] = useState([]);
    const [name, setName] = useState('');
    const [building, setBuilding] = useState('');
    const [isGoldUnit, setIsGoldUnit] = useState(false);
    const [isMeta, setIsMeta] = useState(false);
    const [isUnique, setIsUnique] = useState(false);
    const [counterOf, setCounterOf] = useState([]);
    const [counteredBy, setCounteredBy] = useState([]);
    // const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    // const [uploadStatus, setUploadStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const apiBaseUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setLoading(true);
        let unitUrl = `${apiBaseUrl}/units`;
        let unitByIdUrl = `${apiBaseUrl}/units/${id}`;
        const promise1 = axios.get(unitUrl, {
            withCredentials: true
        });
        const promise2 = axios.get(unitByIdUrl, {
            withCredentials: true
        });
        Promise.all([promise1, promise2])
            .then((response) => {
                setUnits(response[0].data.data)
                setName(response[1].data.name);
                setImageUrl(response[1].data.image);
                setBuilding(response[1].data.building);
                setIsGoldUnit(response[1].data.isGoldUnit);
                setIsMeta(response[1].data.isMeta);
                setIsUnique(response[1].data.isUnique);
                setCounterOf(response[1].data.counterOf);
                setCounteredBy(response[1].data.counteredBy);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                alert('An error happened. Check Console for details.');
                console.log(error);
            });
    }, [apiBaseUrl, id])
    const handleEditUnit = () => {
        const data = {
            name,
            building,
            isGoldUnit: isGoldUnit || false,
            isMeta: isMeta || false,
            isUnique: isUnique || false,
            counterOf,
            counteredBy
        };
        setLoading(true);
        axios
            .put(`${apiBaseUrl}/units/${id}`, data, {
                withCredentials: true
            })
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

    const uploadImage = async (uploadedImage) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', uploadedImage);

            const response = await axios.put(`${apiBaseUrl}/units/${id}/image`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.imageUrl) {
                setImageUrl(response.data.imageUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            uploadImage(selectedImage);
        }
    };

    const handleCheckBoxChange = (setFunction) => () => {
        setFunction((prev) => !prev);
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
                    <label className='text-xl mr-4 text-gray-500'>Building</label>
                    {/*                     <input
                        type='text'
                        value={building}
                        onChange={}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    /> */}
                    <select
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    >
                        <option value="Barracks">Barracks</option>
                        <option value="Archery Range">Archery Range</option>
                        <option value="Stable">Stable</option>
                        <option value="Castle">Castle</option>
                        <option value="Krepost">Krepost</option>
                        <option value="Donjon">Donjon</option>
                        <option value="Fortified Church">Fortified Church</option>

                    </select>
                </div>
                <div className='my-4'>
                    <input
                        type='checkbox'
                        value={'Gold Unit'}
                        checked={isGoldUnit}
                        onChange={handleCheckBoxChange(setIsGoldUnit)}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                    />
                    <label className='text-xl text-gray-500'>This is a gold unit</label>
                </div>
                <div className='my-4'>
                    <input
                        type='checkbox'
                        checked={isMeta}
                        onChange={handleCheckBoxChange(setIsMeta)}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                    />
                    <label className='text-xl text-gray-500'>This is a meta unit</label>
                </div>
                <div className='my-4'>
                    <input
                        type='checkbox'
                        checked={isUnique}
                        onChange={handleCheckBoxChange(setIsUnique)}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2'
                    />
                    <label className='text-xl text-gray-500'>This is a unique unit</label>
                </div>
                <div>
                    {imageUrl && <img src={imageUrl} alt="Unit" />}
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Unit Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
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