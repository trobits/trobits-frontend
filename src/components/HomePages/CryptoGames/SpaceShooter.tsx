import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useGameHighscore } from "@/hooks/useGameHighscore";
import { useAppSelector } from "@/redux/hooks";
import { Award, Play, RotateCcw, Trophy, Zap } from 'lucide-react'; // Import necessary icons


// Type definitions for game objects
interface GameAsteroid extends THREE.Mesh {
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  size: number;
}

interface GameBullet extends THREE.Mesh {
  velocity: THREE.Vector3;
}

interface GameExplosion extends THREE.Group {
  life: number;
  maxLife: number;
}

interface KeyState {
  [key: string]: boolean;
}

const SpaceShooterGame: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const shipRef = useRef<THREE.Group | null>(null);
  const asteroidsRef = useRef<GameAsteroid[]>([]);
  const bulletsRef = useRef<GameBullet[]>([]);
  const explosionsRef = useRef<GameExplosion[]>([]);
  const keysRef = useRef<KeyState>({});
  const gameLoopRef = useRef<number | null>(null);

  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "spaceshooter",
    gameName: "Space Shooter"
  });

  // Debug: log user and highscore when loaded
  React.useEffect(() => {
    console.log("[SpaceShooterGame] User:", user);
    console.log("[SpaceShooterGame] Loaded highscore:", highscore);
  }, [user, highscore]);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; userId: string }[]>([]);

  // Fetch leaderboard from backend
  const fetchLeaderboard = useCallback(() => {
    fetch("http://localhost:3000/api/v1/games/spaceshooter/getallscores")
      .then(res => res.json())
      .then(data => {
        const scoresObj = data.scores || {};
        // Convert to array and sort descending
        const arr = Object.values(scoresObj)
          .map((entry: any) => ({
            name: entry.user_id === user?.id
              ? "You"
              : (entry.first_name ? entry.first_name : entry.user_id),
            score: entry.highscore,
            userId: entry.user_id
          }))
          .sort((a, b) => b.score - a.score);
        setLeaderboard(arr);
        console.log("[SpaceShooterGame] Leaderboard fetched (names only):", arr.map(e => ({ name: e.name, score: e.score, userId: e.userId })));
      })
      .catch(err => {
        setLeaderboard([]);
        console.error("[SpaceShooterGame] Failed to fetch leaderboard", err);
      });
  }, [user?.id]);

  // Fetch leaderboard on mount and after game over
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, gameOver]);


  // Initialize Three.js scene with crypto theme
  const initScene = useCallback((): THREE.Scene => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a); // Dark blue matching theme

    // Add stars with crypto-themed colors
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x00d4ff, // Cyan like the theme
      size: 2,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices: number[] = [];
    for (let i = 0; i < 1500; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Add glowing grid effect in the background
    const gridGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.z = -100;
    scene.add(grid);

    sceneRef.current = scene;
    return scene;
  }, []);
  // Get container dimensions
  const getContainerDimensions = useCallback(() => {
    if (!mountRef.current) return { width: 800, height: 600 };
    const rect = mountRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  // Initialize camera
  const initCamera = useCallback((): THREE.PerspectiveCamera => {
    const { width, height } = getContainerDimensions();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    return camera;
  }, [getContainerDimensions]);

  // Initialize renderer
  const initRenderer = useCallback((): THREE.WebGLRenderer => {
    const { width, height } = getContainerDimensions();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0a0e1a);
    rendererRef.current = renderer;
    return renderer;
  }, [getContainerDimensions]);

  // Create crypto-themed spaceship
  const createSpaceship = useCallback((): THREE.Group => {
    const shipGroup = new THREE.Group();

    // Main body with crypto colors
    const bodyGeometry = new THREE.ConeGeometry(0.6, 2.5, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({
      color: 0x00d4ff,
      emissive: 0x003366,
      emissiveIntensity: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    shipGroup.add(body);

    // Glowing core
    const coreGeometry = new THREE.SphereGeometry(0.3);
    const coreMaterial = new THREE.MeshLambertMaterial({
      color: 0xffa500,
      emissive: 0xffa500,
      emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.z = 0.5;
    shipGroup.add(core);

    // Wings with gradient effect
    const wingGeometry = new THREE.BoxGeometry(0.4, 0.15, 1.2);
    const wingMaterial = new THREE.MeshLambertMaterial({
      color: 0x4a90e2,
      emissive: 0x001133,
      emissiveIntensity: 0.2
    });

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.8, 0, -0.2);
    shipGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.8, 0, -0.2);
    shipGroup.add(rightWing);

    shipGroup.position.set(0, 0, 0);
    shipRef.current = shipGroup;
    return shipGroup;
  }, []);

  // Create crypto-themed asteroid
  const createAsteroid = useCallback((size: number | null = null, position: THREE.Vector3 | null = null): GameAsteroid => {
    const asteroidSize = size || (Math.random() * 2 + 1);
    const geometry = new THREE.DodecahedronGeometry(asteroidSize);
    const material = new THREE.MeshLambertMaterial({
      color: 0x8B4513,
      emissive: 0x441100,
      emissiveIntensity: 0.1
    });
    const asteroid = new THREE.Mesh(geometry, material) as unknown as GameAsteroid;

    // Add glowing edges
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.6
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    asteroid.add(wireframe);

    if (position) {
      asteroid.position.copy(position);
      asteroid.position.add(new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ));
    } else {
      asteroid.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        -50
      );
    }

    asteroid.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      Math.random() * 0.3 + 0.1
    );

    asteroid.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    asteroid.rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    );

    asteroid.size = asteroidSize;

    return asteroid;
  }, []);

  // Create explosion effect with crypto colors
  const createExplosion = useCallback((position: THREE.Vector3, size: number = 1, color: number = 0x00d4ff): GameExplosion => {
    const explosionGroup = new THREE.Group() as GameExplosion;
    const particleCount = Math.floor(size * 25);

    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1 * size);
      const particleMaterial = new THREE.MeshLambertMaterial({
        color: i % 3 === 0 ? 0x00d4ff : (i % 3 === 1 ? 0xffa500 : 0xff4400),
        transparent: true,
        opacity: 1,
        emissive: i % 3 === 0 ? 0x003366 : (i % 3 === 1 ? 0x663300 : 0x331100),
        emissiveIntensity: 0.3
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial) as unknown as THREE.Mesh & { velocity: THREE.Vector3 };

      particle.position.copy(position);
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.4 * size,
        (Math.random() - 0.5) * 0.4 * size,
        (Math.random() - 0.5) * 0.4 * size
      );

      explosionGroup.add(particle);
    }

    explosionGroup.position.copy(position);
    explosionGroup.life = 80;
    explosionGroup.maxLife = 80;

    return explosionGroup;
  }, []);

  // Break asteroid into smaller pieces
  const breakAsteroid = useCallback((asteroid: GameAsteroid): GameAsteroid[] => {
    if (!sceneRef.current) return [];

    const fragments: GameAsteroid[] = [];
    const numFragments = Math.floor(asteroid.size) + 2;
    const fragmentSize = asteroid.size * 0.4;

    if (fragmentSize > 0.3) {
      for (let i = 0; i < numFragments; i++) {
        const fragment = createAsteroid(fragmentSize, asteroid.position);

        fragment.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          Math.random() * 0.2 + 0.1
        );

        sceneRef.current.add(fragment);
        asteroidsRef.current.push(fragment);
        fragments.push(fragment);
      }
    }

    const explosion = createExplosion(asteroid.position, asteroid.size, 0x00d4ff);
    sceneRef.current.add(explosion);
    explosionsRef.current.push(explosion);

    return fragments;
  }, [createAsteroid, createExplosion]);

  // Create ship explosion with dramatic effect
  const createShipExplosion = useCallback((position: THREE.Vector3): void => {
    if (!sceneRef.current) return;

    const explosion = createExplosion(position, 4, 0xff0044);
    sceneRef.current.add(explosion);
    explosionsRef.current.push(explosion);

    if (cameraRef.current) {
      const originalPosition = cameraRef.current.position.clone();
      let shakeFrames = 40;

      const shake = (): void => {
        if (shakeFrames > 0 && cameraRef.current) {
          cameraRef.current.position.x = originalPosition.x + (Math.random() - 0.5) * 0.8;
          cameraRef.current.position.y = originalPosition.y + (Math.random() - 0.5) * 0.8;
          shakeFrames--;
          setTimeout(shake, 16);
        } else if (cameraRef.current) {
          cameraRef.current.position.copy(originalPosition);
        }
      };
      shake();
    }
  }, [createExplosion]);

  // Create glowing bullet
  const createBullet = useCallback((position: THREE.Vector3): GameBullet => {
    const geometry = new THREE.SphereGeometry(0.12);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.5
    });
    const bullet = new THREE.Mesh(geometry, material) as unknown as GameBullet;

    bullet.position.copy(position);
    bullet.position.z -= 1;
    bullet.velocity = new THREE.Vector3(0, 0, -1.2);

    return bullet;
  }, []);

  // Handle shooting
  const shoot = useCallback((): void => {
    if (!shipRef.current || !sceneRef.current) return;

    const bullet = createBullet(shipRef.current.position);
    sceneRef.current.add(bullet);
    bulletsRef.current.push(bullet);
  }, [createBullet]);

  // Key event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent): void => {
    keysRef.current[event.code] = true;
    if (event.code === 'Space') {
      event.preventDefault();
      shoot();
    }
  }, [shoot]);

  const handleKeyUp = useCallback((event: KeyboardEvent): void => {
    keysRef.current[event.code] = false;
  }, []);

  // Update ship position
  const updateShip = useCallback((): void => {
    if (!shipRef.current) return;

    const speed = 0.35;
    if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
      shipRef.current.position.x -= speed;
      shipRef.current.rotation.z = Math.min(shipRef.current.rotation.z + 0.1, 0.3);
    } else if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
      shipRef.current.position.x += speed;
      shipRef.current.rotation.z = Math.max(shipRef.current.rotation.z - 0.1, -0.3);
    } else {
      shipRef.current.rotation.z *= 0.9;
    }

    if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) {
      shipRef.current.position.y += speed;
    }
    if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) {
      shipRef.current.position.y -= speed;
    }

    // Keep ship in bounds
    shipRef.current.position.x = Math.max(-15, Math.min(15, shipRef.current.position.x));
    shipRef.current.position.y = Math.max(-10, Math.min(10, shipRef.current.position.y));
  }, []);

  // Update bullets
  const updateBullets = useCallback((): void => {
    if (!sceneRef.current) return;

    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
      const bullet = bulletsRef.current[i];
      bullet.position.add(bullet.velocity);

      if (bullet.position.z < -60) {
        sceneRef.current.remove(bullet);
        bulletsRef.current.splice(i, 1);
      }
    }
  }, []);

  // Update explosions
  const updateExplosions = useCallback((): void => {
    if (!sceneRef.current) return;

    for (let i = explosionsRef.current.length - 1; i >= 0; i--) {
      const explosion = explosionsRef.current[i];
      explosion.life--;

      explosion.children.forEach((particle) => {
        const typedParticle = particle as THREE.Mesh & { velocity: THREE.Vector3 };
        typedParticle.position.add(typedParticle.velocity);
        typedParticle.velocity.multiplyScalar(0.97);

        const lifeRatio = explosion.life / explosion.maxLife;
        (typedParticle.material as THREE.MeshLambertMaterial).opacity = lifeRatio;
        (typedParticle.material as THREE.MeshLambertMaterial).emissiveIntensity = lifeRatio * 0.3;
      });

      if (explosion.life <= 0) {
        sceneRef.current.remove(explosion);
        explosionsRef.current.splice(i, 1);
      }
    }
  }, []);

  // Update asteroids
  const updateAsteroids = useCallback((): void => {
    if (!sceneRef.current) return;

    for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
      const asteroid = asteroidsRef.current[i];
      asteroid.position.add(asteroid.velocity);
      asteroid.rotation.x += asteroid.rotationSpeed.x;
      asteroid.rotation.y += asteroid.rotationSpeed.y;
      asteroid.rotation.z += asteroid.rotationSpeed.z;

      if (asteroid.position.z > 20) {
        sceneRef.current.remove(asteroid);
        asteroidsRef.current.splice(i, 1);
      }

      if (shipRef.current && asteroid.position.distanceTo(shipRef.current.position) < asteroid.size + 1) {
        createShipExplosion(shipRef.current.position);
        setGameOver(true);
        // Submit highscore when game is over
        submitHighscore(score).then(() => {
          console.log("[SpaceShooterGame] submitHighscore called with:", score);
        });
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
          gameLoopRef.current = null;
        }
      }
    }
  }, [createShipExplosion, score, submitHighscore]);

  // Check collisions between bullets and asteroids
  const checkCollisions = useCallback((): void => {
    if (!sceneRef.current) return;

    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
      const bullet = bulletsRef.current[i];

      for (let j = asteroidsRef.current.length - 1; j >= 0; j--) {
        const asteroid = asteroidsRef.current[j];

        if (bullet.position.distanceTo(asteroid.position) < asteroid.size + 0.5) {
          sceneRef.current.remove(bullet);
          bulletsRef.current.splice(i, 1);

          breakAsteroid(asteroid);
          sceneRef.current.remove(asteroid);
          asteroidsRef.current.splice(j, 1);

          const points = Math.floor(10 / asteroid.size * 5);
          setScore(prev => prev + points);
          break;
        }
      }
    }
  }, [breakAsteroid]);

  // Spawn asteroids
  const spawnAsteroid = useCallback((): void => {
    if (!sceneRef.current) return;

    if (Math.random() < 0.012) {
      const asteroid = createAsteroid();
      sceneRef.current.add(asteroid);
      asteroidsRef.current.push(asteroid);
    }
  }, [createAsteroid]);

  // Game loop
  const gameLoop = useCallback((): void => {
    if (gameOver || !gameStarted) return;

    updateShip();
    updateBullets();
    updateAsteroids();
    updateExplosions();
    checkCollisions();
    spawnAsteroid();

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver, gameStarted, updateShip, updateBullets, updateAsteroids, updateExplosions, checkCollisions, spawnAsteroid]);

  // Start game
  const startGame = useCallback((): void => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);

    // Clear existing game elements from scene and arrays
    asteroidsRef.current.forEach(asteroid => sceneRef.current?.remove(asteroid));
    bulletsRef.current.forEach(bullet => sceneRef.current?.remove(bullet));
    explosionsRef.current.forEach(explosion => sceneRef.current?.remove(explosion));
    asteroidsRef.current = [];
    bulletsRef.current = [];
    explosionsRef.current = [];

    if (shipRef.current) {
      shipRef.current.position.set(0, 0, 0);
    }
    // Ensure the game loop starts only once and properly
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    gameLoop();
  }, [gameLoop]);

  // Handle container resize
  const handleResize = useCallback((): void => {
    if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;

    const { width, height } = getContainerDimensions();

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, [getContainerDimensions]);


  // Initialize game
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = initScene();
    const camera = initCamera();
    const renderer = initRenderer();

    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.6);
    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ship = createSpaceship();
    scene.add(ship);

    mountRef.current.appendChild(renderer.domElement);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    renderer.render(scene, camera);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);

      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [initScene, initCamera, initRenderer, createSpaceship, handleKeyDown, handleKeyUp, handleResize]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop();
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]);

  const backgroundStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)'
  };

  const startScreenStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(10,14,26,0.95) 0%, rgba(26,31,46,0.95) 100%)'
  };

  const gameOverScreenStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(10,14,26,0.95) 0%, rgba(26,31,46,0.95) 100%)'
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={backgroundStyle}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Crypto-themed UI */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-gradient-to-r from-blue-900/80 to-cyan-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
          <div className="text-cyan-400 text-lg font-bold mb-1">⚡ SCORE</div>
          <div className="text-white text-2xl font-mono">{score.toLocaleString()}</div>
          <div className="mt-2 text-base text-purple-300">
            Highscore: {loading ? "..." : highscore?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="bg-gradient-to-r from-gray-900/80 to-blue-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
          <div className="text-cyan-400 text-sm font-semibold mb-2">🎮 CONTROLS</div>
          <div className="text-gray-300 text-sm space-y-1">
            <div>🚀 WASD/Arrows: Navigate</div>
            <div>💥 Space: Fire Plasma</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {gameStarted && (
        <div className="absolute top-6 right-6 z-10 w-80">
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                <p className="text-sm text-gray-400">Top Crypto Blasters</p>
              </div>
            </div>
            <div className="space-y-3">
              {leaderboard.length === 0 && (
                <div className="text-gray-400 text-center">No scores yet.</div>
              )}
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    entry.name === "You"
                      ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-300 font-bold"
                      : "bg-gray-800/30 border-gray-700/30 text-white hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm w-6 text-center ${
                        entry.name === "You" ? "text-blue-400" : "text-gray-400"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <p className="text-base truncate">{entry.name === "You" ? "🚀 You" : entry.name}</p>
                  </div>
                  <span className={`font-bold text-xl ${
                      entry.name === "You" ? "text-blue-400" : "text-yellow-400"
                    }`}
                  >
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center mt-6 pt-4 border-t border-gray-700/50">
              Current Score: <span className="font-bold text-cyan-400">{score.toLocaleString()}</span>
            </p>
          </div>
        </div>
      )}


      {/* Start Screen */}
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={startScreenStyle}>
          <div className="text-center max-w-md mx-4">
            <div className="mb-8">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                CRYPTO BLASTER
              </h1>
              <p className="text-cyan-300 text-lg mb-2">Navigate the Digital Void</p>
              <p className="text-gray-400 text-base">Destroy crypto asteroids & earn digital rewards!</p>
            </div>

            <div className="bg-gradient-to-r from-gray-900/60 to-blue-900/60 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 mb-8">
              <h3 className="text-cyan-400 font-bold mb-3">⚡ GAME FEATURES</h3>
              <div className="text-gray-300 text-sm space-y-2">
                <div>💎 Asteroids fragment when hit</div>
                <div>🔥 Spectacular explosion effects</div>
                <div>🎯 Score multipliers for smaller targets</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              🚀 LAUNCH MISSION
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={gameOverScreenStyle}>
          <div className="text-center max-w-md mx-4">
            <div className="mb-8">
              <div className="text-6xl mb-4">💥</div>
              <h1 className="text-4xl font-bold text-red-400 mb-4">MISSION FAILED</h1>
              <div className="bg-gradient-to-r from-gray-900/60 to-red-900/60 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 mb-6">
                <div className="text-red-300 text-lg mb-2">Final Score</div>
                <div className="text-white text-3xl font-mono font-bold">{score.toLocaleString()}</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              🔄 RETRY MISSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceShooterGame;