import { Fragment } from 'react'
import main_logo from '../assets/main_logo.svg';

export function Navbar() {
    return (
        <Fragment>
            <div className="main_nav">
                <img src={main_logo} alt="" />
            </div>
        </Fragment>
    )
}
