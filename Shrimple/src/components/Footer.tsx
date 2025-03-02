import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <>
        <footer className="footer">
            <div className="container">
                <p className="mb-0">
                    &copy; {new Date().getFullYear()} Shrimple. All rights reserved.
                </p>

                <div className="mb-0">
                    <Link aria-current="page" to="/PrivacyPolicy">Privacy Policy </Link>
                </div>

                <div className="mb-0">
                    <Link aria-current="page" to="/TermsOfService">Terms of Service </Link>
                </div>

                <div className="mb-0">
                    <Link aria-current="page" to="/ContactInfo">Contact Info</Link>
                </div>
            </div>
        </footer>
        </>
    );
}

export default Footer;