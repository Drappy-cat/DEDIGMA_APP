import React from "react";

interface SkyBgProps {
  children: React.ReactNode;
  className?: string;
}

export const SkyBg: React.FC<SkyBgProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100 ${className}`}>
      {children}
    </div>
  );
};
export default SkyBg;
