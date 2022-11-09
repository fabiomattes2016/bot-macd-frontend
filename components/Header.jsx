/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";

const Header = () => {
  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          Nexus - Crypto BOT
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a href="/" className="nav-link px-2 text-secondary">
                Home
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
