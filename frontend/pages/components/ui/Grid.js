// components/ui/Grid.js
import React from 'react';

const Grid = ({ children, className }) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
