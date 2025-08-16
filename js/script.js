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
    const cellSize = 20; // Larger cells for bigger sprites
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    
    // Game state
    let gameActive = true;
    let respawnTimer = 0;
    
    // Classic Pac-Man maze layout (25x15 for 500x300 canvas)
    // 1 = wall, 0 = empty path, 2 = pellet, 3 = power pellet
    const maze = [
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
      speed: 0.15,  // Smooth sub-pixel movement
      targetPath: []
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
        mode: 'scatter', speed: 0.12, targetPath: [], scatter: {x: 23, y: 1},
        spawn: ghostSpawns[0] },
      { x: ghostSpawns[1].x, y: ghostSpawns[1].y, 
        pixelX: ghostSpawns[1].x * cellSize, pixelY: ghostSpawns[1].y * cellSize,
        color: '#FFB8FF', direction: 'right', name: 'Pinky', 
        mode: 'scatter', speed: 0.11, targetPath: [], scatter: {x: 1, y: 1},
        spawn: ghostSpawns[1] },
      { x: ghostSpawns[2].x, y: ghostSpawns[2].y, 
        pixelX: ghostSpawns[2].x * cellSize, pixelY: ghostSpawns[2].y * cellSize,
        color: '#00FFFF', direction: 'left', name: 'Inky', 
        mode: 'scatter', speed: 0.10, targetPath: [], scatter: {x: 23, y: 13},
        spawn: ghostSpawns[2] },
      { x: ghostSpawns[3].x, y: ghostSpawns[3].y, 
        pixelX: ghostSpawns[3].x * cellSize, pixelY: ghostSpawns[3].y * cellSize,
        color: '#FFB852', direction: 'down', name: 'Clyde', 
        mode: 'scatter', speed: 0.09, targetPath: [], scatter: {x: 1, y: 13},
        spawn: ghostSpawns[3] }
    ];
    
    let modeTimer = 200; // Start with scatter mode
    let chaseMode = false;
    let startDelay = 120; // Give player 2 seconds to start
    
    // Movement patterns for ghosts
    const directions = ['up', 'down', 'left', 'right'];
    
    // A* Pathfinding Algorithm
    function findPath(startX, startY, targetX, targetY, maxLength = 20) {
      // Validate inputs
      if (!isFinite(startX) || !isFinite(startY) || !isFinite(targetX) || !isFinite(targetY)) {
        return [];
      }
      
      const openSet = [];
      const closedSet = [];
      const path = [];
      
      // Node class for pathfinding
      class Node {
        constructor(x, y, g, h, parent) {
          this.x = x;
          this.y = y;
          this.g = g; // Distance from start
          this.h = h; // Heuristic distance to target
          this.f = g + h; // Total cost
          this.parent = parent;
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
      
      const startNode = new Node(Math.floor(startX), Math.floor(startY), 0, 
                                  heuristic(startX, startY, targetX, targetY), null);
      openSet.push(startNode);
      
      let iterations = 0;
      const maxIterations = 100; // Prevent infinite loops
      
      while (openSet.length > 0 && path.length < maxLength && iterations < maxIterations) {
        iterations++;
        
        // Find node with lowest f cost
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
          if (openSet[i].f < openSet[currentIndex].f) {
            currentIndex = i;
          }
        }
        
        const current = openSet.splice(currentIndex, 1)[0];
        closedSet.push(current);
        
        // Check if we reached the target
        if (Math.abs(current.x - targetX) < 1 && Math.abs(current.y - targetY) < 1) {
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
          
          // Check if already in closed set
          if (closedSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) continue;
          
          const g = current.g + 1;
          const h = heuristic(neighbor.x, neighbor.y, targetX, targetY);
          
          // Check if already in open set
          const existingNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
          if (existingNode) {
            if (g < existingNode.g) {
              existingNode.g = g;
              existingNode.f = g + h;
              existingNode.parent = current;
            }
          } else {
            openSet.push(new Node(neighbor.x, neighbor.y, g, h, current));
          }
        }
      }
      
      return path; // Return partial path if target not reached
    }
    
    function drawMaze() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
          const cell = maze[row][col];
          const x = col * cellSize;
          const y = row * cellSize;
          
          if (cell === 1) {
            // Draw wall with better graphics
            ctx.fillStyle = '#1919A6';
            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            
            // Add highlights
            ctx.strokeStyle = '#2929FF';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          } else if (cell === 2) {
            // Draw pellet
            ctx.fillStyle = '#FFB897';
            ctx.beginPath();
            ctx.arc(x + cellSize/2, y + cellSize/2, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            // Draw power pellet (larger)
            ctx.fillStyle = '#FFB897';
            ctx.beginPath();
            ctx.arc(x + cellSize/2, y + cellSize/2, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    function drawPacman() {
      const x = pacman.pixelX + cellSize/2;
      const y = pacman.pixelY + cellSize/2;
      const radius = cellSize/2 - 2;
      
      ctx.save();
      ctx.translate(x, y);
      
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
        const x = ghost.pixelX + cellSize/2;
        const y = ghost.pixelY + cellSize/2;
        const radius = cellSize/2 - 2;
        
        ctx.save();
        
        // Ghost body
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(x, y - radius/3, radius, Math.PI, 0, false);
        ctx.lineTo(x + radius, y + radius/2);
        
        // Wavy bottom with more waves
        const waveCount = 4;
        const waveWidth = (radius * 2) / waveCount;
        for (let i = 0; i < waveCount; i++) {
          const waveX = x + radius - (i * waveWidth);
          const waveY = y + radius/2 + (i % 2 ? 3 : 0);
          ctx.lineTo(waveX - waveWidth/2, waveY);
        }
        ctx.lineTo(x - radius, y + radius/2);
        ctx.closePath();
        ctx.fill();
        
        // Eyes
        const eyeRadius = 3;
        const eyeY = y - radius/3;
        
        // White of eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - radius/3, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(x + radius/3, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils that look in direction of movement
        ctx.fillStyle = '#000066';
        let pupilOffsetX = 0, pupilOffsetY = 0;
        switch(ghost.direction) {
          case 'left': pupilOffsetX = -1; break;
          case 'right': pupilOffsetX = 1; break;
          case 'up': pupilOffsetY = -1; break;
          case 'down': pupilOffsetY = 1; break;
        }
        
        ctx.beginPath();
        ctx.arc(x - radius/3 + pupilOffsetX, eyeY + pupilOffsetY, 2, 0, Math.PI * 2);
        ctx.arc(x + radius/3 + pupilOffsetX, eyeY + pupilOffsetY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    }
    
    function canMove(x, y) {
      // Allow movement in tunnels
      if (y >= 0 && y < 15) {
        if (x < 0 || x >= 25) return true; // Allow tunnel movement
        if (maze[y] && maze[y][x] !== undefined) {
          return maze[y][x] !== 1;
        }
      }
      return false;
    }
    
    function smoothMove(entity) {
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
          return canMove(testX, testY);
        });
        
        if (validDirs.length > 0) {
          entity.direction = validDirs[0];
        } else {
          return false; // Can't move at all
        }
      }
      
      // Calculate target position based on direction
      let targetX = entity.x;
      let targetY = entity.y;
      
      switch(entity.direction) {
        case 'up': targetY = Math.floor(entity.y - 0.5); break;
        case 'down': targetY = Math.ceil(entity.y + 0.5); break;
        case 'left': targetX = Math.floor(entity.x - 0.5); break;
        case 'right': targetX = Math.ceil(entity.x + 0.5); break;
      }
      
      // Check if can move to target
      if (canMove(targetX, targetY)) {
        // Smooth pixel movement
        switch(entity.direction) {
          case 'up': 
            entity.pixelY -= entity.speed * cellSize;
            entity.y = entity.pixelY / cellSize;
            break;
          case 'down': 
            entity.pixelY += entity.speed * cellSize;
            entity.y = entity.pixelY / cellSize;
            break;
          case 'left': 
            entity.pixelX -= entity.speed * cellSize;
            entity.x = entity.pixelX / cellSize;
            break;
          case 'right': 
            entity.pixelX += entity.speed * cellSize;
            entity.x = entity.pixelX / cellSize;
            break;
        }
        
        // Wrap around for tunnels
        if (entity.x < -0.5) {
          entity.x = 24.5;
          entity.pixelX = 24.5 * cellSize;
        } else if (entity.x > 24.5) {
          entity.x = -0.5;
          entity.pixelX = -0.5 * cellSize;
        }
        
        return true;
      }
      return false;
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
      pacman.x = pacmanSpawn.x;
      pacman.y = pacmanSpawn.y;
      pacman.pixelX = pacmanSpawn.x * cellSize;
      pacman.pixelY = pacmanSpawn.y * cellSize;
      pacman.direction = 'left';
      pacman.nextDirection = 'left';
      pacman.targetPath = [];
      
      // Also reset ghosts to their spawn positions
      ghosts.forEach((ghost) => {
        ghost.x = ghost.spawn.x;
        ghost.y = ghost.spawn.y;
        ghost.pixelX = ghost.spawn.x * cellSize;
        ghost.pixelY = ghost.spawn.y * cellSize;
        ghost.targetPath = [];
      });
      
      respawnTimer = 30;
      startDelay = 60; // Give player time to orient
    }
    
    function isPositionSafe(x, y, dangerRadius = 4) {
      // Check if position is safe from ghosts
      for (let ghost of ghosts) {
        const dist = Math.abs(x - ghost.x) + Math.abs(y - ghost.y);
        if (dist < dangerRadius) {
          // Check if ghost is moving toward this position
          if (ghost.mode === 'chase' || dist < dangerRadius / 2) {
            return false;
          }
        }
      }
      return true;
    }
    
    function findSafestPellet() {
      let safePellets = [];
      let unsafePellets = [];
      
      // Categorize pellets by safety
      for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 25; x++) {
          if (maze[y] && (maze[y][x] === 2 || maze[y][x] === 3)) {
            const dist = Math.abs(pacman.x - x) + Math.abs(pacman.y - y);
            const pelletInfo = {x, y, dist, isPower: maze[y][x] === 3};
            
            if (isPositionSafe(x, y)) {
              safePellets.push(pelletInfo);
            } else {
              unsafePellets.push(pelletInfo);
            }
          }
        }
      }
      
      // Prioritize safe pellets, especially power pellets
      if (safePellets.length > 0) {
        // Sort by distance and prioritize power pellets
        safePellets.sort((a, b) => {
          if (a.isPower && !b.isPower) return -1;
          if (!a.isPower && b.isPower) return 1;
          return a.dist - b.dist;
        });
        return safePellets[0];
      }
      
      // If no safe pellets, go for power pellets first to turn the tables
      if (unsafePellets.length > 0) {
        const powerPellets = unsafePellets.filter(p => p.isPower);
        if (powerPellets.length > 0) {
          powerPellets.sort((a, b) => a.dist - b.dist);
          return powerPellets[0];
        }
        // Otherwise get the least dangerous pellet
        unsafePellets.sort((a, b) => a.dist - b.dist);
        return unsafePellets[0];
      }
      
      return null;
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
    
    function getDirectionFromPath(entity) {
      if (!entity.targetPath || entity.targetPath.length < 2) {
        // Fallback to random valid direction
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
        
        if (validDirs.length > 0 && !validDirs.includes(entity.direction)) {
          return validDirs[Math.floor(Math.random() * validDirs.length)];
        }
        return entity.direction;
      }
      
      const target = entity.targetPath[1]; // Next node in path
      const dx = target.x - Math.round(entity.x);
      const dy = target.y - Math.round(entity.y);
      
      if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'right' : 'left';
      } else if (dy !== 0) {
        return dy > 0 ? 'down' : 'up';
      }
      
      return entity.direction;
    }
    
    function updatePacman() {
      if (!gameActive || respawnTimer > 0) {
        if (respawnTimer > 0) respawnTimer--;
        return;
      }
      
      // Update pathfinding periodically
      const gridX = Math.round(pacman.x);
      const gridY = Math.round(pacman.y);
      const atGridPosition = Math.abs(pacman.x - gridX) < 0.2 && Math.abs(pacman.y - gridY) < 0.2;
      
      // Check for immediate danger
      let inDanger = false;
      let closestGhostDist = Infinity;
      for (let ghost of ghosts) {
        const dist = Math.abs(pacman.x - ghost.x) + Math.abs(pacman.y - ghost.y);
        if (dist < closestGhostDist) {
          closestGhostDist = dist;
        }
        if (dist < 3) {
          inDanger = true;
        }
      }
      
      // If in immediate danger, prioritize escape
      if (inDanger && atGridPosition) {
        const escapeDir = findEscapeDirection();
        if (escapeDir) {
          pacman.direction = escapeDir;
          pacman.targetPath = []; // Clear path to recalculate after escaping
        }
      } else {
        // Recalculate path occasionally or when no path
        if (frameCounter % 20 === 0 || !pacman.targetPath || pacman.targetPath.length === 0) {
          const pellet = findSafestPellet();
          if (pellet) {
            // Use A* only if pellet is safe or we have no choice
            if (isPositionSafe(pellet.x, pellet.y) || closestGhostDist > 5) {
              const newPath = findPath(gridX, gridY, pellet.x, pellet.y, 20);
              if (newPath && newPath.length > 0) {
                // Check if the path leads us into danger
                let pathSafe = true;
                for (let i = 0; i < Math.min(3, newPath.length); i++) {
                  if (!isPositionSafe(newPath[i].x, newPath[i].y, 3)) {
                    pathSafe = false;
                    break;
                  }
                }
                
                if (pathSafe) {
                  pacman.targetPath = newPath;
                } else {
                  // Path is dangerous, escape instead
                  const escapeDir = findEscapeDirection();
                  if (escapeDir) {
                    pacman.direction = escapeDir;
                    pacman.targetPath = [];
                  }
                }
              }
            } else {
              // Pellet is not safe, move away from ghosts
              const escapeDir = findEscapeDirection();
              if (escapeDir) {
                pacman.direction = escapeDir;
                pacman.targetPath = [];
              }
            }
          }
        }
      }
      
      // Clean up reached nodes
      while (pacman.targetPath && pacman.targetPath.length > 0 && 
             Math.abs(pacman.x - pacman.targetPath[0].x) < 0.5 && 
             Math.abs(pacman.y - pacman.targetPath[0].y) < 0.5) {
        pacman.targetPath.shift();
      }
      
      // Update direction at grid positions
      if (atGridPosition) {
        const newDir = getDirectionFromPath(pacman);
        
        // Try to change direction
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
          // If can't follow path, find any valid direction
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
            pacman.direction = validDirs.includes(pacman.direction) ? 
                               pacman.direction : validDirs[0];
          }
        }
      }
      
      // Move Pac-Man
      smoothMove(pacman);
      
      // Animate mouth
      pacman.animationCounter++;
      if (pacman.animationCounter % 3 === 0) {
        pacman.mouthOpen = !pacman.mouthOpen;
      }
      
      // Eat pellets
      const currentGridX = Math.round(pacman.x);
      const currentGridY = Math.round(pacman.y);
      if (maze[currentGridY] && maze[currentGridY][currentGridX] === 2) {
        maze[currentGridY][currentGridX] = 0;
        pacman.targetPath = []; // Recalculate path
      } else if (maze[currentGridY] && maze[currentGridY][currentGridX] === 3) {
        maze[currentGridY][currentGridX] = 0;
        // Power pellet - ghosts should flee
        chaseMode = false;
        modeTimer = 200;
      }
      
      checkCollision();
    }
    
    function updateGhosts() {
      // Wait for start delay
      if (startDelay > 0) {
        startDelay--;
        return; // Don't move ghosts yet
      }
      
      // Update ghost mode
      if (modeTimer > 0) {
        modeTimer--;
      } else {
        chaseMode = !chaseMode;
        modeTimer = chaseMode ? 300 : 200; // Chase longer than scatter
      }
      
      ghosts.forEach((ghost, index) => {
        const gridX = Math.round(ghost.x);
        const gridY = Math.round(ghost.y);
        const atGridPosition = Math.abs(ghost.x - gridX) < 0.1 && Math.abs(ghost.y - gridY) < 0.1;
        
        // Update pathfinding periodically
        if (atGridPosition && (frameCounter % 60 === index * 15 || !ghost.targetPath || ghost.targetPath.length === 0)) {
          let targetX, targetY;
          
          if (chaseMode) {
            // Each ghost has different targeting behavior
            switch(ghost.name) {
              case 'Blinky': // Direct chase
                targetX = pacman.x;
                targetY = pacman.y;
                break;
              case 'Pinky': // Target ahead of Pac-Man (but less aggressive early)
                targetX = pacman.x;
                targetY = pacman.y;
                const lookAhead = frameCounter < 600 ? 2 : 4; // Less aggressive at start
                switch(pacman.direction) {
                  case 'up': targetY -= lookAhead; break;
                  case 'down': targetY += lookAhead; break;
                  case 'left': targetX -= lookAhead; break;
                  case 'right': targetX += lookAhead; break;
                }
                break;
              case 'Inky': // Complex targeting
                targetX = pacman.x + (Math.random() - 0.5) * 8;
                targetY = pacman.y + (Math.random() - 0.5) * 8;
                break;
              case 'Clyde': // Shy - chase when far, flee when close
                const dist = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y);
                if (dist > 8) {
                  targetX = pacman.x;
                  targetY = pacman.y;
                } else {
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
          
          const newPath = findPath(Math.round(ghost.x), Math.round(ghost.y), targetX, targetY, 15);
          if (newPath && newPath.length > 0) {
            ghost.targetPath = newPath;
          } else {
            // Fallback to random movement if pathfinding fails
            ghost.targetPath = [];
          }
        }
        
        // Follow path
        if (ghost.targetPath && ghost.targetPath.length > 0) {
          // Remove reached nodes
          if (Math.abs(ghost.x - ghost.targetPath[0].x) < 0.5 && 
              Math.abs(ghost.y - ghost.targetPath[0].y) < 0.5) {
            ghost.targetPath.shift();
          }
          
          // Update direction
          if (atGridPosition) {
            const newDir = getDirectionFromPath(ghost);
            if (newDir !== ghost.direction) {
              let testX = gridX, testY = gridY;
              switch(newDir) {
                case 'up': testY--; break;
                case 'down': testY++; break;
                case 'left': testX--; break;
                case 'right': testX++; break;
              }
              if (canMove(testX, testY)) {
                ghost.direction = newDir;
              }
            }
          }
        }
        
        // Move ghost
        if (!smoothMove(ghost)) {
          // If can't move, try a new random direction
          const validDirs = directions.filter(dir => {
            let testX = Math.round(ghost.x);
            let testY = Math.round(ghost.y);
            switch(dir) {
              case 'up': testY--; break;
              case 'down': testY++; break;
              case 'left': testX--; break;
              case 'right': testX++; break;
            }
            return canMove(testX, testY);
          });
          
          if (validDirs.length > 0) {
            ghost.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
            ghost.targetPath = []; // Clear path to force recalculation
          }
        }
      });
    }
    
    let frameCounter = 0;
    
    function gameLoop() {
      // Clear and draw
      drawMaze();
      drawGhosts();
      
      // Flash effect when respawning
      if (respawnTimer <= 0 || respawnTimer % 6 < 3) {
        drawPacman();
      }
      
      // Update at 60 FPS for smooth movement
      updatePacman();
      updateGhosts();
      
      frameCounter++;
      
      requestAnimationFrame(gameLoop);
    }
    
    // Handle Pac-Man click for secret page
    canvas.style.pointerEvents = 'auto'; // Enable clicks on canvas
    canvas.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent the link from triggering
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const pacmanX = pacman.x * cellSize;
      const pacmanY = pacman.y * cellSize;
      
      // Check if click is on Pac-Man
      if (x >= pacmanX && x <= pacmanX + cellSize &&
          y >= pacmanY && y <= pacmanY + cellSize) {
        window.location.href = 'secret.html';
      }
    });
    
    // Start the game
    gameLoop();
  }
  