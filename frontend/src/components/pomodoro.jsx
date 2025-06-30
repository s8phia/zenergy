import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
  const DEFAULT_TIME = 25 * 60; // 25 minutes
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSecondsLeft(DEFAULT_TIME);
  };

  return (
    <div className="bg-gray-200 border border-black rounded-2xl shadow-md p-6 text-center max-w-md mx-auto mt-6 mb-10">
      <h2 className="text-xl font-bold font-stye: italic mb-4">Pomodoro Timer</h2>
      <div className="text-5xl font-mono mb-6">{formatTime(secondsLeft)}</div>
      <div className="flex justify-center gap-4">
        <button
          className="bg-amber-500 text-white px-4 py-2 rounded-3xl transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-amber-800"
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-3xl transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:bg-yellow-600"
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded-3xl transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg  hover:bg-red-600"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
