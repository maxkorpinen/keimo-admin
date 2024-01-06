import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Navbar = () => {
    // State to manage the navbar's visibility
    const [nav, setNav] = useState(false);

    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

    // Array containing navigation items
    const navItems = [
        { id: 1, text: 'Home', url: '/' },
        { id: 2, text: 'Civs', url: '/civs' },
        { id: 3, text: 'Units', url: '/units' },
    ];

    return (
        <div className='bg-slate-700 flex justify-between py-2 px-4 items-center h-auto full-w mx-auto text-white'>
            {/* Logo */}
            <div>
                <Link to='/'>
                    <h1 className='w-full text-3xl hover:text-rose-500 font-bold text-rose-600'>AGE OF KEIMO</h1>
                    <h2 className='w-full text-xl hover:text-yellow-200 text-yellow-400'> Admin Panel</h2>
                </Link>
            </div>


            {/* Desktop Navigation */}
            <ul className='hidden md:flex'>
                {navItems.map(item => (
                    <Link to={item.url} key={item.id}>
                        <li
                            className='p-5 rounded-md hover:bg-yellow-400 cursor-pointer duration-300 hover:text-slate-950'
                        >
                            {item.text}
                        </li>
                    </Link>
                ))}
            </ul>

            {/* Mobile Navigation Icon */}
            <div onClick={handleNav} className='cursor-pointer hover:text-yellow-400 block md:hidden'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            {/* Mobile Navigation Menu */}
            <ul
                className={
                    nav
                        ? 'fixed md:hidden left-0 top-0 w-[60%] h-full bg-slate-950 ease-in-out duration-500'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                }
            >
                {/* Mobile Logo */}
                <Link to="/">
                <h1 className='w-full text-3xl hover:text-rose-500 font-bold text-rose-700 m-4'>KEIMO</h1>
                </Link>

                {/* Mobile Navigation Items */}
                {navItems.map(item => (
                    <li
                        key={item.id}
                        className='p-4 hover:bg-yellow-400 duration-300 hover:text-slate-950 cursor-pointer border-gray-600'
                    >
                        <Link to={item.url}>
                            {item.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar;