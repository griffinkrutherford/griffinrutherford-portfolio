document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });
  
    // Apply initial animation styles and observe elements
    const animatedElements = document.querySelectorAll('.experience-item, .ig-post, .show-more-btn');
    animatedElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.4s ease-out';
      observer.observe(el);
    });
  
    // Consolidated "Show More" functionality for collapsible sections:
    document.querySelectorAll('.collapsible').forEach(collapsible => {
      const content = collapsible.querySelector('.collapsible-content');
      const button = collapsible.querySelector('.show-more-btn');
      if (!content || !button) return;
      
      // Convert 30em to pixels (using the root font size)
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const threshold = 20 * rootFontSize; // 30em in pixels
    
      // If the content's scrollHeight is less than or equal to 20em, hide the button.
      if (content.scrollHeight <= threshold) {
        button.style.display = 'none';
      } else {
        button.style.display = 'block';
      }
    
      button.addEventListener('click', () => {
        collapsible.classList.toggle('expanded');
        button.textContent = collapsible.classList.contains('expanded')
          ? 'Show Less ↑'
          : 'Show More ↓';
      });
    });
    
  
    // Scroll arrow functionality: Scroll smoothly to the content section
    const scrollArrow = document.querySelector('.scroll-arrow');
    const contentSection = document.querySelector('.content-section');
    if (scrollArrow && contentSection) {
      scrollArrow.addEventListener('click', function() {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      console.error('Scroll arrow or content section not found.');
    }
  });
  
  // 90s Mode Toggle Functionality
  document.addEventListener('DOMContentLoaded', function() {
    const ninetiesToggle = document.getElementById('nineties-toggle');
    
    if (ninetiesToggle) {
      ninetiesToggle.addEventListener('click', function() {
        // Redirect to 90s page
        window.location.href = '90s.html';
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const quickLinksMenu = document.querySelector('.quick-links-menu');
    const quickLinksButton = document.querySelector('.quick-links-button');
    const quickLinksNav = document.querySelector('.quick-links-nav');
    
    if (quickLinksButton && quickLinksMenu) {
      quickLinksButton.addEventListener('click', (e) => {
        e.stopPropagation();
        quickLinksMenu.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!quickLinksMenu.contains(e.target)) {
          quickLinksMenu.classList.remove('active');
        }
      });
      
      // Close menu when clicking on a link
      const navLinks = quickLinksNav.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          quickLinksMenu.classList.remove('active');
        });
      });

      // Handle submenu toggle on mobile
      const submenuParent = quickLinksNav.querySelector('.has-submenu');
      if (submenuParent && window.innerWidth <= 768) {
        const parentLink = submenuParent.querySelector('> a');
        parentLink.addEventListener('click', (e) => {
          e.preventDefault();
          submenuParent.classList.toggle('active');
        });
      }
    }
  });
  
  // Pac-Man Maze Game
  const canvas = document.getElementById('pacman-maze');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Function to resize canvas responsively
    function resizeCanvas() {
      const container = canvas.parentElement;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Set canvas size to match container
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      
      // Calculate cell size based on canvas dimensions
      // Maintain the 25x15 grid ratio
      const targetCols = 25;
      const targetRows = 15;
      const cellSizeX = canvas.width / targetCols;
      const cellSizeY = canvas.height / targetRows;
      
      // Use the smaller cell size to maintain aspect ratio
      window.pacmanCellSize = Math.min(cellSizeX, cellSizeY);
      
      // Center the game if there's extra space
      window.pacmanOffsetX = (canvas.width - (targetCols * window.pacmanCellSize)) / 2;
      window.pacmanOffsetY = (canvas.height - (targetRows * window.pacmanCellSize)) / 2;
    }
    
    // Initial resize
    resizeCanvas();
    
    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
    
    const cellSize = window.pacmanCellSize;
    const cols = 25; // Fixed grid size
    const rows = 15;
    
    // Game state
    let gameActive = true;
    let respawnTimer = 0;
    let pelletsRemaining = 0;
    let levelComplete = false;
    
    // Frame rate independent timing
    let lastFrameTime = 0;
    let deltaTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS; // 16.67ms for 60fps
    
    // Classic Pac-Man maze layout (25x15 for 500x300 canvas)
    // 1 = wall, 0 = empty path, 2 = pellet, 3 = power pellet
    const mazeTemplate = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,3,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,3,1,0],
      [0,1,2,1,1,2,1,1,1,1,2,1,0,1,2,1,1,1,1,2,1,1,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,0],
      [0,1,2,2,2,2,1,2,2,2,2,1,0,1,2,2,2,2,1,2,2,2,2,1,0],
      [0,1,1,1,1,2,1,1,1,1,0,1,0,1,0,1,1,1,1,2,1,1,1,1,0],
      [0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0],
      [0,1,1,1,1,2,1,0,1,1,0,0,0,0,0,1,1,0,1,2,1,1,1,1,0],
      [0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0],
      [0,1,2,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,0],
      [0,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    
    // Create a working copy of the maze
    let maze = mazeTemplate.map(row => [...row]);
    
    function resetMaze() {
      // Reset maze to original state
      maze = mazeTemplate.map(row => [...row]);
      
      // Count pellets
      pelletsRemaining = 0;
      for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 25; x++) {
          if (maze[y][x] === 2 || maze[y][x] === 3) {
            pelletsRemaining++;
          }
        }
      }
      
      // Reset entities to spawn positions
      pacman.x = pacmanSpawn.x;
      pacman.y = pacmanSpawn.y;
      pacman.pixelX = pacmanSpawn.x * cellSize;
      pacman.pixelY = pacmanSpawn.y * cellSize;
      pacman.direction = 'left';
      pacman.targetPath = [];
      
      ghosts.forEach((ghost) => {
        ghost.x = ghost.spawn.x;
        ghost.y = ghost.spawn.y;
        ghost.pixelX = ghost.spawn.x * cellSize;
        ghost.pixelY = ghost.spawn.y * cellSize;
        ghost.targetPath = [];
        ghost.mode = 'scatter';
      });
      
      // Reset game state (in milliseconds)
      startDelay = 2000; // 2 seconds
      modeTimer = 3000; // 3 seconds
      chaseMode = false;
      levelComplete = false;
    }
    
    // Game entities with spawn positions and smooth movement
    const pacmanSpawn = { x: 12, y: 10 };
    let pacman = {
      x: pacmanSpawn.x,
      y: pacmanSpawn.y,
      pixelX: pacmanSpawn.x * cellSize,
      pixelY: pacmanSpawn.y * cellSize,
      direction: 'left',
      nextDirection: 'left',
      mouthOpen: true,
      animationCounter: 0,
      speed: 0.08,  // Slower, frame-rate independent movement
      targetPath: [],
      lastPositions: []
    };
    
    // Spread ghost spawns across the maze to avoid early collision
    const ghostSpawns = [
      { x: 12, y: 7 },   // Blinky - center ghost house
      { x: 2, y: 2 },    // Pinky - top left corner
      { x: 22, y: 2 },   // Inky - top right corner  
      { x: 12, y: 4 }    // Clyde - upper middle
    ];
    
    const ghosts = [
      { x: ghostSpawns[0].x, y: ghostSpawns[0].y, 
        pixelX: ghostSpawns[0].x * cellSize, pixelY: ghostSpawns[0].y * cellSize, 
        color: '#FF0000', direction: 'up', name: 'Blinky', 
        mode: 'scatter', speed: 0.06, targetPath: [], scatter: {x: 23, y: 1},
        spawn: ghostSpawns[0] },
      { x: ghostSpawns[1].x, y: ghostSpawns[1].y, 
        pixelX: ghostSpawns[1].x * cellSize, pixelY: ghostSpawns[1].y * cellSize,
        color: '#FFB8FF', direction: 'right', name: 'Pinky', 
        mode: 'scatter', speed: 0.055, targetPath: [], scatter: {x: 1, y: 1},
        spawn: ghostSpawns[1] },
      { x: ghostSpawns[2].x, y: ghostSpawns[2].y, 
        pixelX: ghostSpawns[2].x * cellSize, pixelY: ghostSpawns[2].y * cellSize,
        color: '#00FFFF', direction: 'left', name: 'Inky', 
        mode: 'scatter', speed: 0.05, targetPath: [], scatter: {x: 23, y: 13},
        spawn: ghostSpawns[2] },
      { x: ghostSpawns[3].x, y: ghostSpawns[3].y, 
        pixelX: ghostSpawns[3].x * cellSize, pixelY: ghostSpawns[3].y * cellSize,
        color: '#FFB852', direction: 'down', name: 'Clyde', 
        mode: 'scatter', speed: 0.045, targetPath: [], scatter: {x: 1, y: 13},
        spawn: ghostSpawns[3] }
    ];
    
    let modeTimer = 200; // Start with scatter mode
    let chaseMode = false;
    let startDelay = 120; // Give player 2 seconds to start
    
    // Movement patterns for ghosts
    const directions = ['up', 'down', 'left', 'right'];
    
    // A* Pathfinding Algorithm with improved robustness
    function findPath(startX, startY, targetX, targetY, maxLength = 20) {
      // Validate inputs
      if (!isFinite(startX) || !isFinite(startY) || !isFinite(targetX) || !isFinite(targetY)) {
        return [];
      }
      
      // Round coordinates to grid positions
      const startGridX = Math.round(startX);
      const startGridY = Math.round(startY);
      const targetGridX = Math.round(targetX);
      const targetGridY = Math.round(targetY);
      
      // Ensure target is within bounds
      if (targetGridX < 0 || targetGridX >= 25 || targetGridY < 0 || targetGridY >= 15) {
        return [];
      }
      
      // If already at target, return empty path
      if (startGridX === targetGridX && startGridY === targetGridY) {
        return [];
      }
      
      const openSet = [];
      const closedSet = new Set();
      
      // Node class for pathfinding
      class Node {
        constructor(x, y, g, h, parent) {
          this.x = x;
          this.y = y;
          this.g = g; // Distance from start
          this.h = h; // Heuristic distance to target
          this.f = g + h; // Total cost
          this.parent = parent;
          this.key = `${x},${y}`; // Unique key for fast lookup
        }
      }
      
      // Heuristic function (Manhattan distance)
      function heuristic(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
      }
      
      // Check if position is valid for pathfinding
      function isValidPos(x, y) {
        if (y < 0 || y >= 15) return false;
        if (x < 0 || x >= 25) return false;
        return maze[y] && maze[y][x] !== 1;
      }
      
      const startNode = new Node(startGridX, startGridY, 0, 
                                  heuristic(startGridX, startGridY, targetGridX, targetGridY), null);
      openSet.push(startNode);
      
      let iterations = 0;
      const maxIterations = 200; // Increased iterations for complex paths
      
      while (openSet.length > 0 && iterations < maxIterations) {
        iterations++;
        
        // Find node with lowest f cost
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
          if (openSet[i].f < openSet[currentIndex].f || 
              (openSet[i].f === openSet[currentIndex].f && openSet[i].h < openSet[currentIndex].h)) {
            currentIndex = i;
          }
        }
        
        const current = openSet.splice(currentIndex, 1)[0];
        closedSet.add(current.key);
        
        // Check if we reached the target
        if (current.x === targetGridX && current.y === targetGridY) {
          const path = [];
          let temp = current;
          while (temp) {
            path.push({x: temp.x, y: temp.y});
            temp = temp.parent;
          }
          return path.reverse();
        }
        
        // Check neighbors
        const neighbors = [
          {x: current.x, y: current.y - 1}, // up
          {x: current.x, y: current.y + 1}, // down
          {x: current.x - 1, y: current.y}, // left
          {x: current.x + 1, y: current.y}  // right
        ];
        
        for (let neighbor of neighbors) {
          if (!isValidPos(neighbor.x, neighbor.y)) continue;
          
          const neighborKey = `${neighbor.x},${neighbor.y}`;
          if (closedSet.has(neighborKey)) continue;
          
          const g = current.g + 1;
          const h = heuristic(neighbor.x, neighbor.y, targetGridX, targetGridY);
          
          // Check if already in open set
          const existingNodeIndex = openSet.findIndex(n => n.key === neighborKey);
          if (existingNodeIndex !== -1) {
            if (g < openSet[existingNodeIndex].g) {
              openSet[existingNodeIndex].g = g;
              openSet[existingNodeIndex].f = g + h;
              openSet[existingNodeIndex].parent = current;
            }
          } else {
            openSet.push(new Node(neighbor.x, neighbor.y, g, h, current));
          }
        }
      }
      
      return []; // Return empty if no path found
    }
    
    function drawMaze() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
          const cell = maze[row][col];
          const x = col * window.pacmanCellSize + window.pacmanOffsetX;
          const y = row * window.pacmanCellSize + window.pacmanOffsetY;
          
          if (cell === 1) {
            // Draw wall with better graphics
            ctx.fillStyle = '#1919A6';
            ctx.fillRect(x + 1, y + 1, window.pacmanCellSize - 2, window.pacmanCellSize - 2);
            
            // Add highlights
            ctx.strokeStyle = '#2929FF';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, window.pacmanCellSize - 2, window.pacmanCellSize - 2);
          } else if (cell === 2) {
            // Draw pellet (scale with cell size)
            ctx.fillStyle = '#FFB897';
            ctx.beginPath();
            const pelletSize = Math.max(2, window.pacmanCellSize * 0.15);
            ctx.arc(x + window.pacmanCellSize/2, y + window.pacmanCellSize/2, pelletSize, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            // Draw power pellet (larger, scale with cell size)
            ctx.fillStyle = '#FFB897';
            ctx.beginPath();
            const powerPelletSize = Math.max(4, window.pacmanCellSize * 0.3);
            ctx.arc(x + window.pacmanCellSize/2, y + window.pacmanCellSize/2, powerPelletSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    function drawPacman() {
      // Convert grid position to screen coordinates and center in cell
      const gridX = pacman.x * window.pacmanCellSize + window.pacmanOffsetX + window.pacmanCellSize/2;
      const gridY = pacman.y * window.pacmanCellSize + window.pacmanOffsetY + window.pacmanCellSize/2;
      const radius = Math.max(4, window.pacmanCellSize/2 - 3);
      
      ctx.save();
      ctx.translate(gridX, gridY);
      
      // Draw Pac-Man body
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      
      // Animate mouth with smoother animation
      let mouthAngle = pacman.mouthOpen ? 0.25 : 0.05;
      let startAngle, endAngle;
      
      switch(pacman.direction) {
        case 'right':
          ctx.rotate(0);
          break;
        case 'left':
          ctx.rotate(Math.PI);
          break;
        case 'up':
          ctx.rotate(-Math.PI/2);
          break;
        case 'down':
          ctx.rotate(Math.PI/2);
          break;
      }
      
      startAngle = mouthAngle * Math.PI;
      endAngle = (2 - mouthAngle) * Math.PI;
      
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      
      // Add a subtle gradient for depth
      const gradient = ctx.createRadialGradient(-radius/3, -radius/3, 0, 0, 0, radius);
      gradient.addColorStop(0, '#FFFF66');
      gradient.addColorStop(1, '#FFCC00');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    }
    
    function drawGhosts() {
      ghosts.forEach(ghost => {
        // Convert grid position to screen coordinates and center in cell
        const gridX = ghost.x * window.pacmanCellSize + window.pacmanOffsetX + window.pacmanCellSize/2;
        const gridY = ghost.y * window.pacmanCellSize + window.pacmanOffsetY + window.pacmanCellSize/2;
        const radius = Math.max(4, window.pacmanCellSize/2 - 3);
        
        ctx.save();
        
        // Ghost body
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(gridX, gridY - radius/3, radius, Math.PI, 0, false);
        ctx.lineTo(gridX + radius, gridY + radius/2);
        
        // Wavy bottom with more waves
        const waveCount = 4;
        const waveWidth = (radius * 2) / waveCount;
        for (let i = 0; i < waveCount; i++) {
          const waveX = gridX + radius - (i * waveWidth);
          const waveY = gridY + radius/2 + (i % 2 ? Math.max(1, radius/8) : 0);
          ctx.lineTo(waveX - waveWidth/2, waveY);
        }
        ctx.lineTo(gridX - radius, gridY + radius/2);
        ctx.closePath();
        ctx.fill();
        
        // Eyes (scale with cell size)
        const eyeRadius = Math.max(2, radius/4);
        const eyeY = gridY - radius/3;
        
        // White of eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(gridX - radius/3, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(gridX + radius/3, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils that look in direction of movement
        ctx.fillStyle = '#000066';
        let pupilOffsetX = 0, pupilOffsetY = 0;
        const pupilOffset = Math.max(1, radius/8);
        switch(ghost.direction) {
          case 'left': pupilOffsetX = -pupilOffset; break;
          case 'right': pupilOffsetX = pupilOffset; break;
          case 'up': pupilOffsetY = -pupilOffset; break;
          case 'down': pupilOffsetY = pupilOffset; break;
        }
        
        const pupilRadius = Math.max(1, radius/6);
        ctx.beginPath();
        ctx.arc(gridX - radius/3 + pupilOffsetX, eyeY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.arc(gridX + radius/3 + pupilOffsetX, eyeY + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    }
    
    function canMove(x, y, isGhost = false) {
      // Bounds check
      if (y < 0 || y >= 15) return false;
      
      // Handle horizontal tunnels for Pac-Man only
      if (!isGhost && (x < 0 || x >= 25)) {
        return y >= 0 && y < 15; // Allow tunnel movement for Pac-Man
      }
      
      // Ghosts must stay within maze bounds
      if (isGhost && (x < 0 || x >= 25)) {
        return false;
      }
      
      if (maze[y] && maze[y][x] !== undefined) {
        return maze[y][x] !== 1;
      }
      return false;
    }
    
    function smoothMove(entity) {
      // Check if this is a ghost (has a color property)
      const isGhost = entity.hasOwnProperty('color');
      
      // Ensure entity has a valid direction
      if (!entity.direction || !directions.includes(entity.direction)) {
        const validDirs = directions.filter(dir => {
          let testX = Math.round(entity.x);
          let testY = Math.round(entity.y);
          switch(dir) {
            case 'up': testY--; break;
            case 'down': testY++; break;
            case 'left': testX--; break;
            case 'right': testX++; break;
          }
          return canMove(testX, testY, isGhost);
        });
        
        if (validDirs.length > 0) {
          entity.direction = validDirs[0];
        } else {
          return false; // Can't move at all
        }
      }
      
      // Calculate next position based on direction using delta time for frame-rate independence
      let nextPixelX = entity.pixelX;
      let nextPixelY = entity.pixelY;
      const speed = entity.speed * cellSize * (deltaTime / frameTime); // Frame-rate independent movement
      
      switch(entity.direction) {
        case 'up': nextPixelY -= speed; break;
        case 'down': nextPixelY += speed; break;
        case 'left': nextPixelX -= speed; break;
        case 'right': nextPixelX += speed; break;
      }
      
      // Convert to grid coordinates to check collision
      const nextGridX = Math.round(nextPixelX / cellSize);
      const nextGridY = Math.round(nextPixelY / cellSize);
      
      // Check if the next position is valid
      if (canMove(nextGridX, nextGridY, isGhost)) {
        // Move the entity
        entity.pixelX = nextPixelX;
        entity.pixelY = nextPixelY;
        entity.x = entity.pixelX / cellSize;
        entity.y = entity.pixelY / cellSize;
        
        // Handle tunnel wrapping (only for Pac-Man, not ghosts)
        if (!isGhost) {
          if (entity.x < -0.5) {
            entity.x = 24.5;
            entity.pixelX = 24.5 * cellSize;
          } else if (entity.x > 24.5) {
            entity.x = -0.5;
            entity.pixelX = -0.5 * cellSize;
          }
        }
        
        return true;
      } else {
        // Check if we're at a grid position and can turn
        const currentGridX = Math.round(entity.x);
        const currentGridY = Math.round(entity.y);
        const atGrid = Math.abs(entity.x - currentGridX) < 0.1 && Math.abs(entity.y - currentGridY) < 0.1;
        
        if (atGrid) {
          // Try to find an alternative direction
          const validDirs = directions.filter(dir => {
            let testX = currentGridX, testY = currentGridY;
            switch(dir) {
              case 'up': testY--; break;
              case 'down': testY++; break;
              case 'left': testX--; break;
              case 'right': testX++; break;
            }
            return canMove(testX, testY, isGhost);
          });
          
          if (validDirs.length > 0 && !validDirs.includes(entity.direction)) {
            // Change direction to a valid one
            entity.direction = validDirs[0];
            return smoothMove(entity); // Try moving in new direction
          }
        }
        
        return false;
      }
    }
    
    function checkCollision() {
      for (let ghost of ghosts) {
        const dist = Math.sqrt(
          Math.pow(pacman.pixelX - ghost.pixelX, 2) + 
          Math.pow(pacman.pixelY - ghost.pixelY, 2)
        );
        if (dist < cellSize * 0.8) {
          respawnPacman();
          break;
        }
      }
    }
    
    function respawnPacman() {
      // Respawn Pac-Man at center
      pacman.x = 12; // Center of maze
      pacman.y = 7;  // Center position
      pacman.pixelX = 12 * cellSize;
      pacman.pixelY = 7 * cellSize;
      pacman.direction = 'left';
      pacman.nextDirection = 'left';
      pacman.targetPath = [];
      
      // Don't reset ghosts, just give player breathing room (in milliseconds)
      respawnTimer = 1000; // 1 second
    }
    
    function isPositionSafe(x, y, dangerRadius = 3) {
      // Check if position is safe from ghosts
      for (let ghost of ghosts) {
        const dist = Math.abs(x - ghost.x) + Math.abs(y - ghost.y);
        if (dist < dangerRadius) {
          return false;
        }
      }
      return true;
    }
    
    function findBestPellet() {
      let allPellets = [];
      
      // Find all remaining pellets
      for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 25; x++) {
          if (maze[y] && (maze[y][x] === 2 || maze[y][x] === 3)) {
            const dist = Math.abs(pacman.x - x) + Math.abs(pacman.y - y);
            const isSafe = isPositionSafe(x, y);
            const isPower = maze[y][x] === 3;
            
            // Calculate score for this pellet
            let score = 1000 - dist; // Closer is better
            if (isSafe) score += 500; // Safety bonus
            if (isPower) score += 300; // Power pellet bonus
            
            // Check ghost proximity to this pellet
            let minGhostDist = Infinity;
            for (let ghost of ghosts) {
              const ghostDist = Math.abs(ghost.x - x) + Math.abs(ghost.y - y);
              if (ghostDist < minGhostDist) minGhostDist = ghostDist;
            }
            
            // Prefer pellets that ghosts are far from
            score += minGhostDist * 10;
            
            allPellets.push({x, y, dist, score, isPower, isSafe});
          }
        }
      }
      
      if (allPellets.length === 0) return null;
      
      // Sort by score (higher is better)
      allPellets.sort((a, b) => b.score - a.score);
      
      // Return best pellet
      return allPellets[0];
    }
    
    function findEscapeDirection() {
      // Find the safest direction to escape from ghosts
      const gridX = Math.round(pacman.x);
      const gridY = Math.round(pacman.y);
      
      let bestDir = null;
      let bestSafety = -Infinity;
      
      for (let dir of directions) {
        let testX = gridX, testY = gridY;
        switch(dir) {
          case 'up': testY--; break;
          case 'down': testY++; break;
          case 'left': testX--; break;
          case 'right': testX++; break;
        }
        
        if (!canMove(testX, testY)) continue;
        
        // Calculate safety score (sum of distances to all ghosts)
        let safety = 0;
        for (let ghost of ghosts) {
          const dist = Math.abs(testX - ghost.x) + Math.abs(testY - ghost.y);
          
          // Heavily penalize moving toward a ghost
          const futureGhostDist = Math.abs(testX - ghost.x) + Math.abs(testY - ghost.y);
          const currentGhostDist = Math.abs(gridX - ghost.x) + Math.abs(gridY - ghost.y);
          
          if (futureGhostDist < currentGhostDist && dist < 3) {
            safety -= 100; // Don't move toward nearby ghosts
          } else {
            safety += dist * dist; // Square the distance for more weight on farther ghosts
          }
        }
        
        // Bonus for directions with more escape routes
        let escapeRoutes = 0;
        for (let nextDir of directions) {
          let nextX = testX, nextY = testY;
          switch(nextDir) {
            case 'up': nextY--; break;
            case 'down': nextY++; break;
            case 'left': nextX--; break;
            case 'right': nextX++; break;
          }
          if (canMove(nextX, nextY)) escapeRoutes++;
        }
        safety += escapeRoutes * 5;
        
        if (safety > bestSafety) {
          bestSafety = safety;
          bestDir = dir;
        }
      }
      
      return bestDir;
    }
    
    // Add stuck detection for entities
    function detectStuck(entity) {
      if (!entity.lastPositions) {
        entity.lastPositions = [];
      }
      
      const currentPos = { x: Math.round(entity.x * 10), y: Math.round(entity.y * 10) };
      entity.lastPositions.push(currentPos);
      
      // Keep only last 30 positions (about 0.5 seconds)
      if (entity.lastPositions.length > 30) {
        entity.lastPositions.shift();
      }
      
      // Check if entity hasn't moved much
      if (entity.lastPositions.length >= 20) {
        const recent = entity.lastPositions.slice(-20);
        const startPos = recent[0];
        const endPos = recent[recent.length - 1];
        const distMoved = Math.abs(startPos.x - endPos.x) + Math.abs(startPos.y - endPos.y);
        
        // If moved less than 1 grid unit in 20 frames, likely stuck
        return distMoved < 10;
      }
      
      return false;
    }
    
    function getDirectionFromPath(entity) {
      if (!entity.targetPath || entity.targetPath.length === 0) {
        // Fallback to valid direction
        const validDirs = directions.filter(dir => {
          let testX = Math.round(entity.x);
          let testY = Math.round(entity.y);
          switch(dir) {
            case 'up': testY--; break;
            case 'down': testY++; break;
            case 'left': testX--; break;
            case 'right': testX++; break;
          }
          return canMove(testX, testY);
        });
        
        if (validDirs.length > 0) {
          // Prefer continuing in same direction if possible
          if (validDirs.includes(entity.direction)) {
            return entity.direction;
          } else {
            return validDirs[Math.floor(Math.random() * validDirs.length)];
          }
        }
        return entity.direction;
      }
      
      const target = entity.targetPath[0]; // Next node in path
      const currentX = Math.round(entity.x);
      const currentY = Math.round(entity.y);
      const dx = target.x - currentX;
      const dy = target.y - currentY;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'right' : 'left';
      } else if (dy !== 0) {
        return dy > 0 ? 'down' : 'up';
      }
      
      return entity.direction;
    }
    
    function updatePacman() {
      if (!gameActive || respawnTimer > 0) {
        if (respawnTimer > 0) {
          respawnTimer -= deltaTime;
          if (respawnTimer < 0) respawnTimer = 0;
        }
        return;
      }
      
      const gridX = Math.round(pacman.x);
      const gridY = Math.round(pacman.y);
      const atGridPosition = Math.abs(pacman.x - gridX) < 0.3 && Math.abs(pacman.y - gridY) < 0.3;
      
      // Check for immediate danger
      let inDanger = false;
      let closestGhostDist = Infinity;
      for (let ghost of ghosts) {
        const dist = Math.abs(pacman.x - ghost.x) + Math.abs(pacman.y - ghost.y);
        if (dist < closestGhostDist) {
          closestGhostDist = dist;
        }
        if (dist < 4) {
          inDanger = true;
        }
      }
      
      // Clean up reached nodes from path
      while (pacman.targetPath && pacman.targetPath.length > 0 && 
             Math.abs(pacman.x - pacman.targetPath[0].x) < 0.6 && 
             Math.abs(pacman.y - pacman.targetPath[0].y) < 0.6) {
        pacman.targetPath.shift();
      }
      
      // Recalculate strategy when path is empty or periodically (every 500ms)
      if (!pacman.targetPath || pacman.targetPath.length === 0 || (frameCounter * deltaTime) % 500 < deltaTime) {
        if (inDanger && closestGhostDist < 3) {
          // Emergency escape mode
          const escapeDir = findEscapeDirection();
          if (escapeDir) {
            pacman.direction = escapeDir;
            pacman.targetPath = [];
          }
        } else {
          // Normal pellet hunting
          const pellet = findBestPellet();
          if (pellet) {
            const newPath = findPath(gridX, gridY, pellet.x, pellet.y, 25);
            if (newPath && newPath.length > 1) {
              pacman.targetPath = newPath;
            } else {
              // Direct movement toward pellet if pathfinding fails
              const dx = pellet.x - gridX;
              const dy = pellet.y - gridY;
              
              let preferredDir;
              if (Math.abs(dx) > Math.abs(dy)) {
                preferredDir = dx > 0 ? 'right' : 'left';
              } else {
                preferredDir = dy > 0 ? 'down' : 'up';
              }
              
              // Test if preferred direction is valid
              let testX = gridX, testY = gridY;
              switch(preferredDir) {
                case 'up': testY--; break;
                case 'down': testY++; break;
                case 'left': testX--; break;
                case 'right': testX++; break;
              }
              
              if (canMove(testX, testY)) {
                pacman.direction = preferredDir;
              }
              pacman.targetPath = [];
            }
          }
        }
      }
      
      // Update direction at grid positions if following a path
      if (atGridPosition && pacman.targetPath && pacman.targetPath.length > 0) {
        const nextNode = pacman.targetPath[0];
        const dx = nextNode.x - gridX;
        const dy = nextNode.y - gridY;
        
        let newDir;
        if (Math.abs(dx) > Math.abs(dy)) {
          newDir = dx > 0 ? 'right' : 'left';
        } else if (dy !== 0) {
          newDir = dy > 0 ? 'down' : 'up';
        } else {
          newDir = pacman.direction; // Keep current direction
        }
        
        // Validate direction change
        let testX = gridX, testY = gridY;
        switch(newDir) {
          case 'up': testY--; break;
          case 'down': testY++; break;
          case 'left': testX--; break;
          case 'right': testX++; break;
        }
        
        if (canMove(testX, testY)) {
          pacman.direction = newDir;
        } else {
          // Path is blocked, clear it to force recalculation
          pacman.targetPath = [];
        }
      }
      
      // Always try to move
      if (!smoothMove(pacman)) {
        // Pac-Man is stuck, find any valid direction to keep moving
        const validDirs = directions.filter(dir => {
          let tx = gridX, ty = gridY;
          switch(dir) {
            case 'up': ty--; break;
            case 'down': ty++; break;
            case 'left': tx--; break;
            case 'right': tx++; break;
          }
          return canMove(tx, ty);
        });
        
        if (validDirs.length > 0) {
          // Prefer continuing in same direction if possible
          if (validDirs.includes(pacman.direction)) {
            // Current direction is still valid, keep going
          } else {
            // Pick a new valid direction
            pacman.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
          }
          pacman.targetPath = []; // Clear path to force recalculation
        }
      }
      
      // Animate mouth (frame-rate independent)
      pacman.animationCounter += deltaTime;
      const mouthAnimationSpeed = 150; // ms per animation cycle
      if (pacman.animationCounter >= mouthAnimationSpeed) {
        pacman.mouthOpen = !pacman.mouthOpen;
        pacman.animationCounter = 0;
      }
      
      // Eat pellets
      const currentGridX = Math.round(pacman.x);
      const currentGridY = Math.round(pacman.y);
      if (maze[currentGridY] && maze[currentGridY][currentGridX] === 2) {
        maze[currentGridY][currentGridX] = 0;
        pelletsRemaining--;
        pacman.targetPath = []; // Force new path calculation
      } else if (maze[currentGridY] && maze[currentGridY][currentGridX] === 3) {
        maze[currentGridY][currentGridX] = 0;
        pelletsRemaining--;
        // Power pellet - ghosts should flee
        chaseMode = false;
        modeTimer = 3000; // 3 seconds of scatter mode
        pacman.targetPath = []; // Force new path calculation
      }
      
      // Check if level complete
      if (pelletsRemaining <= 0 && !levelComplete) {
        levelComplete = true;
        setTimeout(() => {
          resetMaze();
        }, 2000); // Wait 2 seconds before resetting
      }
      
      checkCollision();
    }
    
    function updateGhosts() {
      // Wait for start delay (frame-rate independent)
      if (startDelay > 0) {
        startDelay -= deltaTime;
        if (startDelay < 0) startDelay = 0;
        return; // Don't move ghosts yet
      }
      
      // Update ghost mode (frame-rate independent)
      if (modeTimer > 0) {
        modeTimer -= deltaTime;
      } else {
        chaseMode = !chaseMode;
        modeTimer = chaseMode ? 5000 : 3000; // Chase 5s, scatter 3s (in milliseconds)
        // Clear all ghost paths when mode changes
        ghosts.forEach(ghost => {
          ghost.targetPath = [];
        });
      }
      
      ghosts.forEach((ghost, index) => {
        const gridX = Math.round(ghost.x);
        const gridY = Math.round(ghost.y);
        const atGridPosition = Math.abs(ghost.x - gridX) < 0.3 && Math.abs(ghost.y - gridY) < 0.3;
        
        // Clean up reached nodes from path
        while (ghost.targetPath && ghost.targetPath.length > 0 && 
               Math.abs(ghost.x - ghost.targetPath[0].x) < 0.6 && 
               Math.abs(ghost.y - ghost.targetPath[0].y) < 0.6) {
          ghost.targetPath.shift();
        }
        
        // Update pathfinding when path is empty or periodically (staggered timing for each ghost)
        // Each ghost recalculates every 750ms, with 200ms stagger between ghosts
        const recalcInterval = 750;
        const staggerDelay = index * 200;
        const ghostTimer = (frameCounter * deltaTime + staggerDelay) % recalcInterval;
        if (!ghost.targetPath || ghost.targetPath.length === 0 || ghostTimer < deltaTime) {
          let targetX, targetY;
          
          if (chaseMode) {
            // Each ghost has different targeting behavior
            switch(ghost.name) {
              case 'Blinky': // Aggressive direct chase
                targetX = Math.round(pacman.x);
                targetY = Math.round(pacman.y);
                break;
                
              case 'Pinky': // Ambush - target ahead of Pac-Man
                targetX = Math.round(pacman.x);
                targetY = Math.round(pacman.y);
                const lookAhead = 4;
                switch(pacman.direction) {
                  case 'up': targetY -= lookAhead; break;
                  case 'down': targetY += lookAhead; break;
                  case 'left': targetX -= lookAhead; break;
                  case 'right': targetX += lookAhead; break;
                }
                break;
                
              case 'Inky': // Patrol behavior - targets area between Pac-Man and Blinky
                const blinky = ghosts[0]; // Reference to Blinky
                const pacX = Math.round(pacman.x);
                const pacY = Math.round(pacman.y);
                const blinkyX = Math.round(blinky.x);
                const blinkyY = Math.round(blinky.y);
                
                // Target point opposite to Blinky relative to Pac-Man
                const vectorX = pacX - blinkyX;
                const vectorY = pacY - blinkyY;
                targetX = pacX + vectorX;
                targetY = pacY + vectorY;
                break;
                
              case 'Clyde': // Shy ghost - runs away when close
                const distToPacman = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y);
                if (distToPacman > 8) {
                  // Chase when far away
                  targetX = Math.round(pacman.x);
                  targetY = Math.round(pacman.y);
                } else {
                  // Flee to corner when close
                  targetX = ghost.scatter.x;
                  targetY = ghost.scatter.y;
                }
                break;
            }
          } else {
            // Scatter mode - go to corners
            targetX = ghost.scatter.x;
            targetY = ghost.scatter.y;
          }
          
          // Clamp targets to maze bounds
          targetX = Math.max(0, Math.min(24, Math.round(targetX)));
          targetY = Math.max(0, Math.min(14, Math.round(targetY)));
          
          // Only pathfind if target is different from current position
          if (targetX !== gridX || targetY !== gridY) {
            const newPath = findPath(gridX, gridY, targetX, targetY, 20);
            if (newPath && newPath.length > 1) {
              ghost.targetPath = newPath;
            } else {
              // Direct movement toward target if pathfinding fails
              const dx = targetX - gridX;
              const dy = targetY - gridY;
              
              let preferredDir;
              if (Math.abs(dx) > Math.abs(dy)) {
                preferredDir = dx > 0 ? 'right' : 'left';
              } else if (dy !== 0) {
                preferredDir = dy > 0 ? 'down' : 'up';
              } else {
                preferredDir = ghost.direction; // Keep current direction
              }
              
              // Test if preferred direction is valid
              let testX = gridX, testY = gridY;
              switch(preferredDir) {
                case 'up': testY--; break;
                case 'down': testY++; break;
                case 'left': testX--; break;
                case 'right': testX++; break;
              }
              
              if (canMove(testX, testY, true)) {
                ghost.direction = preferredDir;
              }
              ghost.targetPath = [];
            }
          }
        }
        
        // Update direction at grid positions if following a path
        if (atGridPosition && ghost.targetPath && ghost.targetPath.length > 0) {
          const nextNode = ghost.targetPath[0];
          const dx = nextNode.x - gridX;
          const dy = nextNode.y - gridY;
          
          let newDir;
          if (Math.abs(dx) > Math.abs(dy)) {
            newDir = dx > 0 ? 'right' : 'left';
          } else if (dy !== 0) {
            newDir = dy > 0 ? 'down' : 'up';
          } else {
            newDir = ghost.direction; // Keep current direction
          }
          
          // Validate direction change
          let testX = gridX, testY = gridY;
          switch(newDir) {
            case 'up': testY--; break;
            case 'down': testY++; break;
            case 'left': testX--; break;
            case 'right': testX++; break;
          }
          
          if (canMove(testX, testY, true)) {
            ghost.direction = newDir;
          } else {
            // Path is blocked, clear it to force recalculation
            ghost.targetPath = [];
          }
        }
        
        // Always try to move
        if (!smoothMove(ghost)) {
          // Ghost is stuck, find any valid direction to keep moving
          const validDirs = directions.filter(dir => {
            let testX = gridX, testY = gridY;
            switch(dir) {
              case 'up': testY--; break;
              case 'down': testY++; break;
              case 'left': testX--; break;
              case 'right': testX++; break;
            }
            return canMove(testX, testY, true);
          });
          
          if (validDirs.length > 0) {
            // Prefer continuing in same direction if possible
            if (validDirs.includes(ghost.direction)) {
              // Current direction is still valid, keep going
            } else {
              // Pick a new valid direction, avoiding reverse if possible
              const oppositeDir = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
              }[ghost.direction];
              
              const preferredDirs = validDirs.filter(dir => dir !== oppositeDir);
              ghost.direction = (preferredDirs.length > 0 ? preferredDirs : validDirs)[0];
            }
            ghost.targetPath = []; // Clear path to force recalculation
          }
        }
      });
    }
    
    let frameCounter = 0;
    
    function gameLoop(currentTime) {
      // Calculate delta time for frame-rate independence
      if (lastFrameTime === 0) lastFrameTime = currentTime;
      deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      
      // Cap delta time to prevent large jumps (if tab was inactive)
      deltaTime = Math.min(deltaTime, frameTime * 3);
      
      // Clear and draw
      drawMaze();
      drawGhosts();
      
      // Flash effect when respawning (frame-rate independent)
      const flashSpeed = 200; // ms per flash
      if (respawnTimer <= 0 || Math.floor(currentTime / flashSpeed) % 2 === 0) {
        drawPacman();
      }
      
      // Update game logic
      updatePacman();
      updateGhosts();
      
      frameCounter++;
      
      requestAnimationFrame(gameLoop);
    }
    
    // Handle Pac-Man click for secret page
    canvas.style.pointerEvents = 'auto'; // Enable clicks on canvas
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const pacmanX = pacman.x * window.pacmanCellSize + window.pacmanOffsetX;
      const pacmanY = pacman.y * window.pacmanCellSize + window.pacmanOffsetY;
      
      // Check if click is on Pac-Man (with some padding for easier clicking)
      const clickRadius = window.pacmanCellSize;
      if (x >= pacmanX && x <= pacmanX + clickRadius &&
          y >= pacmanY && y <= pacmanY + clickRadius) {
        e.preventDefault();
        e.stopPropagation(); // Prevent the link from triggering
        window.location.href = 'secret.html';
      } else {
        // Allow the wrapper link to handle navigation to 90s.html
        // Don't prevent default, let the parent link work
      }
    });
    
    // Initialize the game
    resetMaze();
    
    // Start the game
    gameLoop();
  }
  