function Header(){
    return (
        <header className="site-header">
            <a className="site-logo" href="#home">
            <span className="logo-symbol">🛕</span>
            <span>Temple Explorer</span>
            </a>
            <nav className="site-nav">
                <a href="#home">Home</a>
                <a href="#deities">Deities</a>
                <a href="#states">States</a>
                <a href="#temples">Temples</a>
                <a href="#slokas">Slokas and Mantras</a>
                <a href="#about">About</a>
            </nav>
        </header>
    )
}
export default Header