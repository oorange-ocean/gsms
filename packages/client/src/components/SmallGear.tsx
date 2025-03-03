import React from 'react';
import '@/styles/Gear.scss';

interface SmallGearProps {
  title: string;
  icon: string;
  backgroundColor: string;
  position: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClick?: () => void;
}

const SmallGear: React.FC<SmallGearProps> = ({
  title,
  icon,
  backgroundColor,
  position,
  onClick
}) => {
  return (
    <div
      className={`small-gear small-gear-${position}`}
      onClick={onClick}
    >
      <div className="gear-content" style={{ backgroundColor }}>
        <span className="material-icons">
          {icon}
        </span>
      </div>
      <div className="gear-title">{title}</div>
    </div>
  );
};

export default SmallGear;