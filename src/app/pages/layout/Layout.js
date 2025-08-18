import { Outlet } from "react-router-dom";

const Layout = () => {


    return (
        <div className="container">
            <div className="container-layout">
                <div className="container__topbar">
                    {/* Layout topbar */}
                </div>
                
                <div className="container__content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout;