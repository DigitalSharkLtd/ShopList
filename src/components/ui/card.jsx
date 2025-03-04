import React from 'react';

export const Card = ({ className, ...props }) => (
  <div className={`bg-white text-gray-800 ${className}`} {...props} />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={`p-4 pt-0 ${className}`} {...props} />
);
