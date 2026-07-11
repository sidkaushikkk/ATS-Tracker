import "./HomeSections.css";

function Footer() {
  const links = [
    { label: "About",          href: "#" },
    { label: "Contact",        href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms",          href: "#" },
    { label: "GitHub",         href: "https://github.com" },
    { label: "LinkedIn",       href: "https://linkedin.com" },
  ];

  return (
    <footer className="hs-footer">
      <div className="footer-links">
        {links.map((l) => (
          <a href={l.href} key={l.label} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {l.label}
          </a>
        ))}
      </div>
      <p className="footer-copy">
        © 2026 ATS Resume Analyzer. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
