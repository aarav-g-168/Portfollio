import dayjs from "dayjs";
import { navLinks, navIcons } from "../constants";

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
        <div>
            <ul>
                {navIcons.map(({id, image}) => (
                    <li key={id}>
                        <img src={image} className="icon-hover" alt={`icon-${id}`} />
                    </li>
                ))} 
            </ul>
        </div>
        <time>{dayjs().format("MMM D-ddd  h:mm A")}</time>
    </nav>
  )
}

export default Navbar