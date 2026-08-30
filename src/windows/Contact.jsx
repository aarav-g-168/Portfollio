import React from 'react'
import WindowWrapper from '../hoc/WindowWrapper'
import { socials } from '../constants/index'
import WindowControls from '../components/WindowControls'

const Contact = () => {
    return (
        <>
            <div id="window-header">
                <WindowControls windowKey="contact" />
                <h2>Contact Me</h2>
            </div>

            <div className="p-5 space-y-5">
                <img src="/images/aarav.png" alt="Aarav" className="w-20 h-20 rounded-full" />
            </div>

            <h3>Let's Connect</h3>
            <p>
                Whether it's a new idea, a technical challenge, or just a quick chat,
                I'd love to hear from you.
            </p>

            <ul>
                {socials.map(( id, bg, link, icon, text) => (
                    <li key={id} style={{ backgroundColor: bg }}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 p-2 rounded">
                            <img src={icon} alt={text} className="size-5" />
                            <p>{text}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    )
}

const ContactWindow = WindowWrapper(Contact, "contact");

export default ContactWindow;