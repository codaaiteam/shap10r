import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import GameShape from './GameShape';
import styles from './DiamanteGame.module.css';

const SHAPES = ['heart', 'circle', 'square'];
const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'brown'];
const ROWS = 10;
const COLS = 5;

const DiamanteGame = forwardRef((props, ref) => {
  const [gameBoard, setGameBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [feedback, setFeedback] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [targetNumbers, setTargetNumbers] = useState(Array(ROWS).fill(0));
  const [currentRow, setCurrentRow] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1138);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(4669);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHardMode, setIsHardMode] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [usedShapes, setUsedShapes] = useState(new Set());
  const [showTimer, setShowTimer] = useState(true);

  const shapeValues = useRef({});
  const colorValues = useRef({});
  const targetAnswer = useRef([]);

  const initializeValues = useCallback(() => {
    SHAPES.forEach(shape => {
      shapeValues.current[shape] = Math.floor(Math.random() * 10) * 10 + 10;
    });

    const values = Array.from({length: 8}, (_, i) => i + 1);
    COLORS.forEach(color => {
      const index = Math.floor(Math.random() * values.length);
      colorValues.current[color] = values.splice(index, 1)[0];
    });
  }, []);

  const calculateValue = useCallback((shape, color) => {
    return shapeValues.current[shape] + colorValues.current[color];
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const centiseconds = time % 100;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  const startNewGame = useCallback(() => {
    initializeValues();

    const allPieces = SHAPES.flatMap(shape => 
      COLORS.map(color => ({
        shape,
        color,
        value: calculateValue(shape, color)
      }))
    );

    const answer = [];
    while (answer.length < 5) {
      const index = Math.floor(Math.random() * allPieces.length);
      const piece = allPieces[index];
      if (!answer.some(p => p.value === piece.value)) {
        answer.push(piece);
      }
    }

    if (!isHardMode) {
      answer.sort((a, b) => a.value - b.value);
    }

    targetAnswer.current = answer;
    const initialTotal = answer.reduce((sum, piece) => sum + piece.value, 0);

    setGameBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setFeedback(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setTargetNumbers(Array(ROWS).fill(initialTotal));
    setCurrentRow(0);
    setScore(0);
    setTime(0);
    setIsPlaying(true);
    setUsedShapes(new Set());
    setShowWinDialog(false);
  }, [isHardMode, calculateValue, initializeValues]);

  const handlePieceSelect = useCallback((piece) => {
    if (!isPlaying || currentRow >= ROWS) return;

    const currentRowCells = gameBoard[currentRow];
    const emptyIndex = currentRowCells.findIndex(cell => cell === null);
    
    if (emptyIndex === -1) return;

    setUsedShapes(prev => new Set([...prev, `${piece.shape}-${piece.color}`]));

    const newBoard = [...gameBoard];
    newBoard[currentRow][emptyIndex] = {
      ...piece,
      value: calculateValue(piece.shape, piece.color)
    };
    
    setGameBoard(newBoard);
  }, [gameBoard, currentRow, isPlaying, calculateValue]);

  // 检查当前行
  const checkRow = useCallback(() => {
 if (!gameBoard[currentRow].every(cell => cell !== null)) return;

 const newFeedback = [...feedback];
 const newBoard = [...gameBoard];
 let remainingTotal = targetNumbers[currentRow];
 
 // 第一步：检查完全匹配
 let correctCount = 0;
 newFeedback[currentRow] = gameBoard[currentRow].map((cell, index) => {
   if (cell.value === targetAnswer.current[index].value) {
     remainingTotal -= cell.value;
     correctCount++;
     
     // 如果不是最后一行，自动填充下一行相同位置
     if (currentRow < ROWS - 1) {
       newBoard[currentRow + 1][index] = cell;
     }
     return 'correct';
   }
   return null;
 });

 // 第二步：检查位置错误但值存在的情况
 const unusedTargets = targetAnswer.current.map((target, index) => 
   newFeedback[currentRow][index] !== 'correct' ? target.value : null
 ).filter(v => v !== null);

 gameBoard[currentRow].forEach((cell, index) => {
   if (newFeedback[currentRow][index] === null) {
     const targetIndex = unusedTargets.indexOf(cell.value);
     if (targetIndex !== -1) {
       newFeedback[currentRow][index] = 'wrong-position';
       unusedTargets.splice(targetIndex, 1);
     } else {
       newFeedback[currentRow][index] = 'incorrect';
     }
   }
 });

 setGameBoard(newBoard);
 setFeedback(newFeedback);
 
 // 更新目标数值
 setTargetNumbers(prev => {
   const next = [...prev];
   next[currentRow] = remainingTotal;
   return next;
 });
 
 // 计算本行得分
 const rowScore = targetNumbers[currentRow] - remainingTotal;
 setScore(prev => prev + rowScore);

 // 更新已使用的形状集合，但不包含正确位置的形状
 const newUsedShapes = new Set();
 gameBoard[currentRow].forEach((cell, index) => {
   if (newFeedback[currentRow][index] !== 'correct') {
     newUsedShapes.add(`${cell.shape}-${cell.color}`);
   }
 });
 setUsedShapes(newUsedShapes);

 // 检查是否全部正确
 if (correctCount === COLS) {
   setShowWinDialog(true);
   endGame(true);
 } else {
   if (currentRow === ROWS - 1) {
     endGame(false);
   } else {
     setCurrentRow(prev => prev + 1);
   }
 }
  }, [currentRow, gameBoard, targetNumbers, feedback]);

  const handleDelete = useCallback(() => {
    if (!isPlaying || currentRow >= ROWS) return;
    
    const currentRowCells = gameBoard[currentRow];
    const lastFilledIndex = currentRowCells.map((cell, index) => cell ? index : -1)
      .filter(i => i !== -1)
      .pop();
    
    if (lastFilledIndex === undefined) return;

    const cellToRemove = gameBoard[currentRow][lastFilledIndex];
    setUsedShapes(prev => {
      const newSet = new Set(prev);
      newSet.delete(`${cellToRemove.shape}-${cellToRemove.color}`);
      return newSet;
    });

    const newBoard = [...gameBoard];
    newBoard[currentRow][lastFilledIndex] = null;
    setGameBoard(newBoard);
  }, [gameBoard, currentRow, isPlaying]);

  const endGame = (won) => {
    setIsPlaying(false);
    if (score > highScore) setHighScore(score);
    if (time < bestTime) setBestTime(time);
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime(t => t + 1);
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return (
    <div className={styles.gameWrapper} ref={ref}>
      <div className={styles.header}>
        <div className={styles.scoreSection}>
          Score: {score} HIGH: {highScore}
        </div>
        <div className={styles.timerSection}>
          <button 
            className={styles.timerToggle}
            onClick={() => setShowTimer(!showTimer)}
          >
            {showTimer ? 'Hide' : 'Show'} Timer
          </button>
          {showTimer && (
            <span>Time: {formatTime(time)} BEST: {formatTime(bestTime)}</span>
          )}
        </div>
      </div>

      <div className={styles.gameBoard}>
        {gameBoard.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${
                  feedback[rowIndex]?.[colIndex] === 'correct' ? styles.correct : 
                  feedback[rowIndex]?.[colIndex] === 'wrong-position' ? styles.wrongPosition : ''
                }`}
              >
                {cell && <GameShape shape={cell.shape} color={cell.color} />}
                {cell && feedback[rowIndex]?.[colIndex] === 'correct' && (
                  <span className={styles.value}>{cell.value}</span>
                )}
              </div>
            ))}
            <div className={styles.target}>{targetNumbers[rowIndex]}</div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.shapesGrid}>
          {SHAPES.flatMap(shape => 
            COLORS.map(color => (
            <button
              key={`${shape}-${color}`}
              className={`${styles.shapeSelector} ${
                usedShapes.has(`${shape}-${color}`) ? styles.used : ''
              }`}
              onClick={() => handlePieceSelect({ shape, color })}
              disabled={
                !isPlaying || 
                gameBoard[currentRow]?.every(cell => cell !== null) ||
                // 检查该形状是否已在之前的行中被确认为正确
                feedback.some((rowFeedback, rowIndex) => 
                  rowIndex < currentRow && 
                  gameBoard[rowIndex].some((cell, colIndex) => 
                    cell?.shape === shape && 
                    cell?.color === color && 
                    rowFeedback[colIndex] === 'correct'
                  )
                )
              }
            >
              <GameShape shape={shape} color={color} />
            </button>
            ))
          )}
        </div>
        <div className={styles.gameControls}>
          <button
            className={styles.controlButton}
            onClick={handleDelete}
            disabled={!isPlaying || !gameBoard[currentRow]?.some(cell => cell !== null)}
          >
            Delete
          </button>
          <button
            className={styles.controlButton}
            onClick={checkRow}
            disabled={!isPlaying || !gameBoard[currentRow]?.every(cell => cell !== null)}
          >
            Enter
          </button>
        </div>
      </div>

      <div className={styles.statusBar}>
        <button
          className={styles.modeButton}
          onClick={() => {
            setIsHardMode(!isHardMode);
            startNewGame();
          }}
        >
          {isHardMode ? 'Hard Mode' : 'Normal Mode'}
        </button>
      </div>

      {showWinDialog && (
        <div className={styles.winDialog}>
          <div className={styles.winContent}>
            <h2>Congratulations!</h2>
            <p>You solved the puzzle in {currentRow + 1} tries!</p>
            <p className={styles.scoreInfo}>Final Score: {score}</p>
            {score > highScore && (
              <p className={styles.newHighScore}>New High Score!</p>
            )}
            <div className={styles.winButtons}>
              <button 
                className={styles.newGameButton}
                onClick={startNewGame}
              >
                Play Again
              </button>
              <button 
                className={styles.modeButton}
                onClick={() => {
                  setIsHardMode(!isHardMode);
                  startNewGame();
                }}
              >
                Try {isHardMode ? 'Normal' : 'Hard'} Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

DiamanteGame.displayName = 'DiamanteGame';

export default DiamanteGame;