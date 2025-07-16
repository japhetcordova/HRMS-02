import React from 'react';

const FormInput = ({ label, name, value, onChange, type = 'text', required = false, ...props }) => (
  <div>
    <label className="block font-semibold mb-1">{label}{required && ' *'}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
      {...props}
    />
  </div>
);

export default FormInput;
