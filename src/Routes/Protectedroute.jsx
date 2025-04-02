/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutDialog from './Logout';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ Component }) {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkToken = () => {
            const logins = Cookies.get('logins');
            if (!logins) {
                if (location.pathname !== '/') {
                    setOpenDialog(true);
                }
                return;
            }

            const existingLogins = JSON.parse(logins);
            const currentLogin = existingLogins[existingLogins.length - 1];
            const tokenExpiry = new Date(currentLogin.tokenExpiry);

            // console.log(tokenExpiry, "token26");

            if (new Date() >= tokenExpiry) {
                setOpenDialog(true);
            } else {
                const timeout = tokenExpiry.getTime() - new Date().getTime();
                const timeoutId = setTimeout(() => {
                    setOpenDialog(true);
                }, timeout);
                return () => clearTimeout(timeoutId);
            }
        };

        // Check token initially
        checkToken();

        // Listen to location changes and check token validity
        const unlisten = navigate(checkToken);

        // Return the cleanup function for unlisten
        return unlisten;
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        Cookies.remove('logins');
        setOpenDialog(false);
        navigate('/');
    };

    return (
        <div>
            <LogoutDialog open={openDialog} onLogout={handleLogout} />
            <Component />
        </div>
    );
}
