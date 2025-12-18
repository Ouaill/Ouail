import { useState, useEffect, useRef, useCallback } from 'react';

// ══════════════════════════════════════════════════════════════
// CONSTANTES DE JEU
// ══════════════════════════════════════════════════════════════

// États du jeu
const GAME_STATE = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
  PAUSED: 'PAUSED'
};

// Touches de contrôle
const JUMP_KEYS = ['Space', ' ', 'ArrowUp', 'KeyW', 'KeyZ', 'Enter'];
const PAUSE_KEYS = ['Escape', 'KeyP'];
const RESTART_KEYS = ['KeyR'];

// Configuration des niveaux
const LEVELS = [
  {
    id: 1,
    name: 'Tutoriel - Découverte',
    speed: 2,
    gap: 180,
    obstacleSpacing: 300,
    targetScore: 5,
    multiplier: 1,
    gravity: 0.4,
    jumpForce: -7.5,
    theme: {
      bg: 'from-sky-400 to-blue-300',
      obstacle: 'bg-green-600',
      obstacleBorder: 'border-green-800'
    }
  },
  {
    id: 2,
    name: 'Échauffement',
    speed: 3,
    gap: 150,
    obstacleSpacing: 280,
    targetScore: 10,
    multiplier: 1.5,
    gravity: 0.45,
    jumpForce: -8,
    theme: {
      bg: 'from-orange-400 via-pink-400 to-purple-400',
      obstacle: 'bg-purple-600',
      obstacleBorder: 'border-purple-900'
    }
  },
  {
    id: 3,
    name: 'Challenge',
    speed: 4,
    gap: 130,
    obstacleSpacing: 260,
    targetScore: 15,
    multiplier: 2,
    gravity: 0.5,
    jumpForce: -8.5,
    theme: {
      bg: 'from-indigo-500 via-purple-500 to-pink-500',
      obstacle: 'bg-indigo-700',
      obstacleBorder: 'border-indigo-950'
    }
  },
  {
    id: 4,
    name: 'Expert',
    speed: 5,
    gap: 115,
    obstacleSpacing: 240,
    targetScore: 20,
    multiplier: 2.5,
    gravity: 0.55,
    jumpForce: -9,
    theme: {
      bg: 'from-slate-800 via-blue-900 to-indigo-900',
      obstacle: 'bg-cyan-500',
      obstacleBorder: 'border-cyan-700'
    }
  },
  {
    id: 5,
    name: 'Maître',
    speed: 6,
    gap: 100,
    obstacleSpacing: 220,
    targetScore: 25,
    multiplier: 3,
    gravity: 0.6,
    jumpForce: -9.5,
    theme: {
      bg: 'from-purple-900 via-indigo-900 to-black',
      obstacle: 'bg-gradient-to-b from-purple-500 to-pink-500',
      obstacleBorder: 'border-purple-400'
    }
  }
];

// Constantes de jeu
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 40;
const OBSTACLE_WIDTH = 60;

// ══════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════

function App() {
  // États du jeu
  const [gameState, setGameState] = useState(GAME_STATE.MENU);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [countdown, setCountdown] = useState(null);

  // États du personnage
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);

  // États des obstacles
  const [obstacles, setObstacles] = useState([]);
  const [nextObstacleId, setNextObstacleId] = useState(0);

  // Refs
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const keysPressed = useRef(new Set());

  // Récupérer le niveau actuel
  const level = LEVELS[currentLevel];

  // ══════════════════════════════════════════════════════════════
  // FONCTIONS UTILITAIRES
  // ══════════════════════════════════════════════════════════════

  const resetGame = useCallback(() => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setObstacles([]);
    setNextObstacleId(0);
    setLevelScore(0);
  }, []);

  const startLevel = useCallback((levelIndex) => {
    resetGame();
    setCurrentLevel(levelIndex);
    setGameState(GAME_STATE.PLAYING);
  }, [resetGame]);

  const startCountdown = useCallback((levelIndex) => {
    resetGame();
    setCurrentLevel(levelIndex);
    setCountdown(3);
    setGameState(GAME_STATE.LEVEL_COMPLETE);
  }, [resetGame]);

  const jump = useCallback(() => {
    if (gameState === GAME_STATE.PLAYING && level) {
      setBirdVelocity(level.jumpForce);
    }
  }, [gameState, level]);

  const checkCollision = useCallback((bird_Y, obstaclesList) => {
    // Collision avec le sol ou plafond
    if (bird_Y < 0 || bird_Y + BIRD_SIZE > GAME_HEIGHT) {
      return true;
    }

    // Hitbox tolérante (80% du sprite)
    const birdLeft = 100 + BIRD_SIZE * 0.1;
    const birdRight = 100 + BIRD_SIZE * 0.9;
    const birdTop = bird_Y + BIRD_SIZE * 0.1;
    const birdBottom = bird_Y + BIRD_SIZE * 0.9;

    // Collision avec les obstacles
    for (const obstacle of obstaclesList) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + OBSTACLE_WIDTH;

      // Si l'oiseau est dans la zone horizontale de l'obstacle
      if (birdRight > obstacleLeft && birdLeft < obstacleRight) {
        // Vérifier collision avec obstacle du haut
        if (birdTop < obstacle.topHeight) {
          return true;
        }
        // Vérifier collision avec obstacle du bas
        if (birdBottom > obstacle.topHeight + obstacle.gap) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // ══════════════════════════════════════════════════════════════
  // GESTION DES ÉVÉNEMENTS CLAVIER
  // ══════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current.add(e.code);

      // Empêcher le comportement par défaut
      if (JUMP_KEYS.includes(e.code) || JUMP_KEYS.includes(e.key) ||
          PAUSE_KEYS.includes(e.code) || RESTART_KEYS.includes(e.code)) {
        e.preventDefault();
      }

      // Saut
      if (JUMP_KEYS.includes(e.code) || JUMP_KEYS.includes(e.key)) {
        if (gameState === GAME_STATE.MENU) {
          startCountdown(0);
        } else if (gameState === GAME_STATE.PLAYING) {
          jump();
        } else if (gameState === GAME_STATE.GAME_OVER) {
          resetGame();
          setScore(0);
          setLevelScore(0);
          setCurrentLevel(0);
          setGameState(GAME_STATE.MENU);
        } else if (gameState === GAME_STATE.VICTORY) {
          resetGame();
          setScore(0);
          setLevelScore(0);
          setCurrentLevel(0);
          setGameState(GAME_STATE.MENU);
        }
      }

      // Pause
      if (PAUSE_KEYS.includes(e.code)) {
        if (gameState === GAME_STATE.PLAYING) {
          setGameState(GAME_STATE.PAUSED);
        } else if (gameState === GAME_STATE.PAUSED) {
          setGameState(GAME_STATE.PLAYING);
        }
      }

      // Restart
      if (RESTART_KEYS.includes(e.code)) {
        if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) {
          resetGame();
          setLevelScore(0);
          setGameState(GAME_STATE.PLAYING);
        }
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, jump, resetGame, startCountdown]);

  // Gestion du clic souris
  const handleClick = useCallback(() => {
    if (gameState === GAME_STATE.MENU) {
      startCountdown(0);
    } else if (gameState === GAME_STATE.PLAYING) {
      jump();
    } else if (gameState === GAME_STATE.GAME_OVER) {
      resetGame();
      setScore(0);
      setLevelScore(0);
      setCurrentLevel(0);
      setGameState(GAME_STATE.MENU);
    } else if (gameState === GAME_STATE.VICTORY) {
      resetGame();
      setScore(0);
      setLevelScore(0);
      setCurrentLevel(0);
      setGameState(GAME_STATE.MENU);
    }
  }, [gameState, jump, resetGame, startCountdown]);

  // ══════════════════════════════════════════════════════════════
  // COMPTE À REBOURS
  // ══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      setGameState(GAME_STATE.PLAYING);
    }
  }, [countdown]);

  // ══════════════════════════════════════════════════════════════
  // GAME LOOP
  // ══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (gameState !== GAME_STATE.PLAYING) {
      return;
    }

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Physique de l'oiseau
      setBirdVelocity((v) => v + level.gravity);
      setBirdY((y) => {
        const newY = y + birdVelocity;
        return newY;
      });

      // Gestion des obstacles
      setObstacles((prevObstacles) => {
        let newObstacles = [...prevObstacles];

        // Déplacer les obstacles
        newObstacles = newObstacles.map((obs) => ({
          ...obs,
          x: obs.x - level.speed,
        }));

        // Supprimer les obstacles hors écran
        newObstacles = newObstacles.filter((obs) => obs.x + OBSTACLE_WIDTH > 0);

        // Ajouter de nouveaux obstacles si nécessaire
        const lastObstacle = newObstacles[newObstacles.length - 1];
        if (!lastObstacle || lastObstacle.x < GAME_WIDTH - level.obstacleSpacing) {
          const topHeight = Math.random() * (GAME_HEIGHT - level.gap - 100) + 50;
          newObstacles.push({
            id: nextObstacleId,
            x: GAME_WIDTH,
            topHeight: topHeight,
            gap: level.gap,
            scored: false,
          });
          setNextObstacleId((id) => id + 1);
        }

        // Vérifier si l'oiseau a franchi un obstacle
        newObstacles = newObstacles.map((obs) => {
          if (!obs.scored && obs.x + OBSTACLE_WIDTH < 100) {
            setLevelScore((s) => s + 1);
            setScore((s) => s + Math.floor(level.multiplier));
            return { ...obs, scored: true };
          }
          return obs;
        });

        return newObstacles;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [gameState, birdVelocity, level, nextObstacleId]);

  // ══════════════════════════════════════════════════════════════
  // DÉTECTION DE COLLISION
  // ══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (gameState === GAME_STATE.PLAYING) {
      if (checkCollision(birdY, obstacles)) {
        setGameState(GAME_STATE.GAME_OVER);
        if (score > bestScore) {
          setBestScore(score);
        }
      }
    }
  }, [birdY, obstacles, gameState, checkCollision, score, bestScore]);

  // ══════════════════════════════════════════════════════════════
  // PROGRESSION DE NIVEAU
  // ══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (gameState === GAME_STATE.PLAYING && level && levelScore >= level.targetScore) {
      if (currentLevel < LEVELS.length - 1) {
        // Passer au niveau suivant
        startCountdown(currentLevel + 1);
      } else {
        // Victoire !
        setGameState(GAME_STATE.VICTORY);
        if (score > bestScore) {
          setBestScore(score);
        }
      }
    }
  }, [levelScore, gameState, level, currentLevel, startCountdown, score, bestScore]);

  // ══════════════════════════════════════════════════════════════
  // RENDU
  // ══════════════════════════════════════════════════════════════

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div
        className={`relative overflow-hidden shadow-2xl transition-all duration-500 ${
          level ? `bg-gradient-to-b ${level.theme.bg}` : 'bg-gradient-to-b from-sky-400 to-blue-300'
        }`}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={handleClick}
      >
        {/* ═══════════════════════════════════════════════════════ */}
        {/* ÉCRAN DE MENU */}
        {/* ═══════════════════════════════════════════════════════ */}
        {gameState === GAME_STATE.MENU && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <h1 className="text-7xl font-bold text-white mb-8 drop-shadow-2xl animate-pulse">
              🐦 FLAPPY BIRD
            </h1>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-2xl max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                5 Niveaux de Difficulté
              </h2>
              <div className="space-y-3 mb-6">
                {LEVELS.map((lvl, idx) => (
                  <div key={lvl.id} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">
                      {lvl.id}. {lvl.name}
                    </span>
                    <span className="text-gray-600">→ {lvl.targetScore} obstacles</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-gray-300 pt-4 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Contrôles :</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">Sauter :</span>
                    <span>ESPACE / ↑ / W / Z / ENTRÉE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Pause :</span>
                    <span>ÉCHAP / P</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Recommencer :</span>
                    <span>R</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Clic souris :</span>
                    <span>Sauter / Sélectionner</span>
                  </div>
                </div>
              </div>
              {bestScore > 0 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-4">
                  <p className="text-center font-bold text-yellow-800">
                    🏆 Meilleur Score : {bestScore}
                  </p>
                </div>
              )}
              <button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => startCountdown(0)}
              >
                JOUER
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ÉCRAN DE COMPTE À REBOURS */}
        {/* ═══════════════════════════════════════════════════════ */}
        {gameState === GAME_STATE.LEVEL_COMPLETE && countdown !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur rounded-3xl p-12 shadow-2xl text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Niveau {level.id}
              </h2>
              <h3 className="text-2xl font-semibold text-gray-600 mb-8">
                {level.name}
              </h3>
              <div className="text-9xl font-bold text-blue-600 animate-bounce">
                {countdown > 0 ? countdown : 'GO!'}
              </div>
              <div className="mt-8 text-gray-700">
                <p className="text-lg">Objectif : {level.targetScore} obstacles</p>
                <p className="text-sm text-gray-500 mt-2">
                  Multiplicateur : x{level.multiplier}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ÉCRAN DE JEU */}
        {/* ═══════════════════════════════════════════════════════ */}
        {(gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) && (
          <>
            {/* Oiseau */}
            <div
              className="absolute bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-lg transition-transform"
              style={{
                left: 100,
                top: birdY,
                width: BIRD_SIZE,
                height: BIRD_SIZE,
                transform: `rotate(${Math.max(-30, Math.min(30, birdVelocity * 3))}deg)`,
              }}
            >
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full"></div>
            </div>

            {/* Obstacles */}
            {obstacles.map((obstacle) => (
              <div key={obstacle.id}>
                {/* Obstacle du haut */}
                <div
                  className={`absolute ${level.theme.obstacle} border-4 ${level.theme.obstacleBorder} shadow-xl`}
                  style={{
                    left: obstacle.x,
                    top: 0,
                    width: OBSTACLE_WIDTH,
                    height: obstacle.topHeight,
                  }}
                />
                {/* Obstacle du bas */}
                <div
                  className={`absolute ${level.theme.obstacle} border-4 ${level.theme.obstacleBorder} shadow-xl`}
                  style={{
                    left: obstacle.x,
                    top: obstacle.topHeight + obstacle.gap,
                    width: OBSTACLE_WIDTH,
                    height: GAME_HEIGHT - (obstacle.topHeight + obstacle.gap),
                  }}
                />
              </div>
            ))}

            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-black/70 backdrop-blur text-white px-6 py-3 rounded-xl shadow-lg">
                <p className="text-sm font-semibold">Niveau {level.id}</p>
                <p className="text-2xl font-bold">{levelScore} / {level.targetScore}</p>
              </div>
              <div className="bg-black/70 backdrop-blur text-white px-6 py-3 rounded-xl shadow-lg text-right">
                <p className="text-sm font-semibold">Score Total</p>
                <p className="text-2xl font-bold">{score}</p>
                {bestScore > 0 && (
                  <p className="text-xs text-yellow-400">Meilleur : {bestScore}</p>
                )}
              </div>
            </div>

            {/* Barre de progression */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur rounded-full h-6 overflow-hidden shadow-lg">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-300 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    width: `${Math.min(100, (levelScore / level.targetScore) * 100)}%`,
                  }}
                >
                  {levelScore >= level.targetScore / 2 && `${Math.floor((levelScore / level.targetScore) * 100)}%`}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ÉCRAN DE PAUSE */}
        {/* ═══════════════════════════════════════════════════════ */}
        {gameState === GAME_STATE.PAUSED && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-10 shadow-2xl text-center">
              <h2 className="text-5xl font-bold text-gray-800 mb-6">⏸️ PAUSE</h2>
              <p className="text-gray-600 mb-2">Appuyez sur ÉCHAP ou P pour reprendre</p>
              <p className="text-gray-600">Appuyez sur R pour recommencer le niveau</p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ÉCRAN GAME OVER */}
        {/* ═══════════════════════════════════════════════════════ */}
        {gameState === GAME_STATE.GAME_OVER && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-10 shadow-2xl text-center max-w-md">
              <h2 className="text-6xl font-bold text-red-600 mb-6">💥 GAME OVER</h2>
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <p className="text-gray-600 mb-2">Niveau atteint</p>
                <p className="text-4xl font-bold text-gray-800 mb-4">
                  Niveau {level.id}
                </p>
                <p className="text-gray-600 mb-2">Score final</p>
                <p className="text-5xl font-bold text-blue-600 mb-4">{score}</p>
                {score > bestScore && (
                  <p className="text-green-600 font-bold text-lg">🎉 Nouveau record !</p>
                )}
                {bestScore > 0 && score <= bestScore && (
                  <p className="text-gray-500">Meilleur score : {bestScore}</p>
                )}
              </div>
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  resetGame();
                  setScore(0);
                  setLevelScore(0);
                  setCurrentLevel(0);
                  setGameState(GAME_STATE.MENU);
                }}
              >
                RETOUR AU MENU
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ÉCRAN DE VICTOIRE */}
        {/* ═══════════════════════════════════════════════════════ */}
        {gameState === GAME_STATE.VICTORY && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400">
            <div className="bg-white/95 backdrop-blur rounded-3xl p-12 shadow-2xl text-center max-w-lg">
              <h2 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mb-6 animate-pulse">
                🎉 VICTOIRE ! 🎉
              </h2>
              <p className="text-2xl font-bold text-gray-800 mb-8">
                Vous avez complété les 5 niveaux !
              </p>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-6">
                <p className="text-gray-600 mb-2">Score final</p>
                <p className="text-6xl font-bold text-orange-600 mb-4">{score}</p>
                {score > bestScore && (
                  <p className="text-green-600 font-bold text-xl">🏆 Nouveau record absolu !</p>
                )}
              </div>
              <div className="mb-6">
                <p className="text-gray-700 font-semibold">Félicitations !</p>
                <p className="text-gray-600 text-sm">
                  Vous êtes un véritable maître de Flappy Bird
                </p>
              </div>
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  resetGame();
                  setScore(0);
                  setLevelScore(0);
                  setCurrentLevel(0);
                  setGameState(GAME_STATE.MENU);
                }}
              >
                REJOUER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
