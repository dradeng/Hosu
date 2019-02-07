import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <footer style={{maxHeight:100}}className="bg-light text-dark mt-5 p-4 text-center">
      <div>
  		<Link className="text-dark" style={{ textDecoration: 'none', paddingRight: 10 }} to="/how-it-works">
        	How It Works
      </Link>
  		|
  		<Link className="text-dark" style={{ textDecoration: 'none', padding: 10 }} to="/terms-of-service">
        	Terms of Service
      </Link>
      |
      <Link className="text-dark" style={{ textDecoration: 'none', padding: 10 }} to="/privacy-policy">
          Privacy Policy
      </Link>
      |
  		<Link className="text-dark" style={{ textDecoration: 'none', paddingLeft: 10 }} to="/careers">
        	Careers
      </Link>
      </div>

      Copyright &copy; {new Date().getFullYear()} Aveneu

    </footer>
  );
};
