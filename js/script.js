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
    const cellSize = 10;
    const cols = canvas.width / cellSize;
    const rows = canvas.height / cellSize;
    
    // Simple maze layout (1 = wall, 0 = path, 2 = pellet)
    const maze = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,1,2,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,2,1,2,1],
      [1,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,2,1,1,1,1,2,1,1,0,0,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1],
      [0,0,0,0,1,2,1,2,2,2,2,2,0,0,0,0,2,2,2,2,2,1,2,1,0,0,0,0,0,0],
      [1,1,1,1,1,2,1,2,1,1,2,1,1,1,1,1,1,2,1,1,2,1,2,1,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,2,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,1,2,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    // Game entities
    let pacman = {
      x: 14,
      y: 9,
      direction: 'right',
      mouthOpen: true,
      animationCounter: 0
    };
    
    const ghosts = [
      { x: 13, y: 7, color: '#FF0000', direction: 'up', name: 'Blinky' },
      { x: 14, y: 7, color: '#FFB8FF', direction: 'down', name: 'Pinky' },
      { x: 15, y: 7, color: '#00FFFF', direction: 'left', name: 'Inky' },
      { x: 16, y: 7, color: '#FFB852', direction: 'right', name: 'Clyde' }
    ];
    
    // Movement patterns for ghosts
    const directions = ['up', 'down', 'left', 'right'];
    
    function drawMaze() {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = maze[row][col];
          const x = col * cellSize;
          const y = row * cellSize;
          
          if (cell === 1) {
            // Draw wall
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeStyle = '#4040FF';
            ctx.strokeRect(x, y, cellSize, cellSize);
          } else if (cell === 2) {
            // Draw pellet
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(x + cellSize/2, y + cellSize/2, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    function drawPacman() {
      const x = pacman.x * cellSize + cellSize/2;
      const y = pacman.y * cellSize + cellSize/2;
      
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      
      // Animate mouth
      let mouthAngle = pacman.mouthOpen ? 0.2 : 0;
      let startAngle, endAngle;
      
      switch(pacman.direction) {
        case 'right':
          startAngle = mouthAngle * Math.PI;
          endAngle = (2 - mouthAngle) * Math.PI;
          break;
        case 'left':
          startAngle = (1 + mouthAngle) * Math.PI;
          endAngle = (1 - mouthAngle) * Math.PI;
          break;
        case 'up':
          startAngle = (1.5 + mouthAngle) * Math.PI;
          endAngle = (1.5 - mouthAngle) * Math.PI;
          break;
        case 'down':
          startAngle = (0.5 + mouthAngle) * Math.PI;
          endAngle = (0.5 - mouthAngle) * Math.PI;
          break;
      }
      
      ctx.arc(x, y, cellSize/2 - 1, startAngle, endAngle);
      ctx.lineTo(x, y);
      ctx.fill();
    }
    
    function drawGhosts() {
      ghosts.forEach(ghost => {
        const x = ghost.x * cellSize + cellSize/2;
        const y = ghost.y * cellSize + cellSize/2;
        
        ctx.fillStyle = ghost.color;
        
        // Ghost body
        ctx.beginPath();
        ctx.arc(x, y - 2, cellSize/2 - 1, Math.PI, 0, false);
        ctx.lineTo(x + cellSize/2 - 1, y + cellSize/2 - 3);
        
        // Wavy bottom
        for (let i = 0; i < 3; i++) {
          ctx.lineTo(x + cellSize/2 - 3 - i*3, y + cellSize/2 - 1 - (i%2)*2);
        }
        ctx.lineTo(x - cellSize/2 + 1, y + cellSize/2 - 3);
        ctx.closePath();
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2);
        ctx.arc(x + 2, y - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 1, 0, Math.PI * 2);
        ctx.arc(x + 2, y - 2, 1, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    function canMove(x, y) {
      if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
      return maze[y][x] !== 1;
    }
    
    function moveEntity(entity) {
      let newX = entity.x;
      let newY = entity.y;
      
      switch(entity.direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }
      
      // Wrap around for tunnel
      if (newX < 0) newX = cols - 1;
      if (newX >= cols) newX = 0;
      
      if (canMove(newX, newY)) {
        entity.x = newX;
        entity.y = newY;
        return true;
      }
      return false;
    }
    
    function updatePacman() {
      // Auto-move Pac-Man
      if (!moveEntity(pacman)) {
        // Hit a wall, change direction
        const possibleDirections = directions.filter(dir => {
          let testX = pacman.x;
          let testY = pacman.y;
          switch(dir) {
            case 'up': testY--; break;
            case 'down': testY++; break;
            case 'left': testX--; break;
            case 'right': testX++; break;
          }
          return canMove(testX, testY);
        });
        
        if (possibleDirections.length > 0) {
          pacman.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }
      }
      
      // Animate mouth
      pacman.animationCounter++;
      if (pacman.animationCounter % 5 === 0) {
        pacman.mouthOpen = !pacman.mouthOpen;
      }
      
      // Eat pellets
      if (maze[pacman.y][pacman.x] === 2) {
        maze[pacman.y][pacman.x] = 0;
      }
    }
    
    function updateGhosts() {
      ghosts.forEach(ghost => {
        // Random AI movement
        if (Math.random() < 0.3 || !moveEntity(ghost)) {
          const possibleDirections = directions.filter(dir => {
            let testX = ghost.x;
            let testY = ghost.y;
            switch(dir) {
              case 'up': testY--; break;
              case 'down': testY++; break;
              case 'left': testX--; break;
              case 'right': testX++; break;
            }
            return canMove(testX, testY);
          });
          
          if (possibleDirections.length > 0) {
            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
          }
        }
      });
    }
    
    function gameLoop() {
      drawMaze();
      drawGhosts();
      drawPacman();
      
      // Update positions every few frames for slower movement
      if (Date.now() % 3 === 0) {
        updatePacman();
        updateGhosts();
      }
      
      requestAnimationFrame(gameLoop);
    }
    
    // Handle Pac-Man click for secret page
    canvas.addEventListener('click', (e) => {
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
  