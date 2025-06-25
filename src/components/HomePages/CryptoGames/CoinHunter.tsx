import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useGameHighscore } from '@/hooks/useGameHighscore';
import { useAppSelector } from '@/redux/hooks';
import { Trophy } from 'lucide-react';

const CoinBombGame = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gridRef = useRef<any[][]>([]);
  const activeObjectsRef = useRef<
    Array<
      THREE.Mesh<
        THREE.CylinderGeometry | THREE.SphereGeometry,
        THREE.MeshLambertMaterial,
        THREE.Object3DEventMap
      >
    >
  >([]);
  const gameStateRef = useRef('waiting');
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const backgroundObjectsRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[]>([]);
  const cameraShakeRef = useRef({ x: 0, y: 0, intensity: 0 });
  const difficultyRef = useRef(1);
  const streakRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Backend integration - same pattern as SnakeGame
  const user = useAppSelector((state) => state.auth.user);
  const { highscore, loading, submitHighscore } = useGameHighscore({
    gameId: "coinhuntergame",
    gameName: "Coin Hunter Game"
  });

  // Debug: log user and highscore when loaded
  React.useEffect(() => {
    console.log("[CoinBombGame] User:", user);
    console.log("[CoinBombGame] Loaded highscore:", highscore);
  }, [user, highscore]);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [lives, setLives] = useState(3);

  // Leaderboard state - same pattern as SnakeGame
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; userId: string }[]>([]);

  // Fetch leaderboard from backend
  const fetchLeaderboard = useCallback(() => {
    fetch("http://localhost:3000/api/v1/games/coinhuntergame/getallscores")
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
        console.log("[CoinBombGame] Leaderboard fetched:", arr.map(e => ({ name: e.name, score: e.score, userId: e.userId })));
      })
      .catch(err => {
        setLeaderboard([]);
        console.error("[CoinBombGame] Failed to fetch leaderboard", err);
      });
  }, [user?.id]);

  // Fetch leaderboard on mount and after game over
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, gameOver]);

  // CRYPTO THEMED BALANCED CONSTANTS
  const GRID_SIZE = 8;
  const BASE_COIN_COUNT = 4;
  const BASE_BOMB_COUNT = 10;
  const BASE_OBJECT_DURATION = 3000;
  const BASE_SPAWN_INTERVAL = 4000;
  const ANIMATION_DURATION = 400;
  const FAKE_COIN_CHANCE = 0.15;
  const MOVING_OBJECT_CHANCE = 0.25;
  const INVISIBLE_OBJECT_CHANCE = 0.05;
  const DECOY_BOMB_COUNT = 2;
  const CAMERA_SHAKE_INTENSITY = 0.2;

  // Get container dimensions
  const getContainerDimensions = useCallback(() => {
    if (!mountRef.current) return { width: 800, height: 600 };
    const rect = mountRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  const createCryptoGrid = useCallback(() => {
    const gridGroup = new THREE.Group();
    gridRef.current = [];

    for (let x = 0; x < GRID_SIZE; x++) {
      gridRef.current[x] = [];
      for (let z = 0; z < GRID_SIZE; z++) {
        const height = 0.8;
        const boxGeometry = new THREE.BoxGeometry(1.0, height, 1.0);
        const boxMaterial = new THREE.MeshLambertMaterial({ 
          color: new THREE.Color(0x1a202c),
          transparent: true,
          opacity: 0.8
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        
        box.position.set(
          x - GRID_SIZE / 2 + 0.5,
          height / 2,
          z - GRID_SIZE / 2 + 0.5
        );
        box.castShadow = true;
        box.receiveShadow = true;
        
        const edges = new THREE.EdgesGeometry(boxGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.6
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        box.add(wireframe);
        
        gridGroup.add(box);
        gridRef.current[x][z] = {
          box,
          position: { x, z },
          worldPosition: box.position.clone(),
          occupied: false,
          wireframe,
          originalColor: boxMaterial.color.clone(),
          height
        };
      }
    }

    const baseGeometry = new THREE.PlaneGeometry(GRID_SIZE + 2, GRID_SIZE + 2);
    const baseMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x0f172a,
      transparent: true,
      opacity: 0.7
    });
    const basePlatform = new THREE.Mesh(baseGeometry, baseMaterial);
    basePlatform.rotation.x = -Math.PI / 2;
    basePlatform.position.y = -0.5;
    basePlatform.receiveShadow = true;
    gridGroup.add(basePlatform);

    if (sceneRef.current) {
      sceneRef.current.add(gridGroup);
    }
  }, []);

  const createCryptoBackground = useCallback(() => {
    for (let i = 0; i < 60; i++) {
      const geometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.04, 8, 8);
      const hue = Math.random() > 0.5 ? 0.55 : 0.05;
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        transparent: true,
        opacity: 0.5 + Math.random() * 0.4
      });
      const particle = new THREE.Mesh(geometry, material);
      
      particle.position.set(
        (Math.random() - 0.5) * 25,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 25
      );
      
      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.02
        ),
        rotSpeed: Math.random() * 0.03,
        hue: hue
      };
      
      if (sceneRef.current) {
        sceneRef.current.add(particle);
        backgroundObjectsRef.current.push(particle);
      }
    }
  }, []);

  const initializeScene = useCallback(() => {
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0x0a0f1c);
    scene.background = bgColor;
    scene.fog = new THREE.Fog(bgColor, 10, 35);
    sceneRef.current = scene;

    const { width, height } = getContainerDimensions();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 12, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0a0f1c);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x4a5568, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(0, 15, 0);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -15;
    scene.add(mainLight);

    const cryptoLight1 = new THREE.PointLight(0x00d4ff, 0.6, 20);
    cryptoLight1.position.set(-6, 8, -6);
    scene.add(cryptoLight1);

    const cryptoLight2 = new THREE.PointLight(0xff6b35, 0.6, 20);
    cryptoLight2.position.set(6, 8, -6);
    scene.add(cryptoLight2);

    const cryptoLight3 = new THREE.PointLight(0x9333ea, 0.6, 20);
    cryptoLight3.position.set(0, 8, 6);
    scene.add(cryptoLight3);

    createCryptoGrid();
    createCryptoBackground();

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Handle container resize using ResizeObserver
    const handleResize = () => {
      if (camera && renderer) {
        const { width, height } = getContainerDimensions();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    // Set up ResizeObserver to watch container size changes
    if (window.ResizeObserver && mountRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserverRef.current.observe(mountRef.current);
    }

    const handleClick = (event: MouseEvent) => {
      if (gameStateRef.current !== 'playing') return;

      const currentTime = Date.now();
      const timeSinceLastClick = currentTime - lastClickTimeRef.current;
      
      if (timeSinceLastClick < 150) {
        setScore(prev => Math.max(0, prev - 3));
        createPenaltyEffect();
        return;
      }
      
      lastClickTimeRef.current = currentTime;

      // Get container bounds for correct mouse position calculation
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const { width, height } = getContainerDimensions();

      // Calculate mouse position relative to the container
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      // Include all children in raycast detection (recursive = true)
      const intersects = raycasterRef.current.intersectObjects(activeObjectsRef.current, true);

      if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        
        // If we hit a child object, find the parent game object
        while (clickedObject.parent && !activeObjectsRef.current.includes(clickedObject as any)) {
          clickedObject = clickedObject.parent;
        }
        
        // Make sure we found a valid game object
        if (activeObjectsRef.current.includes(clickedObject as any)) {
          handleObjectClick(clickedObject);
        } else {
          setScore(prev => Math.max(0, prev - 1));
          streakRef.current = 0;
          setStreak(0);
        }
      } else {
        setScore(prev => Math.max(0, prev - 1));
        streakRef.current = 0;
        setStreak(0);
      }
    };

    // Add click listener to the renderer's canvas
    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      renderer.domElement.removeEventListener('click', handleClick);
    };
  }, [createCryptoGrid, createCryptoBackground, getContainerDimensions]);

  const animateCryptoBackground = useCallback(() => {
    const time = Date.now() * 0.001;
    
    backgroundObjectsRef.current.forEach((particle, i) => {
      if (particle && particle.position && particle.userData) {
        particle.position.add(particle.userData.velocity);
        particle.rotation.x += particle.userData.rotSpeed;
        particle.rotation.y += particle.userData.rotSpeed;
        
        particle.position.y += Math.sin(time + i) * 0.003;
        
        const saturation = 0.8 + Math.sin(time * 2 + i) * 0.2;
        particle.material.color.setHSL(particle.userData.hue, saturation, 0.6);
        
        if (particle.position.x > 12) particle.position.x = -12;
        if (particle.position.x < -12) particle.position.x = 12;
        if (particle.position.z > 12) particle.position.z = -12;
        if (particle.position.z < -12) particle.position.z = 12;
      }
    });

    if (cameraShakeRef.current.intensity > 0 && cameraRef.current) {
      cameraRef.current.position.x += (Math.random() - 0.5) * cameraShakeRef.current.intensity * 0.2;
      cameraRef.current.position.y += (Math.random() - 0.5) * cameraShakeRef.current.intensity * 0.2;
      cameraShakeRef.current.intensity *= 0.9;
    }
  }, []);

  const createCryptoCoin = (gridCell: { worldPosition: THREE.Vector3Like; height: number; }, isFake = false, isMoving = false, isInvisible = false) => {
    const geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 20);
    const material = new THREE.MeshLambertMaterial({ 
      color: isFake ? 0xf59e0b : 0xfbbf24,
      emissive: isFake ? 0x451a03 : 0x78350f,
      transparent: isInvisible,
      opacity: isInvisible ? 0.4 : 1
    });
    const coin = new THREE.Mesh(geometry, material);
    
    coin.position.copy(gridCell.worldPosition);
    coin.position.y = gridCell.height;
    coin.castShadow = true;
    coin.userData = { 
      type: isFake ? 'fake_coin' : 'coin',
      gridCell,
      targetY: gridCell.height + 2.0,
      startY: gridCell.height,
      isMoving,
      isInvisible,
      moveSpeed: Math.random() * 0.05 + 0.02,
      moveDirection: new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2).normalize()
    };
    
    const symbolGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 16);
    const symbolMaterial = new THREE.MeshLambertMaterial({ 
      color: isFake ? 0x92400e : 0xb45309,
      emissive: isFake ? 0x1c0701 : 0x451a03
    });
    const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbol.position.y = 0.08;
    coin.add(symbol);
    
    return coin;
  };

  const createCryptoBomb = (gridCell: { worldPosition: any; height: any; }, isDecoy = false, isMoving = false, isInvisible = false) => {
    if (isDecoy) {
      const coin = createCryptoCoin(gridCell, false, isMoving, isInvisible);
      coin.userData.type = 'decoy_bomb';
      return coin;
    }
    
    const geometry = new THREE.SphereGeometry(0.35, 16, 16);
    const material = new THREE.MeshLambertMaterial({ 
      color: 0xdc2626,
      emissive: 0x450a0a,
      transparent: isInvisible,
      opacity: isInvisible ? 0.4 : 1
    });
    const bomb = new THREE.Mesh(geometry, material);
    
    bomb.position.copy(gridCell.worldPosition);
    bomb.position.y = gridCell.height;
    bomb.castShadow = true;
    bomb.userData = { 
      type: 'bomb',
      gridCell,
      targetY: gridCell.height + 2.0,
      startY: gridCell.height,
      isMoving,
      isInvisible,
      moveSpeed: Math.random() * 0.04 + 0.02,
      moveDirection: new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2).normalize()
    };
    
    const fuseGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    const fuseMaterial = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const fuse = new THREE.Mesh(fuseGeometry, fuseMaterial);
    fuse.position.y = 0.5;
    bomb.add(fuse);
    
    const sparkGeometry = new THREE.SphereGeometry(0.02, 6, 6);
    const sparkMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff4500
    });
    const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
    spark.position.y = 0.65;
    bomb.add(spark);
    
    return bomb;
  };

  const createPenaltyEffect = () => {
    cameraShakeRef.current.intensity = CAMERA_SHAKE_INTENSITY;
  };

  const animateObjectEmerge = (object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial, THREE.Object3DEventMap> | THREE.Mesh<THREE.CylinderGeometry, THREE.MeshLambertMaterial, THREE.Object3DEventMap>, onComplete: (() => any) | undefined) => {
    const startTime = Date.now();
    const startY = object.userData.startY;
    const targetY = object.userData.targetY;
    const gridCell = object.userData.gridCell;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      object.position.y = startY + (targetY - startY) * easeProgress;
      
      if (gridCell && gridCell.box && gridCell.originalColor) {
        gridCell.box.material.color.lerpColors(
          gridCell.originalColor, 
          new THREE.Color(0x00d4ff), 
          easeProgress * 0.6
        );
        if (gridCell.wireframe) {
          gridCell.wireframe.material.opacity = 0.6 + easeProgress * 0.4;
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete && onComplete();
      }
    };
    animate();
  };

  const animateObjectRetract = (object: THREE.Object3D<THREE.Object3DEventMap>, onComplete: (() => any) | undefined) => {
    const startTime = Date.now();
    const startY = object.position.y;
    const targetY = object.userData.startY;
    const gridCell = object.userData.gridCell;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      
      object.position.y = startY + (targetY - startY) * progress;
      
      if (gridCell && gridCell.box && gridCell.originalColor) {
        gridCell.box.material.color.lerpColors(
          gridCell.box.material.color,
          gridCell.originalColor,
          progress
        );
        if (gridCell.wireframe) {
          gridCell.wireframe.material.opacity = 1 - progress * 0.4;
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (sceneRef.current) {
          sceneRef.current.remove(object);
        }
        if (gridCell) {
          gridCell.occupied = false;
        }
        onComplete && onComplete();
      }
    };
    animate();
  };

  const createCryptoExplosion = (position: THREE.Vector3Like) => {
    const explosionGroup = new THREE.Group();
    
    for (let ring = 0; ring < 3; ring++) {
      const shockGeometry = new THREE.RingGeometry(ring * 0.8, ring * 0.8 + 0.4, 16);
      const shockMaterial = new THREE.MeshBasicMaterial({ 
        color: ring % 2 === 0 ? 0xff6b35 : 0x00d4ff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const shockwave = new THREE.Mesh(shockGeometry, shockMaterial);
      shockwave.position.copy(position);
      shockwave.position.y = 0.1;
      shockwave.rotation.x = -Math.PI / 2;
      explosionGroup.add(shockwave);
    }
    
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 6, 6);
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(Math.random() > 0.5 ? 0.05 : 0.55, 1, 0.6)
      });
      const particle = new THREE.Mesh(geometry, material);
      
      particle.position.copy(position);
      particle.position.y = 0.5;
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 10
      );
      
      particle.userData = { velocity, spin: Math.random() * 0.3 };
      explosionGroup.add(particle);
    }
    
    if (sceneRef.current) {
      sceneRef.current.add(explosionGroup);
    }
    
    cameraShakeRef.current.intensity = CAMERA_SHAKE_INTENSITY * 2;
    
    const startTime = Date.now();
    const animateExplosion = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / 1500;
      
      explosionGroup.children.forEach((child, index) => {
        if (index < 3) {
          child.scale.setScalar(1 + progress * 12);
          if ((child as THREE.Mesh).material && 'opacity' in (child as THREE.Mesh).material) {
            ((child as THREE.Mesh).material as THREE.Material & { opacity: number }).opacity = Math.max(0, 0.8 * (1 - progress));
          }
        } else {
          child.position.add(child.userData.velocity.clone().multiplyScalar(0.03));
          child.userData.velocity.y -= 0.02;
          child.rotation.x += child.userData.spin;
          child.rotation.y += child.userData.spin;
          if ((child as THREE.Mesh).material && 'opacity' in (child as THREE.Mesh).material) {
            ((child as THREE.Mesh).material as THREE.Material & { opacity: number }).opacity = Math.max(0, 1 - progress);
          }
        }
      });
      
      if (progress < 1) {
        requestAnimationFrame(animateExplosion);
      } else {
        if (sceneRef.current) {
          sceneRef.current.remove(explosionGroup);
        }
      }
    };
    animateExplosion();
  };

  const getDifficultyMultipliers = () => {
    const level = difficultyRef.current;
    return {
      coinCount: Math.max(2, BASE_COIN_COUNT - Math.floor(level / 4)),
      bombCount: BASE_BOMB_COUNT + Math.floor(level / 3),
      decoyBombCount: Math.min(3, DECOY_BOMB_COUNT + Math.floor(level / 5)),
      duration: Math.max(2000, BASE_OBJECT_DURATION - level * 150),
      interval: Math.max(2500, BASE_SPAWN_INTERVAL - level * 200),
      fakeCoinChance: Math.min(0.3, FAKE_COIN_CHANCE + level * 0.02),
      movingChance: Math.min(0.4, MOVING_OBJECT_CHANCE + level * 0.03),
      invisibleChance: Math.min(0.15, INVISIBLE_OBJECT_CHANCE + level * 0.01)
    };
  };

  const getRandomEmptyPositions = (count: number) => {
    const available = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        if (gridRef.current[x] && gridRef.current[x][z] && !gridRef.current[x][z].occupied) {
          available.push({ x, z });
        }
      }
    }
    
    const selected = [];
    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selected.push(available.splice(randomIndex, 1)[0]);
    }
    
    return selected;
  };

  const spawnObjects = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;

    const multipliers = getDifficultyMultipliers();
    const totalObjects = multipliers.coinCount + multipliers.bombCount + multipliers.decoyBombCount;
    const positions = getRandomEmptyPositions(totalObjects);
    const newObjects = [];
    
    let posIndex = 0;
    
    for (let i = 0; i < multipliers.coinCount && posIndex < positions.length; i++) {
      const pos = positions[posIndex++];
      const gridCell = gridRef.current[pos.x][pos.z];
      const isFake = Math.random() < multipliers.fakeCoinChance;
      const isMoving = Math.random() < multipliers.movingChance;
      const isInvisible = Math.random() < multipliers.invisibleChance;
      
      const coin = createCryptoCoin(gridCell, isFake, isMoving, isInvisible);
      
      if (sceneRef.current) {
        sceneRef.current.add(coin);
        newObjects.push(coin);
        gridCell.occupied = true;
        animateObjectEmerge(coin, undefined);
      }
    }
    
    for (let i = 0; i < multipliers.bombCount && posIndex < positions.length; i++) {
      const pos = positions[posIndex++];
      const gridCell = gridRef.current[pos.x][pos.z];
      const isMoving = Math.random() < multipliers.movingChance;
      const isInvisible = Math.random() < multipliers.invisibleChance;
      
      const bomb = createCryptoBomb(gridCell, false, isMoving, isInvisible);
      
      if (sceneRef.current) {
        sceneRef.current.add(bomb);
        newObjects.push(bomb);
        gridCell.occupied = true;
        animateObjectEmerge(bomb, undefined);
      }
    }
    
    for (let i = 0; i < multipliers.decoyBombCount && posIndex < positions.length; i++) {
      const pos = positions[posIndex++];
      const gridCell = gridRef.current[pos.x][pos.z];
      const isMoving = Math.random() < multipliers.movingChance;
      const isInvisible = Math.random() < multipliers.invisibleChance;
      
      const decoyBomb = createCryptoBomb(gridCell, true, isMoving, isInvisible);
      
      if (sceneRef.current) {
        sceneRef.current.add(decoyBomb);
        newObjects.push(decoyBomb);
        gridCell.occupied = true;
        animateObjectEmerge(decoyBomb, undefined);
      }
    }
    
    activeObjectsRef.current = newObjects;

    setTimeout(() => {
      activeObjectsRef.current.forEach(obj => {
        if (sceneRef.current && sceneRef.current.children.includes(obj)) {
          animateObjectRetract(obj, undefined);
        }
      });
      activeObjectsRef.current = [];
    }, multipliers.duration);
  }, []);

  const handleObjectClick = (object: THREE.Object3D<THREE.Object3DEventMap>) => {
    const type = object.userData.type;
    
    if (type === 'coin') {
      const points = 10 + streakRef.current * 2;
      setScore(prev => prev + points);
      streakRef.current++;
      setStreak(streakRef.current);
      
      const startTime = Date.now();
      const animateCollection = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / 200;
        
        object.scale.setScalar(1 + progress * 2);
        const mat = (object as THREE.Mesh).material;
        if (mat && !Array.isArray(mat) && 'opacity' in mat) {
          (mat as THREE.Material & { opacity: number }).opacity = Math.max(0, 1 - progress);
        }
        object.rotation.y += 0.3;
        
        if (progress < 1) {
          requestAnimationFrame(animateCollection);
        } else {
          if (sceneRef.current) {
            sceneRef.current.remove(object);
          }
          if (object.userData.gridCell) {
            object.userData.gridCell.occupied = false;
          }
          activeObjectsRef.current = activeObjectsRef.current.filter(obj => obj !== object);
        }
      };
      animateCollection();
      
    } else if (type === 'fake_coin') {
      setScore(prev => Math.max(0, prev - 15));
      setLives(prev => {
        const newLives = Math.max(0, prev - 1);
        if (newLives <= 0) {
          gameStateRef.current = 'gameOver';
          setTimeout(() => setGameOver(true), 500);
        }
        return newLives;
      });
      streakRef.current = 0;
      setStreak(0);
      createPenaltyEffect();
      
      if (sceneRef.current) {
        sceneRef.current.remove(object);
      }
      if (object.userData.gridCell) {
        object.userData.gridCell.occupied = false;
      }
      
    } else if (type === 'bomb' || type === 'decoy_bomb') {
      createCryptoExplosion(object.position);
      if (sceneRef.current) {
        sceneRef.current.remove(object);
      }
      if (object.userData.gridCell) {
        object.userData.gridCell.occupied = false;
      }
      
      setLives(prev => {
        const newLives = Math.max(0, prev - 1);
        if (newLives <= 0) {
          gameStateRef.current = 'gameOver';
          setTimeout(() => setGameOver(true), 1000);
        }
        return newLives;
      });
      streakRef.current = 0;
      setStreak(0);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setLives(3);
    setDifficulty(1);
    difficultyRef.current = 1;
    streakRef.current = 0;
    gameStateRef.current = 'playing';
    
    let timeRemaining = 120;
    setTimeLeft(timeRemaining);
    
    // Clear any existing timers
    if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
    }
    if (spawnIntervalRef.current) {
      clearTimeout(spawnIntervalRef.current);
    }
    
    gameTimerRef.current = setInterval(() => {
      if (gameStateRef.current !== 'playing') {
        return;
      }
      
      timeRemaining--;
      setTimeLeft(timeRemaining);
      
      if (timeRemaining % 20 === 0 && timeRemaining > 0) {
        difficultyRef.current++;
        setDifficulty(difficultyRef.current);
      }
      
      if (timeRemaining <= 0) {
        gameStateRef.current = 'gameOver';
        setGameOver(true);
        // Submit highscore when time runs out
        console.log("[CoinBombGame] Time's up! Final Score:", score);
        console.log("[CoinBombGame] Previous Highscore:", highscore);
        submitHighscore(score).then(() => {
          console.log("[CoinBombGame] submitHighscore called with:", score);
        });
      }
    }, 1000);

    // Start spawning objects
    const startSpawning = () => {
      if (gameStateRef.current === 'playing') {
        spawnObjects();
        const multipliers = getDifficultyMultipliers();
        spawnIntervalRef.current = setTimeout(startSpawning, multipliers.interval);
      }
    };
    
    spawnIntervalRef.current = setTimeout(startSpawning, 1000);
  };

  const resetGame = () => {
    // Clear all timers
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (spawnIntervalRef.current) {
      clearTimeout(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
    
    // Clear all active objects
    activeObjectsRef.current.forEach(obj => {
      if (sceneRef.current && sceneRef.current.children.includes(obj)) {
        sceneRef.current.remove(obj);
        if (obj.userData.gridCell) {
          obj.userData.gridCell.occupied = false;
        }
      }
    });
    activeObjectsRef.current = [];
    
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setLives(3);
    setTimeLeft(0);
    setDifficulty(1);
    difficultyRef.current = 1;
    streakRef.current = 0;
    gameStateRef.current = 'waiting';
  };

  useEffect(() => {
    const cleanup = initializeScene();
    
    const animate = () => {
      animateCryptoBackground();
      
      // Animate objects
      activeObjectsRef.current.forEach(obj => {
        if (obj && obj.userData) {
          if (obj.userData.type === 'coin' || obj.userData.type === 'fake_coin') {
            obj.rotation.y += 0.08;
          }
          
          if (obj.userData.isMoving && obj.position.y > obj.userData.startY + 0.8) {
            obj.position.x += obj.userData.moveDirection.x * obj.userData.moveSpeed;
            obj.position.z += obj.userData.moveDirection.z * obj.userData.moveSpeed;
            
            if (obj.position.x > GRID_SIZE/2 - 0.5 || obj.position.x < -GRID_SIZE/2 + 0.5) {
              obj.userData.moveDirection.x *= -1;
            }
            if (obj.position.z > GRID_SIZE/2 - 0.5 || obj.position.z < -GRID_SIZE/2 + 0.5) {
              obj.userData.moveDirection.z *= -1;
            }
          }
        }
      });
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cleanup && cleanup();
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (spawnIntervalRef.current) {
        clearTimeout(spawnIntervalRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initializeScene, animateCryptoBackground, spawnObjects]);

  // Add game over effect to submit score when lives reach 0
  useEffect(() => {
    if (gameOver && gameStateRef.current === 'gameOver') {
      console.log("[CoinBombGame] Game Over! Final Score:", score);
      console.log("[CoinBombGame] Previous Highscore:", highscore);
      submitHighscore(score).then(() => {
        console.log("[CoinBombGame] submitHighscore called with:", score);
      });
    }
  }, [gameOver, score, highscore, submitHighscore]);

  return (
    <div className="relative w-full h-screen" style={{
      background: 'linear-gradient(135deg, #0a0f1c 0%, #1e293b 50%, #0f172a 100%)'
    }}>
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Crypto-themed UI */}
      <div className="absolute top-4 left-4 text-white">
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-md rounded-xl p-4 border border-cyan-400/30 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-500">
            🎮 Crypto Games
          </h1>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-900/50 rounded-lg p-2">
              <p className="text-cyan-400 font-semibold">Score</p>
              <p className="text-2xl font-bold text-yellow-400">{score}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2">
              <p className="text-orange-400 font-semibold">Lives</p>
              <p className="text-xl">{"❤️".repeat(Math.max(0, lives))}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2">
              <p className="text-purple-400 font-semibold">Streak</p>
              <p className="text-xl font-bold text-green-400">{streak}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2">
              <p className="text-cyan-400 font-semibold">Level</p>
              <p className="text-xl font-bold text-purple-400">{difficulty}</p>
            </div>
            {gameStarted && !gameOver && (
              <div className="col-span-2 bg-slate-900/50 rounded-lg p-2 text-center">
                <p className="text-orange-400 font-semibold">Time Remaining</p>
                <p className="text-2xl font-bold text-red-400">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
              </div>
            )}
            {/* Add highscore display */}
            <div className="col-span-2 bg-slate-900/50 rounded-lg p-2 text-center">
              <p className="text-purple-400 font-semibold">Highscore</p>
              <p className="text-lg font-bold text-purple-300">{loading ? "..." : highscore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Panel - similar to SnakeGame */}
      <div className="absolute top-4 right-4 w-80 text-white">
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-md rounded-xl p-4 border border-purple-400/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Leaderboard</h3>
              <p className="text-sm text-gray-400">Top Coin Hunter Players</p>
            </div>
          </div>

          {/* Scores List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {leaderboard.length === 0 && (
              <div className="text-gray-400 text-center text-sm">No scores yet.</div>
            )}
            {leaderboard.slice(0, 10).map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 border text-sm ${
                  entry.name === "You"
                    ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-300 font-bold"
                    : "bg-gray-800/30 border-gray-700/30 text-white hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs w-6 text-center ${
                      entry.name === "You" ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <p className="truncate">
                    {entry.name === "You" ? "🚀 You" : entry.name}
                  </p>
                </div>
                <span
                  className={`font-bold ${
                    entry.name === "You" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {entry.score}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-4 pt-3 border-t border-gray-700/50">
            Current Score:{" "}
            <span className="font-bold text-green-400">{score}</span>
          </p>
        </div>
      </div>

      {/* Game stats */}
      <div className="absolute bottom-4 right-4 text-white max-w-xs">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-orange-400/30">
          <h3 className="text-orange-400 font-bold mb-2">🎯 Game Info</h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Objects visible:</span>
              <span className="text-cyan-400">{Math.max(2000, BASE_OBJECT_DURATION - difficulty * 150)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Coins per wave:</span>
              <span className="text-yellow-400">{Math.max(2, BASE_COIN_COUNT - Math.floor(difficulty / 4))}</span>
            </div>
            <div className="flex justify-between">
              <span>Bombs per wave:</span>
              <span className="text-red-400">{BASE_BOMB_COUNT + Math.floor(difficulty / 3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fake coins:</span>
              <span className="text-orange-400">{Math.floor((FAKE_COIN_CHANCE + difficulty * 0.02) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start Game Screen */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl p-8 text-white text-center border-2 border-cyan-400/50 shadow-2xl max-w-2xl">
            <div className="mb-6">
              <h2 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-500">
                🎮 Crypto Games
              </h2>
              <p className="text-slate-300 text-lg">Explore fun ways to engage with crypto!</p>
            </div>
            
            <div className="text-left mb-8 space-y-3 bg-slate-900/50 p-6 rounded-lg border border-slate-600">
              <h3 className="text-cyan-400 font-bold text-xl mb-4">🎯 How to Play:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-2">💰 <span className="text-yellow-400 font-semibold">Click GOLD coins</span> to earn points</p>
                  <p className="mb-2">💣 <span className="text-red-400 font-semibold">Avoid RED bombs</span> or lose a life</p>
                  <p className="mb-2">⚡ <span className="text-purple-400 font-semibold">Build streaks</span> for bonus points</p>
                </div>
                <div>
                  <p className="mb-2">🎲 Watch out for fake coins and decoy bombs</p>
                  <p className="mb-2">🏃 Some objects move around the grid</p>
                  <p className="mb-2">⏱️ Objects appear for 2-3 seconds each wave</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <p className="text-orange-400 font-semibold">Coin:Bomb Ratio = 2:5 (More bombs, stay alert!)</p>
                <p className="text-purple-400 font-semibold mt-2">Your Best: {loading ? "..." : highscore} points</p>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 px-10 py-4 rounded-xl font-bold text-xl shadow-lg transform transition hover:scale-105 border-2 border-cyan-400/50"
            >
              🚀 Start Crypto Challenge
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg rounded-2xl p-8 text-white text-center border-2 border-orange-400/50 shadow-2xl max-w-lg">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              🎮 Game Complete!
            </h2>
            
            <div className="mb-6 space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-slate-300">Final Score</p>
                <p className="text-4xl font-bold text-yellow-400">{score}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-300">Best Streak</p>
                  <p className="text-2xl font-bold text-green-400">{streak}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-300">Level Reached</p>
                  <p className="text-2xl font-bold text-purple-400">{difficulty}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-slate-300">Your Best</p>
                <p className="text-2xl font-bold text-purple-300">{loading ? "..." : highscore}</p>
              </div>
            </div>
            
            <div className="mb-6 text-sm">
              {score > 300 && <p className="text-green-400 font-semibold">🏆 Crypto Master! Outstanding performance!</p>}
              {score > 150 && score <= 300 && <p className="text-yellow-400 font-semibold">⚡ Excellent work! You're getting good at this!</p>}
              {score <= 150 && <p className="text-cyan-400 font-semibold">🎮 Good start! Practice makes perfect!</p>}
            </div>
            
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition hover:scale-105 border-2 border-purple-400/50"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {gameStarted && !gameOver && (
        <div className="absolute bottom-4 left-4 text-white">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-lg p-3 border border-cyan-400/30">
            <p className="text-sm flex items-center gap-2">
              <span className="text-yellow-400">💰</span>
              <span>Click gold coins</span>
              <span>•</span>
              <span className="text-red-400">💣</span>
              <span>Avoid red bombs</span>
            </p>
          </div>
        </div>
      )}

      {/* Level indicator */}
      {gameStarted && !gameOver && difficulty > 2 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-4xl font-bold text-cyan-400 opacity-20">
            LEVEL {difficulty}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinBombGame;