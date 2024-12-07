import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import GameShape from './GameShape';
import styles from './DiamanteGame.module.css';
import * as gtag from '@/lib/gtag'
import GamesHelpDialog from './GamesHelpDialog';  // 确保路径正确

const SHAPES = ['heart', 'circle', 'square'];
const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'brown'];
const ROWS = 10;
const COLS = 5;

const DiamanteGame = forwardRef((props, ref) => {
  const { t, isLoading } = useTranslations();
  const [gameBoard, setGameBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [feedback, setFeedback] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [targetNumbers, setTargetNumbers] = useState(Array(ROWS).fill(0));
  const [currentRow, setCurrentRow] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [isHardMode, setIsHardMode] = useState(false);
  const [usedShapes, setUsedShapes] = useState(new Set());
  const [showHelpDialog, setShowHelpDialog] = useState(false);  // 添加这行

  const [highScore, setHighScore] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);

  useEffect(() => {
    // Initialize from localStorage only on client side
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('shap10r_highScore');
      const savedBestTime = localStorage.getItem('shap10r_bestTime');
      if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
      if (savedBestTime) setBestTime(parseInt(savedBestTime, 10));
    }
  }, []);

  const updateHighScore = useCallback((newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      if (typeof window !== 'undefined') {
        localStorage.setItem('shap10r_highScore', newScore.toString());
      }
    }
  }, [highScore]);

  const updateBestTime = useCallback((newTime) => {
    if (newTime < bestTime || bestTime === Infinity) {
      setBestTime(newTime);
      if (typeof window !== 'undefined') {
        localStorage.setItem('shap10r_bestTime', newTime.toString());
      }
    }
  }, [bestTime]);

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
    setShowWinDialog(false);
    setUsedShapes(new Set());
  }, [isHardMode, calculateValue, initializeValues]);

  const handlePieceSelect = useCallback((piece) => {
    if (!isPlaying || currentRow >= ROWS) return;

    const currentRowCells = gameBoard[currentRow];
    const emptyIndex = currentRowCells.findIndex((cell, index) => 
      cell === null && feedback[currentRow][index] !== 'correct'
    );
    
    if (emptyIndex === -1) return;
    
    // 添加到已使用形状集合，但这只是为了显示标记
    setUsedShapes(prev => {
      const newSet = new Set(prev);
      newSet.add(`${piece.shape}-${piece.color}`);
      return newSet;
    });

    const newBoard = [...gameBoard];
    newBoard[currentRow][emptyIndex] = {
      ...piece,
      value: calculateValue(piece.shape, piece.color)
    };
    
    setGameBoard(newBoard);
  }, [gameBoard, currentRow, isPlaying, calculateValue, feedback]);

  // 检查当前行
  const checkRow = useCallback(() => {

    window.gtag('event', 'check_row', {
      event_category: 'Game',
      event_label: 'Row Validation',
      value: score
    });
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
    // 找到最后一个可删除的位置（非正确位置）
    const lastFilledIndex = currentRowCells.map((cell, index) => 
      cell && feedback[currentRow][index] !== 'correct' ? index : -1
    )
      .filter(i => i !== -1)
      .pop();
    
    if (lastFilledIndex === undefined) return;
  
    const cellToRemove = gameBoard[currentRow][lastFilledIndex];
    
    // 从已使用形状集合中移除
    setUsedShapes(prev => {
      const newSet = new Set(prev);
      newSet.delete(`${cellToRemove.shape}-${cellToRemove.color}`);
      return newSet;
    });
  
    const newBoard = [...gameBoard];
    newBoard[currentRow][lastFilledIndex] = null;
    setGameBoard(newBoard);
  }, [gameBoard, currentRow, isPlaying, feedback]);

  const endGame = (won) => {
    setIsPlaying(false);
    if (won) {
      setShowWinDialog(true);
      setShowWinDialog(true);
      updateHighScore(score);
      updateBestTime(time);

    }
  };

  const handleCloseWinDialog = () => {
    setShowWinDialog(false);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && isTimerActive) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isTimerActive]);

  const handleTimerToggle = () => {
    if (isTimerActive) {
      setTime(0); // 关闭时重置为0
    }
    setIsTimerActive(!isTimerActive);
  };

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return (
    <>
      {!isLoading && (
        <>
          <div className={styles.gameWrapper} ref={ref}>
            <div className={styles.header}>
              <div className={styles.scoreSection}>
                <span>{t.common.game.score}: {score}</span>
                <span>{t.common.game.highScore}: {highScore}</span>
              </div>
              {!props.hideHelp && !props.isQuad && (
                <button 
                  className={styles.helpButton}
                  onClick={() => setShowHelpDialog(true)}
                  aria-label={t.common.game.help}
                >
                  ?
                </button>
              )}
            </div>
            <div className={styles.timerSection}>
              <button 
                className={styles.timerToggle}
                onClick={handleTimerToggle}
                aria-label={isTimerActive ? t.common.game.stopTimer : t.common.game.startTimer}
              >
                {isTimerActive ? "⏸️" : "▶️"}
              </button>
              <span>
                {t.common.game.time}: {formatTime(time)} 
                {bestTime !== Infinity && ` ${t.common.game.bestTime}: ${formatTime(bestTime)}`}
              </span>
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

            <div className={styles.shapesWrapper}>
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
                      gameBoard.some((row, rowIndex) =>
                        row.some((cell, colIndex) =>
                          cell?.shape === shape && 
                          cell?.color === color && 
                          feedback[rowIndex][colIndex] === 'correct'
                        )
                      )
                    }
                  >
                    <GameShape shape={shape} color={color} />
                  </button>
                  ))
                )}
                <button
                  className={`${styles.shapeSelector} ${styles.controlButton}`}
                  onClick={handleDelete}
                  disabled={!isPlaying || !gameBoard[currentRow]?.some(cell => cell !== null)}
                >
                  ✕
                </button>
                <button
                  className={`${styles.shapeSelector} ${styles.controlButton}`}
                  onClick={checkRow}
                  disabled={!isPlaying || !gameBoard[currentRow]?.every(cell => cell !== null)}
                >
                  ✓
                </button>
                <button
                  className={`${styles.shapeSelector} ${styles.controlButton}`}
                  onClick={startNewGame}
                >
                  +
                </button>
              </div>
              {showHelpDialog && (
                <GamesHelpDialog 
                  t={t} 
                  onClose={() => setShowHelpDialog(false)} 
                />
              )}
            </div>

            <div className={styles.statusBar}>
              <button
                className={styles.modeButton}
                onClick={() => {
                  setIsHardMode(!isHardMode);
                  startNewGame();
                }}
              >
                {t.common.game[isHardMode ? 'hardMode' : 'normalMode']}
              </button>
            </div>

            {showWinDialog && (
              <div className={styles.winDialog}>
                <div className={styles.winContent}>
                  <button className={styles.closeButton} onClick={handleCloseWinDialog}>×</button>
                  <h2>{t.common.game.congratulations}</h2>
                  <p>{t.common.game.solvedPuzzle.replace('{tries}', currentRow + 1)}</p>
                  <p className={styles.scoreInfo}>{t.common.game.finalScore.replace('{score}', score)}</p>
                  {score > highScore && (
                    <p className={styles.newHighScore}>{t.common.game.newHighScore}</p>
                  )}
                  <div className={styles.winButtons}>
                    <button 
                      className={styles.newGameButton}
                      onClick={() => {
                        startNewGame();
                        handleCloseWinDialog();
                      }}
                    >
                      {t.common.game.newGame}
                    </button>
                    <button 
                      className={styles.modeButton}
                      onClick={() => {
                        setIsHardMode(!isHardMode);
                        startNewGame();
                        handleCloseWinDialog();
                      }}
                    >
                      {t.common.game.tryMode.replace('{mode}', t.common.game[isHardMode ? 'normalMode' : 'hardMode'])}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
});

DiamanteGame.displayName = 'DiamanteGame';

export default DiamanteGame;