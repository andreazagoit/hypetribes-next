import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const PrimaryButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const OutlineButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const LargeButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const SmallButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
