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

      <div className="p-4 bg-white space-y-4">
        {/* Intro */}
        <div className="flex items-center gap-4">
          <img
            src="/images/aarav.jpeg"
            alt="Aarav"
            className="size-20 rounded-full object-cover"
          />

          <div>
            <h3 className="text-lg font-semibold">Let's Connect</h3>
            <p className="mt-1 text-sm text-gray-600">
              Have an idea or want to talk tech? Let's chat.
            </p>
          </div>
        </div>

        {/* Socials */}
        <ul className="grid grid-cols-2 gap-2">
          {socials.map(({ id, bg, link, icon, text }) => (
            <li
              key={id}
              style={{ backgroundColor: bg }}
              className="rounded-lg overflow-hidden"
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
                className="flex items-center gap-3 px-3 py-3 text-white"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/20">
                  <img
                    src={icon}
                    alt={text}
                    className="size-4"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">{text}</p>
                  <p className="text-[11px] opacity-80">
                    Open profile →
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