import React from 'react';

export default () => {
  return (
    <footer style={{maxHeight:100}}className="bg-light text-dark mt-5 p-4 text-center">
      Copyright &copy; {new Date().getFullYear()} HausFlex
    </footer>
  );
};
