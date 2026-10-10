export const contactEmail = "guptaaarav987@gmail.com";

export async function submitContactMessage(fields) {
  let response;
  try {
    response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        _replyto: fields.email,
        _subject: `Portfolio: ${fields.subject}`,
        _template: "table",
      }),
      signal: AbortSignal.timeout(20000),
    });
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new Error("The email service took too long to respond. Delivery is unconfirmed; please email me directly.", { cause: error });
    }
    throw new Error("Couldn't connect to the email service. Check your connection or email me directly.", { cause: error });
  }

  const result = await response.json().catch(() => null);
  const reason = typeof result?.message === "string" ? result.message.trim() : "";

  if (/activat|verif|confirm.*(?:email|form)/i.test(reason)) {
    throw new Error("This contact form is awaiting email verification. Please email me directly for now.");
  }
  if (response.status === 429) {
    throw new Error("The email service has received too many requests. Please wait a little or email me directly.");
  }
  if (response.status >= 500) {
    throw new Error("The email service is temporarily unavailable. Please try again later or email me directly.");
  }
  if (!response.ok || ![true, "true"].includes(result?.success)) {
    throw new Error(reason
      ? `The email service couldn't accept your message: ${reason.slice(0, 300)}`
      : "The email service couldn't confirm your submission. Please email me directly.");
  }
}
