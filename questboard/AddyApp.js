/* ===========================
   Addy - Fixed app.js
   =========================== */

/** Global state **/
const state = {
  setup: { userType:null, businessType:null, personalPurpose:null, teams:[], categories:[] },
  avatars: [],
  teams: {},
  currentUserId: null,
  currentTeam: null,
  office: { posX:0, posY:0, speed:3, keys:{}, loopId:null, keydownHandler:null, keyupHandler:null, nearTeam:null },
  ui: { beltPaused:false },
  workspace: { id:null, type:null, login:null },
  companyEvents: [],
  
  // Temporary avatar data during creation
  tempAvatar: null,
  
  // Track points spent in store separately
  pointsSpent: 0
};

// ---- Workspace helpers ----
function buildEmptyWorkspace() {
  return {
    setup: { userType: null, businessType: null, personalPurpose: null, teams: [], categories: [] },
    avatars: [],
    teams: {},
    pointsSpent: 0
  };
}

function applyWorkspaceData(data) {
  const d = data || buildEmptyWorkspace();
  state.setup = JSON.parse(JSON.stringify(d.setup || { userType:null, businessType:null, personalPurpose:null, teams:[], categories:[] }));
  state.avatars = JSON.parse(JSON.stringify(d.avatars || []));
  state.teams = JSON.parse(JSON.stringify(d.teams || {}));
  state.companyEvents = JSON.parse(JSON.stringify(d.companyEvents || []));
  state.pointsSpent = d.pointsSpent || 0;
  state.currentUserId = null;
}

/* ===== Supabase ===== */
const SUPA_ON = !!(window.SUPABASE_URL && window.SUPABASE_ANON && window.supabase);

function getSupabaseClient() {
  if (!window._supaClient) {
    window._supaClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON);
  }
  return window._supaClient;
}

let currentWorkspaceName = "default";
const CLOUD_CACHE = "QB_workspace_cache_v1";
const cacheSet = d => { try{ localStorage.setItem(CLOUD_CACHE, JSON.stringify(d)); }catch{} };
const cacheGet = () => { try{ return JSON.parse(localStorage.getItem(CLOUD_CACHE)||"null"); }catch{ return null } };

async function cloudSignUp(email, password){
  if(!SUPA_ON) throw new Error("Supabase disabled");
  const { data, error } = await getSupabaseClient().auth.signUp({ email, password });
  if(error) throw error; 
  return data.user;
}

async function cloudSignIn(email, password){
  if(!SUPA_ON) throw new Error("Supabase disabled");
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  if(error) throw error;
  return data.user;
}

async function cloudSignOut(){
  if(!SUPA_ON) return;
  await getSupabaseClient().auth.signOut();
}

async function currentUser(){
  if(!SUPA_ON) return null;
  return (await getSupabaseClient().auth.getUser()).data.user;
}

async function loadWorkspaceFromCloud(name="default"){
  const user = await currentUser(); 
  if(!user) return null;
  const { data, error } = await getSupabaseClient()
    .from("workspaces")
    .select("id,name,data,updated_at")
    .eq("user_id", user.id)
    .eq("name", name)
    .maybeSingle();
  if(error) throw error;

  if(data){
    applyWorkspaceData(data.data);
    cacheSet(data.data);
    return data.data;
  }else{
    const empty = buildEmptyWorkspace();
    await saveWorkspaceToCloud(empty, name);
    applyWorkspaceData(empty);
    cacheSet(empty);
    return empty;
  }
}

async function saveWorkspaceToCloud(appState, name="default"){
  const user = await currentUser(); 
  if(!user) throw new Error("Not authenticated");
  const payload = { user_id: user.id, name, data: appState, updated_at: new Date().toISOString() };
  const { error } = await getSupabaseClient().from("workspaces").upsert(payload, { onConflict: "user_id,name" });
  if(error) throw error; 
  cacheSet(appState);
}

/** ==== Local Storage ==== **/
const LS_KEY = 'QB_workspaces_v1';
const LS_ACTIVE = 'QB_active_session_v1';

function saveActiveSession(session){
  localStorage.setItem(LS_ACTIVE, JSON.stringify(session || null));
}
function readActiveSession(){
  try { return JSON.parse(localStorage.getItem(LS_ACTIVE) || 'null'); }
  catch(e){ return null; }
}
function clearActiveSession(){ localStorage.removeItem(LS_ACTIVE); }

function readStore(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)||'{}'); } catch(e){ return {}; }
}
function writeStore(store){ localStorage.setItem(LS_KEY, JSON.stringify(store)); }
function generateId(prefix){ return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }

async function saveCurrentWorkspace(){
  if(!state.workspace.id) return;
  
  const data = {
    setup: state.setup,
    avatars: state.avatars,
    teams: state.teams,
    companyEvents: state.companyEvents || [],
    storeData: state.storeData || null,
    pointsSpent: state.pointsSpent || 0
  };
  
  console.log('💾 SAVING workspace - pointsSpent (bin):', state.pointsSpent);
  
  // שמור ל-localStorage (גיבוי מקומי)
  const store = readStore();
  store[state.workspace.id] = {
    id: state.workspace.id,
    type: state.workspace.type,
    login: state.workspace.login,
    data
  };
  writeStore(store);
  
  console.log('✅ Saved to localStorage. Verifying...');
  const verification = readStore();
  console.log('📋 Verified pointsSpent in storage:', verification[state.workspace.id]?.data?.pointsSpent);
  
  // שמור ל-Supabase
  if(SUPA_ON){
    try{
      await saveWorkspaceToCloud(data, currentWorkspaceName);
      console.log('☁️ Saved to Supabase');
    }catch(e){
      console.log('⚠️ Supabase save failed, but localStorage is saved');
    }
  }
}

function createWorkspace(type, username, password){
  const id = generateId('ws');
  state.workspace.id = id;
  state.workspace.type = type;
  state.workspace.login = { username, password };
  saveCurrentWorkspace();
  return id;
}

function hydrateFrom(ws){
  state.setup = JSON.parse(JSON.stringify(ws.data?.setup || { userType:null, businessType:null, personalPurpose:null, teams:[], categories:[] }));
  state.avatars = JSON.parse(JSON.stringify(ws.data?.avatars || []));
  state.teams = JSON.parse(JSON.stringify(ws.data?.teams || {}));
  state.companyEvents = JSON.parse(JSON.stringify(ws.data?.companyEvents || []));
  
  // CRITICAL: Load the "bin" (points spent)
  state.pointsSpent = ws.data?.pointsSpent || 0;
  console.log('📂 LOADING workspace - pointsSpent (bin) from storage:', state.pointsSpent);
  
  // Load store data with proper ownership info
  if (ws.data?.storeData) {
    state.storeData = {
      ownedCharacters: ws.data.storeData.ownedCharacters || ['char_emoji_1', 'char_emoji_2'],
      ownedBackgrounds: ws.data.storeData.ownedBackgrounds || ['bg_plain_1', 'bg_plain_2'],
      currentCharacter: ws.data.storeData.currentCharacter || '•',
      currentBackground: ws.data.storeData.currentBackground || null
    };
  } else {
    state.storeData = null;
  }
  
  state.currentUserId = null;
  state.currentTeam = null;
  state.office = { posX:0, posY:0, speed:3, keys:{}, loopId:null, keydownHandler:null, keyupHandler:null, nearTeam:null };
  state.ui = { beltPaused:false };
  state.workspace = { id: ws.id, type: ws.type, login: ws.login };
}



/** DOM helpers **/
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>{
  const elements = document.querySelectorAll(s);
  return elements ? Array.from(elements) : [];
};
const byId=(id)=>document.getElementById(id);

/** Screens **/
const screens={ 
  signup: byId('signupScreen'), 
  setup:byId('setupScreen'), 
  avatar:byId('avatarScreen'), 
  platform:byId('platformScreen'), 
  team:byId('teamScreen'),
  store: byId('storeScreen') 
};

function showScreen(k){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  if (screens[k]) {
    screens[k].classList.add('active');
  }
}

/* ===========================
   Setup Wizard
   =========================== */
const stepsOrder={ personal:['step1','step2b','step3b'], business:['step1','step2a','step3a'] };
let currentStepIndex=0;
function currentSteps(){ return stepsOrder[state.setup.userType||'personal']; }
function gotoStep(i){
  $$('.step').forEach(st=>st.classList.remove('active'));
  currentStepIndex=Math.max(0,Math.min(i,currentSteps().length-1));
  const stepId = currentSteps()[currentStepIndex];
  const stepEl = byId(stepId);
  if(stepEl) stepEl.classList.add('active');
  const prevBtn = byId('prevBtn');
  const nextBtn = byId('nextBtn');
  const progressFill = byId('progressFill');
  if(prevBtn) prevBtn.style.display=currentStepIndex===0?'none':'inline-flex';
  if(nextBtn) nextBtn.disabled=!isCurrentStepValid();
  if(progressFill) progressFill.style.width=((currentStepIndex+1)/currentSteps().length)*100+'%';
}

function isCurrentStepValid(){
  const id=currentSteps()[currentStepIndex];
  if(id==='step1') return !!state.setup.userType;
  if(id==='step2a') return !!state.setup.businessType;
  if(id==='step2b') return !!state.setup.personalPurpose;
  if(id==='step3a') return state.setup.teams.length>0;
  if(id==='step3b') return state.setup.categories.length>0;
  return true;
}

function previousStep(){ gotoStep(currentStepIndex-1); }

function nextStep(){
  if(!isCurrentStepValid()) return;
  const isLast = currentStepIndex===currentSteps().length-1;
  if(!isLast){ gotoStep(currentStepIndex+1); return; }

  // Last step completed
  if (state.setup.userType === 'business') {
    createWorkspace('business', null, null);
    saveCurrentWorkspace();
    renderPlatformForUser();
    showScreen('platform');
    toast('Business workspace created.');
    return;
  }

  // Personal: go to avatar creation
  prepareAvatarScreen(true);
  showScreen('avatar');
}




function selectOption(field,val,el){
  if(field==='userType'){ state.setup.userType=val; state.setup.businessType=null; state.setup.personalPurpose=null; }
  else if(field==='businessType'){ state.setup.businessType=val; }
  else if(field==='personalPurpose'){ state.setup.personalPurpose=val; }
  if(el?.parentElement){
    el.parentElement.querySelectorAll('.option-card').forEach(c=>c.classList.remove('selected'));
    el.classList.add('selected');
  }
  const nextBtn = byId('nextBtn'); if(nextBtn) nextBtn.disabled=!isCurrentStepValid();
}

function focusTagInput(){
  const inputs=$$('.tag-input');
  const active = inputs.find(i=>i.closest('.step')?.classList.contains('active'));
  active?.focus();
}

function createTag(label, container, onRemove){
  const tag=document.createElement('span'); tag.className='tag'; tag.textContent=label;
  const x=document.createElement('button'); x.className='tag-remove'; x.type='button'; x.textContent='×';
  x.addEventListener('click',()=>{
    if (container?.contains(tag)) container.removeChild(tag);
    onRemove?.();
    const nextBtn = byId('nextBtn'); if(nextBtn) nextBtn.disabled=!isCurrentStepValid();
  });
  tag.appendChild(x); container?.appendChild(tag);
}

function handleTeamInput(e){
  if(e.key==='Enter'){
    e.preventDefault();
    const v=e.target.value.trim(); if(!v) return;
    if(!state.setup.teams.includes(v)){
      state.setup.teams.push(v);
      createTag(v, byId('teamTags'), ()=>{ state.setup.teams=state.setup.teams.filter(t=>t!==v); });
    }
    e.target.value='';
    const nextBtn = byId('nextBtn'); if(nextBtn) nextBtn.disabled=!isCurrentStepValid();
  }
}

function handleCategoryInput(e){
  if(e.key==='Enter'){
    e.preventDefault();
    const v=e.target.value.trim(); if(!v) return;
    if(!state.setup.categories.includes(v)){
      state.setup.categories.push(v);
      createTag(v, byId('categoryTags'), ()=>{ state.setup.categories=state.setup.categories.filter(t=>t!==v); });
    }
    e.target.value='';
    const nextBtn = byId('nextBtn'); if(nextBtn) nextBtn.disabled=!isCurrentStepValid();
  }
}

/* ===========================
   Avatar Creation (TWO STEPS)
   =========================== */
const DEFAULT_AVATARS=['🧙‍♂️','🧛‍♀️','🤖','🧑‍🚀','🧟‍♂️','🧚‍♀️','🧜‍♀️','🧑‍🔬','🦸‍♂️','🦹‍♀️','🐉','🦺','🦄','🐵','🐸','🐯'];

function prepareAvatarScreen(isPersonalCreation=false){
  const isBiz = state.setup.userType==='business';
  
  // Reset temp avatar
  state.tempAvatar = null;
  
  // Show/hide team selection
  const group = byId('teamSelectionGroup');
  const select= byId('userTeam');
  if(group) group.style.display = isBiz ? 'block':'none';
  if(isBiz && select) {
    select.innerHTML = `<option value="">Select your team</option>` + 
      state.setup.teams.map(t=>`<option value="${t}">${t}</option>`).join('');
  }

  // Show step 1, hide step 2
  const step1 = byId('avatarStep1');
  const step2 = byId('avatarStep2');
  if(step1) step1.style.display = 'block';
  if(step2) step2.style.display = 'none';

  // Render avatar grid
  const grid=byId('avatarGrid'); 
  if(grid) {
    grid.innerHTML='';
    let selected=null;

    DEFAULT_AVATARS.forEach(emo=>{
      const el=document.createElement('div'); 
      el.className='avatar-option'; 
      el.textContent=emo;
      el.onclick=()=>{ 
        grid.querySelectorAll('.avatar-option').forEach(n=>n.classList.remove('selected')); 
        el.classList.add('selected'); 
        selected=emo; 
        if(state.tempAvatar) state.tempAvatar.emoji = selected;
      };
      grid.appendChild(el);
    });
    
    // Auto-select first avatar
    if(grid.firstChild) {
      grid.firstChild.classList.add('selected');
      selected = DEFAULT_AVATARS[0];
    }
  }

  // Back button
  const goBack = ()=>{ 
    if(state.avatars.length>0 || state.workspace.id){ 
      showScreen('platform'); 
      renderPlatformForUser(); 
    } else { 
      showScreen('setup'); 
      gotoStep(0); 
    } 
  };
  const avatarBackBtn = byId('avatarBackBtn');
  const cancelAvatarBtn = byId('cancelAvatarBtn');
  if(avatarBackBtn) avatarBackBtn.onclick = goBack;
  if(cancelAvatarBtn) avatarBackBtn.onclick = goBack;

  // STEP 1 Form
  const form1 = byId('avatarStep1Form');
  if(form1){
form1.onsubmit=(e)=>{
  e.preventDefault();
  const name=byId('userName')?.value.trim();
  const role=byId('jobTitle')?.value.trim() || 'Personal User';
  const team=isBiz ? byId('userTeam')?.value : null;
console.log('Selected team from dropdown:', team, 'isBiz:', isBiz);


  if(!name) { toast('Please enter your name'); return; }
  if(isBiz && !team) { toast('Please select your team'); return; }

  // Get selected emoji
const selectedEl = byId('avatarGrid')?.querySelector('.avatar-option.selected');
const emoji = selectedEl?.textContent?.trim() || DEFAULT_AVATARS[0];
console.log('Selected emoji:', emoji, 'Length:', emoji.length);
  // Store temp data
  state.tempAvatar = {
    id: generateId('avt'),
    name,
    role,
    emoji,
    team,
    isTeamLead: false
  };

  // Business: go to step 2 (credentials)
  // Personal: create avatar immediately
  if(isBiz){
    byId('avatarStep1').style.display = 'none';
    byId('avatarStep2').style.display = 'block';
  } else {
    // Personal: create immediately
    finishAvatarCreation(isPersonalCreation);
  }
};




  }

  // STEP 2 Form (Business only)
  const form2 = byId('avatarStep2Form');
  if(form2){
    form2.onsubmit=(e)=>{
      e.preventDefault();
      const email = byId('avatarEmail')?.value.trim();
      const pass = byId('avatarPassword')?.value;
      const username = byId('avatarUsername')?.value.trim() || email;
      
      if(!email || !pass){ 
        toast('Please enter email and password'); 
        return; 
      }
      
      if(pass.length < 8){
        toast('Password must be at least 8 characters');
        return;
      }
      
      // Check uniqueness
      if(state.avatars.some(a=>a.login?.email===email)){
        toast('Email already exists'); 
        return;
      }
      
      // Add login to temp avatar
      if(state.tempAvatar){
        state.tempAvatar.login = { email, password: pass, username };
      }
      
      finishAvatarCreation(false);
    };
  }

  // Back to step 1 button
  const backBtn = byId('backToStep1Btn');
  if(backBtn){
    backBtn.onclick = ()=>{
      byId('avatarStep2').style.display = 'none';
      byId('avatarStep1').style.display = 'block';
    };
  }
}

function finishAvatarCreation(isPersonalCreation){
  if(!state.tempAvatar) return;

  const avatar = state.tempAvatar;
  console.log('Creating avatar:', avatar);
  
  state.avatars.push(avatar);
  state.currentUserId = avatar.id;

  // Add to team
  if(avatar.team) {
    console.log('Avatar has team:', avatar.team);
    ensureTeamExists(avatar.team);
    console.log('Team before adding member:', JSON.stringify(state.teams[avatar.team]));
    
    if(!state.teams[avatar.team].members.includes(avatar.id)) {
      state.teams[avatar.team].members.push(avatar.id);
    }
    if(!state.teams[avatar.team].leadId){ 
      state.teams[avatar.team].leadId = avatar.id; 
      avatar.isTeamLead = true; 
    }
    console.log('Team after adding member:', JSON.stringify(state.teams[avatar.team]));
  } else {
    console.log('Avatar has NO team!');
  }

  // Personal first creation
  if(state.workspace.type==='personal' && !state.workspace.id){
    createWorkspace('personal', null, null);
    saveCurrentWorkspace();
    renderPlatformForUser(); 
    showScreen('platform'); 
    toast('Workspace created successfully');
    return;
  }

  // Save and go to platform
  saveCurrentWorkspace();
  renderPlatformForUser();
  showScreen('platform');
  toast('Avatar created successfully');
}




function ensureTeamExists(name){
  if(!state.teams[name]) {
    state.teams[name]={ name, members:[], tasks:[], events:[], leadId:null, awardedPoints:0 };
  }
}

/* ===========================
   Platform
   =========================== */
function renderPlatformForUser(){
  const u=getCurrentUser();
  
  // Apply saved background from storeData (persisted across sessions)
  try {
    if(u && state.storeData && state.storeData.currentBackground) {
      const officeMap = byId('officeMap');
      if(officeMap) {
        let styleEl = byId('office-bg-style');
        if(!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'office-bg-style';
          document.head.appendChild(styleEl);
        }
        
        const bgData = state.storeData.currentBackground;
        let bgStyle = '';
        if(bgData.startsWith('#')) {
          bgStyle = `background: ${bgData}; opacity: 0.85;`;
        } else if(bgData.startsWith('linear-gradient')) {
          bgStyle = `background: ${bgData}; opacity: 0.85;`;
        } else {
          bgStyle = `background: url('${bgData}'); background-size: cover; background-position: center; opacity: 0.85;`;
        }
        
        styleEl.textContent = `.office-map::before, .team-container::before { ${bgStyle} }`;
      }
    }
  } catch(e) {}
  
  


  // FIXED: Apply user's selected character emoji AND owned items from store
  if(u && state.storeData) {
    if(state.storeData.currentCharacter) {
      u.emoji = state.storeData.currentCharacter;
    }
  }
  
  // Update nav UI
  const navUserAvatar = byId('navUserAvatar');
  const navUserName = byId('navUserName');
  const navUserRole = byId('navUserRole');

  if(navUserAvatar) navUserAvatar.textContent=u?.emoji || '•';
  if(navUserName) navUserName.textContent=u?.name || (state.workspace.type==='business'?'Not signed in':'');

  // FIXED: Show points in nav header using state.pointsSpent
  if(navUserRole && u) {
    const earnedPoints = calculateUserPoints(u.id);
    const availablePoints = earnedPoints - (state.pointsSpent || 0);
    const roleText = u.role || '';
    navUserRole.innerHTML = `${roleText} <span style="color:#10B981;font-weight:800;margin-left:8px;">⭐ ${availablePoints} pts</span>`;
  } else if(navUserRole) {
    navUserRole.textContent = '';
  }

  // Render ALL avatars on screen in a horizontal line
  const map = byId('officeMap');
  if(map) {
    map.querySelectorAll('.user-character').forEach(c => c.remove());
    
    if(!state.office.avatarPositions) {
      state.office.avatarPositions = {};
    }
    
    const startX = 60;
    const startY = 500;
    const spacing = 100;
    
    state.avatars.forEach((avatar, idx) => {
      if(!state.office.avatarPositions[avatar.id]) {
        state.office.avatarPositions[avatar.id] = {
          x: startX + idx * spacing,
          y: startY
        };
      }
      
      const char = document.createElement('div');
      char.id = `char-${avatar.id}`;
      char.className = 'user-character';
      char.style.position = 'absolute';
      char.style.left = state.office.avatarPositions[avatar.id].x + 'px';
      char.style.top = state.office.avatarPositions[avatar.id].y + 'px';
      
      const ca = document.createElement('div');
      ca.className = 'character-avatar';
      const cn = document.createElement('div');
      cn.className = 'character-name';
      
      char.appendChild(ca);
      char.appendChild(cn);
      map.appendChild(char);
      
      if(ca) ca.textContent = avatar.emoji || '•';
      if(cn) cn.textContent = avatar.name || '';
      
      if(avatar.id === state.currentUserId) {
        char.style.outline = '3px solid #4F46E5';
        char.style.outlineOffset = '2px';
      }
    });
  }

  renderTeamRooms();
  renderSidebar();

  const createNewAvatarBtn = byId('createNewAvatarBtn');
  const employeeSignInBtn = byId('employeeSignInBtn');
  const createTeamBtn = byId('createTeamBtn');
  const signOutEmployeeBtn = byId('signOutEmployeeBtn');
  
  if(state.workspace.type==='personal'){
    if(createNewAvatarBtn) createNewAvatarBtn.style.display='none';
    if(employeeSignInBtn) employeeSignInBtn.style.display='none';
    if(createTeamBtn) createTeamBtn.style.display='none';
    if(signOutEmployeeBtn) signOutEmployeeBtn.style.display='none';
  }else{
    if(createNewAvatarBtn){
      createNewAvatarBtn.style.display='inline-flex';
      createNewAvatarBtn.onclick=()=>{ 
        stopOfficeControls(); 
        prepareAvatarScreen(false); 
        showScreen('avatar'); 
      };
    }
    if(employeeSignInBtn){
      employeeSignInBtn.style.display = state.currentUserId ? 'none' : 'inline-flex';
      employeeSignInBtn.onclick=()=>showEmployeeSignInModal();
    }
    if(signOutEmployeeBtn){
      signOutEmployeeBtn.style.display = state.currentUserId ? 'inline-flex' : 'none';
      signOutEmployeeBtn.onclick=()=>signOutEmployee();
    }
    if(createTeamBtn){
      createTeamBtn.style.display='inline-flex';
      createTeamBtn.onclick=()=>showCreateTeamModal();
    }
  }
  
  const signOutBtn = byId('signOutBtn');
  if (signOutBtn) signOutBtn.onclick = signOut;

  const topCompanyEventsBtn = byId('topCompanyEventsBtn');
  if(topCompanyEventsBtn && state.setup && state.setup.teams && state.setup.teams.length > 0) {
    topCompanyEventsBtn.style.display = 'inline-block';
    topCompanyEventsBtn.onclick = () => showCompanyEventsSimple();
  } else if(topCompanyEventsBtn) {
    topCompanyEventsBtn.style.display = 'none';
  }
  
  const addCompanyEventBtn = byId('addCompanyEventBtn');
  if(addCompanyEventBtn) {
    addCompanyEventBtn.onclick = () => showCompanyEventsSimple();
  }
  
  const openStoreBtn = byId('openStoreBtn');
  if(openStoreBtn) {
    openStoreBtn.onclick = () => openStore();
  }
  
  startOfficeControls();
}

function getCurrentUser(){ 
  return state.avatars.find(a=>a.id===state.currentUserId)||null; 
}

window.getCurrentUserId = function() {
  return state.currentUserId;
};

function calculateUserPoints(userId) {
  if (!userId) return 0;
  
  let totalPoints = 0;
  Object.values(state.teams).forEach(team => {
    const userTasks = team.tasks.filter(t => t.status === 'done' && t.assigneeId === userId);
    totalPoints += userTasks.reduce((sum, task) => sum + (task.points || 0), 0);
  });
  
  return totalPoints;
}

// Emit points update event for UI synchronization
function emitPointsUpdate(userId) {
  const event = new CustomEvent('points-updated', { 
    detail: { userId, points: calculateUserPoints(userId) } 
  });
  window.dispatchEvent(event);
}

function updateTeamPointsDisplay(){
  const u=getCurrentUser(); 
  let t=0;
  if(u?.team && state.teams[u.team]) t=state.teams[u.team].awardedPoints||0;
  const teamPoints = byId('teamPoints'); 
  if(teamPoints) teamPoints.textContent=t;
}

function renderTeamRooms(){
  const c=byId('teamRoomsContainer'); 
  if(!c) return;
  c.innerHTML='';
  
  const isPersonal = state.workspace.type === 'personal';
  const items = isPersonal ? state.setup.categories : state.setup.teams;
  
  if(!items || items.length === 0) return;
  
  const cols=Math.min(4,Math.max(2,Math.ceil(Math.sqrt(items.length||1))));
  const cellW=240, cellH=190, startX=60, startY=60;

  items.forEach((item,i)=>{
    if(!isPersonal) ensureTeamExists(item);
    const el=document.createElement('div'); 
    el.className='team-room'; 
    el.dataset.team=item;
    el.style.borderColor=['#4F46E5','#10B981','#F59E0B','#EF4444','#6366F1','#06B6D4'][i%6];
    
    // Calculate completion percentage
    const title=Object.assign(document.createElement('div'),{className:'room-header',textContent:item});
     const members=Object.assign(document.createElement('div'),{className:'room-members'});
    
if(!isPersonal && state.teams[item]) {
  // Don't show avatars in team boxes
}
    
const enter=Object.assign(document.createElement('div'),{className:'room-enter',textContent:'Press Enter'});
    el.append(title,members,enter);
    const r=Math.floor(i/cols), col=i%cols; 
    el.style.left=(startX+col*cellW)+'px'; 
    el.style.top=(startY+r*cellH)+'px';
    el.onclick=()=>openTeam(item);
    c.appendChild(el);
  });

}


function renderSidebar(){
  const isPersonal = state.workspace.type === 'personal';
  
  const sidePanel = byId('sidePanel');
  if(sidePanel) {
    sidePanel.style.display = isPersonal ? 'none' : 'block';
  }
  
  if(isPersonal) return;
  
    // Render company events in sidebar
  const companyEventsList = byId('sidebarCompanyEvents');
  if(companyEventsList) {
    if(!state.companyEvents || state.companyEvents.length === 0) {
      companyEventsList.innerHTML = '<div class="empty">No events yet</div>';
    } else {
      companyEventsList.innerHTML = state.companyEvents.map(ev => {
        const responses = ev.responses || {};
        const yesCount = Object.values(responses).filter(r => r === 'yes').length;
        
        return `
          <div class="event-item" data-event-id="${ev.id}" style="padding:8px;border:1px solid var(--color-border);border-radius:8px;margin-bottom:6px;cursor:pointer;background:#fff;">
            <div style="font-weight:600;font-size:13px;margin-bottom:2px;">${ev.name}</div>
            <div style="font-size:11px;color:#6b7280;">📅 ${ev.date || 'No date'}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px;">✅ ${yesCount} attending</div>
          </div>`;
      }).join('');
      
      // Add click handlers to open event details
      companyEventsList.querySelectorAll('.event-item').forEach(el => {
        el.onclick = () => {
          showCompanyEventsSimple();
        };
      });
    }
  }
  

  const teamList=byId('sidebarTeamList');
  if(teamList){
    // Calculate percentages for each team
    const teamsWithPercentage = state.setup.teams.map(t => {
      let percentage = 0;
      if(state.teams[t]) {
        const teamTasks = state.teams[t].tasks || [];
        const totalTasks = teamTasks.filter(task => task.status !== 'backlog').length;
        const doneTasks = teamTasks.filter(task => task.status === 'done').length;
        if(totalTasks > 0) {
          percentage = Math.round((doneTasks / totalTasks) * 100);
        }
      }
      return { name: t, percentage };
    });
    
    // Sort by percentage (highest first)
    teamsWithPercentage.sort((a, b) => b.percentage - a.percentage);
    
    teamList.innerHTML = teamsWithPercentage.map(t=>
      `<div class="team-item" data-team="${t.name}">
        <span>${t.name}</span>
        <span class="team-percentage">${t.percentage}%</span>
      </div>`
    ).join('') || `<div class="empty">No teams yet</div>`;
    
    teamList.querySelectorAll('.team-item').forEach(el=> el.onclick=()=>openTeam(el.dataset.team));
  }

  const search=byId('employeeSearch'), list=byId('sidebarEmployeeList');
  const refresh=()=>{
    const q=(search?.value||'').toLowerCase();
    const filtered=state.avatars.filter(a=>a.name.toLowerCase().includes(q));
    if(list){
      list.innerHTML = filtered.map(a=>`
        <div class="employee-item" data-id="${a.id}">
          <div class="emp-avatar">${a.emoji}</div>
          <div class="emp-info">
            <div class="emp-name">${a.name}${isLead(a)?' <span class="lead-star">⭐</span>':''}</div>
            <div class="emp-meta">${a.role}${a.team?' · '+a.team:''}</div>
          </div>
        </div>`).join('') || `<div class="empty">No employees</div>`;

list.querySelectorAll('.employee-item').forEach(el=> {
  el.onclick=()=>{
    openEmployeeProfile(el.dataset.id);
  };
});

}
  };
  if(search) search.oninput=refresh;
  refresh();
}

function isLead(avatar){
  const team = avatar.team && state.teams[avatar.team];
  const byIdLead = team && team.leadId === avatar.id;
  const role = (avatar.role||'').toLowerCase();
  const isByRole = /lead|manager|head|team\s*lead|boss/.test(role);
  return !!(byIdLead || isByRole);
}

function getTeamLead(teamName) {
  const team = state.teams[teamName];
  if(!team || !team.leadId) return null;
  return state.avatars.find(a => a.id === team.leadId);
}

function isTeamLeadOf(userId, teamName) {
  const team = state.teams[teamName];
  if(!team) return false;
  return team.leadId === userId;
}

function canEditEmployee(editorId, targetId) {
  // Can always edit yourself
  if(editorId === targetId) return true;
  
  const editor = state.avatars.find(a => a.id === editorId);
  const target = state.avatars.find(a => a.id === targetId);
  
  if(!editor || !target) return false;
  
  // If target has no team, anyone can edit themselves only
  if(!target.team) return editorId === targetId;
  
  // Team lead can edit members of their team
  return isTeamLeadOf(editorId, target.team);
}

function canManageTasks(userId, teamName) {
  const team = state.teams[teamName];
  if(!team) return false;
  
  // If no permissions set, only team lead can manage
  if(!team.taskPermissions) {
    return isTeamLeadOf(userId, teamName);
  }
  
  const perms = team.taskPermissions;
  
  // All employees can manage
  if(perms.type === 'all') return true;
  
  // Specific teams/users
  if(perms.type === 'specific') {
    const user = state.avatars.find(a => a.id === userId);
    if(!user || !user.team) return false;
    
    // Check if user's team is allowed
    const teamAllowed = perms.allowedTeams?.includes(user.team);
    if(!teamAllowed) return false;
    
    // Check if all members or specific user
    const teamPerms = perms.teamMembers?.[user.team];
    if(!teamPerms) return false;
    
    if(teamPerms === 'all') return true;
    if(Array.isArray(teamPerms)) return teamPerms.includes(userId);
  }
  
  return false;
}

// פותח מודל לניהול ההרשאות של צוות
function showTeamPermissionsModal(teamName) {
  const team = state.teams?.[teamName];
  const currentUser = getCurrentUser?.();

  if (!team) { toast('Team not found'); return; }
  if (!currentUser || !isTeamLeadOf?.(currentUser.id, teamName)) {
    toast('Only the team leader can manage permissions');
    return;
  }

  // ודא שיש אובייקט הרשאות צוותי (לא לשבור שמות שדות קיימים)
  team.taskPermissions = team.taskPermissions || {
    type: 'all',         // 'all' | 'specific'
    teams: [],           // שמות צוותים מורשים
    membersByTeam: {}    // { teamName: [memberIds] }
  };

  const modal = buildModal('Task Management Permissions', (body, close) => {

    const renderTeamCheckboxes = () => {
      const box = body.querySelector('#teamCheckboxes');
      if (!box) return;

      const teamNames = Object.keys(state.teams || {});
      box.innerHTML = teamNames.map(tn => {
        const checked = team.taskPermissions.teams.includes(tn) ? 'checked' : '';
        return `
          <label class="perm-chip">
            <input type="checkbox" class="team-checkbox" data-team="${tn}" ${checked}>
            <span>${tn}</span>
          </label>
        `;
      }).join('') || `<div class="muted">No teams found</div>`;
    };

    const renderMemberSelections = () => {
      const wrap = body.querySelector('#memberSelections');
      const teamBoxes = body.querySelector('#teamCheckboxes');
      if (!wrap || !teamBoxes) return;

      const selectedTeams = Array.from(
        teamBoxes.querySelectorAll('.team-checkbox:checked')
      ).map(cb => cb.dataset.team);

      wrap.innerHTML = selectedTeams.map(tn => {
        const t = state.teams[tn];
        if (!t || !Array.isArray(t.members)) return '';
        const chosen = team.taskPermissions.membersByTeam[tn] || [];
        const membersHtml = t.members.map(m => {
          const isChecked = chosen.includes(m.id) ? 'checked' : '';
          const role = m.role ? ` · ${m.role}` : '';
          return `
            <label class="member-chip">
              <input type="checkbox" class="member-checkbox" data-team="${tn}" data-member="${m.id}" ${isChecked}>
              <span>${m.name}${role}</span>
            </label>
          `;
        }).join('') || `<div class="muted">No members in ${tn}</div>`;

        return `
          <div class="team-members-group">
            <div class="group-title">${tn}</div>
            <div class="chips-row">${membersHtml}</div>
          </div>
        `;
      }).join('') || `<div class="muted">Select at least one team to choose members</div>`;
    };

    const render = () => {
      body.innerHTML = `
        <div class="perm-modal">
          <div class="field">
            <label for="permType" class="label">Permission scope</label>
            <select id="permType" class="select">
              <option value="all" ${team.taskPermissions.type === 'all' ? 'selected' : ''}>All team members can manage tasks</option>
              <option value="specific" ${team.taskPermissions.type === 'specific' ? 'selected' : ''}>Only specific teams/members…</option>
            </select>
          </div>

          <div id="specificPerms" style="display:${team.taskPermissions.type === 'specific' ? 'block' : 'none'}">
            <div class="section-title">Allowed Teams</div>
            <div id="teamCheckboxes" class="chips-row"></div>

            <div class="section-title">Allowed Members</div>
            <div id="memberSelections"></div>
          </div>

          <div class="modal-actions">
            <button id="closePerm" class="btn btn-light">Close</button>
            <button id="savePerm" class="btn btn-primary">Save</button>
          </div>
        </div>
      `;

      // רנדר ראשוני של רשימות
      renderTeamCheckboxes();
      renderMemberSelections();

      // האזנות – כולן יחסי ל-body
      body.querySelector('#permType')?.addEventListener('change', (e) => {
        const val = e.target.value;
        const specific = body.querySelector('#specificPerms');
        if (specific) specific.style.display = (val === 'specific') ? 'block' : 'none';
      });

      // שינוי בחירת צוותים → מרענן בחירת חברים
      body.querySelector('#teamCheckboxes')?.addEventListener('change', (e) => {
        const cb = e.target;
        if (!(cb instanceof HTMLInputElement) || !cb.classList.contains('team-checkbox')) return;

        const tn = cb.dataset.team;
        const idx = team.taskPermissions.teams.indexOf(tn);
        if (cb.checked) {
          if (idx === -1) team.taskPermissions.teams.push(tn);
          team.taskPermissions.membersByTeam[tn] = team.taskPermissions.membersByTeam[tn] || [];
        } else {
          if (idx !== -1) team.taskPermissions.teams.splice(idx, 1);
          delete team.taskPermissions.membersByTeam[tn];
        }
        renderMemberSelections();
      });

      // שינוי בחירת חברים
      body.querySelector('#memberSelections')?.addEventListener('change', (e) => {
        const cb = e.target;
        if (!(cb instanceof HTMLInputElement) || !cb.classList.contains('member-checkbox')) return;

        const tn = cb.dataset.team;
        const mid = cb.dataset.member;
        team.taskPermissions.membersByTeam[tn] = team.taskPermissions.membersByTeam[tn] || [];

        const list = team.taskPermissions.membersByTeam[tn];
        const i = list.indexOf(mid);
        if (cb.checked) {
          if (i === -1) list.push(mid);
        } else {
          if (i !== -1) list.splice(i, 1);
        }
      });

      // כפתורי סגירה ושמירה
      body.querySelector('#closePerm')?.addEventListener('click', close);

      body.querySelector('#savePerm')?.addEventListener('click', () => {
        const typeSel = body.querySelector('#permType');
        const typeVal = typeSel ? typeSel.value : 'all';

        // מרענן את האובייקט מתוך ה־UI
        const selectedTeams = Array.from(
          body.querySelectorAll('#teamCheckboxes .team-checkbox:checked')
        ).map(cb => cb.dataset.team);

        const membersByTeam = {};
        selectedTeams.forEach(tn => {
          const chosen = Array.from(
            body.querySelectorAll(`#memberSelections .member-checkbox[data-team="${tn}"]:checked`)
          ).map(cb => cb.dataset.member);
          membersByTeam[tn] = chosen;
        });

        team.taskPermissions.type = typeVal;
        team.taskPermissions.teams = selectedTeams;
        team.taskPermissions.membersByTeam = membersByTeam;

        saveCurrentWorkspace?.();
        toast('Permissions updated');
        close();
      });
    };

    render();
  });

  // אם buildModal לא מחבר אוטומטית – חבר; אם הוא כן, השורה הזו לא תזיק.
  if (!modal.isConnected) document.body.appendChild(modal);
}


function openEmployeeProfile(id){
  const a=state.avatars.find(x=>x.id===id); 
  if(!a) return;
  
  const currentUser = getCurrentUser();
  const canEdit = currentUser && canEditEmployee(currentUser.id, a.id);
  const isCurrentTeamLead = currentUser && a.team && isTeamLeadOf(currentUser.id, a.team);
  
  const teamLead = a.team ? getTeamLead(a.team) : null;
  
  const teamOptions = canEdit ? state.setup.teams.map(t => 
    `<option value="${t}" ${a.team === t ? 'selected' : ''}>${t}</option>`
  ).join('') : '';
  
  const modal=buildModal('Employee Profile',(body,close)=>{
    body.innerHTML=`
      <div class="modal-form">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="font-size:40px">${a.emoji}</div>
          <div>
            <div style="font-weight:600;font-size:16px;">${a.name}</div>
            <div style="color:#6b7280;font-size:12px;">ID: ${a.id}</div>
          </div>
        </div>
        
        <div class="profile-row"><span>Role</span><strong>${a.role}</strong></div>
        
        ${canEdit ? `
          <div class="form-group">
            <label class="form-label">Team</label>
            <select id="editTeam" class="form-control">
              <option value="">No Team</option>
              ${teamOptions}
            </select>
          </div>
        ` : `
          <div class="profile-row"><span>Team</span><strong>${a.team || 'No Team'}</strong></div>
        `}
        
        <div class="profile-row">
          <span>Team Lead</span>
          <strong>${teamLead ? `${teamLead.emoji} ${teamLead.name}` : 'No Team Lead'}</strong>
        </div>
        
        ${isCurrentTeamLead ? `
          <div class="form-group">
            <label class="form-label">Set as Team Leader</label>
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="setAsLead" ${a.id === state.teams[a.team]?.leadId ? 'checked' : ''} />
              <span>This employee is the team leader</span>
            </label>
          </div>
        ` : ''}
        
        <div class="modal-buttons">
          <button id="closeEmp" class="btn btn-secondary">Close</button>
          ${canEdit ? '<button id="saveEmp" class="btn btn-primary">Save Changes</button>' : ''}
        </div>
      </div>`;
    
    setTimeout(() => {
      const closeBtn = byId('closeEmp');
      const saveBtn = byId('saveEmp');
      
      if(closeBtn) closeBtn.onclick=close;
      
      if(saveBtn && canEdit) {
        saveBtn.onclick = () => {
          const newTeam = byId('editTeam')?.value;
          const setAsLead = byId('setAsLead')?.checked;
          
          // Remove from old team
          if(a.team && state.teams[a.team]) {
            state.teams[a.team].members = state.teams[a.team].members.filter(memberId => memberId !== a.id);
            
            // If was lead, remove lead status
            if(state.teams[a.team].leadId === a.id) {
              state.teams[a.team].leadId = null;
            }
          }
          
          // Update team
          a.team = newTeam || null;
          
          // Add to new team
          if(newTeam) {
            ensureTeamExists(newTeam);
            if(!state.teams[newTeam].members.includes(a.id)) {
              state.teams[newTeam].members.push(a.id);
            }
            
            // Set as lead if checked
            if(setAsLead && isCurrentTeamLead) {
              state.teams[newTeam].leadId = a.id;
            }
          }
          
          saveCurrentWorkspace();
          close();
          renderPlatformForUser();
          toast('Employee updated');
        };
      }
    }, 0);
  });
  document.body.appendChild(modal);
}

/* ===========================
   Office Movement
   =========================== */
function startOfficeControls(){
  const map=byId('officeMap');
  if(!map) return;
  
  stopOfficeControls();
  
  // Initialize positions for each avatar if not set
  if(!state.office.avatarPositions) {
    state.office.avatarPositions = {};
    const startX = 60, startY = 500, spacing = 100;
    state.avatars.forEach((avatar, idx) => {
      state.office.avatarPositions[avatar.id] = {
        x: startX + idx * spacing,
        y: startY
      };
    });
  }
  
  const keys=state.office.keys;
const kd=(e)=>{ 
  const k=norm(e.key); 
  if(!k && e.key !== 'Enter') return; 
  if(k) keys[k]=true; 
  if((k==='e' || e.key === 'Enter') && state.office.nearTeam){ 
    stopOfficeControls(); 
    openTeam(state.office.nearTeam); 
  } 
};
  const ku=(e)=>{ 
    const k=norm(e.key); 
    if(!k) return; 
    keys[k]=false; 
  };
  
  state.office.keydownHandler=kd; 
  state.office.keyupHandler=ku; 
  document.addEventListener('keydown',kd); 
  document.addEventListener('keyup',ku);

  const step=()=>{ 
    const currentUserId = state.currentUserId;
    if(!currentUserId) {
      state.office.loopId=requestAnimationFrame(step);
      return;
    }
    
    const s=state.office.speed; 
    let dx=0,dy=0; 
    if(keys.left)dx-=s; 
    if(keys.right)dx+=s; 
    if(keys.up)dy-=s; 
    if(keys.down)dy+=s;
    
    if(dx&&dy){ 
      const m=Math.sqrt(2); 
      dx/=m; 
      dy/=m; 
    }
    
    const mrg=30, w=map.clientWidth, h=map.clientHeight;
    const pos = state.office.avatarPositions[currentUserId];
    if(pos) {
      pos.x = clamp(pos.x + dx, mrg, w - mrg);
      pos.y = clamp(pos.y + dy, mrg, h - mrg);
      
      const ch = byId(`char-${currentUserId}`);
      if(ch) {
        ch.style.left = pos.x + 'px';
        ch.style.top = pos.y + 'px';
      }
    }
    
    near(); 
    state.office.loopId=requestAnimationFrame(step); 
  };
  step();



  function near(){
    const currentUserId = state.currentUserId;
    if(!currentUserId) return;
    
    const ch = byId(`char-${currentUserId}`);
    if(!ch) return;
    
    const rooms=$$('.team-room'); 
    const cr=ch.getBoundingClientRect(); 
    const mr=map.getBoundingClientRect();
    const cc={x:cr.left-mr.left+cr.width/2, y:cr.top-mr.top+cr.height/2}; 
    let best=null, dist=Infinity;
    
    rooms.forEach(rm=>{
      const rr=rm.getBoundingClientRect();
      const r={left:rr.left-mr.left, top:rr.top-mr.top, right:rr.right-mr.left, bottom:rr.bottom-mr.top};
      const dx=(cc.x<r.left)?(r.left-cc.x):(cc.x>r.right)?(cc.x-r.right):0;
      const dy=(cc.y<r.top)?(r.top-cc.y):(cc.y>r.bottom)?(cc.y-r.bottom):0;
      const d=Math.hypot(dx,dy); 
      const NEAR=28;
      const hint=rm.querySelector('.room-enter'); 
      if(hint) hint.style.opacity = d<=NEAR?'1':'0';
      if(d<dist){ dist=d; best = d<=NEAR ? rm : null; }
    });
    state.office.nearTeam = best ? best.dataset.team : null;
  }
}





function stopOfficeControls(){
  if(state.office.loopId){ 
    cancelAnimationFrame(state.office.loopId); 
    state.office.loopId=null; 
  }
  if(state.office.keydownHandler){ 
    document.removeEventListener('keydown',state.office.keydownHandler); 
    state.office.keydownHandler=null; 
  }
  if(state.office.keyupHandler){ 
    document.removeEventListener('keyup',state.office.keyupHandler); 
    state.office.keyupHandler=null; 
  }
  $$('.team-room .room-enter').forEach(e=>e.style.opacity='0');
}



function norm(k){
  if(!k) return null;
  const key = k.length===1 ? k.toLowerCase() : k;
  if(key==='ArrowLeft'||key==='a')return'left';
  if(key==='ArrowRight'||key==='d')return'right';
  if(key==='ArrowUp'||key==='w')return'up';
  if(key==='ArrowDown'||key==='s')return'down';
  if(key==='e')return'e';
  return null;
}

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

/* ===========================
   Team View (placeholder - keeping original logic)
   =========================== */
const STATUS_ORDER=['backlog','todo','in-progress','waiting','done'];

function openTeam(teamName){
  state.currentTeam=teamName;
  const isPersonal = state.workspace.type === 'personal';
  
  if(isPersonal) {
    ensureTeamExists(teamName);
  }
  
  const team=state.teams[teamName];
  if(!team) return;

  stopOfficeControls();

  // Show back button
const topBackBtn = byId('backToPlatform');
if(topBackBtn) {
  topBackBtn.style.display = 'inline-flex';
  topBackBtn.onclick = () => {
    showScreen('platform');
    renderPlatformForUser();
    updateTeamPointsDisplay();
    topBackBtn.style.display = 'none';
  };
}
  const tn = byId('teamName'); 
  if(tn) tn.textContent=teamName;
  
  // Show team lead
  const leadInfo = byId('teamLeadInfo');
  if(leadInfo) {
    const lead = getTeamLead(teamName);
    if(lead) {
      leadInfo.innerHTML = `<span style="font-size:14px;color:#6b7280;">Team Leader: <strong>${lead.emoji} ${lead.name}</strong></span>`;
    } else {
      leadInfo.innerHTML = `<span style="font-size:14px;color:#6b7280;">No team leader assigned</span>`;
    }
  }

  // Render team events (same as company events in sidebar)
  const eventsSection = byId('teamEventsSection');
  if(eventsSection) {
    if(!team.events || team.events.length === 0) {
      eventsSection.innerHTML = '<div class="empty">No events yet</div>';
    } else {
      eventsSection.innerHTML = team.events.map(ev => {
        const responses = ev.responses || {};
        const yesCount = Object.values(responses).filter(r => r === 'yes').length;
        
        return `
          <div class="event-item" data-event-id="${ev.id}" style="padding:8px;border:1px solid var(--color-border);border-radius:8px;margin-bottom:6px;cursor:pointer;background:#fff;">
            <div style="font-weight:600;font-size:13px;margin-bottom:2px;">${ev.name}</div>
            <div style="font-size:11px;color:#6b7280;">📅 ${ev.date || 'No date'}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px;">✅ ${yesCount} attending</div>
          </div>`;
      }).join('');
      
      // Add click handlers to open event details
      eventsSection.querySelectorAll('.event-item').forEach(el => {
        el.onclick = () => {
          showTeamEventsModal(teamName);
        };
      });
    }
  }

  const list=byId('teamMembersList');

  if (list) {
    list.innerHTML='';
    team.members.forEach(id=>{
      const a=state.avatars.find(v=>v.id===id);
      if(!a) return;
      
      // Calculate individual points from completed tasks
      let individualPoints = 0;
      const userCompletedTasks = team.tasks.filter(
        task => task.status === 'done' && task.assigneeId === a.id
      );
      individualPoints = userCompletedTasks.reduce((sum, task) => sum + (task.points || 0), 0);
      
      const card=document.createElement('div'); card.className='team-member';
      const av=document.createElement('div'); av.className='member-avatar'; av.textContent=a.emoji;
      const info=document.createElement('div'); info.className='member-info';
      const nm=document.createElement('div'); nm.className='member-name'; 
      nm.textContent=a.name+(isLead(a)?' ⭐':'')+(individualPoints > 0 ? ' • '+individualPoints+' pts' : '');
      const rl=document.createElement('div'); rl.className='member-role'; rl.textContent=a.role;
      info.append(nm,rl); card.append(av,info); list.appendChild(card);
    });
  }

  renderBoard(teamName);
  enableDnD(teamName);
  showScreen('team');

  setTimeout(() => {
    const addTaskBtn = byId('addTaskHeaderBtn');
    if (addTaskBtn) {
      addTaskBtn.onclick = (e) => {
        e.preventDefault();
        showAddTaskModal(teamName);
      };
    }
  }, 50);

  const eventsBtn = byId('teamEventsBtn');
  const eventsBtnText = byId('teamEventsBtnText');
  if(eventsBtn) eventsBtn.onclick=()=>showTeamEventsModal(teamName);
  if(eventsBtnText) eventsBtnText.textContent = `${teamName} Events`;

const backBtn = byId('backButton');
if(backBtn) backBtn.onclick=()=>{ 
  showScreen('platform'); 
  renderPlatformForUser(); 
  updateTeamPointsDisplay();
  const topBackBtn = byId('backToPlatform');
  if(topBackBtn) topBackBtn.style.display = 'none';
};

  const toggle = byId('beltToggle');
  if(toggle) {
    toggle.onclick = ()=>{
      state.ui.beltPaused = !state.ui.beltPaused;
      toggle.textContent = state.ui.beltPaused ? 'Play' : 'Pause';
      renderBacklogBelt(team);
      enableDnD(teamName);
    };
  }

  setTimeout(() => {
    const managePermsBtn = byId('managePermsBtn');
    if(managePermsBtn) {
      const currentUser = getCurrentUser();
      if(currentUser && isTeamLeadOf(currentUser.id, teamName)) {
        managePermsBtn.style.display = 'inline-flex';
        managePermsBtn.onclick = () => showTeamPermissionsModal(teamName);
      } else {
        managePermsBtn.style.display = 'none';
      }
    }
  }, 50);
}

function renderBoard(teamName){
  const team=state.teams[teamName];
  renderBacklogBelt(team);

  const buckets={
    'todo':byId('todoTasks'),
    'in-progress':byId('progressTasks'),
    'waiting':byId('waitingTasks'),
    'done':byId('doneTasks')
  };
  Object.values(buckets).forEach(el=>{ if(el) el.innerHTML=''; });
  const counts={todo:0,'in-progress':0,waiting:0,done:0};

  team.tasks.forEach(task=>{
    if(task.status==='backlog') return;
    const col=buckets[task.status]||buckets['todo']; if(!col) return;
    col.appendChild(renderTaskCard(task, team, false));
    counts[task.status]=(counts[task.status]||0)+1;
  });

  const todoCount = byId('todoCount');
  const progressCount = byId('progressCount');
  const waitingCount = byId('waitingCount');
  const doneCount = byId('doneCount');
  if(todoCount) todoCount.textContent=counts.todo||0;
  if(progressCount) progressCount.textContent=counts['in-progress']||0;
  if(waitingCount) waitingCount.textContent=counts.waiting||0;
  if(doneCount) doneCount.textContent=counts.done||0;
}

function renderBacklogBelt(team){
  const tasks = team.tasks.filter(t=>t.status==='backlog');
  const backlogCount = byId('backlogCount'); if(backlogCount) backlogCount.textContent = tasks.length;

  const viewport = byId('backlogBeltViewport');
  const track = byId('backlogBeltTrack');
  if(!viewport || !track) return;
  track.innerHTML='';

  tasks.forEach(t=> track.appendChild(renderTaskCard(t, team, true)));

  viewport.setAttribute('data-paused', String(state.ui.beltPaused));
}

function renderTaskCard(task, team, mini=false, isClone=false){
  const card=document.createElement('div');
  card.className='task-card task--status-'+(task.status||'backlog')+(mini?' task-mini':'');
  card.draggable=!isClone;
  card.dataset.taskId=task.id;
  if(isClone) {
    card.setAttribute('data-clone','1');
    card.style.pointerEvents = 'none';
  }

  const title=document.createElement('div'); title.className='task-title-lg'; title.textContent=task.title;
  const statusRow=document.createElement('div'); statusRow.className='task-status-row';
  const statusText=document.createElement('div'); statusText.className='task-status-text'; statusText.textContent='Status: '+prettyStatus(task.status);
  statusRow.appendChild(statusText);

  if(task.due){
    const d=document.createElement('span'); d.className='pill'; d.textContent='due: '+task.due;
    statusRow.appendChild(d);
  }
  if(task.assigneeRole && !task.assigneeId){
    const r=document.createElement('span'); r.className='pill'; r.textContent='for: '+task.assigneeRole;
    statusRow.appendChild(r);
  }

  if(task.status==='waiting'){ const b=document.createElement('span'); b.className='pill pill--warning'; b.textContent='Waiting senior'; statusRow.appendChild(b); }
  if(task.status==='done'){ const b=document.createElement('span'); b.className='pill pill--success'; b.textContent='Approved'; statusRow.appendChild(b); }

  if(!mini){
    const desc=document.createElement('div'); desc.className='task-description'; desc.textContent=task.description||'';
    card.append(title,statusRow,desc);
  } else {
    card.append(title,statusRow);
  }

  const footer=document.createElement('div'); footer.className='task-footer';
  const pts=document.createElement('div'); pts.className='task-points'; pts.textContent=`${task.points??0} pts`;
  const asg=document.createElement('div'); asg.className='task-assignee';
  const assignee=state.avatars.find(a=>a.id===task.assigneeId);
  asg.textContent=assignee?assignee.emoji:'•';
  if(task.assigneeRole && !assignee){ asg.title = 'Role: '+task.assigneeRole; }
  footer.append(pts,asg); card.appendChild(footer);

  const user=getCurrentUser();
if(task.status==='waiting' && user && isTeamLeadOf(user.id, team.name)){
  const btn=document.createElement('button'); 
  btn.className='approve-button'; 
  btn.textContent='Approve & Done';
  btn.onclick=(e)=>{
    e.stopPropagation();
    team.awardedPoints=(team.awardedPoints||0)+(task.points||0);
    task.status='done';
    
    // CRITICAL: Emit points update for immediate UI refresh
    if(task.assigneeId) {
      emitPointsUpdate(task.assigneeId);
    }
    
    saveCurrentWorkspace();
    renderBoard(team.name);
    enableDnD(team.name);
    showCelebration(task.points||0);
  };
  card.appendChild(btn);
}

  if(!isClone){
    card.onclick=(e)=>{
      if(e.target.classList.contains('approve-button')) return;
      showTaskDetailsModal(task, team);
    };
  }

  return card;
}

function prettyStatus(s){
  if(s==='backlog') return 'Backlog';
  if(s==='todo') return 'TODO';
  if(s==='in-progress') return 'In Progress';
  if(s==='waiting') return 'Waiting for approvment';
  if(s==='done') return 'Done';
  return s||'';
}

function enableDnD(teamName){
  const team=state.teams[teamName];
  const user=getCurrentUser();
  const isLeadUser = user && isLead(user);
  const isPersonal = state.workspace.type === 'personal';
  const backlogView = byId('backlogBeltViewport');
  
  if(backlogView) {
    backlogView.ondragover=(ev)=>{ ev.preventDefault(); backlogView.classList.add('drag-over'); };
    backlogView.ondragleave=()=> backlogView.classList.remove('drag-over');
    backlogView.ondrop=(ev)=>{
      ev.preventDefault(); backlogView.classList.remove('drag-over');
      const id=ev.dataTransfer?.getData('text/task-id'); const task=team.tasks.find(t=>t.id===id); if(!task) return;
      task.status='backlog'; 
      task.assigneeId = null;
      saveCurrentWorkspace(); renderBoard(teamName); enableDnD(teamName);
    };
  }

  [['todo','todoTasks'],['in-progress','progressTasks'],['waiting','waitingTasks'],['done','doneTasks']].forEach(([status,id])=>{
    const el=byId(id); if(!el) return;
    el.ondragover=(ev)=>{ ev.preventDefault(); el.classList.add('drag-over'); };
    el.ondragleave=()=> el.classList.remove('drag-over');
    el.ondrop=(ev)=>{
      ev.preventDefault(); el.classList.remove('drag-over');
      const taskId=ev.dataTransfer?.getData('text/task-id'); const task=team.tasks.find(t=>t.id===taskId); if(!task) return;
      const prev = task.status;

      if(prev==='waiting' && status==='done' && !isTeamLeadOf(user?.id, teamName)){ 
        toast('Only Team Lead can approve to Done.'); 
        return; 
      }

if(status==='todo' && !task.assigneeId && !isPersonal && team.members.length > 0){
  promptAssignMember(team, (memberId)=>{
    task.assigneeId = memberId;
    task.status = 'todo';
    saveCurrentWorkspace();
    renderBoard(teamName); enableDnD(teamName);
  }, ()=>{
    // Allow unassigned - don't revert status
    task.status = status;
    saveCurrentWorkspace();
    renderBoard(teamName); enableDnD(teamName);
  });
  return;
}

      if(status==='todo' && !task.assigneeId && isPersonal){
        task.assigneeId = state.currentUserId;
      }

      task.status=status;
      
      // Show celebration when moved to done
      if(status==='done' && prev!=='done'){
        showCelebration(task.points||0);
  
        // CRITICAL: Award points immediately
        if(user && task.assigneeId === user.id) {
          emitPointsUpdate(user.id);
        }
      }
      
      saveCurrentWorkspace();
      renderBoard(teamName);
      enableDnD(teamName);
    };
  });

  $$('.task-card').forEach(card=>{
    const isClone = card.getAttribute('data-clone')==='1';
    if(!isClone) {
      card.ondragstart=(ev)=>{ ev.dataTransfer?.setData('text/task-id', card.dataset.taskId); setTimeout(()=>card.classList.add('dragging'),0); };
      card.ondragend=()=> card.classList.remove('dragging');
    }
  });
}

function showAddTaskModal(teamName, targetStatus = 'backlog'){
  const currentUser = getCurrentUser();
  if(!currentUser || !canManageTasks(currentUser.id, teamName)) {
    toast('You do not have permission to add tasks');
    return;
  }

  ensureTeamExists(teamName);
  const team=state.teams[teamName];
  const isPersonal = state.workspace.type === 'personal';

console.log('Team members:', team.members);
console.log('All avatars:', state.avatars);
state.avatars.forEach(a => console.log('Avatar:', a.name, 'Team:', a.team, 'ID:', a.id));

const memberOptions = !isPersonal ? team.members.map(id=>{
  const a=state.avatars.find(v=>v.id===id);
  console.log('Looking for avatar with id:', id, 'Found:', a);
  const nm = a ? a.name : id;
  return `<option value="${id}">${nm}</option>`;
}).join('') : '';

console.log('Member options HTML:', memberOptions);

  const assigneeSection = !isPersonal ? `
    <div class="form-group">
      <label>Assignee (optional)</label>
      <select id="taskAssignee" class="form-control">
        <option value="">— Choose member (optional) —</option>
        ${memberOptions}
      </select>
    </div>

    <div class="form-group">
      <label>Or by Role (optional)</label>
      <input id="taskAssigneeRole" class="form-control" placeholder="e.g., QA, Team Lead, Designer" />
    </div>` : '';

  const modal=buildModal('Add New Task',(body,close)=>{
    body.innerHTML=`
      <form id="addTaskForm" class="modal-form">
        <div class="form-group">
          <label>Task Title</label>
          <input id="taskTitle" class="form-control" required />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="taskDescription" class="form-control" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Due date</label>
          <input id="taskDue" type="date" class="form-control" />
        </div>

        ${assigneeSection}

        <div class="form-group">
          <label>Priority</label>
          <select id="taskPriority" class="form-control">
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div class="form-group">
          <label>Points</label>
          <input id="taskPoints" type="number" class="form-control" min="1" max="500" value="10" />
        </div>

<div class="modal-buttons">
  <button type="button" id="cancelAssign" class="btn btn-secondary">Cancel</button>
  <button type="button" id="skipAssign" class="btn btn-secondary">Skip (Unassigned)</button>
  <button type="submit" class="btn btn-primary">Assign</button>
</div>
      </form>`;

    setTimeout(() => {
      const cancelBtn = byId('cancelBtn'); if (cancelBtn) cancelBtn.onclick = close;

      const addTaskForm = byId('addTaskForm');
      if (addTaskForm) {
        addTaskForm.onsubmit = (e) => {
          e.preventDefault();
          const title = byId('taskTitle')?.value.trim();
          if(!title){ toast('Please enter task title'); return; }

          const chosenAssignee = !isPersonal ? (byId('taskAssignee')?.value || null) : state.currentUserId;
          const roleText = !isPersonal ? (byId('taskAssigneeRole')?.value.trim() || null) : null;

          const task={
            id:'tsk_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
            title,
            description:byId('taskDescription')?.value.trim() || '',
            priority:byId('taskPriority')?.value || 'medium',
            points:Number(byId('taskPoints')?.value)||0,
            due: byId('taskDue')?.value || null,
            assigneeId: chosenAssignee,
            assigneeRole: roleText,
            status: targetStatus
          };

          team.tasks.push(task);
          saveCurrentWorkspace();
          close();
          renderBoard(teamName);
          enableDnD(teamName);
        };
      }
    }, 0);
  });
  document.body.appendChild(modal);
}

function showAddTaskToColumnModal(targetStatus){ 
  showAddTaskModal(state.currentTeam, targetStatus); 
}

function promptAssignMember(team, onAssign, onCancel){
  const modal=buildModal('Assign Task',(body,close)=>{
    const options = team.members.map(id=>{
      const a=state.avatars.find(v=>v.id===id);
      return `<label class="assign-row"><input type="radio" name="assignee" value="${id}"><span>${a?.name||id}</span></label>`;
    }).join('') || '<div>No members</div>';
    body.innerHTML=`
      <form id="assignForm" class="modal-form">
        <div class="form-group">
          <label>Select member</label>
          <div class="assign-list">${options}</div>
        </div>
        <div class="modal-buttons">
          <button type="button" id="cancelAssign" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Assign</button>
        </div>
      </form>`;

    setTimeout(() => {
const cancelAssignBtn = byId('cancelAssign');
if(cancelAssignBtn) cancelAssignBtn.onclick=()=>{ close(); onCancel?.(); };

const skipAssignBtn = byId('skipAssign');
if(skipAssignBtn) skipAssignBtn.onclick=()=>{ close(); onAssign?.(null); };

const assignForm = byId('assignForm');
if(assignForm) {
  assignForm.onsubmit=(e)=>{
          e.preventDefault();
          const chosen = body.querySelector('input[name="assignee"]:checked')?.value;
          if(!chosen) return;
          close();
          onAssign?.(chosen);
        };
      }
    }, 0);
  });
  document.body.appendChild(modal);
}

function showTaskDetailsModal(task, team){
  const assignee = state.avatars.find(a=>a.id===task.assigneeId);
  const dueSection = task.due ? `
    <div class="task-detail-section">
      <label class="task-detail-label">Due Date</label>
      <p class="task-detail-text">${task.due}</p>
    </div>` : '';

  const modal=buildModal('Task Details',(body,close)=>{
    body.innerHTML=`
      <div class="modal-form">
        <div class="task-detail-header">
          <h3 class="task-detail-title">${task.title}</h3>
          <span class="task-detail-status">${prettyStatus(task.status)}</span>
        </div>
        <div class="task-detail-section">
          <label class="task-detail-label">Description</label>
          <p class="task-detail-text">${task.description || 'No description'}</p>
        </div>
        <div class="task-detail-row">
          <div class="task-detail-section">
            <label class="task-detail-label">Points</label>
            <p class="task-detail-text">${task.points || 0}</p>
          </div>
          <div class="task-detail-section">
            <label class="task-detail-label">Priority</label>
            <p class="task-detail-text">${task.priority || 'medium'}</p>
          </div>
        </div>
        ${dueSection}
        <div class="task-detail-section">
          <label class="task-detail-label">Assigned To</label>
          <p class="task-detail-text">
            ${assignee ? `${assignee.emoji} ${assignee.name}` : (task.assigneeRole ? `Role: ${task.assigneeRole}` : 'Unassigned')}
          </p>
        </div>
        <div class="modal-buttons">
          <button id="closeTaskBtn" class="btn btn-secondary">Close</button>
          <button id="deleteTaskBtn" class="btn btn-danger">Delete Task</button>
        </div>
      </div>`;

    setTimeout(() => {
      const closeBtn = byId('closeTaskBtn'); if(closeBtn) closeBtn.onclick = close;
      const deleteBtn = byId('deleteTaskBtn');
      if(deleteBtn){
        deleteBtn.onclick=()=>{
          const currentUser = getCurrentUser();
          if(!currentUser || !canManageTasks(currentUser.id, team.name)) {
            toast('You do not have permission to delete tasks');
            return;
          }
          
          if(confirm(`Are you sure you want to delete "${task.title}"?`)){
            team.tasks = team.tasks.filter(t => t.id !== task.id);
            saveCurrentWorkspace();
            close();
            renderBoard(team.name);
            enableDnD(team.name);
            toast('Task deleted successfully');
          }
        };
      }
    }, 0);
  });
  document.body.appendChild(modal);
}

function showTeamEventsModal(teamName){
  const team=state.teams[teamName];
  
  // Initialize events array if it doesn't exist
  if(!team.events) team.events = [];
  
  const modal=buildModal(`${teamName} Events`,(body,close)=>{
    const render=()=>{
      const list=byId('eventsListDyn');
      if(list) {
        if(team.events.length === 0) {
          list.innerHTML = `<div style="color:#6b7280;text-align:center;padding:20px;">No events yet.</div>`;
        } else {
          list.innerHTML = '';
          team.events.forEach(ev => {
            const responses = ev.responses || {};
            const yesCount = Object.values(responses).filter(r => r === 'yes').length;
            const noCount = Object.values(responses).filter(r => r === 'no').length;
            const maybeCount = Object.values(responses).filter(r => r === 'maybe').length;
            
            const card = document.createElement('div');
            card.className = 'event-card';
            card.style.cssText = 'border:1px solid var(--color-border);border-radius:12px;padding:12px;margin-bottom:12px;background:#fff;';
            
            card.innerHTML = `
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                <div>
                  <h4 style="margin:0 0 4px 0;font-size:16px;">${ev.name}</h4>
                  <div style="font-size:12px;color:#6b7280;">📅 ${ev.date || 'No date set'}</div>
                </div>
                <button class="btn btn-danger btn-sm delete-event-btn" data-event-id="${ev.id}">Delete</button>
              </div>
              ${ev.description ? `<p style="margin:8px 0;font-size:14px;color:#374151;">${ev.description}</p>` : ''}
              ${ev.imageUrl ? `<img src="${ev.imageUrl}" style="max-width:100%;border-radius:8px;margin:8px 0;" alt="Event flyer"/>` : ''}
              <div style="margin-top:12px;padding-top:12px;border-top:1px solid #eef0f3;">
                <div style="font-size:13px;font-weight:600;margin-bottom:6px;">Responses:</div>
                <div style="display:flex;gap:12px;font-size:12px;margin-bottom:8px;">
                  <span>✅ Yes: ${yesCount}</span>
                  <span>❌ No: ${noCount}</span>
                  <span>🤔 Maybe: ${maybeCount}</span>
                </div>
                <div style="margin-top:8px;">
                  <button class="btn btn-sm rsvp-btn" data-event-id="${ev.id}" data-response="yes" style="background:#10B981;color:#fff;margin-right:6px;">Yes</button>
                  <button class="btn btn-sm rsvp-btn" data-event-id="${ev.id}" data-response="no" style="background:#EF4444;color:#fff;margin-right:6px;">No</button>
                  <button class="btn btn-sm rsvp-btn" data-event-id="${ev.id}" data-response="maybe" style="background:#F59E0B;color:#fff;">Maybe</button>
                </div>
              </div>`;
            
            list.appendChild(card);
          });
          
          // Attach delete handlers
          list.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.onclick = () => {
              const eventId = btn.getAttribute('data-event-id');
              team.events = team.events.filter(e => e.id !== eventId);
              saveCurrentWorkspace();
              render();
              toast('Event deleted');
            };
          });
          
          // Attach RSVP handlers
          list.querySelectorAll('.rsvp-btn').forEach(btn => {
            btn.onclick = () => {
              const eventId = btn.getAttribute('data-event-id');
              const response = btn.getAttribute('data-response');
              const userId = state.currentUserId;
              
              if(!userId) {
                toast('Please select a user first');
                return;
              }
              
              const event = team.events.find(e => e.id === eventId);
              if(event) {
                if(!event.responses) event.responses = {};
                event.responses[userId] = response;
                saveCurrentWorkspace();
                render();
                toast(`You responded: ${response.toUpperCase()}`);
              }
            };
          });
        }
      }
    };
    
    body.innerHTML=`
      <div class="modal-form">
        <div id="eventsListDyn" class="events-list" style="margin-bottom:16px;max-height:400px;overflow-y:auto;"></div>
        
        <div style="border-top:2px solid #eef0f3;padding-top:16px;">
          <h4 style="margin:0 0 12px 0;">Add New Event</h4>
          <div class="form-group">
            <label class="form-label">Event Name</label>
            <input id="eventName" class="form-control" placeholder="e.g., Team Building Day" required/>
          </div>
          
          <div class="form-group">
            <label class="form-label">Date</label>
            <input id="eventDate" type="date" class="form-control"/>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="eventDescription" class="form-control" rows="2" placeholder="Event details..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Image URL (optional)</label>
            <input id="eventImage" class="form-control" placeholder="https://example.com/flyer.jpg"/>
          </div>
          
          <div class="modal-buttons">
            <button id="cancelEvents" class="btn btn-secondary">Close</button>
            <button id="addEventBtn" class="btn btn-primary">Add Event</button>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const cancelEventsBtn = byId('cancelEvents');
      if(cancelEventsBtn) cancelEventsBtn.onclick=close;

      const addEventBtn = byId('addEventBtn');
      if(addEventBtn) {
        addEventBtn.onclick=()=>{
          const name=byId('eventName')?.value.trim();
          const date=byId('eventDate')?.value || '';
          const description=byId('eventDescription')?.value.trim() || '';
          const imageUrl=byId('eventImage')?.value.trim() || '';
          
          if(!name) {
            toast('Please enter event name');
            return;
          }
          
          team.events.push({
            id:'evt_'+Date.now(),
            name,
            date,
            description,
            imageUrl,
            responses: {}
          });
          
          byId('eventName').value='';
          byId('eventDate').value='';
          byId('eventDescription').value='';
          byId('eventImage').value='';
          
          saveCurrentWorkspace();
          render();
          toast('Event added successfully');
        };
      }
      render();
    }, 0);
  });
  document.body.appendChild(modal);
}



function showCompanyEventsSimple(){
  if(!state.companyEvents) state.companyEvents = [];
  
  const modal=buildModal('Company Events',(body,close)=>{
    const render=()=>{
      const list=byId('companyEventsListSimple');
      if(list) {
        if(state.companyEvents.length === 0) {
          list.innerHTML = `<div style="color:#6b7280;text-align:center;padding:20px;">No company events yet.</div>`;
        } else {
          list.innerHTML = '';
          state.companyEvents.forEach(ev => {
            const responses = ev.responses || {};
            const yesCount = Object.values(responses).filter(r => r === 'yes').length;
            const noCount = Object.values(responses).filter(r => r === 'no').length;
            const maybeCount = Object.values(responses).filter(r => r === 'maybe').length;
            
            const card = document.createElement('div');
            card.style.cssText = 'border:1px solid var(--color-border);border-radius:12px;padding:12px;margin-bottom:12px;background:#fff;';
            
            card.innerHTML = `
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                <div>
                  <h4 style="margin:0 0 4px 0;font-size:16px;">${ev.name}</h4>
                  <div style="font-size:12px;color:#6b7280;">📅 ${ev.date || 'No date set'}</div>
                </div>
                <button class="btn btn-danger btn-sm delete-company-event-btn" data-event-id="${ev.id}">Delete</button>
              </div>
              ${ev.description ? `<p style="margin:8px 0;font-size:14px;color:#374151;">${ev.description}</p>` : ''}
              ${ev.imageUrl ? `<img src="${ev.imageUrl}" style="max-width:100%;border-radius:8px;margin:8px 0;" alt="Event"/>` : ''}
              <div style="margin-top:12px;padding-top:12px;border-top:1px solid #eef0f3;">
                <div style="font-size:13px;font-weight:600;margin-bottom:6px;">Responses:</div>
                <div style="display:flex;gap:12px;font-size:12px;margin-bottom:8px;">
                  <span>✅ Yes: ${yesCount}</span>
                  <span>❌ No: ${noCount}</span>
                  <span>🤔 Maybe: ${maybeCount}</span>
                </div>
                <div style="margin-top:8px;">
                  <button class="btn btn-sm company-rsvp-btn" data-event-id="${ev.id}" data-response="yes" style="background:#10B981;color:#fff;margin-right:6px;">Yes</button>
                  <button class="btn btn-sm company-rsvp-btn" data-event-id="${ev.id}" data-response="no" style="background:#EF4444;color:#fff;margin-right:6px;">No</button>
                  <button class="btn btn-sm company-rsvp-btn" data-event-id="${ev.id}" data-response="maybe" style="background:#F59E0B;color:#fff;">Maybe</button>
                </div>
              </div>`;
            
            list.appendChild(card);
          });
          
          list.querySelectorAll('.delete-company-event-btn').forEach(btn => {
            btn.onclick = () => {
              const eventId = btn.getAttribute('data-event-id');
              state.companyEvents = state.companyEvents.filter(e => e.id !== eventId);
              saveCurrentWorkspace();
              renderSidebar();
              render();
              toast('Event deleted');
            };
          });
          
          list.querySelectorAll('.company-rsvp-btn').forEach(btn => {
            btn.onclick = () => {
              const eventId = btn.getAttribute('data-event-id');
              const response = btn.getAttribute('data-response');
              const userId = state.currentUserId;
              
              if(!userId) {
                toast('Please select a user first');
                return;
              }
              
              const event = state.companyEvents.find(e => e.id === eventId);
              if(event) {
                if(!event.responses) event.responses = {};
                event.responses[userId] = response;
                saveCurrentWorkspace();
                renderSidebar();
                render();
                toast(`You responded: ${response.toUpperCase()}`);
              }
            };
          });
        }
      }
    };
    
    body.innerHTML=`
      <div class="modal-form">
        <div id="companyEventsListSimple" class="events-list" style="margin-bottom:16px;max-height:400px;overflow-y:auto;"></div>
        
        <div style="border-top:2px solid #eef0f3;padding-top:16px;">
          <h4 style="margin:0 0 12px 0;">Add New Company Event</h4>
          <div class="form-group">
            <label class="form-label">Event Name</label>
            <input id="companyEventNameSimple" class="form-control" placeholder="e.g., Annual Party" required/>
          </div>
          
          <div class="form-group">
            <label class="form-label">Date</label>
            <input id="companyEventDateSimple" type="date" class="form-control"/>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="companyEventDescSimple" class="form-control" rows="2" placeholder="Event details..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Add invitation flyer (optional)</label>
            <input id="companyEventImageSimple" class="form-control" placeholder="Paste image URL (e.g., from imgur.com)"/>
            <div style="font-size:11px;color:#6b7280;margin-top:4px;">Upload your flyer to imgur.com or similar, then paste the link here</div>
          </div>
          
          <div class="modal-buttons">
            <button id="cancelCompanyEventsSimple" class="btn btn-secondary">Close</button>
            <button id="addCompanyEventBtnSimple" class="btn btn-primary">Add Event</button>
          </div>
        </div>
      </div>`;

    setTimeout(() => {
      const cancelBtn = byId('cancelCompanyEventsSimple');
      if(cancelBtn) cancelBtn.onclick=close;

      const addBtn = byId('addCompanyEventBtnSimple');
      if(addBtn) {
        addBtn.onclick=()=>{
          const name=byId('companyEventNameSimple')?.value.trim();
          const date=byId('companyEventDateSimple')?.value || '';
          const description=byId('companyEventDescSimple')?.value.trim() || '';
          const imageUrl=byId('companyEventImageSimple')?.value.trim() || '';
          
          if(!name) {
            toast('Please enter event name');
            return;
          }
          
          state.companyEvents.push({
            id:'evt_'+Date.now(),
            name,
            date,
            description,
            imageUrl,
            responses: {}
          });
          
          byId('companyEventNameSimple').value='';
          byId('companyEventDateSimple').value='';
          byId('companyEventDescSimple').value='';
          byId('companyEventImageSimple').value='';
          
          saveCurrentWorkspace();
          renderSidebar();
          render();
          toast('Company event added');
        };
      }
      render();
    }, 0);
  });
  document.body.appendChild(modal);
}

function showEnhancedCompanyEventsModal(){
  if(!state.companyEvents) state.companyEvents = [];
  
  const modal = buildModal('🎉 Company Events', (body, close) => {
    const render = () => {
      body.innerHTML = `
        <div style="max-height:70vh;overflow-y:auto;">
          <div id="eventsList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:20px;">
            ${state.companyEvents.length === 0 ? 
              '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#6b7280;"><div style="font-size:48px;margin-bottom:12px;">📅</div><div style="font-size:16px;">No events yet. Create your first company event!</div></div>' 
              : 
              state.companyEvents.map(ev => {
                const responses = ev.responses || {};
                const yesCount = Object.values(responses).filter(r => r === 'yes').length;
                const noCount = Object.values(responses).filter(r => r === 'no').length;
                const maybeCount = Object.values(responses).filter(r => r === 'maybe').length;
                const userResponse = state.currentUserId ? responses[state.currentUserId] : null;
                
                return `
                  <div class="event-card-fancy" data-event-id="${ev.id}" style="border:2px solid #e5e7eb;border-radius:16px;padding:16px;background:linear-gradient(135deg,#f8f9ff 0%,#fff 100%);cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden;">
                    <div style="position:absolute;top:-20px;right:-20px;font-size:60px;opacity:0.1;">🎊</div>
                    ${ev.imageUrl ? `<img src="${ev.imageUrl}" style="width:100%;height:150px;object-fit:cover;border-radius:12px;margin-bottom:12px;" alt="${ev.name}"/>` : ''}
                    <div style="position:relative;">
                      <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:800;color:#1f2937;">${ev.name}</h3>
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;color:#6b7280;font-size:13px;">
                        <span>📅</span>
                        <span>${ev.date || 'Date TBD'}</span>
                      </div>
                      ${ev.description ? `<p style="font-size:14px;color:#4b5563;margin:8px 0;line-height:1.5;">${ev.description.substring(0, 80)}${ev.description.length > 80 ? '...' : ''}</p>` : ''}
                      <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb;">
                        <div style="display:flex;gap:16px;font-size:12px;margin-bottom:8px;">
                          <span style="display:flex;align-items:center;gap:4px;"><strong style="color:#10B981;">${yesCount}</strong> ✅</span>
                          <span style="display:flex;align-items:center;gap:4px;"><strong style="color:#EF4444;">${noCount}</strong> ❌</span>
                          <span style="display:flex;align-items:center;gap:4px;"><strong style="color:#F59E0B;">${maybeCount}</strong> 🤔</span>
                        </div>
                        ${userResponse ? `<div style="font-size:11px;color:#6b7280;background:#f3f4f6;padding:4px 8px;border-radius:6px;display:inline-block;">Your RSVP: <strong>${userResponse.toUpperCase()}</strong></div>` : '<div style="font-size:11px;color:#6b7280;">Click to RSVP</div>'}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')
            }
          </div>
          
          <div style="border-top:2px solid #e5e7eb;padding-top:20px;margin-top:20px;">
            <button id="showAddEventForm" class="btn btn-primary" style="width:100%;padding:12px;font-size:16px;background:linear-gradient(135deg,#4F46E5,#7C3AED);border:none;">
              ✨ Create New Event
            </button>
            
            <div id="addEventForm" style="display:none;margin-top:16px;padding:20px;background:#f8f9ff;border-radius:12px;">
              <h4 style="margin:0 0 16px 0;">Create Company Event</h4>
              <div class="form-group">
                <label class="form-label">Event Name</label>
                <input id="newEventName" class="form-control" placeholder="e.g., Summer Party 2025" />
              </div>
              <div class="form-group">
                <label class="form-label">Date</label>
                <input id="newEventDate" type="date" class="form-control" />
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea id="newEventDesc" class="form-control" rows="3" placeholder="Tell everyone about this amazing event..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Image URL (optional)</label>
                <input id="newEventImage" class="form-control" placeholder="https://example.com/party.jpg" />
              </div>
              <div style="display:flex;gap:8px;margin-top:12px;">
                <button id="cancelAddEvent" class="btn btn-secondary" style="flex:1;">Cancel</button>
                <button id="submitAddEvent" class="btn btn-primary" style="flex:1;">Create Event</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Event card click handlers
      body.querySelectorAll('.event-card-fancy').forEach(card => {
        card.onclick = () => {
          const eventId = card.getAttribute('data-event-id');
          showEventDetailModal(eventId);
        };
        
        card.onmouseenter = () => {
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
          card.style.borderColor = '#4F46E5';
        };
        
        card.onmouseleave = () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'none';
          card.style.borderColor = '#e5e7eb';
        };
      });
      
      // Show/hide add form
      const showFormBtn = byId('showAddEventForm');
      const addForm = byId('addEventForm');
      const cancelBtn = byId('cancelAddEvent');
      
      if(showFormBtn) {
        showFormBtn.onclick = () => {
          if(addForm) {
            addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
            showFormBtn.textContent = addForm.style.display === 'none' ? '✨ Create New Event' : '❌ Cancel';
          }
        };
      }
      
      if(cancelBtn) {
        cancelBtn.onclick = () => {
          if(addForm) addForm.style.display = 'none';
          if(showFormBtn) showFormBtn.textContent = '✨ Create New Event';
        };
      }
      
      // Submit new event
      const submitBtn = byId('submitAddEvent');
      if(submitBtn) {
        submitBtn.onclick = () => {
          const name = byId('newEventName')?.value.trim();
          const date = byId('newEventDate')?.value || '';
          const description = byId('newEventDesc')?.value.trim() || '';
          const imageUrl = byId('newEventImage')?.value.trim() || '';
          
          if(!name) {
            toast('Please enter an event name');
            return;
          }
          
          state.companyEvents.push({
            id: 'evt_' + Date.now(),
            name,
            date,
            description,
            imageUrl,
            responses: {}
          });
          
          saveCurrentWorkspace();
          renderSidebar();
          render();
          toast('Event created! 🎉');
          
          if(addForm) addForm.style.display = 'none';
          if(showFormBtn) showFormBtn.textContent = '✨ Create New Event';
        };
      }
    };
    
    render();
  });
  
  document.body.appendChild(modal);
}

function showEventDetailModal(eventId) {
  const event = state.companyEvents.find(e => e.id === eventId);
  if(!event) return;
  
  const modal = buildModal(event.name, (body, close) => {
    const render = () => {
      const responses = event.responses || {};
      const yesCount = Object.values(responses).filter(r => r === 'yes').length;
      const noCount = Object.values(responses).filter(r => r === 'no').length;
      const maybeCount = Object.values(responses).filter(r => r === 'maybe').length;
      const userId = state.currentUserId;
      const userResponse = userId ? responses[userId] : null;
      
      body.innerHTML = `
        <div class="modal-form">
          ${event.imageUrl ? `<img src="${event.imageUrl}" style="width:100%;max-height:200px;object-fit:cover;border-radius:12px;margin-bottom:16px;" alt="${event.name}"/>` : ''}
          
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;color:#6b7280;">
            <span style="font-size:20px;">📅</span>
            <span style="font-size:16px;font-weight:600;">${event.date || 'Date TBD'}</span>
          </div>
          
          ${event.description ? `<p style="font-size:15px;line-height:1.6;color:#374151;margin-bottom:20px;">${event.description}</p>` : ''}
          
          <div style="background:#f8f9ff;padding:16px;border-radius:12px;margin-bottom:20px;">
            <div style="font-weight:700;margin-bottom:12px;font-size:15px;">📊 RSVP Status</div>
            <div style="display:flex;gap:20px;font-size:14px;">
              <div style="text-align:center;">
                <div style="font-size:24px;font-weight:800;color:#10B981;">${yesCount}</div>
                <div style="color:#6b7280;">✅ Yes</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:24px;font-weight:800;color:#EF4444;">${noCount}</div>
                <div style="color:#6b7280;">❌ No</div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:24px;font-weight:800;color:#F59E0B;">${maybeCount}</div>
                <div style="color:#6b7280;">🤔 Maybe</div>
              </div>
            </div>
            ${userResponse ? `<div style="margin-top:12px;text-align:center;font-size:13px;color:#6b7280;">Your response: <strong>${userResponse.toUpperCase()}</strong></div>` : ''}
          </div>
          
          <div style="margin-bottom:20px;">
            <div style="font-weight:700;margin-bottom:8px;font-size:15px;">Your Response</div>
            <div style="display:flex;gap:8px;">
              <button id="rsvpYes" class="btn" style="flex:1;background:#10B981;color:#fff;padding:12px;font-size:15px;${userResponse === 'yes' ? 'border:3px solid #065f46;' : ''}">✅ Yes</button>
              <button id="rsvpNo" class="btn" style="flex:1;background:#EF4444;color:#fff;padding:12px;font-size:15px;${userResponse === 'no' ? 'border:3px solid #991b1b;' : ''}">❌ No</button>
              <button id="rsvpMaybe" class="btn" style="flex:1;background:#F59E0B;color:#fff;padding:12px;font-size:15px;${userResponse === 'maybe' ? 'border:3px solid #92400e;' : ''}">🤔 Maybe</button>
            </div>
          </div>
          
          <div class="modal-buttons">
            <button id="deleteEvent" class="btn btn-danger">Delete Event</button>
            <button id="closeEvent" class="btn btn-secondary">Close</button>
          </div>
        </div>
      `;
      
      ['yes', 'no', 'maybe'].forEach(response => {
        const btn = byId(`rsvp${response.charAt(0).toUpperCase() + response.slice(1)}`);
        if(btn) {
          btn.onclick = () => {
            if(!userId) {
              toast('Please select a user first');
              return;
            }
            if(!event.responses) event.responses = {};
            event.responses[userId] = response;
            saveCurrentWorkspace();
            renderSidebar();
            render();
            toast(`Response updated: ${response.toUpperCase()} 🎉`);
          };
        }
      });
      
      const deleteBtn = byId('deleteEvent');
      if(deleteBtn) {
        deleteBtn.onclick = () => {
          if(confirm(`Delete "${event.name}"?`)) {
            state.companyEvents = state.companyEvents.filter(e => e.id !== eventId);
            saveCurrentWorkspace();
            renderSidebar();
            close();
            toast('Event deleted');
          }
        };
      }
      
      const closeBtn = byId('closeEvent');
      if(closeBtn) closeBtn.onclick = close;
    };
    
    render();
  });
  
  document.body.appendChild(modal);
}


function showCelebration(points){
  const o=document.createElement('div'); o.className='celebration-overlay';
  o.innerHTML = '<div class="celebration-content">'
    + '<div class="celebration-text">Task Completed!</div>'
    + '<div class="celebration-points">+' + points + ' pts</div>'
    + '</div>';
  
  // Add fireworks
  for(let i = 0; i < 6; i++) {
    setTimeout(() => {
      const firework = document.createElement('div');
      firework.className = 'firework';
      firework.style.left = (20 + Math.random() * 60) + '%';
      firework.style.top = (20 + Math.random() * 60) + '%';
      o.appendChild(firework);
      setTimeout(() => firework.remove(), 1000);
    }, i * 200);
  }
  
  document.body.appendChild(o);
  setTimeout(()=>o.remove(),2000);
}

window.showAddTaskToColumnModal=showAddTaskToColumnModal;


/* ===========================
   Auth Modals
   =========================== */
function showGlobalSignInModal(){
  const modal = buildModal('Sign In',(body,close)=>{
    body.innerHTML = `
      <form id="globalSignInForm" class="modal-form">
        <div class="form-group">
          <label>Email</label>
          <input id="siEmail" type="email" class="form-control" placeholder="you@example.com" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input id="siPass" type="password" class="form-control" placeholder="Your password" required>
        </div>
        <div class="modal-buttons">
          <button type="button" id="siCancel" class="btn btn-secondary">Cancel</button>
<button type="submit" class="btn btn-primary">Sign In</button>
        </div>
      </form>`;
      
    setTimeout(()=>{
      const cancelBtn = byId('siCancel');
      const submitBtn = byId('siSubmit');
      
      if(cancelBtn) cancelBtn.onclick = close;

      const form = byId('globalSignInForm');
if(form) {
  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = byId('siEmail')?.value.trim();
    const pass = byId('siPass')?.value;
    
    if (!email || !pass) {
      alert('Please enter both email and password');
      return;
    }
    
    try{
      await cloudSignIn(email, pass);
      const cached = cacheGet(); 
      if (cached) applyWorkspaceData(cached);
      
      await loadWorkspaceFromCloud('default');
      close();
      renderPlatformForUser(); 
      showScreen('platform');
      toast('Signed in successfully');
    }catch(err){
      alert('Sign-in failed: ' + (err?.message || err));
    }
  };
}   
    },0);
  });
  document.body.appendChild(modal);
}



function showEmployeeSignInModal(){
  const modal=buildModal('Employee Sign In',(body,close)=>{
    body.innerHTML=`
      <form id="empSignInForm" class="modal-form">
        <div class="form-group">
          <label>Employee Email</label>
          <input id="empEmail" type="email" class="form-control" placeholder="your@email.com" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input id="empPass" type="password" class="form-control" placeholder="Your password" required>
        </div>
        <div class="modal-buttons">
          <button type="button" id="empCancel" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Sign In</button>
        </div>
      </form>`;
    setTimeout(()=>{
      byId('empCancel').onclick=close;
      byId('empSignInForm').onsubmit=(e)=>{
        e.preventDefault();
        const email=byId('empEmail').value.trim();
        const pass=byId('empPass').value;
        
        const found = state.avatars.find(a=>a.login?.email===email && a.login?.password===pass);
        if(!found){ 
          toast('Invalid email or password'); 
          return; 
        }
        
        state.currentUserId = found.id;
        saveActiveSession({
          wsId: state.workspace.id,
          type: state.workspace.type,
          employeeId: found.id
        });

        saveCurrentWorkspace();
        close();
        renderPlatformForUser();
        toast(`Welcome back, ${found.name}!`);
      };
    },0);
  });
  document.body.appendChild(modal);
}

function signOutEmployee(){
  if(!state.currentUserId) return;
  
  state.currentUserId = null;
  
  const map = byId('officeMap');
  if(map) {
    map.querySelectorAll('.user-character').forEach(char => {
      char.style.outline = 'none';
    });
  }
  
  // FIXED: Clear background on sign-out (session only)
  const styleEl = byId('office-bg-style');
  if(styleEl) {
    styleEl.remove();
  }
  
  // FIXED: Clear session storage
  try {
    sessionStorage.removeItem('addy_session_bg');
  } catch(e) {}
  
  const navUserAvatar = byId('navUserAvatar');
  const navUserName = byId('navUserName');
  const navUserRole = byId('navUserRole');
  
  if(navUserAvatar) navUserAvatar.textContent = '•';
  if(navUserName) navUserName.textContent = 'Not signed in';
  if(navUserRole) navUserRole.textContent = '';
  
  renderPlatformForUser();
  toast('Signed out from employee');
}

function showCreateTeamModal(){
  const modal = buildModal('Create New Team',(body,close)=>{
    body.innerHTML = `
      <form id="createTeamForm" class="modal-form">
        <div class="form-group">
          <label>Team Name</label>
          <input id="newTeamName" class="form-control" placeholder="e.g., Engineering, Marketing" required />
        </div>
        <div class="modal-buttons">
          <button type="button" id="cancelTeam" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Team</button>
        </div>
      </form>`;
    
    setTimeout(()=>{
      byId('cancelTeam').onclick = close;
      byId('createTeamForm').onsubmit = (e)=>{
        e.preventDefault();
        const teamName = byId('newTeamName')?.value.trim();
        if(!teamName) return;
        
        if(state.setup.teams.includes(teamName)){
          toast('Team already exists');
          return;
        }
        
        state.setup.teams.push(teamName);
        ensureTeamExists(teamName);
        saveCurrentWorkspace();
        close();
        renderPlatformForUser();
        toast(`Team "${teamName}" created successfully`);
      };
    },0);
  });
  document.body.appendChild(modal);
}

/* ===========================
   Modal Infrastructure
   =========================== */
function buildModal(title, mount){
  const wrap=document.createElement('div'); 
  wrap.className='modal';
  const content=document.createElement('div'); 
  content.className='modal-content';
  const header=document.createElement('div'); 
  header.className='modal-header';
  const h=document.createElement('h3'); 
  h.textContent=title;
  const x=document.createElement('button'); 
  x.className='modal-close'; 
  x.textContent='×';
  header.append(h,x);
  const body=document.createElement('div');
  content.append(header,body);
  wrap.appendChild(content);
  const close=()=>hideModal(wrap);
  x.onclick=close;
  wrap.addEventListener('click',e=>{ if(e.target===wrap) close(); });
  mount(body,close);
  return wrap;
}

function hideModal(m){ 
  if(m&&m.parentElement) m.parentElement.removeChild(m); 
}

function toast(msg){
  const n=document.createElement('div');
  n.textContent=msg;
  Object.assign(n.style,{
    position:'fixed',
    bottom:'24px',
    left:'50%',
    transform:'translateX(-50%)',
    background:'rgba(0,0,0,.8)',
    color:'#fff',
    padding:'10px 14px',
    borderRadius:'8px',
    zIndex:'2000'
  });
  
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),1600);
}

function signOut(){
  try { 
    clearActiveSession();
    cloudSignOut();
  } catch(e) { console.warn(e); }
  
  state.currentUserId = null;
  state.workspace = { id:null, type:null, login:null };
  state.avatars = [];
  state.teams = {};
  state.setup = { userType:null, businessType:null, personalPurpose:null, teams:[], categories:[] };
  
  showScreen('signup');
  toast('Signed out successfully');
}

/* ===========================
   Wire up
   =========================== */
window.previousStep=previousStep;
window.nextStep=nextStep;
window.selectOption=selectOption;
window.focusTagInput=focusTagInput;
window.handleTeamInput=handleTeamInput;
window.handleCategoryInput=handleCategoryInput;

/* ===========================
   Cloud save overlay
   =========================== */
(function(){
  if(typeof saveCurrentWorkspace !== "function") return;
  const saveLocal = saveCurrentWorkspace;
  window.saveCurrentWorkspace = async function(){
    try{ saveLocal(); }catch(e){ console.warn("Local save error", e); }
    if(SUPA_ON){
      try{
        // CRITICAL: Include pointsSpent and storeData in cloud save!
        await saveWorkspaceToCloud({ 
          setup: state.setup, 
          avatars: state.avatars, 
          teams: state.teams, 
          companyEvents: state.companyEvents,
          pointsSpent: state.pointsSpent || 0,
          storeData: state.storeData || null
        }, currentWorkspaceName);
      }catch(e){
        console.warn("Cloud save failed:", e?.message||e);
      }
    }
  };
})();



/* ===========================
   Store Integration
   =========================== */
function openStore() {
  const user = getCurrentUser();
  if (!user) {
    toast('Please sign in first');
    return;
  }
  
  // Initialize store data with employee as source of truth
  if (!state.storeData) {
    state.storeData = {
      ownedCharacters: ['char_emoji_1', 'char_emoji_2'],
      ownedBackgrounds: ['bg_plain_1', 'bg_plain_2'],
      currentCharacter: user.emoji,
      currentBackground: null
    };
    saveCurrentWorkspace(); // Save initial store data
  }
  
  // CRITICAL: Points = Earned - Spent (single source of truth from state.pointsSpent)
  const earnedPoints = calculateUserPoints(user.id);
  const availablePoints = earnedPoints - (state.pointsSpent || 0);
  console.log('Opening store - Earned:', earnedPoints, 'Spent (bin):', state.pointsSpent, 'Available:', availablePoints);
  // Update store header
  const storeUserAvatar = byId('storeUserAvatar');
  const storeUserName = byId('storeUserName');
  const storeUserPoints = byId('storeUserPoints');
  
  if(storeUserAvatar) storeUserAvatar.textContent = state.storeData.currentCharacter || user.emoji || '•';
  if(storeUserName) storeUserName.textContent = user.name || '';
  if(storeUserPoints) storeUserPoints.textContent = `${availablePoints} Points`;
  
  showScreen('store');
  
  // Initialize store UI with calculated points
  setTimeout(() => {
    if (window.initializeStore) {
      window.initializeStore({
        points: availablePoints,
        pointsSpent: state.pointsSpent || 0,
        ownedCharacters: state.storeData.ownedCharacters,
        ownedBackgrounds: state.storeData.ownedBackgrounds,
        currentCharacter: state.storeData.currentCharacter,
        currentBackground: state.storeData.currentBackground || '#F8FAFC'
      });
    }
  }, 100);
  
  const closeBtn = byId('closeStoreBtn');
  const backBtn = byId('backFromStore');
  
  if(closeBtn) {
    closeBtn.onclick = () => {
      showScreen('platform');
      renderPlatformForUser();
    };
  }
  
  if(backBtn) {
    backBtn.onclick = () => {
      showScreen('platform');
      renderPlatformForUser();
    };
  }
}

// Fallback render function if store.js fails to load
function renderStoreInline() {
  const storeContent = byId('storeContent');
  if(!storeContent) {
    console.error('storeContent element not found!');
    return;
  }
  
  const STORE_DATA = {
    characters: [
      { id: 'char_1', name: 'Winnie the Pooh', image: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400', price: 500, tier: 'premium' },
      { id: 'char_2', name: 'Mickey Mouse', image: 'https://images.unsplash.com/photo-1566168051-48245ee5ba77?w=400', price: 500, tier: 'premium' },
      { id: 'char_14', name: 'Smiley Face', image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=400', price: 50, tier: 'common' },
      { id: 'char_15', name: 'Star Icon', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400', price: 50, tier: 'common' }
    ]
  };
  
  storeContent.innerHTML = `
    <div style="padding: 2rem; max-width: 1400px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1 style="font-size: 2.5rem; font-weight: bold; color: #1e293b; margin-bottom: 1rem;">
          🛒 Welcome to Addy Store
        </h1>
        <p style="color: #64748b; font-size: 1.125rem;">Purchase amazing characters and backgrounds with the points you've earned!</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;">
        ${STORE_DATA.characters.map(item => {
          const isOwned = state.storeData.ownedCharacters.includes(item.id);
          const isCurrent = state.storeData.currentCharacter === item.id;
          const canAfford = state.storeData.points >= item.price;
          
          return `
            <div class="store-item-card" 
                 onclick="handleStoreItemClick('${item.id}', 'character')"
                 style="background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.3s; border: 2px solid ${isCurrent ? '#14b8a6' : isOwned ? '#22c55e' : '#e5e7eb'};">
              <div style="position: relative; height: 12rem; overflow: hidden;">
                <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
                ${isCurrent ? '<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #14b8a6; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: bold;">Active</div>' : ''}
                ${isOwned && !isCurrent ? '<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #22c55e; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: bold;">Owned</div>' : ''}
              </div>
              <div style="padding: 1rem;">
                <div style="display: inline-block; background: linear-gradient(to right, #14b8a6, #06b6d4); color: white; padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: bold; margin-bottom: 0.5rem;">${item.tier}</div>
                <h3 style="font-weight: bold; color: #1e293b; margin-bottom: 0.5rem;">${item.name}</h3>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 0.25rem;">
                    <span style="color: #eab308;">⭐</span>
                    <span style="font-weight: bold;">${item.price}</span>
                  </div>
                  <span style="font-size: 0.875rem; color: ${isCurrent ? '#14b8a6' : isOwned ? '#22c55e' : canAfford ? '#14b8a6' : '#dc2626'};">
                    ${isCurrent ? 'Active' : isOwned ? 'Click to activate' : canAfford ? 'Click to buy' : 'Locked'}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function handleStoreItemClick(itemId, type) {
  const isOwned = type === 'character' 
    ? state.storeData.ownedCharacters.includes(itemId)
    : state.storeData.ownedBackgrounds.includes(itemId);
  
  if(isOwned) {
    // Activate item
    if(type === 'character') {
      state.storeData.currentCharacter = itemId;
    } else {
      state.storeData.currentBackground = itemId;
    }
    saveCurrentWorkspace();
    
    // Re-render
    if (window.initializeStore) {
      window.initializeStore(state.storeData);
    } else {
      renderStoreInline();
    }
    
    toast('Item activated! ✨');
  } else {
    // Try to purchase
    const STORE_DATA = {
      characters: [
        { id: 'char_1', name: 'Winnie the Pooh', price: 500 },
        { id: 'char_2', name: 'Mickey Mouse', price: 500 },
        { id: 'char_14', name: 'Smiley Face', price: 50 },
        { id: 'char_15', name: 'Star Icon', price: 50 }
      ]
    };
    
    const item = STORE_DATA.characters.find(i => i.id === itemId);
    if(!item) return;
    
    if(state.storeData.points >= item.price) {
      if(confirm(`Purchase ${item.name} for ${item.price} points?`)) {
        state.storeData.points -= item.price;
        if(type === 'character') {
          state.storeData.ownedCharacters.push(itemId);
          state.storeData.currentCharacter = itemId;
        }
        saveCurrentWorkspace();
        
        // Update header points
        const storeUserPoints = byId('storeUserPoints');
        if(storeUserPoints) storeUserPoints.textContent = `${state.storeData.points} Points`;
        
        // Re-render
        if (window.initializeStore) {
          window.initializeStore(state.storeData);
        } else {
          renderStoreInline();
        }
        
        toast(`Purchased ${item.name}! 🎉`);
      }
    } else {
      toast('Not enough points! Complete more tasks to earn points.');
    }
  }
}

window.updateStoreDataInMainApp = function(storeData) {
  const user = getCurrentUser();
  if (!user) return;
  
  if (!state.storeData) {
    state.storeData = {};
  }
  
  // FIXED: Track spent points atomically in main state (the "bin")
  if (storeData.pointsSpent !== undefined) {
    state.pointsSpent = storeData.pointsSpent;
    console.log('Updated pointsSpent bin to:', state.pointsSpent);
  }

  // Update ownership lists
  if (storeData.ownedCharacters) {
    state.storeData.ownedCharacters = [...storeData.ownedCharacters];
  }
  if (storeData.ownedBackgrounds) {
    state.storeData.ownedBackgrounds = [...storeData.ownedBackgrounds];
  }
  
  // FIXED: Update currentCharacter ONLY if explicitly provided
  if (storeData.currentCharacter !== undefined && storeData.currentCharacter !== state.storeData.currentCharacter) {
    state.storeData.currentCharacter = storeData.currentCharacter;
    user.emoji = storeData.currentCharacter;
    
    const navUserAvatar = byId('navUserAvatar');
    if(navUserAvatar) navUserAvatar.textContent = storeData.currentCharacter;
    
    const charElement = byId(`char-${user.id}`);
    if(charElement) {
      const charAvatar = charElement.querySelector('.character-avatar');
      if(charAvatar) charAvatar.textContent = storeData.currentCharacter;
    }
    
    const storeUserAvatar = byId('storeUserAvatar');
    if(storeUserAvatar) storeUserAvatar.textContent = storeData.currentCharacter;
  }
  
  // FIXED: Update currentBackground ONLY if explicitly provided and not undefined
  if (storeData.currentBackground !== undefined) {
    state.storeData.currentBackground = storeData.currentBackground;
    
    const officeMap = byId('officeMap');
    if(officeMap) {
      const bgData = storeData.currentBackground;
      
      let styleEl = byId('office-bg-style');
      if(!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'office-bg-style';
        document.head.appendChild(styleEl);
      }
      
      let bgStyle = '';
      if(bgData.startsWith('#')) {
        bgStyle = `background: ${bgData}; opacity: 0.85;`;
      } else if(bgData.startsWith('linear-gradient')) {
        bgStyle = `background: ${bgData}; opacity: 0.85;`;
      } else {
        bgStyle = `background: url('${bgData}'); background-size: cover; background-position: center; opacity: 0.85;`;
      }
      
      styleEl.textContent = `.office-map::before, .team-container::before { ${bgStyle} }`;
    }
  }
  
  // CRITICAL: Save EVERYTHING at the end after all updates
  saveCurrentWorkspace();
  
  // FIXED: Calculate and display correct available points EVERYWHERE
  const earnedPoints = calculateUserPoints(user.id);
  const availablePoints = earnedPoints - (state.pointsSpent || 0);
  
  // Update store header points
  const storeUserPoints = byId('storeUserPoints');
  if(storeUserPoints) storeUserPoints.textContent = `${availablePoints} Points`;
  
  // Update nav header points
  const navUserRole = byId('navUserRole');
  if(navUserRole) {
    const roleText = user.role || '';
    navUserRole.innerHTML = `${roleText} <span style="color:#10B981;font-weight:800;margin-left:8px;">⭐ ${availablePoints} pts</span>`;
  }
  
  // FIXED: Emit update for office UI sync
  emitPointsUpdate(user.id);
};







// Make handleStoreItemClick global
window.handleStoreItemClick = handleStoreItemClick;

/* ===========================
   Initial Load
   =========================== */
document.addEventListener('DOMContentLoaded', ()=>{
  const haveAccountBtn = byId('haveAccountBtn');
  const initialSignupForm = byId('initialSignupForm');
  
  if(haveAccountBtn){
    haveAccountBtn.onclick = ()=>{
      showGlobalSignInModal();
    };
  }
  
  if(initialSignupForm){
    initialSignupForm.onsubmit = async (e)=>{
      e.preventDefault();
      const email = byId('signupEmail')?.value.trim();
      const pass = byId('signupPassword')?.value;
      
      if(!email || !pass){
        toast('Please fill all fields');
        return;
      }
      
      if(pass.length < 8){
        toast('Password must be at least 8 characters');
        return;
      }
      
      try{
        await cloudSignUp(email, pass);
        await cloudSignIn(email, pass);
        
        const signupScreen = byId('signupScreen');
        const setupScreen = byId('setupScreen');
        if(signupScreen) signupScreen.classList.remove('active');
        if(setupScreen) setupScreen.classList.add('active');
        gotoStep(0);
        toast('Account created! Now set up your workspace.');
      }catch(err){
        if(err.message.includes('already registered')){
          alert('This email is already registered. Please sign in instead.');
          showGlobalSignInModal();
        } else {
          alert('Sign-up failed: ' + (err?.message||err));
        }
      }
    };
  }

  // Auto-restore session
  // Auto-restore session
  const sess = readActiveSession();
  if (sess && sess.wsId) {
    const store = readStore();
    const ws = store[sess.wsId];
    if (ws) {
      hydrateFrom(ws);
      if (ws.type === 'personal') {
        state.currentUserId = state.avatars[0]?.id || null;
      } else if (sess.employeeId) {
        state.currentUserId = sess.employeeId;
      }

      // CRITICAL: Load pointsSpent from saved data (the "bin")
      state.pointsSpent = ws.data?.pointsSpent || 0;
      console.log('Loaded pointsSpent from storage:', state.pointsSpent);

      if(!state.storeData && state.currentUserId) {
        const user = getCurrentUser();
        state.storeData = {
          ownedCharacters: ws.data?.storeData?.ownedCharacters || ['char_emoji_1', 'char_emoji_2'],
          ownedBackgrounds: ws.data?.storeData?.ownedBackgrounds || ['bg_plain_1', 'bg_plain_2'],
          currentCharacter: ws.data?.storeData?.currentCharacter || user?.emoji || '•',
          currentBackground: ws.data?.storeData?.currentBackground || null
        };
      }
      
      // Apply saved background if it exists
      if(state.storeData && state.storeData.currentBackground) {
        setTimeout(() => {
          const bgData = state.storeData.currentBackground;
          const officeMap = byId('officeMap');
          if(officeMap) {
            let styleEl = byId('office-bg-style');
            if(!styleEl) {
              styleEl = document.createElement('style');
              styleEl.id = 'office-bg-style';
              document.head.appendChild(styleEl);
            }
            
            let bgStyle = '';
            if(bgData.startsWith('#')) {
              bgStyle = `background: ${bgData}; opacity: 0.85;`;
            } else if(bgData.startsWith('linear-gradient')) {
              bgStyle = `background: ${bgData}; opacity: 0.85;`;
            } else {
              bgStyle = `background: url('${bgData}'); background-size: cover; background-position: center; opacity: 0.85;`;
            }
            
            styleEl.textContent = `.office-map::before, .team-container::before { ${bgStyle} }`;
          }
        }, 100);
      }
      
      renderPlatformForUser();
      showScreen('platform');
    }
  }




  window.addEventListener('points-updated', (e) => {
    const { userId, points } = e.detail;
  
    if(state.currentUserId === userId && screens.store?.classList.contains('active')) {
      const storeUserPoints = byId('storeUserPoints');
      if(storeUserPoints && state.storeData) {
        const availablePoints = points - (state.storeData.pointsSpent || 0);
        storeUserPoints.textContent = `${availablePoints} Points`;
      }
    }
  });
});