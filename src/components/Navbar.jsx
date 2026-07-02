import navLinks from "../constants";

const Navbar = () => {
  return (
    <nav>
        <div>
            <img src = "/images/logo.svg" alt = "logo" />
            <p className="font-bold">Aarav's Portfolio</p>
            <ul>
                {navLinks.map(({id, name}) => (
                    <li key={id}>
                        <p>{name}</p>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
  )
}

export default Navbar