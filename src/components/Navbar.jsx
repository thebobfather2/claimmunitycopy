import React, {useEffect, useState} from 'react';
import '../static/css/Navbar.css';
import AuthenticationService from "../api/AuthenticationService";
import {BsFillBellFill} from "react-icons/all";
import {useHistory} from "react-router-dom";
import NotificationDataService from "../api/NotificationDataService";


function Navbar() {

    let history = useHistory();

    const [showNotifications, setShowNotifications] = useState(false)
    const [notificationCount, setNotificationCount] = useState(0)
    const [notifications, setNotifications] = useState([])

    const logOut = () => {
        AuthenticationService.logout();
        history.push({pathname: '/login'})
    }

    const notificationsClicked = () => {

        //Mark as viewed if we're hiding notifications
        setNotificationCount(0)

        //Hide / Show notifications
        setShowNotifications(!showNotifications)

        //Mark notifications as read, in case count is > 0
        if (notificationCount > 0) {
            NotificationDataService.markNotificationsAsRead()
                .catch(() => console.log('Error marking notifications as read.'))
        }
    }

    useEffect(() => {
        populateNotifications();
        const handle = setInterval(populateNotifications, 30000);

        return () => {
            clearInterval(handle);
        }
    }, [])

    const populateNotifications = () => {
        NotificationDataService.getNotifications()
            .then(response => {
                    let data = response.data;
                    setNotificationCount(data.unreadCount);
                    if (data.notifications) {
                        let notifications = data.notifications;
                        setNotifications(notifications);
                    }
                }
            )
    }

    return (
        <div className="top-bar">
            <header>
                <nav className="navbar-expand-md bg-white">
                    <ul className="navbar-nav">
                        <button type="button" className="nav-link icon-button mr-3" onClick={notificationsClicked}>
                            <BsFillBellFill size="20"/>
                            {notificationCount > 0 && <span className="icon-button__badge">{notificationCount}</span>}
                        </button>

                        <li>
                            <button className="ml-2 mt-1 nav-link btn-primary" onClick={logOut}>Logout</button>
                        </li>
                    </ul>
                </nav>

                <div>
                    <hr/>
                </div>
            </header>
            {showNotifications &&
            <div className="notification-container" id="notification-container">
                {
                    notifications.map(
                        notification => {
                            return notification.read ?
                                <div className="notification notification-info">
                                    {notification.message}
                                </div>
                                :
                                <div className="notification notification-info">
                                    {notification.message}
                                    <span className="unread pull-right">&#x25cf;</span>
                                </div>
                        })
                }
            </div>}
        </div>
    );
}

export default Navbar;