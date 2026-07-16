import "./HomeSections.css";

function Footer() {
  const links = [
    { label: "About",          href: "#" },
    { label: "Contact",        href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms",          href: "#" },
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
        © Sid Kaushik | ATS Resume Analyzer. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
