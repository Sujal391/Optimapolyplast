import React from "react";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`min-w-full text-sm text-left text-gray-700 ${className}`}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableRow({ children }) {
  return <tr className="border-b">{children}</tr>;
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase ${className}`}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
