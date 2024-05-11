import React, { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import "./App.css";

function InstructionsModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Fastest Typer Game Instructions</h2>
        <p>
          <strong>Objective:</strong> Type as fast as you can within the set
          time limit.
        </p>
        <p>
          <strong>Game Setup:</strong> Enter the desired game duration (in
          seconds) and click "Start."
        </p>
        <p>
          <strong>Gameplay:</strong> Start typing when the game begins. The
          player with the fastest typing speed wins.
        </p>
        <p>
          <strong>Winning Criteria:</strong> The player with the shortest
          elapsed time (fastest typing speed) wins.
        </p>
        <p>
          <strong>Reset:</strong> Click "Reset" to start a new round.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [gameDuration, setGameDuration] = useState(60); // Default duration is 60 seconds
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  const toggleConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Hide confetti after 5 seconds
  };

  const updateScore = useCallback(() => {
    const newScore = { ...score };
    newScore.player1 = elapsedTime;
    setScore(newScore);
    toggleConfetti();
  }, [score, elapsedTime]);

  const updateScorePlayer2 = useCallback(() => {
    const newScore = { ...score };
    newScore.player2 = elapsedTime;
    setScore(newScore);
    toggleConfetti();
  }, [score, elapsedTime]);

  useEffect(() => {
    if (startTime && !endTime) {
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTimeInSeconds = (currentTime - startTime) / 1000;
        setElapsedTime(elapsedTimeInSeconds);
        if (elapsedTimeInSeconds >= gameDuration) {
          clearInterval(timer);
          setEndTime(currentTime);
          setIsPlaying(false);
          updateScore();
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [startTime, endTime, gameDuration, updateScore]);

  const handleButtonClick = () => {
    if (!isPlaying) {
      setStartTime(Date.now());
      setIsPlaying(true);
    } else {
      setEndTime(Date.now());
      setIsPlaying(false);
      updateScore();
    }
  };

  const handleReset = () => {
    setStartTime(null);
    setEndTime(null);
    setElapsedTime(0);
    setScore({ player1: 0, player2: 0 });
  };

  const handlePlayer2Click = () => {
    if (!isPlaying) {
      setStartTime(Date.now());
      setIsPlaying(true);
    } else {
      setEndTime(Date.now());
      setIsPlaying(false);
      updateScorePlayer2();
    }
  };

  const handleDurationChange = (event) => {
    setGameDuration(parseInt(event.target.value));
  };

  return (
    <div className="App">
      <h1>Fastest Presser App</h1>
      <div className="duration-container">
        <label htmlFor="duration">Game Duration (seconds):</label>
        <input
          type="number"
          id="duration"
          value={gameDuration}
          onChange={handleDurationChange}
          min="1"
        />
      </div>
      <div className="button-container">
        <button
          onClick={handleButtonClick}
          disabled={isPlaying && !endTime}
          className={isPlaying ? "player1-playing" : ""}
        >
          {isPlaying && !endTime
            ? "Player 1: Type as fast as you can!"
            : "Player 1: Start"}
        </button>
        <button
          onClick={handlePlayer2Click}
          disabled={isPlaying && !endTime}
          className={isPlaying ? "player2-playing" : ""}
        >
          {isPlaying && !endTime
            ? "Player 2: Type as fast as you can!"
            : "Player 2: Start"}
        </button>
        <button onClick={toggleInstructions}>Learn</button>
        {showInstructions && <InstructionsModal onClose={toggleInstructions} />}
      </div>
      {showConfetti && <Confetti />}
      {isPlaying && !endTime && (
        <p className="timer">{`Time Left: ${Math.max(
          gameDuration - elapsedTime,
          0
        ).toFixed(2)} seconds`}</p>
      )}

      {endTime && (
        <div>
          <p>{`Player 1 time: ${score.player1.toFixed(2)} seconds`}</p>
          <p>{`Player 2 time: ${score.player2.toFixed(2)} seconds`}</p>
          {score.player1 < score.player2 ? (
            <p>Player 1 wins!</p>
          ) : score.player1 > score.player2 ? (
            <p>Player 2 wins!</p>
          ) : (
            <p>It's a tie!</p>
          )}
          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </div>
  );
}

export default App;
