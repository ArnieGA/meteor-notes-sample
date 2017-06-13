import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {
    document.title = props.documentTitle;
    return (
        <div className='boxed-view'>
            <div className='boxed-view__box'>
                <h1>Page Not Found</h1>
                <p>The requested page doesn't exist</p>
                <Link className='button button--link' to='/'>HEAD HOME</Link>
            </div>
        </div>
    );
};