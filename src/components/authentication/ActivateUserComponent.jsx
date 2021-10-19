import {useEffect, useState} from "react";
import SignUpDataService from "../../api/SignUpDataService";
import {Link} from "react-router-dom";

function ActivateUserComponent(props) {

    const [message, setMessage] = useState('')
    const [link, showLink] = useState(false)


    useEffect(() => {
        SignUpDataService.activateUser(props.match.params.id)
            .then(() => setMessage("Your account is now active. Please click on link below to log in"))
            .then(() => showLink(true))
            .catch(() => setMessage("Unable to activate your account. Please contact support@claimmunity.com to report the issue."))
    });

    return <div>
        <p>{message}</p>
        <p>{link && <Link to="/login">Log In</Link>}</p>
    </div>

}


export default ActivateUserComponent;