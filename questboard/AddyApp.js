/* ===========================
   QuestBoard - app.js (Auth + Persistence)
   =========================== */

/** Global state **/
const state = {
  // setup definitions
  setup: { userType:null, businessType:null, personalPurpose:null, teams:[], categories:[] },

  // domain data
  avatars: [], // [{id,name,role,emoji,team,isTeamLead, login?:{username,password}}]
  teams: {},   // teamName -> { name, members:[], tasks:[], events:[], leadId, awardedPoints }

  // runtime
  currentUserId: null,
  currentTeam: null,
  office: { posX:0, posY:0, speed:3, keys:{}, loopId:null, keydownHandler:null, keyupHandler:null, nearTeam:null },
  ui: { beltPaused:false },

  // workspace (persistence metadata)
  workspace: { id:null, type:null, login:null } // login:{username,password}
};

/** ==== Persistence (localStorage) ==== **/
const LS_KEY = 'QB_workspaces_v1'; // map: id -> { id,type,login:{u,p}, data:<serializedState> }
function readStore(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)||'{}'); } catch(e){ return {}; }
}
function writeStore(store){ localStorage.setItem(LS_KEY, JSON.stringify(store)); }
function generateId(prefix){ return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }

// Save current workspace state
function saveCurrentWorkspace(){
  if(!state.workspace.id) return;
  const store = readStore();
  // serialize minimal public state
  const data = {
    setup: state.setup,
    avatars: state.avatars,
    teams: state.teams
  };
  store[state.workspace.id] = {
    id: state.workspace.id,
    type: state.workspace.type,
    login: state.workspace.login, // {username,password} (Demo only)
    data
  };
  writeStore(store);
}

// Create a new workspace shell (no data yet)
function createWorkspace(type, username, password){
  const id = generateId('ws');
  state.workspace.id = id;
  state.workspace.type = type;
  state.workspace.login = { username, password };
  saveCurrentWorkspace();
  return id;
}

// Try to sign in to workspace
function signInWorkspace(username, password){
  const store = readStore();
  const found = Object.values(store).find(ws => ws.login?.username===username && ws.login?.password===password);
  if(!found) return null;

  // hydrate
  hydrateFrom(found);
  return found;
}

function hydrateFrom(ws){
  // clear current runtime
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
const $  = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
const byId=(id)=>document.getElementById(id);

/** Screens **/
const screens={ setup:byId('setupScreen'), avatar:byId('avatarScreen'), platform:byId('platformScreen'), team:byId('teamScreen') };
function showScreen(k){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  if (screens[k]) screens[k].classList.add('active');
}

/* ===========================
   Setup Wizard (with auth flow)
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

  // הגענו לסוף האשף:
  if(state.setup.userType==='business'){
    // במודל עסקי: אין יצירת אווטאר בשלב זה.
    // מבקשים להגדיר משתמש/סיסמה לאזור (workspace) ושומרים.
    showWorkspaceAuthModal('business', ({username,password})=>{
      createWorkspace('business', username, password);
      saveCurrentWorkspace(); // נשמר כ־Workspace ריק עם ה־setup וה־teams
      // אפשר להיכנס לאזור (ללא עובד מחובר) – כפתורי יצירת/התחברות עובד זמינים.
      renderPlatformForUser(); // יסתדר גם אם currentUserId=null
      showScreen('platform');
      toast('Business workspace created. You can now create or sign in as an employee.');
    });
    return;
  }

  // במודל אישי: נשמור את האישורים בסוף יצירת האווטאר (כדי שה־workspace יכלול את האווטאר)
  prepareAvatarScreen(true /*isPersonalCreation*/);
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
   Avatar Creation
   =========================== */
const DEFAULT_AVATARS=['🧙‍♂️','🧛‍♀️','🤖','🧑‍🚀','🧟‍♂️','🧛‍♀️','🧜‍♀️','🧑‍🔬','🦸‍♂️','🦹‍♀️','🐉','🦺','🦄','🐵','🐸','🐯'];

function prepareAvatarScreen(isPersonalCreation=false){
  const isBiz = state.setup.userType==='business';
  const group = byId('teamSelectionGroup');
  const select= byId('userTeam');
  if(group) group.style.display = isBiz ? 'block':'none';
  if(isBiz && select) select.innerHTML = `<option value="">Select your team</option>` + state.setup.teams.map(t=>`<option value="${t}">${t}</option>`).join('');

  // אם הגענו לפה ממודל עסקי דרך האשף — אל תאפשר יצירת אווטאר (נחזור לפלטפורמה)
  if(isBiz && !isPersonalCreation && !state.workspace.id){
    // ביטחון כפול: לא מציגים את מסך האווטאר ביצירת Workspace עסקי
    renderPlatformForUser();
    showScreen('platform');
    return;
  }

  // Business: מסך יצירת אווטאר שנפתח מהכפתור "+ Create New Avatar" צריך לכלול יצירת שם משתמש/סיסמה לעובד
  const authBlock = byId('avatarAuthBlock');
  if(authBlock) authBlock.style.display = isBiz ? 'block' : 'none';

  // grid avatars
  const grid=byId('avatarGrid'); if(grid) grid.innerHTML='';
  let selected=null;
  DEFAULT_AVATARS.forEach(emo=>{
    const el=document.createElement('div'); el.className='avatar-option'; el.textContent=emo;
    el.onclick=()=>{ grid?.querySelectorAll('.avatar-option').forEach(n=>n.classList.remove('selected')); el.classList.add('selected'); selected=emo; };
    grid?.appendChild(el);
  });

  const goBack = ()=>{ if(state.avatars.length>0 || state.workspace.id){ showScreen('platform'); renderPlatformForUser(); } else { showScreen('setup'); gotoStep(0); } };
  const avatarBackBtn = byId('avatarBackBtn');
  const cancelAvatarBtn = byId('cancelAvatarBtn');
  if(avatarBackBtn) avatarBackBtn.onclick = goBack;
  if(cancelAvatarBtn) cancelAvatarBtn.onclick = goBack;

  const form = byId('avatarForm');
  if(form){
    form.onsubmit=(e)=>{
      e.preventDefault();
      const name=byId('userName')?.value.trim();
      const role=byId('jobTitle')?.value.trim();
      const team=isBiz ? byId('userTeam')?.value : null;
      if(!name||!role) return;

      // credentials for employee (business only)
      let login=null;
      if(isBiz){
        const u = byId('avatarUsername')?.value.trim();
        const p = byId('avatarPassword')?.value;
        if(!u || !p){ toast('Please set username & password for this employee'); return; }
        // ensure uniqueness inside workspace
        if(state.avatars.some(a=>a.login?.username===u)){
          toast('Username already exists'); return;
        }
        login = { username:u, password:p };
      }

      const id = 'avt_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
      const avatar = { id, name, role, emoji:selected||DEFAULT_AVATARS[0], team, isTeamLead:false, login };
      state.avatars.push(avatar);
      state.currentUserId=id;

      if(team) ensureTeamExists(team);
      if(team){
        state.teams[team].members.push(id);
        if(!state.teams[team].leadId){ state.teams[team].leadId=id; avatar.isTeamLead=true; }
      }

      // Personal-first-creation: אחרי יצירת האווטאר מבקשים שם משתמש/סיסמה ל-workspace,
      // ושומרים הכול כך שבפעם הבאה נכנסים דרך Sign In (בלי להקים מחדש).
      if(!isBiz && !state.workspace.id){
        showWorkspaceAuthModal('personal', ({username,password})=>{
          createWorkspace('personal', username, password);
          saveCurrentWorkspace();
          renderPlatformForUser(); showScreen('platform'); form.reset();
          toast('Personal workspace created and saved.');
        });
        return;
      }

      saveCurrentWorkspace();
      renderPlatformForUser(); showScreen('platform'); form.reset();
    };
  }
}

function ensureTeamExists(name){
  if(!state.teams[name]) state.teams[name]={ name, members:[], tasks:[], events:[], leadId:null, awardedPoints:0 };
}

/* ===========================
   Platform (Office)
   =========================== */
function renderPlatformForUser(){
  const u=getCurrentUser(); // יכול להיות null במודל עסקי אם עוד לא בוצעה התחברות עובד
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

  // במודל אישי – אין כפתור יצירת אווטאר נוסף ואין התחברות עובד
  if(state.workspace.type==='personal'){
    if(createNewAvatarBtn) createNewAvatarBtn.style.display='none';
    if(employeeSignInBtn) employeeSignInBtn.style.display='none';
  }else{
    if(createNewAvatarBtn){
      createNewAvatarBtn.style.display='inline-flex';
      createNewAvatarBtn.onclick=()=>{ stopOfficeControls(); prepareAvatarScreen(false); showScreen('avatar'); };
    }
    if(employeeSignInBtn){
      employeeSignInBtn.style.display='inline-flex';
      employeeSignInBtn.onclick=()=>showEmployeeSignInModal();
    }
  }

  startOfficeControls();
}
function getCurrentUser(){ return state.avatars.find(a=>a.id===state.currentUserId)||null; }
function updateTeamPointsDisplay(){
  const u=getCurrentUser(); let t=0;
  if(u?.team && state.teams[u.team]) t=state.teams[u.team].awardedPoints||0;
  const teamPoints = byId('teamPoints'); if(teamPoints) teamPoints.textContent=t;
}

function renderTeamRooms(){
  const c=byId('teamRoomsContainer'); if(!c) return;
  c.innerHTML='';
  const teams=state.setup.teams;
  const cols=Math.min(4,Math.max(2,Math.ceil(Math.sqrt(teams.length||1))));
  const cellW=240, cellH=190, startX=60, startY=60;

  teams.forEach((t,i)=>{
    ensureTeamExists(t);
    const el=document.createElement('div'); el.className='team-room'; el.dataset.team=t;
    el.style.borderColor=['#4F46E5','#10B981','#F59E0B','#EF4444','#6366F1','#06B6D4'][i%6];
    const title=Object.assign(document.createElement('div'),{className:'room-header',textContent:t});
    const members=Object.assign(document.createElement('div'),{className:'room-members'});
    state.teams[t].members.slice(0,5).forEach(id=>{
      const a=state.avatars.find(v=>v.id===id); if(!a) return;
      const m=document.createElement('div'); m.className='room-member'; m.textContent=a.emoji; members.appendChild(m);
    });
    const enter=Object.assign(document.createElement('div'),{className:'room-enter',textContent:'Press E to enter'});
    el.append(title,members,enter);
    const r=Math.floor(i/cols), col=i%cols; el.style.left=(startX+col*cellW)+'px'; el.style.top=(startY+r*cellH)+'px';
    el.onclick=()=>openTeam(t);
    c.appendChild(el);
  });
}

/* Sidebar */
function renderSidebar(){
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
  const isByRole = /lead|manager|head|team\s*lead|boss|מנהל|מנהלת|ראש\s*צוות/.test(role);
  return !!(byIdLead || isByRole);
}
function openEmployeeProfile(id){
  const a=state.avatars.find(x=>x.id===id); if(!a) return;
  const modal=buildModal('Employee Profile',(body,close)=>{
    body.innerHTML=`
      <div class="modal-form">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="font-size:40px">${a.emoji}</div>
          <div>
            <div style="font-weight:600;font-size:16px;">${a.name}</div>
            <div style="color:var(--color-text-secondary);font-size:12px;">ID: ${a.id}</div>
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
   Office movement
   =========================== */
function startOfficeControls(){
  const map=byId('officeMap'), ch=byId('userCharacter'); if(!map||!ch) return;
  stopOfficeControls();
  const rect=map.getBoundingClientRect(); state.office.posX=rect.width/2; state.office.posY=rect.height/2;
  pos(); const keys=state.office.keys;

  const kd=(e)=>{ const k=norm(e.key); if(!k) return; keys[k]=true; if(k==='e'&&state.office.nearTeam){ stopOfficeControls(); openTeam(state.office.nearTeam); } };
  const ku=(e)=>{ const k=norm(e.key); if(!k) return; keys[k]=false; };
  state.office.keydownHandler=kd; state.office.keyupHandler=ku; document.addEventListener('keydown',kd); document.addEventListener('keyup',ku);

  const step=()=>{ const s=state.office.speed; let dx=0,dy=0; if(keys.left)dx-=s; if(keys.right)dx+=s; if(keys.up)dy-=s; if(keys.down)dy+=s;
    if(dx&&dy){ const m=Math.sqrt(2); dx/=m; dy/=m; }
    const mrg=30,w=map.clientWidth,h=map.clientHeight; state.office.posX=clamp(state.office.posX+dx,mrg,w-mrg); state.office.posY=clamp(state.office.posY+dy,mrg,h-mrg);
    pos(); near(); state.office.loopId=requestAnimationFrame(step); };
  step();

  function pos(){ ch.style.left=state.office.posX+'px'; ch.style.top=state.office.posY+'px'; }
  function near(){
    const rooms=$$('.team-room'); const cr=ch.getBoundingClientRect(); const mr=map.getBoundingClientRect();
    const cc={x:cr.left-mr.left+cr.width/2,y:cr.top-mr.top+cr.height/2}; let best=null,dist=Infinity;
    rooms.forEach(rm=>{
      const rr=rm.getBoundingClientRect();
      const r={left:rr.left-mr.left, top:rr.top-mr.top, right:rr.right-mr.left, bottom:rr.bottom-mr.top};
      const dx=(cc.x<r.left)?(r.left-cc.x):(cc.x>r.right)?(cc.x-r.right):0;
      const dy=(cc.y<r.top)?(r.top-cc.y):(cc.y>r.bottom)?(cc.y-r.bottom):0;
      const d=Math.hypot(dx,dy); const NEAR=28;
      const hint=rm.querySelector('.room-enter'); if(hint) hint.style.opacity = d<=NEAR?'1':'0';
      if(d<dist){ dist=d; best = d<=NEAR ? rm : null; }
    });
    state.office.nearTeam = best ? best.dataset.team : null;
  }
}
function stopOfficeControls(){
  if(state.office.loopId){ cancelAnimationFrame(state.office.loopId); state.office.loopId=null; }
  if(state.office.keydownHandler){ document.removeEventListener('keydown',state.office.keydownHandler); state.office.keydownHandler=null; }
  if(state.office.keyupHandler){ document.removeEventListener('keyup',state.office.keyupHandler); state.office.keyupHandler=null; }
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
   Team View + Kanban
   =========================== */
const STATUS_ORDER=['backlog','todo','in-progress','waiting','done'];

function openTeam(teamName){
  state.currentTeam=teamName;
  const team=state.teams[teamName];
  if(!team) return;

  stopOfficeControls();
  const tn = byId('teamName'); if(tn) tn.textContent=teamName;

  const list=byId('teamMembersList');
  if (list) {
    list.innerHTML='';
    team.members.forEach(id=>{
      const a=state.avatars.find(v=>v.id===id);
      if(!a) return;
      const card=document.createElement('div'); card.className='team-member';
      const av=document.createElement('div'); av.className='member-avatar'; av.textContent=a.emoji;
      const info=document.createElement('div'); info.className='member-info';
      const nm=document.createElement('div'); nm.className='member-name'; nm.textContent=a.name+(isLead(a)?' ⭐':'');
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

  const manageBtn = byId('manageEventsBtn');
  if(manageBtn) manageBtn.onclick=()=>showManageEventsModal(teamName);

  const backBtn = byId('backButton');
  if(backBtn) backBtn.onclick=()=>{ showScreen('platform'); renderPlatformForUser(); updateTeamPointsDisplay(); };

  const toggle = byId('beltToggle');
  if(toggle) {
    toggle.onclick = ()=>{
      state.ui.beltPaused = !state.ui.beltPaused;
      toggle.textContent = state.ui.beltPaused ? 'Play' : 'Pause';
      renderBacklogBelt(team);
      enableDnD(teamName);
    };
  }
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
  if(!state.ui.beltPaused && tasks.length){
    tasks.forEach(t=> track.appendChild(renderTaskCard(t, team, true, true)));
  }

  viewport.setAttribute('data-paused', String(state.ui.beltPaused));
}

function renderTaskCard(task, team, mini=false, isClone=false){
  const card=document.createElement('div');
  card.className='task-card task--status-'+(task.status||'backlog')+(mini?' task-mini':'');
  card.draggable=true;
  card.dataset.taskId=task.id;
  if(isClone) card.setAttribute('data-clone','1');

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

  const user=getCurrentUser(); const lead=user && isLead(user);
  if(task.status==='waiting' && lead){
    const btn=document.createElement('button'); btn.className='approve-button'; btn.textContent='Approve & Done';
    btn.onclick=(e)=>{
      e.stopPropagation();
      team.awardedPoints=(team.awardedPoints||0)+(task.points||0);
      task.status='done';
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

  const backlogView = byId('backlogBeltViewport');
  if(backlogView) {
    backlogView.ondragover=(ev)=>{ ev.preventDefault(); backlogView.classList.add('drag-over'); };
    backlogView.ondragleave=()=> backlogView.classList.remove('drag-over');
    backlogView.ondrop=(ev)=>{
      ev.preventDefault(); backlogView.classList.remove('drag-over');
      const id=ev.dataTransfer?.getData('text/task-id'); const task=team.tasks.find(t=>t.id===id); if(!task) return;
      task.status='backlog'; saveCurrentWorkspace(); renderBoard(teamName); enableDnD(teamName);
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

      if(prev==='waiting' && status==='done' && !isLeadUser){ toast('Only Team Lead can approve to Done.'); return; }

      if(status==='todo' && !task.assigneeId){
        promptAssignMember(team, (memberId)=>{
          task.assigneeId = memberId;
          task.status = 'todo';
          saveCurrentWorkspace();
          renderBoard(teamName); enableDnD(teamName);
        }, ()=>{
          task.status = prev;
          renderBoard(teamName); enableDnD(teamName);
        });
        return;
      }

      task.status=status;
      saveCurrentWorkspace();
      renderBoard(teamName);
      enableDnD(teamName);
    };
  });

  $$('.task-card').forEach(card=>{
    if(card.getAttribute('data-clone')==='1') return;
    card.ondragstart=(ev)=>{ ev.dataTransfer?.setData('text/task-id', card.dataset.taskId); setTimeout(()=>card.classList.add('dragging'),0); };
    card.ondragend=()=> card.classList.remove('dragging');
  });
}

/* ===========================
   Modals (Tasks/Events + NEW Auth)
   =========================== */
function showAddTaskModal(teamName){
  ensureTeamExists(teamName);
  const team=state.teams[teamName];

  const memberOptions = team.members.map(id=>{
    const a=state.avatars.find(v=>v.id===id);
    const nm = a ? a.name : id;
    return `<option value="${id}">${nm}</option>`;
  }).join('');

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
        </div>

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
          <button type="button" id="cancelBtn" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Task</button>
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

          const chosenAssignee = byId('taskAssignee')?.value || null;
          const roleText = byId('taskAssigneeRole')?.value.trim() || null;

          const task={
            id:'tsk_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
            title,
            description:byId('taskDescription')?.value.trim() || '',
            priority:byId('taskPriority')?.value || 'medium',
            points:Number(byId('taskPoints')?.value)||0,
            due: byId('taskDue')?.value || null,
            assigneeId: chosenAssignee,
            assigneeRole: roleText,
            status:'backlog'
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

function showManageEventsModal(teamName){
  const team=state.teams[teamName];
  const modal=buildModal('Manage Point Events',(body,close)=>{
    const render=()=>{
      const list=byId('eventsListDyn');
      if(list) {
        list.innerHTML = team.events.map(ev=>`
          <div style="display:flex;justify-content:space-between;gap:8px;padding:8px;border:1px solid var(--color-border);border-radius:8px;margin-bottom:6px;">
            <div><strong>${ev.name}</strong> • ${ev.points} pts</div>
            <button data-id="${ev.id}" class="btn btn-secondary btn-sm">Delete</button>
          </div>`).join('') || `<div style="color:var(--color-text-secondary);">No events yet.</div>`;
        list.querySelectorAll('button[data-id]').forEach(b=> b.onclick=()=>{
          const id=b.getAttribute('data-id'); team.events=team.events.filter(e=>e.id!==id); render(); saveCurrentWorkspace();
        });
      }
    };
    body.innerHTML=`
      <div class="modal-form">
        <div id="eventsListDyn" class="events-list" style="margin-bottom:12px;"></div>
        <h4 style="margin:8px 0 6px 0;">Add New Event</h4>
        <div class="form-group"><label>Event Name</label><input id="eventName" class="form-control" placeholder="e.g., Complete Code Review"></div>
        <div class="form-group"><label>Points</label><input id="eventPoints" type="number" class="form-control" min="1" max="500" value="10"></div>
        <div class="modal-buttons"><button id="cancelEvents" class="btn btn-secondary">Close</button><button id="addEventBtn" class="btn btn-primary">Add Event</button></div>
      </div>`;

    setTimeout(() => {
      const cancelEventsBtn = byId('cancelEvents');
      if(cancelEventsBtn) cancelEventsBtn.onclick=close;

      const addEventBtn = byId('addEventBtn');
      if(addEventBtn) {
        addEventBtn.onclick=()=>{
          const name=byId('eventName')?.value.trim();
          const pts=Number(byId('eventPoints')?.value)||0;
          if(!name||pts<=0) return;
          team.events.push({id:'evt_'+Date.now(),name,points:pts});
          const eventNameInput = byId('eventName');
          const eventPointsInput = byId('eventPoints');
          if(eventNameInput) eventNameInput.value='';
          if(eventPointsInput) eventPointsInput.value='10';
          saveCurrentWorkspace();
          render();
        };
      }
      render();
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

/** ===== Auth Modals ===== */

// יצירת אישורי Workspace (גם personal וגם business)
function showWorkspaceAuthModal(type, onOk){
  const modal=buildModal('Create Workspace Login',(body,close)=>{
    body.innerHTML=`
      <form id="wsAuthForm" class="modal-form">
        <div class="form-group">
          <label>Workspace Username (${type})</label>
          <input id="wsUsername" class="form-control" placeholder="Choose a username" required>
        </div>
        <div class="form-group">
          <label>Workspace Password</label>
          <input id="wsPassword" type="password" class="form-control" placeholder="Choose a password" required>
        </div>
        <div class="modal-buttons">
          <button type="button" id="wsCancel" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
        <div class="small-hint">Note: Demo storage uses your browser only (localStorage).</div>
      </form>`;
    setTimeout(()=>{
      byId('wsCancel').onclick=close;
      byId('wsAuthForm').onsubmit=(e)=>{
        e.preventDefault();
        const username=byId('wsUsername').value.trim();
        const password=byId('wsPassword').value;
        if(!username||!password){ toast('Please fill username & password'); return; }

        // basic uniqueness check
        const exists = signInWorkspace(username, password);
        if(exists){ toast('Workspace with same credentials already exists'); return; }

        // restore pre-check (signInWorkspace mutated state), so reload wizard state:
        hydrateFrom({ id:null, type:null, login:null, data:{ setup: state.setup, avatars: state.avatars, teams: state.teams } });

        close();
        onOk?.({username,password});
      };
    },0);
  });
  document.body.appendChild(modal);
}

// התחברות לאזור קיים מהעמוד הראשוני
function showGlobalSignInModal(){
  const modal=buildModal('Sign In to Workspace',(body,close)=>{
    body.innerHTML=`
      <form id="globalSignInForm" class="modal-form">
        <div class="form-group">
          <label>Workspace Username</label>
          <input id="siWsUser" class="form-control" placeholder="Your workspace username">
        </div>
        <div class="form-group">
          <label>Workspace Password</label>
          <input id="siWsPass" type="password" class="form-control" placeholder="Your workspace password">
        </div>
        <div class="modal-buttons">
          <button type="button" id="siCancel" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Sign In</button>
        </div>
        <div class="small-hint">Personal = one user; Business = add or sign in employees.</div>
      </form>`;
    setTimeout(()=>{
      byId('siCancel').onclick=close;
      byId('globalSignInForm').onsubmit=(e)=>{
        e.preventDefault();
        const u=byId('siWsUser').value.trim(), p=byId('siWsPass').value;
        const ws = signInWorkspace(u,p);
        if(!ws){ toast('Workspace not found or wrong password'); return; }

        // Personal: יש אווטאר אחד — נחבר אותו כ-currentUser
        if(ws.type==='personal'){
          const first = state.avatars[0];
          state.currentUserId = first?.id || null;
        }else{
          state.currentUserId = null; // במודל עסקי – עובד צריך להתחבר בנפרד
        }
        saveCurrentWorkspace(); // עדכון קטן אם צריך
        renderPlatformForUser(); showScreen('platform');
        close();
        toast('Signed in.');
      };
    },0);
  });
  document.body.appendChild(modal);
}

// התחברות עובד (במודל עסקי) לפי שם משתמש/סיסמה שהוגדרו בזמן יצירת האווטאר
function showEmployeeSignInModal(){
  const modal=buildModal('Employee Sign In',(body,close)=>{
    body.innerHTML=`
      <form id="empSignInForm" class="modal-form">
        <div class="form-group">
          <label>Employee Username</label>
          <input id="empUser" class="form-control" placeholder="Your username">
        </div>
        <div class="form-group">
          <label>Employee Password</label>
          <input id="empPass" type="password" class="form-control" placeholder="Your password">
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
        const u=byId('empUser').value.trim(), p=byId('empPass').value;
        const found = state.avatars.find(a=>a.login?.username===u && a.login?.password===p);
        if(!found){ toast('User not found'); return; }
        state.currentUserId = found.id;
        saveCurrentWorkspace();
        close();
        renderPlatformForUser();
        toast('You are signed in.');
      };
    },0);
  });
  document.body.appendChild(modal);
}

/* ========== Modal infra & Utils ========== */
function buildModal(title, mount){
  const wrap=document.createElement('div'); wrap.className='modal';
  const content=document.createElement('div'); content.className='modal-content';
  const header=document.createElement('div'); header.className='modal-header';
  const h=document.createElement('h3'); h.textContent=title;
  const x=document.createElement('button'); x.className='modal-close'; x.textContent='×';
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
function hideModal(m){ if(m&&m.parentElement) m.parentElement.removeChild(m); }

function showCelebration(points){
  const o=document.createElement('div'); o.className='celebration-overlay';
  o.innerHTML = '<div class="celebration-content">'
    + '<div class="celebration-emoji">🎉</div>'
    + '<div class="celebration-text">Released!</div>'
    + '<div class="celebration-points">+' + points + ' pts</div>'
    + '</div>';
  document.body.appendChild(o);
  setTimeout(()=>o.remove(),1200);
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

/* ===========================
   Wire up
   =========================== */
window.previousStep=previousStep;
window.nextStep=nextStep;
window.selectOption=selectOption;
window.focusTagInput=focusTagInput;
window.handleTeamInput=handleTeamInput;
window.handleCategoryInput=handleCategoryInput;

document.addEventListener('DOMContentLoaded', ()=>{
  // כפתור Sign In הראשי מהעמוד הראשון
  const globalBtn = byId('globalSignInBtn');
  if(globalBtn) globalBtn.onclick = showGlobalSignInModal;

  gotoStep(0);
});