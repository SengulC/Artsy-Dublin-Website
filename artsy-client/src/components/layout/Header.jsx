import logo from '../../assets/images/logo.png'
import '../../index.css'

function Header() {
    return (
        <header className="header">
            <a href="/" className="header_logo">
                <img src={logo} alt="Artsy Dublin logo" />
            </a>

            <div className="header-inner">
                <div className="header__search">
                    <input type="text" placeholder="Search" />
                </div>

                <nav className="header__nav">
                    <a href="#">Events</a>
                    <a href="#">Community</a>
                    <a href="#">Message</a>
                </nav>

                <div className="header__user">👤</div>
            </div>
        </header>
    )
}

export default Header