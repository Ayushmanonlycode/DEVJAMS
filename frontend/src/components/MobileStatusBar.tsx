import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

const MobileStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState(85);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      // 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12 in 12-hour format
      
      setCurrentTime(`${hours}:${minutes} ${period}`);
    };
    
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mobile-status-bar px-6 pt-1 pb-0 flex items-center justify-between">
      <div className="flex-1 text-small font-semibold">
        {currentTime}
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-xs">
          <Signal size={12} strokeWidth={2.5} />
        </div>
        <div className="flex items-center text-xs">
          <Wifi size={14} strokeWidth={2.5} />
        </div>
        <div className="flex items-center text-xs">
          <div className="w-6 h-3 border border-black rounded-sm relative flex items-center">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-black rounded-sm" 
              style={{ width: `${batteryLevel}%` }}
            ></div>
            <div className="absolute right-[-2px] top-[2px] bottom-[2px] w-[1px] bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStatusBar; 