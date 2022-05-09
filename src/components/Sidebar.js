import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {SidebarData} from "../data/SidebarData";
import '../static/css/Sidebar.css';
import {IconContext} from "react-icons";
import logo from '../static/images/claimmunity.jpg';
import {Image} from "react-bootstrap";

function Sidebar() {

    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
            <IconContext.Provider value={{color: '#317ABB'}}>
                {/*<div className="navbar">*/}
                {/*    <Link to="#" className="menu-bars">*/}
                {/*        <FaBars onClick={showSidebar}/>*/}
                {/*    </Link>*/}
                {/*</div>*/}
                {/*    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>*/}
                <div className="nav-menu active">
                    <ul className="nav-menu-items" onClick={showSidebar}>
                        {/*<li className="navbar-toggle">*/}
                        {/*    <Link to="#" className="menu-bars">*/}
                        {/*        <AiIcons.AiOutlineClose/>*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        <li>
                            <Image src={logo}/>
                        </li>

                            {SidebarData.map((item, index) => {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to={item.path} className={item.cName}>
                                            {item.icon}&nbsp;
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                )
                            })}

                    </ul>
                </div>
            </IconContext.Provider>
        </>
    )
}

export default Sidebar;
