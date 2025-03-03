import React from 'react';
import '@/styles/Gear.scss';

interface BigGearProps {
  userName: string;
  userIcon: string;
}

const BigGear: React.FC<BigGearProps> = ({ userName, userIcon }) => {
  return (
    <div className="big-gear">
      <div className="gear-content">
        <span className="material-icons">{userIcon}</span>
        <div className="user-name">{userName}</div>
      </div>
    </div>
  );
};

export default BigGear;