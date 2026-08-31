import React from "react";

import WindowWrapper from "../hoc/WindowWrapper";
import { socials } from "../constants/index";
import WindowControls from "../components/WindowControls";

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls windowKey="contact" />
        <h2>Contact Me</h2>
      </div>

      <div className="p-5 space-y-6 bg-white">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <img
            src="/images/aarav.jpeg"
            alt="Aarav"
            className="size-24 rounded-full object-cover"
          />

          <div>
            <h3 className="text-xl font-semibold">Let's Connect</h3>
            <p className="mt-1 text-sm text-gray-600">
              Have an idea or want to talk tech? Let's chat.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <ul className="grid grid-cols-2 gap-3">
          {socials.map(({ id, bg, link, icon, text }) => (
            <li
              key={id}
              style={{ backgroundColor: bg }}
              className="rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
                className="flex items-center gap-3 p-4 text-white"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/20">
                  <img
                    src={icon}
                    alt={text}
                    className="size-5"
                  />
                </div>

                <div>
                  <p className="font-semibold">{text}</p>
                  <p className="text-xs opacity-80">
                    Visit profile →
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");

export default ContactWindow;