import React, { useState } from "react";
import { FiMail, FiSend, FiGithub, FiLinkedin } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
import { profile } from "../content/profile";
import { getProfileLinks } from "../utils/profileLinks";
import Magnetic from "../components/Magnetic";

const empty = { name: "", email: "", subject: "", message: "", _gotcha: "" };

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.subject.trim().length < 3) e.subject = "Please add a short subject.";
  if (v.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  return e;
};

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-white placeholder-zinc-500 transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 focus:shadow-[0_0_20px_rgba(239,91,79,0.25)] focus:outline-none";

export default function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | success | error

  const onChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (values._gotcha) return; // bot
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          _gotcha: values._gotcha,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok === true) {
        setState("success");
        setValues(empty);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const mailto = profile.links?.email
    ? `mailto:${profile.links.email}?subject=${encodeURIComponent(
        values.subject || "Portfolio Inquiry"
      )}&body=${encodeURIComponent(values.message)}`
    : "";

  const githubLink = getProfileLinks(["github"])[0]?.href || profile.links?.github;
  const linkedinLink = getProfileLinks(["linkedin"])[0]?.href || profile.links?.linkedin;

  return (
    <section id="contact" className="mt-28 md:mt-36 scroll-mt-24">
      <SectionHeading
        label="GET IN TOUCH"
        title="Let's Build Something Together"
        subtitle="Have an opportunity, a question, or an idea? I'd like to hear from you."
      />

      <div className="grid gap-8 md:grid-cols-5 items-start">
        {/* ─────────────────────────────────────────────────────────────
            Left Card: Contact Details
        ───────────────────────────────────────────────────────────── */}
        <div
          data-aos="fade-right"
          data-aos-duration="850"
          data-aos-once="true"
          className="md:col-span-2 design-card p-6 sm:p-8 flex flex-col justify-between h-full space-y-6"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[var(--accent)] block mb-2">
              DIRECT REACH
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
              Contact Details
            </h3>

            {/* Email link */}
            {profile.links?.email ? (
              <a
                href={`mailto:${profile.links.email}`}
                className="group flex items-center gap-3 text-base text-zinc-200 hover:text-[var(--accent)] transition-colors py-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[var(--surface-2)] text-[var(--accent)] group-hover:scale-110 transition-transform">
                  <FiMail size={18} aria-hidden="true" />
                </div>
                <span className="break-all font-medium">{profile.links.email}</span>
              </a>
            ) : null}

            {/* Optional Availability Line (hide if empty) */}
            {profile.availability && profile.availability.trim().length > 0 && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm text-emerald-300">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span>{profile.availability}</span>
              </div>
            )}
          </div>

          {/* Social Icon Circles */}
          <div className="pt-6 border-t border-[var(--border)]">
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--muted)] block mb-3">
              Social Profiles
            </span>
            <div className="flex items-center gap-3">
              {githubLink && (
                <Magnetic strength={0.3}>
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-white hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_15px_rgba(239,91,79,0.3)] transition-all cursor-pointer"
                  >
                    <FiGithub size={18} aria-hidden="true" />
                  </a>
                </Magnetic>
              )}

              {linkedinLink && (
                <Magnetic strength={0.3}>
                  <a
                    href={linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-white hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_15px_rgba(239,91,79,0.3)] transition-all cursor-pointer"
                  >
                    <FiLinkedin size={18} aria-hidden="true" />
                  </a>
                </Magnetic>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            Right Card: Contact Form
        ───────────────────────────────────────────────────────────── */}
        <form
          data-aos="fade-left"
          data-aos-duration="850"
          data-aos-once="true"
          onSubmit={onSubmit}
          noValidate
          className="md:col-span-3 design-card p-6 sm:p-8"
        >
          <div className="flex flex-col gap-5">
            {[
              ["name", "NAME", "text", "Your name"],
              ["email", "EMAIL", "email", "your.email@example.com"],
              ["subject", "SUBJECT", "text", "Project discussion / inquiry"],
            ].map(([n, label, type, placeholder]) => (
              <div key={n} className="flex flex-col gap-1.5">
                <label
                  htmlFor={`c-${n}`}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]"
                >
                  {label}
                </label>
                <input
                  id={`c-${n}`}
                  name={n}
                  type={type}
                  placeholder={placeholder}
                  value={values[n]}
                  onChange={onChange}
                  aria-invalid={!!errors[n]}
                  aria-describedby={errors[n] ? `c-${n}-err` : undefined}
                  className={inputClass}
                />
                {errors[n] && (
                  <p id={`c-${n}-err`} className="text-xs text-[var(--accent)]">
                    {errors[n]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="c-message"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]"
              >
                MESSAGE
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={5}
                placeholder="Tell me about your project, team, or inquiry..."
                value={values.message}
                onChange={onChange}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "c-message-err" : undefined}
                className={inputClass}
              />
              {errors.message && (
                <p id="c-message-err" className="text-xs text-[var(--accent)]">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="_gotcha"
              value={values._gotcha}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {/* Coral Submit Button */}
            <div className="pt-2">
              <Magnetic strength={0.15}>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="btn-coral btn-shine-sweep text-xs sm:text-sm uppercase tracking-wider font-bold"
                >
                  <FiSend aria-hidden="true" />
                  <span>{state === "sending" ? "Sending…" : "Send Message"}</span>
                </button>
              </Magnetic>
            </div>

            {/* Status Notifications */}
            <div role="status" aria-live="polite" className="text-sm pt-2">
              {state === "success" && (
                <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-emerald-300">
                  Thanks! Your message was sent successfully.
                </p>
              )}
              {state === "error" && (
                <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-red-300">
                  Message not sent, please try again
                  {profile.links?.email ? (
                    <>
                      {" "}or{" "}
                      <a
                        className="underline text-[var(--accent)] hover:text-white font-semibold"
                        href={`mailto:${profile.links.email}`}
                      >
                        email me directly
                      </a>
                    </>
                  ) : (
                    " or email me directly"
                  )}
                  .
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
