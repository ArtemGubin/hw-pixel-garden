// Flower Garden Interactive Script

// Cfg
const FLOWER_COLORS = ['pink', 'red', 'purple', 'blue', 'orange', 'yellow'];
let flowerCount = 0;

// DOM 
const garden = document.getElementById('garden');
const clearBtn = document.getElementById('clearBtn');
const countDisplay = document.getElementById('count');


document.addEventListener('DOMContentLoaded', () => {
    addClouds();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    garden.addEventListener('click', plantFlower);
    clearBtn.addEventListener('click', clearGarden);
}

// Plant a flower at click position
function plantFlower(event) {
    // Don't plant if clicking on a flower or the clear button
    if (event.target.closest('.flower') || event.target.closest('.btn')) {
        return;
    }

    const rect = garden.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Only plant in the bottom 40% (ground area)
    // The ground starts at 60%
    if (y < rect.height * 0.6) {
        return;
    }

    const flower = createFlower(x, y);
    garden.appendChild(flower);

    flowerCount++;
    updateCount();

    // Add click effect
    createRipple(x, y);
}

// Create a flower
function createFlower(x, y) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    const colorClass = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
    flower.classList.add(colorClass);

    flower.style.left = `${x - 20}px`;
    flower.style.top = `${y - 60}px`;

    // Flower structure
    flower.innerHTML = `
        <div class="petals">
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="petal"></div>
            <div class="center"></div>
        </div>
        <div class="stem"></div>
    `;

    // Add click to remove flower
    flower.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFlower(flower);
    });

    return flower;
}

// Remove a flower with animation
function removeFlower(flower) {
    flower.style.animation = 'grow 0.3s ease-in reverse';
    setTimeout(() => {
        flower.remove();
        if (flowerCount > 0) {
            flowerCount--;
        }
        updateCount();
    }, 300);
}

// Clear all flowers
function clearGarden() {
    const flowers = document.querySelectorAll('.flower');
    
    flowers.forEach((flower, index) => {
        setTimeout(() => {
            flower.style.animation = 'grow 0.3s ease-in reverse';
            setTimeout(() => {
                flower.remove();
            }, 300);
        }, index * 50);
    });

    setTimeout(() => {
        flowerCount = 0;
        updateCount();
    }, flowers.length * 50 + 300);
}

// Update flower count display
function updateCount() {
    countDisplay.textContent = flowerCount;
    countDisplay.style.animation = 'none';
    setTimeout(() => {
        countDisplay.style.animation = 'centerPop 0.3s ease';
    }, 10);
}

// Create ripple effect
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2px solid rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    garden.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add some clouds
function addClouds() {
    const cloudCount = 3;
    
    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        const size = 40 + Math.random() * 40;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        cloud.style.top = `${20 + Math.random() * 100}px`;
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.animationDelay = `${i * 7}s`;
        cloud.style.animationDuration = `${20 + Math.random() * 10}s`;

        // Add cloud puffs
        const before = document.createElement('div');
        before.style.width = `${size * 0.7}px`;
        before.style.height = `${size * 0.7}px`;
        before.style.top = `${-size * 0.3}px`;
        before.style.left = `${size * 0.2}px`;
        
        const after = document.createElement('div');
        after.style.width = `${size * 0.7}px`;
        after.style.height = `${size * 0.7}px`;
        after.style.top = `${-size * 0.2}px`;
        after.style.right = `${size * 0.2}px`;

        cloud.appendChild(before);
        cloud.appendChild(after);
        
        garden.appendChild(cloud);
    }
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 60px;
            height: 60px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        createFlowerExplosion();
        konamiCode = [];
    }
});

// Special flower explosion effect
function createFlowerExplosion() {
    const rect = garden.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height * 0.8;

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 100 + Math.random() * 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            // Only plant if in ground area
            if (y > rect.height * 0.6 && y < rect.height) {
                const flower = createFlower(x, y);
                garden.appendChild(flower);
                flowerCount++;
            }
        }, i * 50);
    }

    setTimeout(updateCount, 1000);
}

console.log("sup")