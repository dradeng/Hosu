import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <footer style={{maxHeight:100}}className="bg-light text-dark mt-5 p-4 text-center">
      <div>
  		<Link className="text-dark" style={{ textDecoration: 'none', paddingRight: 10 }} to="/howItWorks">
        	How It Works
        </Link>
  		|
  		<Link className="text-dark" style={{ textDecoration: 'none', padding: 10 }} to="/termsOfService">
        	Terms of Service
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
