import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Square, Clock } from 'lucide-react';
import TimeSaveModal from '../Modals/TimeSaveModal';

const Header = ({ titulo, toggleSidebar }) => { 
  const navigate = useNavigate();
  
  // Estados Cronómetro
  const [showTimerDropdown, setShowTimerDropdown] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const stopTimer = () => {
    setIsActive(false);
    setShowTimerDropdown(false); 
    setShowSaveModal(true); 
  };

  const handleSaveCompleted = () => {
    setSeconds(0); 
    alert("¡Tiempo registrado correctamente en la base de datos!");
  };

  return (
    <>
        <header className="h-16 bg-black flex items-center px-6 border-b border-gray-800 relative z-30">
        
        <button 
            className="text-2xl text-gray-400 hover:text-white transition-colors mr-3 md:hidden"
            onClick={toggleSidebar} 
        >
            ☰
        </button>

        <button 
            className="mr-6 text-2xl text-gray-400 hover:text-white transition-colors max-md:hidden" 
            onClick={() => navigate('/')} 
        >
            🏠
        </button>

        <div className="flex-grow text-3xl font-bold text-white text-left truncate">
            {titulo || 'Inicio'} 
        </div>
        
        <div className="flex space-x-4 text-gray-400 items-center relative">
            <div className="relative">
                <button 
                    onClick={() => setShowTimerDropdown(!showTimerDropdown)}
                    className={`text-2xl transition-colors flex items-center gap-2 ${isActive || seconds > 0 ? 'text-green-500' : 'hover:text-white'}`}
                    title="Cronómetro"
                >
                    <Clock className="w-6 h-6" />
                    {(isActive || seconds > 0) && (
                        <span className="text-sm font-mono font-bold hidden md:block">{formatTime(seconds)}</span>
                    )}
                </button>

                {showTimerDropdown && (
                    <div className="absolute right-0 top-12 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 flex flex-col items-center z-50">
                        <div className="text-2xl font-mono text-white mb-3 font-bold">
                            {formatTime(seconds)}
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={toggleTimer}
                                className={`p-2 rounded-full text-white ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </button>
                            <button 
                                onClick={stopTimer}
                                disabled={seconds === 0}
                                className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Square className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <button className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
            U
            </button>
        </div>
        </header>

        {showSaveModal && (
            <TimeSaveModal 
                seconds={seconds} 
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveCompleted}
            />
        )}
    </>
  );
};

export default Header;