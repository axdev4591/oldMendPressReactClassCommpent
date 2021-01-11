import React from 'react';
import './style.css';
import logo from './MEND.png';


import { Link } from 'react-router-dom';

const Logo = props => {
    return (
        <Link to="/">
            <div {...props}>
               <img src={logo} alt="logo" height="80" width="200"/> 
            </div>
        </Link>
        
    );
}

export default Logo;