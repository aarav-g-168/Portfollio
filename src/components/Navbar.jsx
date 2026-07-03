import dayjs from "dayjs";
import { navLinks, navIcons } from "../constants";

const Navbar = () => {
  return (
    <nav className=" fixed top-0 left-0 right-0 z-50 h-11 px-5 flex items-center justify-between bg-[#d6d1f5]/80 backdrop-blur-xl border-b border-white/20 ">
      {/* left */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.svg"
            alt="logo"
            className="w-4 h-4"
          />
          <p className="font-bold text-sm whitespace-nowrap">
            Aarav's Portfolio
          </p>
        </div>

        <ul className="flex items-center gap-6">
          {navLinks.map(({ id, name }) => (
            <li
              key={id}
              className="text-sm cursor-pointer hover:text-black/70 transition-colors"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>

      {/* right */}
      <div className="flex items-center gap-6">
        <ul className="flex items-center gap-4">
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img
                src={img}
                alt={`icon-${id}`}
                className="w-4 h-4 cursor-pointer opacity-90 hover:opacity-100 transition"
              />
            </li>
          ))}
        </ul>

        <time className="text-sm font-medium whitespace-nowrap">
          {dayjs().format("MMM D-ddd h:mm A")}
        </time>
      </div>
    </nav>
  );
};

export default Navbar;