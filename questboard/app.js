// Addy Avatar & Workspace Customization Store - Encouragement Focused

// Application data from provided JSON
const APP_DATA = {
  "avatarCategories": {
    "happy_vibes": [
      {"id": "grinning", "emoji": "😀", "name": "Grinning Face", "message": "Spread positivity everywhere!", "cost": 0, "minLevel": 1},
      {"id": "smile", "emoji": "😊", "name": "Smiling Face", "message": "Your smile brightens the world!", "cost": 0, "minLevel": 1},
      {"id": "joy", "emoji": "😄", "name": "Joy", "message": "Pure happiness radiates from you!", "cost": 0, "minLevel": 1},
      {"id": "laughing", "emoji": "😃", "name": "Laughing", "message": "Laughter is the best medicine!", "cost": 0, "minLevel": 1},
      {"id": "heart_eyes", "emoji": "😍", "name": "Heart Eyes", "message": "Love what you do!", "cost": 5, "minLevel": 1},
      {"id": "hugging", "emoji": "🤗", "name": "Hugging", "message": "Sending you virtual hugs!", "cost": 10, "minLevel": 1},
      {"id": "star_struck", "emoji": "🤩", "name": "Star Struck", "message": "You're absolutely amazing!", "cost": 15, "minLevel": 1},
      {"id": "partying", "emoji": "🥳", "name": "Partying", "message": "Celebrate every small win!", "cost": 20, "minLevel": 2},
      {"id": "sun", "emoji": "☀️", "name": "Sunshine", "message": "You bring warmth to everyone!", "cost": 0, "minLevel": 1},
      {"id": "rainbow", "emoji": "🌈", "name": "Rainbow", "message": "You add color to the world!", "cost": 15, "minLevel": 1},
      {"id": "celebration", "emoji": "🎉", "name": "Celebration", "message": "Every day is worth celebrating!", "cost": 25, "minLevel": 2},
      {"id": "balloon", "emoji": "🎈", "name": "Balloon", "message": "Let your spirit soar high!", "cost": 20, "minLevel": 2}
    ],
    "determined": [
      {"id": "flexed_bicep", "emoji": "💪", "name": "Strong", "message": "You've got incredible strength!", "cost": 15, "minLevel": 1},
      {"id": "huffing", "emoji": "😤", "name": "Determined", "message": "Nothing can stop your determination!", "cost": 20, "minLevel": 2},
      {"id": "fire", "emoji": "🔥", "name": "On Fire", "message": "You're absolutely on fire today!", "cost": 25, "minLevel": 2},
      {"id": "lightning", "emoji": "⚡", "name": "Lightning Fast", "message": "Strike with lightning speed!", "cost": 30, "minLevel": 2},
      {"id": "target", "emoji": "🎯", "name": "Focused", "message": "Stay focused on your goals!", "cost": 35, "minLevel": 3},
      {"id": "rocket", "emoji": "🚀", "name": "Rocketing", "message": "Shoot for the stars!", "cost": 40, "minLevel": 3},
      {"id": "punch", "emoji": "👊", "name": "Power Punch", "message": "Pack a powerful punch!", "cost": 45, "minLevel": 3},
      {"id": "running_man", "emoji": "🏃‍♂️", "name": "Never Stop", "message": "Keep running toward success!", "cost": 50, "minLevel": 4},
      {"id": "running_woman", "emoji": "🏃‍♀️", "name": "Unstoppable", "message": "Nothing can slow you down!", "cost": 50, "minLevel": 4},
      {"id": "climbing", "emoji": "🧗‍♂️", "name": "Climbing High", "message": "Reach new heights every day!", "cost": 55, "minLevel": 4},
      {"id": "skiing", "emoji": "⛷️", "name": "Swift Movement", "message": "Navigate challenges with grace!", "cost": 60, "minLevel": 4},
      {"id": "weightlifting", "emoji": "🏋️‍♂️", "name": "Building Strength", "message": "Every day you grow stronger!", "cost": 65, "minLevel": 4}
    ],
    "peaceful": [
      {"id": "relieved", "emoji": "😌", "name": "Peaceful", "message": "Find peace in every moment!", "cost": 25, "minLevel": 2},
      {"id": "meditation", "emoji": "🧘‍♂️", "name": "Meditating", "message": "Inner peace is your superpower!", "cost": 30, "minLevel": 2},
      {"id": "yin_yang", "emoji": "☯️", "name": "Balanced", "message": "Perfect balance in all you do!", "cost": 35, "minLevel": 3},
      {"id": "dove", "emoji": "🕊️", "name": "Peaceful Dove", "message": "Carry peace wherever you go!", "cost": 40, "minLevel": 3},
      {"id": "cherry_blossom", "emoji": "🌸", "name": "Gentle Blossom", "message": "Bloom with gentle strength!", "cost": 45, "minLevel": 3},
      {"id": "hibiscus", "emoji": "🌺", "name": "Beautiful Flower", "message": "Your beauty shines from within!", "cost": 50, "minLevel": 4},
      {"id": "leaves", "emoji": "🍃", "name": "Flowing Leaves", "message": "Go with the flow gracefully!", "cost": 55, "minLevel": 4},
      {"id": "crescent_moon", "emoji": "🌙", "name": "Moonlight", "message": "Shine bright even in darkness!", "cost": 60, "minLevel": 4},
      {"id": "star", "emoji": "⭐", "name": "Guiding Star", "message": "Be a light for others!", "cost": 65, "minLevel": 4},
      {"id": "butterfly", "emoji": "🦋", "name": "Transformation", "message": "Embrace beautiful changes!", "cost": 70, "minLevel": 5},
      {"id": "ocean_wave", "emoji": "🌊", "name": "Calm Waters", "message": "Flow with serene confidence!", "cost": 75, "minLevel": 5}
    ],
    "energetic": [
      {"id": "zap", "emoji": "⚡", "name": "Electric Energy", "message": "Your energy is infectious!", "cost": 40, "minLevel": 3},
      {"id": "fireworks", "emoji": "🎆", "name": "Explosive Energy", "message": "Light up the sky with your passion!", "cost": 45, "minLevel": 3},
      {"id": "confetti", "emoji": "🎊", "name": "Celebration Mode", "message": "Every day is worth celebrating!", "cost": 50, "minLevel": 4},
      {"id": "glowing_star", "emoji": "🌟", "name": "Shining Star", "message": "You're destined to shine bright!", "cost": 55, "minLevel": 4},
      {"id": "sparkles", "emoji": "💫", "name": "Cosmic Energy", "message": "Your energy reaches the cosmos!", "cost": 60, "minLevel": 4},
      {"id": "musical_note", "emoji": "🎵", "name": "Rhythmic Soul", "message": "Dance to your own rhythm!", "cost": 65, "minLevel": 5},
      {"id": "music_notes", "emoji": "🎶", "name": "Harmony", "message": "Create beautiful harmony in life!", "cost": 70, "minLevel": 5},
      {"id": "guitar", "emoji": "🎸", "name": "Rock Star", "message": "Rock your world with confidence!", "cost": 75, "minLevel": 5},
      {"id": "party_face", "emoji": "🥳", "name": "Party Spirit", "message": "Bring the party everywhere!", "cost": 80, "minLevel": 5},
      {"id": "target_energy", "emoji": "🎯", "name": "Focused Energy", "message": "Channel your power precisely!", "cost": 85, "minLevel": 5},
      {"id": "rocket_energy", "emoji": "🚀", "name": "Blast Off", "message": "Launch into greatness!", "cost": 90, "minLevel": 6}
    ],
    "creative": [
      {"id": "artist_palette", "emoji": "🎨", "name": "Creative Soul", "message": "Express your unique creativity!", "cost": 50, "minLevel": 3},
      {"id": "paintbrush", "emoji": "🖌️", "name": "Master Artist", "message": "Paint your dreams into reality!", "cost": 55, "minLevel": 4},
      {"id": "sparkles_art", "emoji": "✨", "name": "Creative Magic", "message": "Create magic with your talents!", "cost": 60, "minLevel": 4},
      {"id": "theater_masks", "emoji": "🎭", "name": "Expressive", "message": "Express yourself authentically!", "cost": 65, "minLevel": 4},
      {"id": "circus_tent", "emoji": "🎪", "name": "Big Dreams", "message": "Think big and dream bigger!", "cost": 70, "minLevel": 5},
      {"id": "unicorn", "emoji": "🦄", "name": "Unique Magic", "message": "You're one in a million!", "cost": 75, "minLevel": 5},
      {"id": "rainbow_art", "emoji": "🌈", "name": "Colorful Spirit", "message": "Add color to everything you touch!", "cost": 80, "minLevel": 5},
      {"id": "camera", "emoji": "📸", "name": "Memory Maker", "message": "Capture beautiful moments!", "cost": 85, "minLevel": 6},
      {"id": "movie_camera", "emoji": "🎬", "name": "Story Teller", "message": "Tell your amazing story!", "cost": 90, "minLevel": 6},
      {"id": "art_frame", "emoji": "🖼️", "name": "Masterpiece", "message": "You are a work of art!", "cost": 95, "minLevel": 6}
    ],
    "magical": [
      {"id": "mage", "emoji": "🧙‍♂️", "name": "Wise Wizard", "message": "Your wisdom is magical!", "cost": 75, "minLevel": 5},
      {"id": "fairy", "emoji": "🧚‍♀️", "name": "Magical Fairy", "message": "Sprinkle magic wherever you go!", "cost": 80, "minLevel": 5},
      {"id": "crystal_ball", "emoji": "🔮", "name": "Future Seer", "message": "Your future is bright and magical!", "cost": 85, "minLevel": 6},
      {"id": "magic_sparkles", "emoji": "✨", "name": "Pure Magic", "message": "You are pure magic in motion!", "cost": 90, "minLevel": 6},
      {"id": "magical_unicorn", "emoji": "🦄", "name": "Mystical Being", "message": "Believe in your magical powers!", "cost": 95, "minLevel": 6},
      {"id": "wand", "emoji": "🪄", "name": "Magic Wand", "message": "Wave your wand and make it happen!", "cost": 100, "minLevel": 7},
      {"id": "shooting_star", "emoji": "💫", "name": "Wish Maker", "message": "Your wishes are coming true!", "cost": 105, "minLevel": 7},
      {"id": "magical_star", "emoji": "⭐", "name": "Guiding Star", "message": "Be the guiding star for others!", "cost": 110, "minLevel": 7},
      {"id": "wizard_hat", "emoji": "🧙‍♀️", "name": "Wise Witch", "message": "Your intuition is powerful magic!", "cost": 115, "minLevel": 7},
      {"id": "magic_theater", "emoji": "🎭", "name": "Magical Performance", "message": "Life is your magical stage!", "cost": 120, "minLevel": 8}
    ],
    "animals": [
      {"id": "lion", "emoji": "🦁", "name": "Brave Lion", "message": "Roar with confidence!", "cost": 30, "minLevel": 2},
      {"id": "tiger", "emoji": "🐯", "name": "Fierce Tiger", "message": "Show your fierce determination!", "cost": 35, "minLevel": 3},
      {"id": "wolf", "emoji": "🐺", "name": "Pack Leader", "message": "Lead with strength and loyalty!", "cost": 40, "minLevel": 3},
      {"id": "eagle", "emoji": "🦅", "name": "Soaring Eagle", "message": "Soar high above challenges!", "cost": 45, "minLevel": 3},
      {"id": "frog", "emoji": "🐸", "name": "Happy Frog", "message": "Leap into new opportunities!", "cost": 25, "minLevel": 2},
      {"id": "turtle", "emoji": "🐢", "name": "Steady Turtle", "message": "Slow and steady wins the race!", "cost": 30, "minLevel": 2},
      {"id": "butterfly_animal", "emoji": "🦋", "name": "Beautiful Butterfly", "message": "Transform into something beautiful!", "cost": 50, "minLevel": 4},
      {"id": "fox", "emoji": "🦊", "name": "Clever Fox", "message": "Smart and cunning in all you do!", "cost": 55, "minLevel": 4},
      {"id": "bee", "emoji": "🐝", "name": "Busy Bee", "message": "Your hard work creates sweet results!", "cost": 35, "minLevel": 3},
      {"id": "octopus", "emoji": "🐙", "name": "Flexible Octopus", "message": "Adapt and thrive in any situation!", "cost": 60, "minLevel": 4},
      {"id": "dragon", "emoji": "🐉", "name": "Mighty Dragon", "message": "Unleash your inner power!", "cost": 85, "minLevel": 6},
      {"id": "unicorn_animal", "emoji": "🦄", "name": "Magical Unicorn", "message": "You're rare and extraordinary!", "cost": 90, "minLevel": 6}
    ],
    "nature": [
      {"id": "tree", "emoji": "🌳", "name": "Strong Tree", "message": "Stay rooted while reaching high!", "cost": 40, "minLevel": 3},
      {"id": "herb", "emoji": "🌿", "name": "Fresh Growth", "message": "Keep growing and flourishing!", "cost": 35, "minLevel": 3},
      {"id": "fallen_leaf", "emoji": "🍃", "name": "Gentle Breeze", "message": "Flow gracefully with changes!", "cost": 30, "minLevel": 3},
      {"id": "sunflower", "emoji": "🌻", "name": "Bright Sunflower", "message": "Always turn toward the light!", "cost": 45, "minLevel": 4},
      {"id": "tulip", "emoji": "🌷", "name": "Spring Tulip", "message": "Fresh starts bring beautiful blooms!", "cost": 50, "minLevel": 4},
      {"id": "mountain", "emoji": "🏔️", "name": "Mighty Mountain", "message": "Stand tall and unmovable!", "cost": 55, "minLevel": 4},
      {"id": "ocean", "emoji": "🌊", "name": "Powerful Ocean", "message": "Your potential is as vast as the ocean!", "cost": 60, "minLevel": 5},
      {"id": "sun_nature", "emoji": "☀️", "name": "Radiant Sun", "message": "Shine your light on everyone!", "cost": 65, "minLevel": 5},
      {"id": "moon_nature", "emoji": "🌙", "name": "Gentle Moon", "message": "Find beauty in quiet moments!", "cost": 70, "minLevel": 5},
      {"id": "fire_nature", "emoji": "🔥", "name": "Natural Fire", "message": "Your passion burns bright!", "cost": 75, "minLevel": 5}
    ],
    "achievements": [
      {"id": "trophy", "emoji": "🏆", "name": "Champion", "message": "You're a true champion!", "cost": 150, "minLevel": 5},
      {"id": "gold_medal", "emoji": "🥇", "name": "Gold Winner", "message": "First place in everything you do!", "cost": 160, "minLevel": 6},
      {"id": "military_medal", "emoji": "🎖️", "name": "Medal of Honor", "message": "Honor yourself and your achievements!", "cost": 170, "minLevel": 6},
      {"id": "crown", "emoji": "👑", "name": "Royal Crown", "message": "Rule your own kingdom of success!", "cost": 200, "minLevel": 7},
      {"id": "diamond", "emoji": "💎", "name": "Precious Diamond", "message": "You're rare and precious!", "cost": 250, "minLevel": 7},
      {"id": "glowing_star_achievement", "emoji": "🌟", "name": "Superstar", "message": "You're destined for greatness!", "cost": 180, "minLevel": 6},
      {"id": "star_achievement", "emoji": "⭐", "name": "Shining Star", "message": "Keep shining bright!", "cost": 190, "minLevel": 6},
      {"id": "gem", "emoji": "💍", "name": "Precious Gem", "message": "You're a rare and valuable gem!", "cost": 300, "minLevel": 8}
    ]
  },
  "themeCategories": {
    "default": [
      {"id": "addy_light", "name": "Addy Light", "description": "Clean, inspiring workspace", "cost": 0, "minLevel": 1, "primary": "#21808d", "secondary": "#e8f1f2", "background": "#fcfcf9"},
      {"id": "addy_warm", "name": "Warm Welcome", "description": "Cozy and encouraging atmosphere", "cost": 0, "minLevel": 1, "primary": "#f59e0b", "secondary": "#fef3c7", "background": "#fffbeb"}
    ],
    "professional": [
      {"id": "success_blue", "name": "Success Blue", "description": "Professional achievement vibes", "cost": 50, "minLevel": 2, "primary": "#1e40af", "secondary": "#dbeafe", "background": "#f0f9ff"},
      {"id": "confident_dark", "name": "Confident Dark", "description": "Bold and confident workspace", "cost": 60, "minLevel": 3, "primary": "#374151", "secondary": "#f3f4f6", "background": "#111827"},
      {"id": "modern_focus", "name": "Modern Focus", "description": "Clean focus for productivity", "cost": 75, "minLevel": 3, "primary": "#64748b", "secondary": "#f1f5f9", "background": "#f8fafc"}
    ],
    "creative": [
      {"id": "sunset_inspiration", "name": "Sunset Inspiration", "description": "Warm and inspiring creativity", "cost": 100, "minLevel": 4, "primary": "#f59e0b", "secondary": "#fef3c7", "background": "linear-gradient(135deg, #fef3c7, #fed7aa)"},
      {"id": "ocean_calm", "name": "Ocean Calm", "description": "Peaceful creative flow", "cost": 125, "minLevel": 4, "primary": "#0891b2", "secondary": "#cffafe", "background": "linear-gradient(135deg, #cffafe, #e0f2fe)"},
      {"id": "forest_growth", "name": "Forest Growth", "description": "Natural growth and prosperity", "cost": 110, "minLevel": 4, "primary": "#059669", "secondary": "#d1fae5", "background": "linear-gradient(135deg, #d1fae5, #dcfce7)"},
      {"id": "purple_dreams", "name": "Purple Dreams", "description": "Dream big and achieve more", "cost": 150, "minLevel": 5, "primary": "#7c3aed", "secondary": "#ede9fe", "background": "linear-gradient(135deg, #ede9fe, #ddd6fe)"}
    ],
    "motivational": [
      {"id": "golden_success", "name": "Golden Success", "description": "Luxury success mindset", "cost": 200, "minLevel": 6, "primary": "#d97706", "secondary": "#fef3c7", "background": "linear-gradient(135deg, #fffbeb, #fef3c7, #fcd34d)"},
      {"id": "champion_silver", "name": "Champion Silver", "description": "Winner's mindset theme", "cost": 250, "minLevel": 7, "primary": "#64748b", "secondary": "#f1f5f9", "background": "linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1)"},
      {"id": "diamond_elite", "name": "Diamond Elite", "description": "Ultimate achievement theme", "cost": 300, "minLevel": 8, "primary": "#1f2937", "secondary": "#f3f4f6", "background": "linear-gradient(135deg, #111827, #374151, #6b7280)"}
    ]
  },
  "levelRequirements": [
    {"level": 1, "pointsRequired": 0, "coinBonus": 100, "title": "Getting Started"},
    {"level": 2, "pointsRequired": 100, "coinBonus": 50, "title": "Building Momentum"},
    {"level": 3, "pointsRequired": 250, "coinBonus": 75, "title": "Finding Your Flow"},
    {"level": 4, "pointsRequired": 500, "coinBonus": 100, "title": "Gaining Confidence"},
    {"level": 5, "pointsRequired": 1000, "coinBonus": 150, "title": "Showing Excellence"},
    {"level": 6, "pointsRequired": 1800, "coinBonus": 200, "title": "Achieving Mastery"},
    {"level": 7, "pointsRequired": 3000, "coinBonus": 250, "title": "Inspiring Others"},
    {"level": 8, "pointsRequired": 5000, "coinBonus": 300, "title": "Living Your Dreams"}
  ],
  "achievements": [
    {"id": "positivity_spreader", "name": "Positivity Spreader", "description": "Collect 5 happy emojis", "coinReward": 50, "pointReward": 100},
    {"id": "self_believer", "name": "Self Believer", "description": "Purchase a determined emoji", "coinReward": 30, "pointReward": 75},
    {"id": "inner_peace", "name": "Inner Peace", "description": "Own 3 peaceful emojis", "coinReward": 75, "pointReward": 150},
    {"id": "creative_soul", "name": "Creative Soul", "description": "Unlock artistic emojis", "coinReward": 100, "pointReward": 200},
    {"id": "nature_lover", "name": "Nature Lover", "description": "Collect nature-themed emojis", "coinReward": 85, "pointReward": 170},
    {"id": "achievement_master", "name": "Achievement Master", "description": "Own premium achievement emojis", "coinReward": 200, "pointReward": 400}
  ]
};

// Motivational quotes array
const MOTIVATIONAL_QUOTES = [
  "You're capable of amazing things!",
  "Every step forward is progress!",
  "Your potential is limitless!",
  "Believe in your incredible journey!",
  "You're growing stronger every day!",
  "Your positive energy is contagious!",
  "Today is full of possibilities!",
  "You have everything you need to succeed!",
  "Your courage inspires others!",
  "You're writing your own success story!"
];

// Application state
let gameState = {
  level: 1,
  points: 0,
  coins: 100,
  totalCoinsSpent: 0,
  ownedAvatars: new Set(['grinning']), // Start with one free happy emoji
  ownedThemes: new Set(['addy_light']), // Start with default theme
  currentAvatar: 'grinning',
  currentTheme: 'addy_light',
  unlockedAchievements: new Set(),
  lastDailyBonus: null,
  currentSection: 'avatars'
};

// Utility functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  const container = document.getElementById('toastContainer');
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function updateUserStats() {
  document.getElementById('userLevel').textContent = gameState.level;
  document.getElementById('userCoins').textContent = gameState.coins;
  document.getElementById('userPoints').textContent = gameState.points;
  
  // Update level title
  const levelData = APP_DATA.levelRequirements.find(l => l.level === gameState.level);
  document.getElementById('levelTitle').textContent = levelData.title;
  
  // Update progress bar
  const currentLevelData = APP_DATA.levelRequirements.find(l => l.level === gameState.level);
  const nextLevelData = APP_DATA.levelRequirements.find(l => l.level === gameState.level + 1);
  
  if (nextLevelData) {
    const currentProgress = gameState.points - currentLevelData.pointsRequired;
    const requiredProgress = nextLevelData.pointsRequired - currentLevelData.pointsRequired;
    const progressPercentage = (currentProgress / requiredProgress) * 100;
    
    document.getElementById('progressFill').style.width = `${Math.min(progressPercentage, 100)}%`;
    document.getElementById('progressNumbers').textContent = `${currentProgress} / ${requiredProgress}`;
  } else {
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('progressNumbers').textContent = 'Max Level Reached!';
  }
}

function updateMotivationalQuote() {
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  document.getElementById('motivationalQuote').textContent = quote;
}

function checkLevelUp() {
  const nextLevel = APP_DATA.levelRequirements.find(l => l.level === gameState.level + 1);
  if (nextLevel && gameState.points >= nextLevel.pointsRequired) {
    gameState.level++;
    gameState.coins += nextLevel.coinBonus;
    const levelData = APP_DATA.levelRequirements.find(l => l.level === gameState.level);
    showToast(`🎉 Level Up! You reached "${levelData.title}" and earned ${nextLevel.coinBonus} bonus coins!`, 'success');
    checkAchievements();
    updateUserStats();
    renderAvatarStore(); // Refresh to show newly unlocked items
    renderWorkspaceThemes();
    updateMotivationalQuote();
  }
}

function checkAchievements() {
  APP_DATA.achievements.forEach(achievement => {
    if (gameState.unlockedAchievements.has(achievement.id)) return;
    
    let unlocked = false;
    
    switch (achievement.id) {
      case 'positivity_spreader':
        const happyEmojis = Array.from(gameState.ownedAvatars).filter(id => 
          APP_DATA.avatarCategories.happy_vibes.some(e => e.id === id)
        );
        unlocked = happyEmojis.length >= 5;
        break;
      case 'self_believer':
        unlocked = Array.from(gameState.ownedAvatars).some(id =>
          APP_DATA.avatarCategories.determined.some(e => e.id === id)
        );
        break;
      case 'inner_peace':
        const peacefulEmojis = Array.from(gameState.ownedAvatars).filter(id =>
          APP_DATA.avatarCategories.peaceful.some(e => e.id === id)
        );
        unlocked = peacefulEmojis.length >= 3;
        break;
      case 'creative_soul':
        unlocked = Array.from(gameState.ownedAvatars).some(id =>
          APP_DATA.avatarCategories.creative.some(e => e.id === id)
        );
        break;
      case 'nature_lover':
        unlocked = Array.from(gameState.ownedAvatars).some(id =>
          APP_DATA.avatarCategories.nature.some(e => e.id === id)
        );
        break;
      case 'achievement_master':
        unlocked = Array.from(gameState.ownedAvatars).some(id =>
          APP_DATA.avatarCategories.achievements.some(e => e.id === id)
        );
        break;
    }
    
    if (unlocked) {
      gameState.unlockedAchievements.add(achievement.id);
      gameState.coins += achievement.coinReward;
      gameState.points += achievement.pointReward;
      showToast(`🏆 Achievement Unlocked: ${achievement.name}! +${achievement.coinReward} coins, +${achievement.pointReward} points`, 'success');
    }
  });
}

function getAllAvatars() {
  const allAvatars = [];
  Object.entries(APP_DATA.avatarCategories).forEach(([category, avatars]) => {
    avatars.forEach(avatar => {
      allAvatars.push({...avatar, category});
    });
  });
  return allAvatars;
}

function getAvatarById(avatarId) {
  const allAvatars = getAllAvatars();
  return allAvatars.find(a => a.id === avatarId);
}

function getCategoryDisplayName(category) {
  const categoryNames = {
    'happy_vibes': 'Happy Vibes',
    'determined': 'Determined',
    'peaceful': 'Peaceful', 
    'energetic': 'Energetic',
    'creative': 'Creative',
    'magical': 'Magical',
    'animals': 'Animals',
    'nature': 'Nature',
    'achievements': 'Achievements'
  };
  return categoryNames[category] || category;
}

// Avatar Store functionality
function renderAvatarStore() {
  const grid = document.getElementById('emojiGrid');
  const categoryFilter = document.getElementById('categoryFilter').value;
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  let avatarsToShow = getAllAvatars();
  
  // Apply category filter
  if (categoryFilter !== 'all') {
    avatarsToShow = avatarsToShow.filter(avatar => avatar.category === categoryFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    avatarsToShow = avatarsToShow.filter(avatar => 
      avatar.name.toLowerCase().includes(searchTerm) ||
      avatar.message.toLowerCase().includes(searchTerm) ||
      avatar.emoji.includes(searchTerm)
    );
  }
  
  grid.innerHTML = avatarsToShow.map(avatar => {
    const isOwned = gameState.ownedAvatars.has(avatar.id);
    const canAfford = gameState.coins >= avatar.cost;
    const hasLevel = gameState.level >= avatar.minLevel;
    const canPurchase = !isOwned && canAfford && hasLevel;
    const isLocked = !hasLevel || (!canAfford && !isOwned);
    const isCurrent = gameState.currentAvatar === avatar.id;
    
    return `
      <div class="emoji-card ${isOwned ? 'owned' : ''} ${isLocked ? 'locked' : ''}" 
           data-avatar-id="${avatar.id}" ${canPurchase || isOwned ? 'onclick="handleAvatarClick(\'' + avatar.id + '\')"' : ''}>
        ${isOwned ? (isCurrent ? '<div class="current-badge">Current</div>' : '<div class="owned-badge">Owned</div>') : ''}
        <div class="emoji-display">${avatar.emoji}</div>
        <div class="emoji-name">${avatar.name}</div>
        <div class="encouraging-message">${avatar.message}</div>
        <div class="emoji-details">
          <span class="emoji-cost ${avatar.cost === 0 ? 'free' : ''}">${avatar.cost === 0 ? 'Free' : avatar.cost + ' coins'}</span>
          <span class="emoji-level">Level ${avatar.minLevel}</span>
        </div>
        <button class="btn ${isOwned ? (isCurrent ? 'btn--primary' : 'btn--outline') : canPurchase ? 'btn--primary' : 'btn--secondary'} emoji-button" 
                ${!canPurchase && !isOwned ? 'disabled' : ''}>
          ${isOwned ? (isCurrent ? 'Current Avatar' : 'Select Avatar') : canPurchase ? 'Choose This One' : (!hasLevel ? `Unlock at Level ${avatar.minLevel}` : 'Need More Coins')}
        </button>
      </div>
    `;
  }).join('');
}

function handleAvatarClick(avatarId) {
  const avatar = getAvatarById(avatarId);
  const isOwned = gameState.ownedAvatars.has(avatarId);
  
  if (isOwned) {
    // Select as current avatar
    gameState.currentAvatar = avatarId;
    showToast(`✨ Selected ${avatar.name} as your avatar! ${avatar.message}`, 'success');
    renderAvatarStore();
    renderCollection();
    updateCurrentAvatar();
    updateMotivationalQuote();
  } else {
    // Show purchase modal
    showPurchaseModal(avatar);
  }
}

function showPurchaseModal(avatar) {
  const modal = document.getElementById('purchaseModal');
  document.getElementById('modalEmojiPreview').textContent = avatar.emoji;
  document.getElementById('modalEmojiName').textContent = avatar.name;
  document.getElementById('modalMessage').textContent = avatar.message;
  document.getElementById('modalCost').textContent = `${avatar.cost} coins`;
  document.getElementById('modalLevel').textContent = avatar.minLevel;
  
  modal.classList.remove('hidden');
  
  // Store current avatar for purchase
  modal.dataset.avatarId = avatar.id;
}

function hidePurchaseModal() {
  document.getElementById('purchaseModal').classList.add('hidden');
}

function confirmPurchase() {
  const modal = document.getElementById('purchaseModal');
  const avatarId = modal.dataset.avatarId;
  const avatar = getAvatarById(avatarId);
  
  if (gameState.coins >= avatar.cost && gameState.level >= avatar.minLevel) {
    gameState.coins -= avatar.cost;
    gameState.totalCoinsSpent += avatar.cost;
    gameState.ownedAvatars.add(avatarId);
    gameState.points += Math.max(avatar.cost, 5); // Earn at least 5 points
    
    showToast(`🎉 Amazing choice! You now own ${avatar.name}! ${avatar.message}`, 'success');
    
    checkAchievements();
    checkLevelUp();
    updateUserStats();
    renderAvatarStore();
    renderCollection();
    hidePurchaseModal();
  } else {
    showToast('❌ Cannot purchase this avatar right now!', 'error');
  }
}

// Collection functionality
function renderCollection() {
  const grid = document.getElementById('collectionGrid');
  const ownedAvatars = getAllAvatars().filter(avatar => gameState.ownedAvatars.has(avatar.id));
  
  document.getElementById('ownedCount').textContent = ownedAvatars.length;
  
  if (ownedAvatars.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); grid-column: 1/-1;">No avatars in your collection yet. Visit the avatar store to find your perfect match!</p>';
    return;
  }
  
  grid.innerHTML = ownedAvatars.map(avatar => {
    const isCurrent = gameState.currentAvatar === avatar.id;
    
    return `
      <div class="emoji-card owned ${isCurrent ? 'current' : ''}" 
           onclick="selectAvatar('${avatar.id}')">
        ${isCurrent ? '<div class="current-badge">Current</div>' : ''}
        <div class="emoji-display">${avatar.emoji}</div>
        <div class="emoji-name">${avatar.name}</div>
        <div class="encouraging-message">${avatar.message}</div>
        <div class="emoji-details">
          <span class="emoji-cost">${getCategoryDisplayName(avatar.category)}</span>
          <span class="emoji-level">Level ${avatar.minLevel}</span>
        </div>
        <button class="btn ${isCurrent ? 'btn--primary' : 'btn--outline'} emoji-button">
          ${isCurrent ? 'Current Avatar' : 'Select This One'}
        </button>
      </div>
    `;
  }).join('');
}

function selectAvatar(avatarId) {
  const avatar = getAvatarById(avatarId);
  gameState.currentAvatar = avatarId;
  showToast(`✨ ${avatar.name} is now your avatar! ${avatar.message}`, 'success');
  renderCollection();
  updateCurrentAvatar();
  updateMotivationalQuote();
}

function updateCurrentAvatar() {
  const currentAvatar = getAvatarById(gameState.currentAvatar);
  document.getElementById('currentAvatar').textContent = currentAvatar.emoji;
  document.getElementById('currentMessage').textContent = currentAvatar.message;
}

// Workspace themes functionality
function renderWorkspaceThemes() {
  Object.entries(APP_DATA.themeCategories).forEach(([category, themes]) => {
    const grid = document.getElementById(`${category}ThemesGrid`);
    
    grid.innerHTML = themes.map(theme => {
      const isOwned = gameState.ownedThemes.has(theme.id);
      const canAfford = gameState.coins >= theme.cost;
      const hasLevel = gameState.level >= theme.minLevel;
      const canPurchase = !isOwned && canAfford && hasLevel;
      const isCurrent = gameState.currentTheme === theme.id;
      
      return `
        <div class="theme-card ${isOwned ? 'owned' : ''} ${isCurrent ? 'current' : ''}"
             onclick="handleThemeClick('${theme.id}')">
          <div class="theme-name">${theme.name}</div>
          <div class="theme-description">${theme.description}</div>
          <div class="theme-colors">
            <div class="color-swatch" style="background: ${theme.primary}"></div>
            <div class="color-swatch" style="background: ${theme.secondary}"></div>
            <div class="color-swatch" style="background: ${theme.background}"></div>
          </div>
          <div class="theme-cost ${theme.cost === 0 ? 'free' : ''}">${theme.cost === 0 ? 'Free' : theme.cost + ' coins'}</div>
          <button class="btn ${isCurrent ? 'btn--primary' : isOwned ? 'btn--outline' : canPurchase ? 'btn--secondary' : 'btn--secondary'} btn--sm" 
                  ${!canPurchase && !isOwned ? 'disabled' : ''}>
            ${isCurrent ? 'Active' : isOwned ? 'Apply' : canPurchase ? 'Purchase' : (!hasLevel ? `Level ${theme.minLevel}` : 'Not enough coins')}
          </button>
        </div>
      `;
    }).join('');
  });
  
  updateCurrentThemeDisplay();
}

function handleThemeClick(themeId) {
  const theme = getThemeById(themeId);
  const isOwned = gameState.ownedThemes.has(themeId);
  
  if (isOwned) {
    applyTheme(themeId);
  } else {
    showThemeModal(theme);
  }
}

function getThemeById(themeId) {
  for (const themes of Object.values(APP_DATA.themeCategories)) {
    const theme = themes.find(t => t.id === themeId);
    if (theme) return theme;
  }
  return null;
}

function showThemeModal(theme) {
  const modal = document.getElementById('themeModal');
  document.getElementById('themeModalName').textContent = theme.name;
  document.getElementById('themeModalDescription').textContent = theme.description;
  document.getElementById('themeModalCost').textContent = `${theme.cost} coins`;
  document.getElementById('themeModalLevel').textContent = theme.minLevel;
  
  // Update color swatches
  document.getElementById('themeModalPrimary').style.background = theme.primary;
  document.getElementById('themeModalSecondary').style.background = theme.secondary;
  document.getElementById('themeModalBackground').style.background = theme.background;
  
  modal.classList.remove('hidden');
  modal.dataset.themeId = theme.id;
}

function hideThemeModal() {
  document.getElementById('themeModal').classList.add('hidden');
}

function confirmTheme() {
  const modal = document.getElementById('themeModal');
  const themeId = modal.dataset.themeId;
  const theme = getThemeById(themeId);
  
  if (gameState.coins >= theme.cost && gameState.level >= theme.minLevel) {
    gameState.coins -= theme.cost;
    gameState.totalCoinsSpent += theme.cost;
    gameState.ownedThemes.add(themeId);
    gameState.points += Math.max(theme.cost / 2, 10);
    
    applyTheme(themeId);
    showToast(`🎨 Theme applied! Your workspace now has ${theme.name} vibes!`, 'success');
    
    checkAchievements();
    checkLevelUp();
    updateUserStats();
    renderWorkspaceThemes();
    hideThemeModal();
  } else {
    showToast('❌ Cannot purchase this theme right now!', 'error');
  }
}

function applyTheme(themeId) {
  gameState.currentTheme = themeId;
  const theme = getThemeById(themeId);
  showToast(`✨ Applied ${theme.name}! Your workspace looks amazing!`, 'success');
  renderWorkspaceThemes();
}

function updateCurrentThemeDisplay() {
  const currentTheme = getThemeById(gameState.currentTheme);
  document.getElementById('currentThemeName').textContent = currentTheme.name;
  document.getElementById('currentPrimary').style.background = currentTheme.primary;
  document.getElementById('currentSecondary').style.background = currentTheme.secondary;
  document.getElementById('currentBackground').style.background = currentTheme.background;
}

// Earn coins functionality
function setupEarnCoins() {
  const dailyBtn = document.getElementById('dailyBonusBtn');
  const spinnerBtn = document.getElementById('spinnerBtn');
  const clickGameBtn = document.getElementById('clickGameBtn');
  
  dailyBtn.addEventListener('click', claimDailyBonus);
  spinnerBtn.addEventListener('click', playFortuneSpinner);
  clickGameBtn.addEventListener('click', startFocusChallenge);
  
  updateDailyBonusStatus();
}

function claimDailyBonus() {
  const now = new Date();
  const today = now.toDateString();
  
  if (gameState.lastDailyBonus === today) {
    showToast('❌ You already claimed your daily encouragement today! Come back tomorrow!', 'warning');
    return;
  }
  
  gameState.coins += 20;
  gameState.points += 15;
  gameState.lastDailyBonus = today;
  
  showToast('🎁 Daily encouragement claimed! +20 coins, +15 points. You\'re amazing!', 'success');
  updateUserStats();
  updateDailyBonusStatus();
  updateMotivationalQuote();
  checkLevelUp();
}

function updateDailyBonusStatus() {
  const btn = document.getElementById('dailyBonusBtn');
  const cooldown = document.getElementById('dailyCooldown');
  const today = new Date().toDateString();
  
  if (gameState.lastDailyBonus === today) {
    btn.disabled = true;
    btn.textContent = 'Already Claimed Today';
    cooldown.textContent = 'Your daily boost will refresh tomorrow!';
  } else {
    btn.disabled = false;
    btn.textContent = 'Claim Daily Boost';
    cooldown.textContent = '';
  }
}

function playFortuneSpinner() {
  if (gameState.coins < 5) {
    showToast('❌ Need 5 coins to spin the wheel of positivity!', 'error');
    return;
  }
  
  gameState.coins -= 5;
  const winAmount = Math.floor(Math.random() * 46) + 5; // 5-50 coins
  gameState.coins += winAmount;
  gameState.points += Math.floor(winAmount / 2);
  
  const encouragements = [
    'The universe is rewarding your positive energy!',
    'Your good vibes attracted this fortune!',
    'Success finds those who believe in themselves!',
    'You deserve this abundance!',
    'Your optimism just paid off!'
  ];
  
  const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
  showToast(`🌟 You won ${winAmount} coins! ${encouragement}`, 'success');
  updateUserStats();
  checkLevelUp();
}

function startFocusChallenge() {
  const gameArea = document.getElementById('clickGameArea');
  gameArea.style.display = 'block';
  gameArea.innerHTML = '';
  
  let score = 0;
  let timeLeft = 15;
  let gameInterval;
  let targetInterval;
  
  // Create score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.style.position = 'absolute';
  scoreDisplay.style.top = '10px';
  scoreDisplay.style.left = '10px';
  scoreDisplay.style.fontWeight = 'bold';
  scoreDisplay.style.color = 'var(--color-text)';
  scoreDisplay.style.background = 'var(--color-surface)';
  scoreDisplay.style.padding = '8px 12px';
  scoreDisplay.style.borderRadius = '6px';
  gameArea.appendChild(scoreDisplay);
  
  // Create timer display
  const timerDisplay = document.createElement('div');
  timerDisplay.style.position = 'absolute';
  timerDisplay.style.top = '10px';
  timerDisplay.style.right = '10px';
  timerDisplay.style.fontWeight = 'bold';
  timerDisplay.style.color = 'var(--color-text)';
  timerDisplay.style.background = 'var(--color-surface)';
  timerDisplay.style.padding = '8px 12px';
  timerDisplay.style.borderRadius = '6px';
  gameArea.appendChild(timerDisplay);
  
  function updateDisplay() {
    scoreDisplay.textContent = `Focused: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
  }
  
  function createTarget() {
    const target = document.createElement('div');
    target.className = 'click-target';
    target.textContent = '🎯';
    
    const maxX = gameArea.clientWidth - 50;
    const maxY = gameArea.clientHeight - 90; // Account for UI elements
    
    target.style.left = Math.max(10, Math.random() * maxX) + 'px';
    target.style.top = Math.max(50, Math.random() * maxY + 40) + 'px';
    
    target.addEventListener('click', () => {
      score++;
      target.remove();
      updateDisplay();
      showPositiveReinforcement();
    });
    
    gameArea.appendChild(target);
    
    // Remove target after 2.5 seconds
    setTimeout(() => {
      if (target.parentNode) {
        target.remove();
      }
    }, 2500);
  }
  
  function showPositiveReinforcement() {
    const messages = ['Great focus!', 'Well done!', 'Amazing!', 'Perfect!', 'Excellent!'];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const reinforcement = document.createElement('div');
    reinforcement.textContent = message;
    reinforcement.style.position = 'absolute';
    reinforcement.style.top = '50%';
    reinforcement.style.left = '50%';
    reinforcement.style.transform = 'translate(-50%, -50%)';
    reinforcement.style.color = 'var(--color-success)';
    reinforcement.style.fontWeight = 'bold';
    reinforcement.style.fontSize = '18px';
    reinforcement.style.pointerEvents = 'none';
    reinforcement.style.zIndex = '10';
    
    gameArea.appendChild(reinforcement);
    
    setTimeout(() => {
      reinforcement.remove();
    }, 800);
  }
  
  updateDisplay();
  
  // Game timer
  gameInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(targetInterval);
      
      const coinsWon = Math.max(score * 3, 5);
      const pointsWon = Math.max(score * 2, 5);
      
      gameState.coins += coinsWon;
      gameState.points += pointsWon;
      
      const encouragements = [
        'Your focus and determination are incredible!',
        'You showed amazing concentration!', 
        'That focus will take you far!',
        'Excellent mindfulness practice!',
        'Your determination is inspiring!'
      ];
      
      const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      
      gameArea.innerHTML = `
        <div style="text-align: center; padding-top: 60px; color: var(--color-text);">
          <h3 style="margin-bottom: 16px;">Challenge Complete!</h3>
          <p style="margin-bottom: 8px;">Targets Hit: ${score}</p>
          <p style="margin-bottom: 8px;">Coins Won: ${coinsWon}</p>
          <p style="margin-bottom: 16px;">Points Won: ${pointsWon}</p>
          <p style="color: var(--color-success); font-style: italic;">${encouragement}</p>
        </div>
      `;
      
      showToast(`🎯 Focus challenge complete! +${coinsWon} coins, +${pointsWon} points. ${encouragement}`, 'success');
      updateUserStats();
      checkLevelUp();
      
      setTimeout(() => {
        gameArea.style.display = 'none';
      }, 4000);
    }
  }, 1000);
  
  // Create targets periodically
  targetInterval = setInterval(createTarget, 1200);
  createTarget(); // First target immediately
}

// Achievements functionality
function renderAchievements() {
  const grid = document.getElementById('achievementsGrid');
  
  grid.innerHTML = APP_DATA.achievements.map(achievement => {
    const isCompleted = gameState.unlockedAchievements.has(achievement.id);
    
    return `
      <div class="achievement-card ${isCompleted ? 'completed' : ''}">
        ${isCompleted ? '<div class="completed-badge">✓ Achieved</div>' : ''}
        <div class="achievement-icon">${isCompleted ? '🏆' : '🎯'}</div>
        <h4>${achievement.name}</h4>
        <p class="achievement-description">${achievement.description}</p>
        <div class="achievement-rewards">
          <span class="reward-coins">+${achievement.coinReward} coins</span>
          <span class="reward-points">+${achievement.pointReward} points</span>
        </div>
      </div>
    `;
  }).join('');
}

// Navigation functionality
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.content-section');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetSection = button.dataset.section;
      
      // Update active nav button
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show target section
      sections.forEach(section => section.classList.remove('active'));
      document.getElementById(targetSection).classList.add('active');
      
      gameState.currentSection = targetSection;
      
      // Render section content
      switch (targetSection) {
        case 'avatars':
          renderAvatarStore();
          break;
        case 'workspace':
          renderWorkspaceThemes();
          break;
        case 'collection':
          renderCollection();
          break;
        case 'achievements':
          renderAchievements();
          break;
      }
      
      updateMotivationalQuote();
    });
  });
}

// Modal functionality
function setupModals() {
  // Avatar purchase modal
  const modal = document.getElementById('purchaseModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelPurchase');
  const confirmBtn = document.getElementById('confirmPurchase');
  
  backdrop.addEventListener('click', hidePurchaseModal);
  closeBtn.addEventListener('click', hidePurchaseModal);
  cancelBtn.addEventListener('click', hidePurchaseModal);
  confirmBtn.addEventListener('click', confirmPurchase);
  
  // Theme modal
  const themeModal = document.getElementById('themeModal');
  const themeBackdrop = document.getElementById('themeModalBackdrop');
  const themeCloseBtn = document.getElementById('themeModalClose');
  const themeCancelBtn = document.getElementById('cancelTheme');
  const themeConfirmBtn = document.getElementById('confirmTheme');
  
  themeBackdrop.addEventListener('click', hideThemeModal);
  themeCloseBtn.addEventListener('click', hideThemeModal);
  themeCancelBtn.addEventListener('click', hideThemeModal);
  themeConfirmBtn.addEventListener('click', confirmTheme);
}

// Filter functionality
function setupFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  
  categoryFilter.addEventListener('change', renderAvatarStore);
  searchInput.addEventListener('input', renderAvatarStore);
}

// Initialize application
function initializeApp() {
  // Give starting free emojis
  APP_DATA.avatarCategories.happy_vibes.forEach(avatar => {
    if (avatar.cost === 0) {
      gameState.ownedAvatars.add(avatar.id);
    }
  });
  
  updateUserStats();
  updateCurrentAvatar();
  updateMotivationalQuote();
  setupNavigation();
  setupModals();
  setupFilters();
  setupEarnCoins();
  renderAvatarStore();
  renderWorkspaceThemes();
  renderCollection();
  renderAchievements();
  
  // Update motivational quote every 30 seconds
  setInterval(updateMotivationalQuote, 30000);
  
  showToast('✨ Welcome to your personal encouragement store! You\'re about to embark on an amazing journey of self-discovery and positivity!', 'success');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);