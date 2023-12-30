import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='flex justify-center gap-x-4'>
            <Link to='/civs'>
                Civs
            </Link>
            <Link to='/civs'>
                Units
            </Link>
        </div>
    )
}

export default Home