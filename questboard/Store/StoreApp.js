// Store Data
const STORE_DATA = {
  characters: [
    // Tier 1: Emoji avatars (50-100 points)
    { id: 'char_emoji_1', name: 'Ghost', emoji: '👻', price: 50, tier: 'common' },
    { id: 'char_emoji_2', name: 'Alien', emoji: '👽', price: 50, tier: 'common' },
    { id: 'char_emoji_3', name: 'Robot', emoji: '👾', price: 60, tier: 'common' },
    { id: 'char_emoji_4', name: 'Pumpkin', emoji: '🎃', price: 60, tier: 'common' },
    { id: 'char_emoji_5', name: 'Heart Eyes', emoji: '😍', price: 70, tier: 'common' },
    { id: 'char_emoji_6', name: 'Cowboy', emoji: '🤠', price: 70, tier: 'common' },
    { id: 'char_emoji_7', name: 'Cool', emoji: '😎', price: 80, tier: 'common' },
    { id: 'char_emoji_8', name: 'Star Eyes', emoji: '🤩', price: 80, tier: 'common' },
    { id: 'char_emoji_9', name: 'Disguise', emoji: '🥸', price: 90, tier: 'common' },
    { id: 'char_emoji_10', name: 'Smirk', emoji: '😏', price: 90, tier: 'common' },
    { id: 'char_emoji_11', name: 'Party', emoji: '🥳', price: 100, tier: 'common' },
    { id: 'char_emoji_12', name: 'Money', emoji: '🤑', price: 100, tier: 'common' },
    
    // Tier 2: Professional emojis (150-300 points)
    { id: 'char_prof_1', name: 'Police Officer', emoji: '👮‍♂️', price: 150, tier: 'rare' },
    { id: 'char_prof_2', name: 'Rockstar', emoji: '👩‍🎤', price: 160, tier: 'rare' },
    { id: 'char_prof_3', name: 'Detective', emoji: '🕵️', price: 170, tier: 'rare' },
    { id: 'char_prof_4', name: 'Doctor', emoji: '👩‍⚕️', price: 180, tier: 'rare' },
    { id: 'char_prof_5', name: 'Farmer', emoji: '👩‍🌾', price: 190, tier: 'rare' },
    { id: 'char_prof_6', name: 'Teacher', emoji: '👩‍🏫', price: 200, tier: 'rare' },
    { id: 'char_prof_7', name: 'Tech Pro', emoji: '🧑‍💻', price: 220, tier: 'rare' },
    { id: 'char_prof_8', name: 'Developer', emoji: '👩‍💻', price: 240, tier: 'rare' },
    { id: 'char_prof_9', name: 'Royalty', emoji: '🫅', price: 260, tier: 'rare' },
    { id: 'char_prof_10', name: 'Princess', emoji: '👸', price: 280, tier: 'rare' },
    { id: 'char_prof_11', name: 'Judge', emoji: '👨‍⚖️', price: 290, tier: 'rare' },
    { id: 'char_prof_12', name: 'Fairy', emoji: '🧚‍♀️', price: 300, tier: 'rare' },
    
    // Tier 3: Premium images (400-800 points)
    { id: 'char_img_1', name: 'Hero Avatar 1', image: 'Store/avatars/1ddeb25aac31555f06cc1f4726694e3.png', price: 400, tier: 'premium' },
    { id: 'char_img_2', name: 'Hero Avatar 2', image: 'Store/avatars/3d6a9f6ee6b6251402befa34f9d2a23.png', price: 420, tier: 'premium' },
    { id: 'char_img_3', name: 'Hero Avatar 3', image: 'Store/avatars/5a3e6ceb4293a5cb05b3c5b57ca5.png', price: 440, tier: 'premium' },
    { id: 'char_img_4', name: 'Hero Avatar 4', image: 'Store/avatars/5e9f364e6ebe817af79f777662396c.png', price: 460, tier: 'premium' },
    { id: 'char_img_5', name: 'Hero Avatar 5', image: 'Store/avatars/5feb3fefaf98c30f3d36ac0d7f73d2.png', price: 480, tier: 'premium' },
    { id: 'char_img_6', name: 'Hero Avatar 6', image: 'Store/avatars/6ac345a0c948f959f787f1506780f5.png', price: 500, tier: 'premium' },
    { id: 'char_img_7', name: 'Epic Avatar 1', image: 'Store/avatars/8bb37d0df436b6f84c8bb3726c6fc3.png', price: 550, tier: 'legendary' },
    { id: 'char_img_8', name: 'Epic Avatar 2', image: 'Store/avatars/08fb4f21a95aef6f8d0ab01e02728.png', price: 580, tier: 'legendary' },
    { id: 'char_img_9', name: 'Epic Avatar 3', image: 'Store/avatars/8fc2c572def20789d158f1a49932da.png', price: 620, tier: 'legendary' },
    { id: 'char_img_10', name: 'Epic Avatar 4', image: 'Store/avatars/17f70a03e7546034dd1d3b397f503.png', price: 650, tier: 'legendary' },
    { id: 'char_img_11', name: 'Epic Avatar 5', image: 'Store/avatars/24f846b655631756b2ac38303bfa2a.png', price: 680, tier: 'legendary' },
    { id: 'char_img_12', name: 'Epic Avatar 6', image: 'Store/avatars/40d1f7291c2d2acceb8eb057effcfb.png', price: 700, tier: 'legendary' },
    { id: 'char_img_13', name: 'Ultimate Avatar 1', image: 'Store/avatars/0150fc3ba207ccce11d97b8839fd71.png', price: 750, tier: 'legendary' },
    { id: 'char_img_14', name: 'Ultimate Avatar 2', image: 'Store/avatars/665decbe73353a81182d48a397d8.png', price: 800, tier: 'legendary' },
  ],
  backgrounds: [
    // Plain colors
    { id: 'bg_plain_1', name: 'Sky Blue', color: '#87CEEB', price: 50, tier: 'common' },
    { id: 'bg_plain_2', name: 'Mint Green', color: '#98FF98', price: 60, tier: 'common' },
    { id: 'bg_plain_3', name: 'Soft Pink', color: '#FFB6C1', price: 70, tier: 'common' },
    { id: 'bg_plain_4', name: 'Lavender', color: '#E6E6FA', price: 80, tier: 'common' },
    { id: 'bg_plain_5', name: 'Peach', color: '#FFDAB9', price: 90, tier: 'common' },
    { id: 'bg_plain_6', name: 'Light Coral', color: '#F08080', price: 100, tier: 'common' },
    
    // Gradients
    { id: 'bg_grad_1', name: 'Ocean Breeze', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', price: 150, tier: 'rare' },
    { id: 'bg_grad_2', name: 'Sunset Glow', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', price: 180, tier: 'rare' },
    { id: 'bg_grad_3', name: 'Fresh Meadow', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', price: 200, tier: 'rare' },
    { id: 'bg_grad_4', name: 'Purple Dream', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', price: 220, tier: 'rare' },
    { id: 'bg_grad_5', name: 'Fire Burst', gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', price: 250, tier: 'rare' },
    { id: 'bg_grad_6', name: 'Cool Mint', gradient: 'linear-gradient(135deg, #a1ffce 0%, #faffd1 100%)', price: 280, tier: 'rare' },
    { id: 'bg_grad_7', name: 'Royal Night', gradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', price: 300, tier: 'rare' },
    
    // Images folder 1
    { id: 'bg_img_1_1', name: 'Premium Scene 1', image: 'Store/backgrounds/1/1ab9ffb39c7b365f0136e06c5b95d80c.jpg', price: 350, tier: 'premium' },
    { id: 'bg_img_1_2', name: 'Premium Scene 2', image: 'Store/backgrounds/1/49677d0ebaf7d4d1e21f6e34bb7005a7.jpg', price: 380, tier: 'premium' },
    { id: 'bg_img_1_3', name: 'Premium Scene 3', image: 'Store/backgrounds/1/546590e48be6e7b9a6c510098b3b4fd5.jpg', price: 410, tier: 'premium' },
    { id: 'bg_img_1_4', name: 'Premium Scene 4', image: 'Store/backgrounds/1/975676e8aebca81bec40ad99623c7e7f.jpg', price: 440, tier: 'premium' },
    { id: 'bg_img_1_5', name: 'Premium Scene 5', image: 'Store/backgrounds/1/41903165bc56b233b300d59de0bbbfb8.jpg', price: 470, tier: 'premium' },
    { id: 'bg_img_1_6', name: 'Premium Scene 6', image: 'Store/backgrounds/1/304645652729cb36b14a30a46108c8d3.jpg', price: 500, tier: 'premium' },
    
    // Images folder 2
    { id: 'bg_img_2_1', name: 'Epic Scene 1', image: 'Store/backgrounds/2/2ddd715bb433ca6e56d26bf2efa21237.jpg', price: 550, tier: 'legendary' },
    { id: 'bg_img_2_2', name: 'Epic Scene 2', image: 'Store/backgrounds/2/3fb30e32868c4a6aa1e8a3caa2863823.jpg', price: 580, tier: 'legendary' },
    { id: 'bg_img_2_3', name: 'Epic Scene 3', image: 'Store/backgrounds/2/4bd34af76f26ecd0200ea27c0e186329.jpg', price: 610, tier: 'legendary' },
    { id: 'bg_img_2_4', name: 'Epic Scene 4', image: 'Store/backgrounds/2/06f714d20948dba3b2ee73f3fe5087a0.jpg', price: 640, tier: 'legendary' },
    { id: 'bg_img_2_5', name: 'Epic Scene 5', image: 'Store/backgrounds/2/6d7cfe5d63b16794c3af0388dcd35a06.jpg', price: 670, tier: 'legendary' },
    { id: 'bg_img_2_6', name: 'Epic Scene 6', image: 'Store/backgrounds/2/7ae7b9833cc7bb60929fb8e4a0796a3f.jpg', price: 700, tier: 'legendary' },
    
    // Images folder 3
    { id: 'bg_img_3_1', name: 'Ultimate Scene 1', image: 'Store/backgrounds/3/00b90809a6815ea8b35fd98f635f4964.jpg', price: 750, tier: 'legendary' },
    { id: 'bg_img_3_2', name: 'Ultimate Scene 2', image: 'Store/backgrounds/3/03ba1c826d141204615f84d75e3f27fb.jpg', price: 800, tier: 'legendary' },
    { id: 'bg_img_3_3', name: 'Ultimate Scene 3', image: 'Store/backgrounds/3/4df310bfcec8882324ebac3f8989bcf.jpg', price: 850, tier: 'legendary' },
    { id: 'bg_img_3_4', name: 'Ultimate Scene 4', image: 'Store/backgrounds/3/6b18ead0da882ce079a155578b5d4556.jpg', price: 900, tier: 'legendary' },
    { id: 'bg_img_3_5', name: 'Ultimate Scene 5', image: 'Store/backgrounds/3/7a226f01fec238cda4ba3b1b037e9024.jpg', price: 950, tier: 'legendary' },
    { id: 'bg_img_3_6', name: 'Ultimate Scene 6', image: 'Store/backgrounds/3/8c273a3c0b837ca256844fd2c273f982f.jpg', price: 1000, tier: 'legendary' },
    { id: 'bg_img_3_7', name: 'Minions Special', image: 'Store/backgrounds/3/minions.png', price: 1200, tier: 'legendary' },
    { id: 'bg_img_3_8', name: 'Up Special', image: 'Store/backgrounds/3/up.jpg', price: 1200, tier: 'legendary' },
  ]
};

let storeState = {
  userPoints: 0,
  pointsSpent: 0,
  ownedCharacters: [],
  ownedBackgrounds: [],
  currentCharacter: null,
  currentBackground: null,
  activeTab: 'characters',
  filter: 'all',
  selectedItem: null,
  showPurchaseModal: false,
  showNotEnoughModal: false
};

function initializeStore(userData) {
  if (userData) {
    // CRITICAL: Points are calculated as earned - spent in parent
    storeState.userPoints = userData.points || 0;
    storeState.pointsSpent = userData.pointsSpent || 0;
    
    storeState.ownedCharacters = userData.ownedCharacters && userData.ownedCharacters.length > 0 
      ? [...userData.ownedCharacters] 
      : ['char_emoji_1', 'char_emoji_2'];
    storeState.ownedBackgrounds = userData.ownedBackgrounds && userData.ownedBackgrounds.length > 0 
      ? [...userData.ownedBackgrounds] 
      : ['bg_plain_1', 'bg_plain_2'];
    
    if (userData.currentCharacter) {
      const charMatch = STORE_DATA.characters.find(c => 
        c.emoji === userData.currentCharacter || c.image === userData.currentCharacter
      );
      storeState.currentCharacter = charMatch ? charMatch.id : 'char_emoji_1';
    } else {
      storeState.currentCharacter = 'char_emoji_1';
    }
    
    // Background is always default on load (session only)
    storeState.currentBackground = 'bg_plain_1';
  }
  renderStore();
}

function renderStore() {
  const app = document.getElementById('storeContent');
  if (!app) return;
  
  app.innerHTML = `
    ${renderHeader()}
    ${renderContent()}
    ${storeState.showPurchaseModal ? renderPurchaseModal() : ''}
    ${storeState.showNotEnoughModal ? renderNotEnoughModal() : ''}
  `;
  
  attachEventListeners();
}

function renderHeader() {
  const currentChar = STORE_DATA.characters.find(c => c.id === storeState.currentCharacter);
  const currentBg = STORE_DATA.backgrounds.find(b => b.id === storeState.currentBackground);
  
  return `
    <div class="store-header">
      <div class="store-bg" style="background-image: url('${currentBg?.image}')"></div>
      <div class="store-overlay"></div>
      <div class="store-preview-content">
        <div style="text-align: center;">
          <div class="preview-avatar">
            <img src="${currentChar?.image}" alt="Current character">
          </div>
          <div class="preview-points">
            <div class="points-content">
              <svg class="star-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="points-text">${storeState.userPoints} Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderContent() {
  return `
    <div class="store-container">
      <div class="store-title-section">
        <h1 class="store-title">
          <svg class="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Addy Store
        </h1>
        <p class="store-subtitle">Purchase amazing characters and backgrounds with the points you've earned!</p>
      </div>
      
      ${renderTabs()}
      ${renderFilters()}
      ${renderItemsGrid()}
    </div>
  `;
}

function renderTabs() {
  const counts = {
    characters: storeState.ownedCharacters.length + '/' + STORE_DATA.characters.length,
    backgrounds: storeState.ownedBackgrounds.length + '/' + STORE_DATA.backgrounds.length
  };
  
  return `
    <div class="store-tabs">
      <button class="tab-button ${storeState.activeTab === 'characters' ? 'active' : ''}" data-tab="characters">
        Characters (${counts.characters})
      </button>
      <button class="tab-button ${storeState.activeTab === 'backgrounds' ? 'active' : ''}" data-tab="backgrounds">
        Backgrounds (${counts.backgrounds})
      </button>
    </div>
  `;
}

function renderFilters() {
  const tiers = ['all', 'legendary', 'premium', 'rare', 'common'];
  const tierNames = {
    all: 'All',
    legendary: 'Legendary',
    premium: 'Premium',
    rare: 'Rare',
    common: 'Common'
  };
  
  return `
    <div class="filter-section">
      ${tiers.map(tier => `
        <button class="filter-button ${tier} ${storeState.filter === tier ? 'active' : ''}" data-filter="${tier}">
          ${tierNames[tier]}
        </button>
      `).join('')}
    </div>
  `;
}

function renderItemsGrid() {
  const items = getFilteredItems();
  
  return `
    <div class="items-grid">
      ${items.map(item => renderItemCard(item)).join('')}
    </div>
  `;
}

function getFilteredItems() {
  const items = storeState.activeTab === 'characters' ? STORE_DATA.characters : STORE_DATA.backgrounds;
  if (storeState.filter === 'all') return items;
  return items.filter(item => item.tier === storeState.filter);
}

function renderItemCard(item) {
  const isOwned = storeState.activeTab === 'characters' 
    ? storeState.ownedCharacters.includes(item.id)
    : storeState.ownedBackgrounds.includes(item.id);
  
  const isCurrent = storeState.activeTab === 'characters'
    ? storeState.currentCharacter === item.id
    : storeState.currentBackground === item.id;
  
  const canAfford = storeState.userPoints >= item.price;
  const isLocked = !isOwned && !canAfford;
  
  const tierNames = {
    legendary: 'Legendary',
    premium: 'Premium',
    rare: 'Rare',
    common: 'Common'
  };
  
  let statusText = '';
  let statusClass = '';
  if (isCurrent) {
    statusText = 'Active';
    statusClass = 'current';
  } else if (isOwned) {
    statusText = 'Click to Activate';
    statusClass = 'owned';
  } else if (canAfford) {
    statusText = 'Click to Purchase';
    statusClass = 'available';
  } else {
    statusText = 'Locked';
    statusClass = 'locked';
  }
  
  let imageContent = '';
  if (storeState.activeTab === 'characters') {
    if (item.emoji) {
      imageContent = `<div class="emoji-display">${item.emoji}</div>`;
    } else if (item.image) {
      imageContent = `<img src="${item.image}" alt="${item.name}">`;
    }
  } else {
    if (item.color) {
      imageContent = `<div class="color-display" style="background: ${item.color};"></div>`;
    } else if (item.gradient) {
      imageContent = `<div class="color-display" style="background: ${item.gradient};"></div>`;
    } else if (item.image) {
      imageContent = `<img src="${item.image}" alt="${item.name}">`;
    }
  }
  
  return `
    <div class="item-card ${isCurrent ? 'current' : ''} ${isOwned ? 'owned' : ''} ${isLocked ? 'locked' : ''}" 
         data-item-id="${item.id}">
      <div class="item-image ${isLocked ? 'blurred' : ''}">
        ${imageContent}
        ${isLocked ? `
          <div class="lock-overlay">
            <svg class="lock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        ` : ''}
        ${isCurrent ? `
          <div class="badge current">
            <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Active
          </div>
        ` : isOwned ? `
          <div class="badge owned">
            <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Owned
          </div>
        ` : ''}
      </div>
      <div class="item-info">
        <div class="tier-badge ${item.tier}">${tierNames[item.tier]}</div>
        <h3 class="item-name">${item.name}</h3>
        <div class="item-footer">
          <div class="item-price">
            <svg class="price-star" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="price-value">${item.price}</span>
          </div>
          <span class="item-status ${statusClass}">${statusText}</span>
        </div>
      </div>
    </div>
  `;
}

function renderPurchaseModal() {
  if (!storeState.selectedItem) return '';
  
  const item = storeState.selectedItem;
  const itemType = storeState.activeTab === 'characters' ? 'character' : 'background';
  
  let previewContent = '';
  let modalBgStyle = '';
  
  if (storeState.activeTab === 'characters') {
    if (item.emoji) {
      previewContent = `<div class="modal-emoji-preview">${item.emoji}</div>`;
    } else if (item.image) {
      previewContent = `<img src="${item.image}" alt="${item.name}" class="modal-image">`;
    }
  } else {
    if (item.color) {
      previewContent = `<div class="modal-bg-preview" style="background: ${item.color};"></div>`;
      modalBgStyle = `style="background: ${item.color};"`;
    } else if (item.gradient) {
      previewContent = `<div class="modal-bg-preview" style="background: ${item.gradient};"></div>`;
      modalBgStyle = `style="background: ${item.gradient};"`;
    } else if (item.image) {
      previewContent = `<img src="${item.image}" alt="${item.name}" class="modal-image">`;
      modalBgStyle = `style="background: url('${item.image}'); background-size: cover; background-position: center; opacity: 0.3;"`;
    }
  }
  
  return `
    <div class="modal" ${modalBgStyle}>
      <div class="modal-content">
        <h3 class="modal-header">Purchase ${item.name}</h3>
        <div class="modal-body">
          ${previewContent}
          <p class="modal-text">Do you want to purchase this ${itemType}?</p>
          <p class="modal-item-name">${item.name}</p>
          <div class="modal-price">
            <svg class="price-star" style="width: 1.5rem; height: 1.5rem;" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span style="font-weight: bold; font-size: 1.5rem;">${item.price} Points</span>
          </div>
          <p class="modal-remaining">You will have: ${storeState.userPoints - item.price} Points left</p>
        </div>
        <div class="modal-buttons">
          <button class="modal-button cancel" onclick="closePurchaseModal()">Return</button>
          <button class="modal-button confirm" onclick="confirmPurchase()">Buy</button>
        </div>
      </div>
    </div>
  `;
}

function renderNotEnoughModal() {
  if (!storeState.selectedItem) return '';
  
  const item = storeState.selectedItem;
  const itemType = storeState.activeTab === 'characters' ? 'character' : 'background';
  const shortage = item.price - storeState.userPoints;
  
  return `
    <div class="modal">
      <div class="modal-content">
        <div class="modal-body">
          <div class="error-icon-container">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="error-title">Insufficient Points</h3>
          <p class="error-message">You don't have enough points for this ${itemType}</p>
          <div class="error-details">
            <p class="error-item-name">${item.name}</p>
            <div class="error-comparison">
              <div class="comparison-item">
                <div class="comparison-label">Required:</div>
                <div class="comparison-value required">
                  <svg style="width: 1.25rem; height: 1.25rem; fill: rgb(220, 38, 38);" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  ${item.price}
                </div>
              </div>
              <div class="comparison-item">
                <div class="comparison-label">You have:</div>
                <div class="comparison-value available">
                  <svg style="width: 1.25rem; height: 1.25rem; fill: rgb(234, 179, 8);" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  ${storeState.userPoints}
                </div>
              </div>
            </div>
            <p class="shortage-text">You need ${shortage} more points</p>
          </div>
          <p class="encouragement-text">Complete more tasks to earn points!</p>
        </div>
        <button class="modal-button close" onclick="closeNotEnoughModal()">Got it</button>
      </div>
    </div>
  `;
}

function attachEventListeners() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      storeState.activeTab = e.target.dataset.tab;
      renderStore();
    });
  });
  
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      storeState.filter = e.target.dataset.filter;
      renderStore();
    });
  });
  
  document.querySelectorAll('[data-item-id]').forEach(card => {
    card.addEventListener('click', () => {
      handleItemClick(card.dataset.itemId);
    });
  });
}

function handleItemClick(itemId) {
  const items = storeState.activeTab === 'characters' 
    ? STORE_DATA.characters : STORE_DATA.backgrounds;
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  
  const isOwned = storeState.activeTab === 'characters'
    ? storeState.ownedCharacters.includes(itemId)
    : storeState.ownedBackgrounds.includes(itemId);
  
  const isCurrent = storeState.activeTab === 'characters'
    ? storeState.currentCharacter === itemId
    : storeState.currentBackground === itemId;
  
  if (isOwned) {
    if (!isCurrent) {
      // FIXED: ONLY activate the item in the current tab
      if (storeState.activeTab === 'characters') {
        storeState.currentCharacter = itemId;
        // FIXED: Don't change currentBackground here
      } else {
        storeState.currentBackground = itemId;
        // FIXED: Don't change currentCharacter here
      }
      updateMainApp();
      renderStore();
    }
  } else if (storeState.userPoints >= item.price) {
    storeState.selectedItem = item;
    storeState.showPurchaseModal = true;
    renderStore();
  } else {
    storeState.selectedItem = item;
    storeState.showNotEnoughModal = true;
    renderStore();
  }
}

function closePurchaseModal() {
  storeState.showPurchaseModal = false;
  storeState.selectedItem = null;
  renderStore();
}

function closeNotEnoughModal() {
  storeState.showNotEnoughModal = false;
  storeState.selectedItem = null;
  renderStore();
}

function confirmPurchase() {
  if (!storeState.selectedItem) return;
  
  const item = storeState.selectedItem;
  
  // CRITICAL: Validate balance before purchase
  if (storeState.userPoints < item.price) {
    toast('Insufficient points!');
    storeState.showPurchaseModal = false;
    storeState.selectedItem = null;
    renderStore();
    return;
  }
  
  // FIXED: Update pointsSpent (tracked separately from earned points)
  storeState.pointsSpent += item.price;
  
  // FIXED: Calculate available points correctly
  storeState.userPoints = storeState.userPoints - item.price;
  
  if (storeState.activeTab === 'characters') {
    storeState.ownedCharacters.push(item.id);
    storeState.currentCharacter = item.id;
    // FIXED: Don't touch background here
  } else {
    storeState.ownedBackgrounds.push(item.id);
    storeState.currentBackground = item.id;
    // FIXED: Don't touch character here
  }
  
  storeState.showPurchaseModal = false;
  storeState.selectedItem = null;
  
  // FIXED: Update main app with atomic transaction
  updateMainApp();
  renderStore();
  
  if (typeof toast === 'function') {
    toast(`Purchased ${item.name}! ✨`);
  }
}

function updateMainApp() {
  if (typeof window.updateStoreDataInMainApp === 'function') {
    const currentChar = STORE_DATA.characters.find(c => c.id === storeState.currentCharacter);
    const currentBg = STORE_DATA.backgrounds.find(b => b.id === storeState.currentBackground);
    
    const updateData = {
      pointsSpent: storeState.pointsSpent, // FIXED: Track spent separately
      ownedCharacters: [...storeState.ownedCharacters],
      ownedBackgrounds: [...storeState.ownedBackgrounds],
      // FIXED: Only send character if it changed
      currentCharacter: currentChar ? (currentChar.emoji || currentChar.image || '•') : null,
      // FIXED: Only send background if it changed (and not default)
      currentBackground: storeState.activeTab === 'backgrounds' && currentBg 
        ? (currentBg.color || currentBg.gradient || currentBg.image || '#F8FAFC') 
        : undefined // Don't send if not actively changing background
    };
    
    window.updateStoreDataInMainApp(updateData);
  }
}

window.closePurchaseModal = closePurchaseModal;
window.closeNotEnoughModal = closeNotEnoughModal;
window.confirmPurchase = confirmPurchase;
window.initializeStore = initializeStore;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeStore();
  });
} else {
  initializeStore();
}