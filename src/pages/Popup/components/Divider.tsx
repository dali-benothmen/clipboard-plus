import React from 'react';

interface DividerProps {
  text: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => (
  <div className="clipboard-line-separator bg-[#f7f7f7] text-center py-1 px-0 text-[#b7b7b7] text-[10px] tracking-wider">
    {text}
  </div>
);

export default Divider;
