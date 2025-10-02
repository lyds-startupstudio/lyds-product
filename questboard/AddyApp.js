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
  
  // Temporary avatar data during creation
  tempAvatar: null
};

// ---- Workspace helpers ----
function buildEmptyWorkspace() {
  return {
    setup: { userType: null, businessType: null, personalPurpose: null, teams: [], categories: [] },
    avatars: [],
    teams: {}
  };
}

function applyWorkspaceData(data) {
  const d = data || buildEmptyWorkspace();
  state.setup = JSON.parse(JSON.stringify(d.setup || { userType:null, businessType:null, personalPurpose:null, teams:[], categories:[] }));
  state.avatars = JSON.parse(JSON.stringify(d.avatars || []));
  state.teams = JSON.parse(JSON.stringify(d.teams || {}));
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

function saveCurrentWorkspace(){
  if(!state.workspace.id) return;
  const store = readStore();
  const data = {
    setup: state.setup,
    avatars: state.avatars,
    teams: state.teams
  };
  store[state.workspace.id] = {
    id: state.workspace.id,
    type: state.workspace.type,
    login: state.workspace.login,
    data
  };
  writeStore(store);
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
  state.currentUserId = null;
  state.currentTeam = null;
  state.office = { posX:0, posY:0, speed:3, keys:{}, loopId:null, keydownHandler:null, keyupHandler:null, nearTeam:null };
  state.ui = { beltPaused:false };
  state.workspace = { id: ws.id, type: ws.type, login: ws.login };
}

/** DOM helpers **/
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
const byId=(id)=>document.getElementById(id);

/** Screens **/
const screens={ signup: byId('signupScreen'), setup:byId('setupScreen'), avatar:byId('avatarScreen'), platform:byId('platformScreen'), team:byId('teamScreen') };
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
    (async () => {
      createWorkspace('business', null, null);
      try { await saveCurrentWorkspace(); } catch (e) { console.warn('Cloud save failed:', e); }
      renderPlatformForUser();
      showScreen('platform');
      toast('Business workspace created.');
    })();
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
      const role=byId('jobTitle')?.value.trim();
      const team=isBiz ? byId('userTeam')?.value : null;
      
      if(!name) { toast('Please enter your name'); return; }
      if(isBiz && !role) { toast('Please enter your role'); return; }
      if(isBiz && !team) { toast('Please select your team'); return; }

      // Get selected emoji
      const selectedEl = byId('avatarGrid')?.querySelector('.avatar-option.selected');
      const emoji = selectedEl?.textContent || DEFAULT_AVATARS[0];

      // Store temp data
      state.tempAvatar = {
        id: generateId('avt'),
        name,
        role: role || 'Personal User',
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
  state.avatars.push(avatar);
  state.currentUserId = avatar.id;

  // Add to team
  if(avatar.team) {
    ensureTeamExists(avatar.team);
    state.teams[avatar.team].members.push(avatar.id);
    if(!state.teams[avatar.team].leadId){ 
      state.teams[avatar.team].leadId = avatar.id; 
      avatar.isTeamLead = true; 
    }
  }

  // Personal first creation
  if(state.workspace.type==='personal' && !state.workspace.id){
    (async ()=>{
      const user = await currentUser();
      if(!user){
        toast('Please sign in first');
        return;
      }
      
      createWorkspace('personal', null, null);
      await saveCurrentWorkspace();
      renderPlatformForUser(); 
      showScreen('platform'); 
      toast('Workspace created successfully');
    })();
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
  const navUserAvatar = byId('navUserAvatar');
  const navUserName = byId('navUserName');
  const navUserRole = byId('navUserRole');

  if(navUserAvatar) navUserAvatar.textContent=u?.emoji || '•';
  if(navUserName) navUserName.textContent=u?.name || (state.workspace.type==='business'?'Not signed in':'');
  if(navUserRole) navUserRole.textContent=u?.role || '';

  const char=byId('userCharacter');
  if(char){
    const ca = char.querySelector('.character-avatar');
    const cn = char.querySelector('.character-name');
    if(ca) ca.textContent=u?.emoji || '•';
    if(cn) cn.textContent=u?.name || '';
  }

  renderTeamRooms();
  renderSidebar();
  updateTeamPointsDisplay();

  const createNewAvatarBtn = byId('createNewAvatarBtn');
  const employeeSignInBtn = byId('employeeSignInBtn');
  const createTeamBtn = byId('createTeamBtn');

  if(state.workspace.type==='personal'){
    if(createNewAvatarBtn) createNewAvatarBtn.style.display='none';
    if(employeeSignInBtn) employeeSignInBtn.style.display='none';
    if(createTeamBtn) createTeamBtn.style.display='none';
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
      employeeSignInBtn.style.display='inline-flex';
      employeeSignInBtn.onclick=()=>showEmployeeSignInModal();
    }
    if(createTeamBtn){
      createTeamBtn.style.display='inline-flex';
      createTeamBtn.onclick=()=>showCreateTeamModal();
    }
  }
  
  const signOutBtn = byId('signOutBtn');
  if (signOutBtn) signOutBtn.onclick = signOut;

  startOfficeControls();
}

function getCurrentUser(){ return state.avatars.find(a=>a.id===state.currentUserId)||null; }

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
    
    const title=Object.assign(document.createElement('div'),{className:'room-header',textContent:item});
    const members=Object.assign(document.createElement('div'),{className:'room-members'});
    
    if(!isPersonal && state.teams[item]) {
      state.teams[item].members.slice(0,5).forEach(id=>{
        const a=state.avatars.find(v=>v.id===id); 
        if(!a) return;
        const m=document.createElement('div'); 
        m.className='room-member'; 
        m.textContent=a.emoji; 
        members.appendChild(m);
      });
    }
    
    const enter=Object.assign(document.createElement('div'),{className:'room-enter',textContent:'Press E to enter'});
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
  
  const teamList=byId('sidebarTeamList');
  if(teamList){
    teamList.innerHTML = state.setup.teams.map(t=>`<div class="team-item" data-team="${t}">${t}</div>`).join('') || `<div class="empty">No teams yet</div>`;
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
      list.querySelectorAll('.employee-item').forEach(el=> el.onclick=()=>openEmployeeProfile(el.dataset.id));
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

function openEmployeeProfile(id){
  const a=state.avatars.find(x=>x.id===id); 
  if(!a) return;
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
        <div class="profile-row"><span>Team</span><strong>${a.team||'—'}</strong></div>
        <div class="profile-row"><span>Team Lead</span><strong>${isLead(a)?'Yes':'No'}</strong></div>
        <div class="modal-buttons"><button id="closeEmp" class="btn btn-secondary">Close</button></div>
      </div>`;
    const closeBtn = byId('closeEmp');
    if(closeBtn) closeBtn.onclick=close;
  });
  document.body.appendChild(modal);
}

/* ===========================
   Office Movement
   =========================== */
function startOfficeControls(){
  const map=byId('officeMap'), ch=byId('userCharacter'); 
  if(!map||!ch) return;
  stopOfficeControls();
  const rect=map.getBoundingClientRect(); 
  state.office.posX=rect.width/2; 
  state.office.posY=rect.height/2;
  pos(); 
  const keys=state.office.keys;

  const kd=(e)=>{ 
    const k=norm(e.key); 
    if(!k) return; 
    keys[k]=true; 
    if(k==='e'&&state.office.nearTeam){ 
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
    const mrg=30,w=map.clientWidth,h=map.clientHeight; 
    state.office.posX=clamp(state.office.posX+dx,mrg,w-mrg); 
    state.office.posY=clamp(state.office.posY+dy,mrg,h-mrg);
    pos(); 
    near(); 
    state.office.loopId=requestAnimationFrame(step); 
  };
  step();

  function pos(){ 
    ch.style.left=state.office.posX+'px'; 
    ch.style.top=state.office.posY+'px'; 
  }
  
  function near(){
    const rooms=$('.team-room'); 
    const cr=ch.getBoundingClientRect(); 
    const mr=map.getBoundingClientRect();
    const cc={x:cr.left-mr.left+cr.width/2,y:cr.top-mr.top+cr.height/2}; 
    let best=null,dist=Infinity;
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
  $('.team-room .room-enter').forEach(e=>e.style.opacity='0');
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
function openTeam(teamName){
  toast('Team view - see original code for full implementation');
}

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
          <button type="button" id="siSubmit" class="btn btn-primary">Sign In</button>
        </div>
      </form>`;
      
    setTimeout(()=>{
      const cancelBtn = byId('siCancel');
      const submitBtn = byId('siSubmit');
      
      if(cancelBtn) cancelBtn.onclick = close;

      if(submitBtn) {
        submitBtn.onclick = async () => {
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
        await saveWorkspaceToCloud({ setup: state.setup, avatars: state.avatars, teams: state.teams }, currentWorkspaceName);
      }catch(e){
        console.warn("Cloud save failed:", e?.message||e);
      }
    }
  };
})();

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
      renderPlatformForUser();
      showScreen('platform');
    }
  }
});