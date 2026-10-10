import { useState } from "react";
import { ArrowUpRight, Check, Copy, LoaderCircle, Mail, Send } from "lucide-react";
import WindowWrapper from "../hoc/WindowWrapper";
import { socials } from "../constants";
import WindowControls from "../components/WindowControls";

const email = "guptaaarav987@gmail.com";

const Contact = () => {
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); }
    catch { setFeedback(`You can email me at ${email}.`); }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (fields._honey) return;
    const name = fields.name.trim();
    const message = fields.message.trim();
    if (!name || message.length < 10) {
      setStatus("error");
      setFeedback(!name ? "Please enter your name." : "Please write a message with at least 10 characters.");
      form.elements.namedItem(!name ? "name" : "message")?.focus();
      return;
    }
    setStatus("sending"); setFeedback("");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, name, message, email: fields.email.trim(), _subject: `Portfolio: ${fields.subject}`, _template: "table" }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || ![true, "true"].includes(result.success)) throw new Error("Submission failed");
      setStatus("success"); setFeedback("Message submitted. Thanks for getting in touch!"); form.reset();
    } catch {
      setStatus("error"); setFeedback("Your message couldn't be submitted. Please try again or email me directly. Your draft is still here.");
    }
  };

  return (
    <div className="contact-window">
      <div id="window-header">
        <WindowControls windowKey="contact" />
        <h2><Mail size={16} aria-hidden="true" /> New message</h2>
        <span className="contact-header-spacer" aria-hidden="true" />
      </div>
      <div className="contact-layout">
        <aside className="contact-sidebar">
          <img className="contact-avatar" src="/images/aarav.jpeg" alt="Aarav Gupta" />
          <h3>Aarav Gupta</h3>
          <p className="contact-role">Full Stack Developer</p>
          <p className="contact-intro">Have an opportunity, an idea, or a question? I'd love to hear from you.</p>
          <div className="contact-email-row">
            <a href={`mailto:${email}`}>{email}</a>
            <button type="button" onClick={copyEmail} aria-label={copied ? "Email copied" : "Copy email address"}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
          <h4>Elsewhere</h4>
          <ul className="contact-socials">
            {socials.map(({ id, icon, text, link }) => <li key={id}><a href={link} target="_blank" rel="noopener noreferrer">
              <span className="contact-social-icon"><img src={icon} alt="" /></span>
              <span>{text === "Github" ? "GitHub" : text}</span><ArrowUpRight size={14} aria-hidden="true" />
            </a></li>)}
          </ul>
        </aside>
        <div className="contact-compose">
          <div className="contact-compose-heading"><span className="contact-eyebrow">LET'S CONNECT</span><h3>A good conversation<br />starts with hello.</h3><p>Drop me a note below.</p></div>
          <form onSubmit={submit} action={`https://formsubmit.co/${email}`} method="POST">
            <fieldset disabled={status === "sending"}>
              <div className="contact-field-row">
                <div><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={100} /></div>
                <div><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254} /></div>
              </div>
              <label htmlFor="contact-subject">What's this about?</label>
              <select id="contact-subject" name="subject" defaultValue="An opportunity"><option>An opportunity</option><option>A project idea</option><option>Just saying hello</option></select>
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" placeholder="Tell me a little about what you have in mind..." rows={4} required minLength={10} maxLength={5000} />
              <input className="contact-honeypot" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="contact-send-row"><span>To: Aarav Gupta</span><button type="submit" className="contact-send" disabled={status === "sending"}>
                {status === "sending" ? <LoaderCircle size={16} className="contact-spinner" /> : <Send size={15} />}
                {status === "sending" ? "Sending..." : "Send message"}
              </button></div>
            </fieldset>
            <p className={`contact-feedback ${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite">{feedback}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;
