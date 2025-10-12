// Store Data
const STORE_DATA = {
  characters: [
    { id: 'char_1', name: 'Winnie the Pooh', image: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400', price: 500, tier: 'premium' },
    { id: 'char_2', name: 'Mickey Mouse', image: 'https://images.unsplash.com/photo-1566168051-48245ee5ba77?w=400', price: 500, tier: 'premium' },
    { id: 'char_3', name: 'Minnie Mouse', image: 'https://images.unsplash.com/photo-1601055903647-daf8b62d5e2c?w=400', price: 450, tier: 'premium' },
    { id: 'char_4', name: 'Iron Man Style', image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400', price: 800, tier: 'legendary' },
    { id: 'char_5', name: 'Captain America', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400', price: 750, tier: 'legendary' },
    { id: 'char_6', name: 'Spider-Man Style', image: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400', price: 700, tier: 'legendary' },
    { id: 'char_7', name: 'Teddy Bear', image: 'https://images.unsplash.com/photo-1551308370-3d1c7b7c4f1c?w=400', price: 250, tier: 'rare' },
    { id: 'char_8', name: 'Cute Puppy', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400', price: 200, tier: 'rare' },
    { id: 'char_9', name: 'Fluffy Kitten', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', price: 200, tier: 'rare' },
    { id: 'char_10', name: 'Princess Crown', image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400', price: 600, tier: 'premium' },
    { id: 'char_11', name: 'Royal Castle', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400', price: 550, tier: 'premium' },
    { id: 'char_12', name: 'Race Car Red', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', price: 300, tier: 'rare' },
    { id: 'char_13', name: 'Classic Car', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400', price: 350, tier: 'rare' },
    { id: 'char_14', name: 'Smiley Face', image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=400', price: 50, tier: 'common' },
    { id: 'char_15', name: 'Star Icon', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400', price: 50, tier: 'common' },
    { id: 'char_16', name: 'Heart Shape', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400', price: 75, tier: 'common' }
  ],
  backgrounds: [
    { id: 'bg_1', name: 'Magical Aurora', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920', price: 1000, tier: 'legendary' },
    { id: 'bg_2', name: 'Space Galaxy', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920', price: 900, tier: 'legendary' },
    { id: 'bg_3', name: 'Sunset Paradise', image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920', price: 850, tier: 'legendary' },
    { id: 'bg_4', name: 'Mountain View', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920', price: 600, tier: 'premium' },
    { id: 'bg_5', name: 'Ocean Waves', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920', price: 550, tier: 'premium' },
    { id: 'bg_6', name: 'Forest Path', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920', price: 500, tier: 'premium' },
    { id: 'bg_7', name: 'Cherry Blossom', image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920', price: 700, tier: 'premium' },
    { id: 'bg_8', name: 'City Skyline', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920', price: 350, tier: 'rare' },
    { id: 'bg_9', name: 'Desert Dunes', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920', price: 300, tier: 'rare' },
    { id: 'bg_10', name: 'Snowy Mountain', image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920', price: 400, tier: 'rare' },
    { id: 'bg_11', name: 'Soft Blue', image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920', price: 100, tier: 'common' },
    { id: 'bg_12', name: 'Pastel Pink', image: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1920', price: 100, tier: 'common' },
    { id: 'bg_13', name: 'Mint Green', image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920', price: 100, tier: 'common' },
    { id: 'bg_14', name: 'Light Gray', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920', price: 50, tier: 'common' },
    { id: 'bg_15', name: 'Cream Beige', image: 'https://images.unsplash.com/photo-1557683304-673a23048d34?w=1920', price: 50, tier: 'common' }
  ]
};

// Store State - will be synced with main app state
let storeState = {
  userPoints: 0,
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

// Initialize store with data from main app
function initializeStore(userData) {
  if (userData) {
    storeState.userPoints = userData.points || 0;
    storeState.ownedCharacters = userData.ownedCharacters || ['char_14', 'char_15'];
    storeState.ownedBackgrounds = userData.ownedBackgrounds || ['bg_14', 'bg_15'];
    storeState.currentCharacter = userData.currentCharacter || 'char_14';
    storeState.currentBackground = userData.currentBackground || 'bg_14';
  }
  renderStore();
}

// Render the entire store
function renderStore() {
  const app = document.getElementById('storeContent'); // שינוי מ-storeApp
  if (!app) return;
  
  app.innerHTML = `
    ${renderHeader()}
    ${renderContent()}
    ${storeState.showPurchaseModal ? renderPurchaseModal() : ''}
    ${storeState.showNotEnoughModal ? renderNotEnoughModal() : ''}
  `;
  
  attachEventListeners();
}

// Render header with preview
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

// Render main content
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

// Render tabs
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

// Render filters
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

// Render items grid
function renderItemsGrid() {
  const items = getFilteredItems();
  
  return `
    <div class="items-grid">
      ${items.map(item => renderItemCard(item)).join('')}
    </div>
  `;
}

// Get filtered items
function getFilteredItems() {
  const items = storeState.activeTab === 'characters' ? STORE_DATA.characters : STORE_DATA.backgrounds;
  if (storeState.filter === 'all') return items;
  return items.filter(item => item.tier === storeState.filter);
}

// Render item card
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
  
  return `
    <div class="item-card ${isCurrent ? 'current' : ''} ${isOwned ? 'owned' : ''} ${isLocked ? 'locked' : ''}" 
         data-item-id="${item.id}">
      <div class="item-image ${isLocked ? 'blurred' : ''}">
        <img src="${item.image}" alt="${item.name}">
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
            פעיל
          </div>
        ` : isOwned ? `
          <div class="badge owned">
            <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            בבעלותך
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

// Render purchase modal
function renderPurchaseModal() {
  if (!storeState.selectedItem) return '';
  
  const item = storeState.selectedItem;
  const itemType = storeState.activeTab === 'characters' ? 'character' : 'background';
  
  return `
    <div class="modal">
      <div class="modal-content">
        <h3 class="modal-header">Purchase Confirmation</h3>
        <div class="modal-body">
          <img src="${item.image}" alt="${item.name}" class="modal-image">
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
          <button class="modal-button cancel" onclick="closePurchaseModal()">Cancel</button>
          <button class="modal-button confirm" onclick="confirmPurchase()">Confirm Purchase</button>
        </div>
      </div>
    </div>
  `;
}

// Render not enough points modal
function renderNotEnoughModal() {
  if (!storeState.selectedItem) return '';
  
  const item = storeState.selectedItem;
  const itemType = storeState.activeTab === 'characters' ? 'characters' : 'backgrounds';
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
            <p class="shortage-text">חסרות לך ${shortage} נקודות</p>
          </div>
          <p class="encouragement-text">המשך להשלים משימות כדי לצבור עוד נקודות!</p>
        </div>
        <button class="modal-button close" onclick="closeNotEnoughModal()">הבנתי</button>
      </div>
    </div>
  `;
}

// Attach event listeners
function attachEventListeners() {
  // Tab buttons
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      storeState.activeTab = e.target.dataset.tab;
      renderStore();
    });
  });
  
  // Filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      storeState.filter = e.target.dataset.filter;
      renderStore();
    });
  });
  
  // Item cards
  document.querySelectorAll('[data-item-id]').forEach(card => {
    card.addEventListener('click', () => {
      handleItemClick(card.dataset.itemId);
    });
  });
}

// Handle item click
function handleItemClick(itemId) {
  const items = storeState.activeTab === 'characters' ? STORE_DATA.characters : STORE_DATA.backgrounds;
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  
  const isOwned = storeState.activeTab === 'characters'
    ? storeState.ownedCharacters.includes(itemId)
    : storeState.ownedBackgrounds.includes(itemId);
  
  if (isOwned) {
    // Equip the item
    if (storeState.activeTab === 'characters') {
      storeState.currentCharacter = itemId;
    } else {
      storeState.currentBackground = itemId;
    }
    updateMainApp();
    renderStore();
  } else if (storeState.userPoints >= item.price) {
    // Show purchase modal
    storeState.selectedItem = item;
    storeState.showPurchaseModal = true;
    renderStore();
  } else {
    // Show not enough points modal
    storeState.selectedItem = item;
    storeState.showNotEnoughModal = true;
    renderStore();
  }
}

// Close purchase modal
function closePurchaseModal() {
  storeState.showPurchaseModal = false;
  storeState.selectedItem = null;
  renderStore();
}

// Close not enough modal
function closeNotEnoughModal() {
  storeState.showNotEnoughModal = false;
  storeState.selectedItem = null;
  renderStore();
}

// Confirm purchase
function confirmPurchase() {
  if (!storeState.selectedItem) return;
  
  const item = storeState.selectedItem;
  storeState.userPoints -= item.price;
  
  if (storeState.activeTab === 'characters') {
    storeState.ownedCharacters.push(item.id);
    storeState.currentCharacter = item.id;
  } else {
    storeState.ownedBackgrounds.push(item.id);
    storeState.currentBackground = item.id;
  }
  
  storeState.showPurchaseModal = false;
  storeState.selectedItem = null;
  
  updateMainApp();
  renderStore();
}

// Update main app with store data
function updateMainApp() {
  if (window.updateStoreDataInMainApp) {
    window.updateStoreDataInMainApp({
      points: storeState.userPoints,
      ownedCharacters: storeState.ownedCharacters,
      ownedBackgrounds: storeState.ownedBackgrounds,
      currentCharacter: storeState.currentCharacter,
      currentBackground: storeState.currentBackground
    });
  }
}

// Make functions global
window.closePurchaseModal = closePurchaseModal;
window.closeNotEnoughModal = closeNotEnoughModal;
window.confirmPurchase = confirmPurchase;
window.initializeStore = initializeStore;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeStore();
  });
} else {
  initializeStore();
}