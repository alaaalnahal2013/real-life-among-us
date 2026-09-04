/* ==========================================================================
   Real-Time Multiplayer & Database Platform - Core Application Logic
   ========================================================================== */

/* ==========================================================================
   1. AUTH MANAGER — Supabase Authentication, Profiles & Storage
   ========================================================================== */

const AuthManager = {
  currentUser: null,      // { email, id }
  currentProfile: null,   // { username, avatar_url }
  guestName: null,        // Filled when user chooses "Play as Guest"

  async init() {
    // 1. Restore guest from sessionStorage
    this.guestName = sessionStorage.getItem('guestName') || null;

    // 2. Restore active account from localStorage
    const savedActive = localStorage.getItem('multiplayer_active_account');
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        if (parsed && parsed.username) {
          this.currentProfile = parsed;
          this.currentUser = { email: parsed.email || null, id: parsed.id || null };
        }
      } catch(e) {}
    }

    // 3. Supabase Auth state listener & session check
    if (window._supabase) {
      try {
        window._supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            this.currentUser = session.user;
            await this.loadProfile(session.user.id);
          } else {
            if (!this.guestName) {
              this.currentUser = null;
              this.currentProfile = null;
            }
          }
          this.renderHeaderButton();
        });

        const { data: { session } } = await window._supabase.auth.getSession();
        if (session?.user) {
          this.currentUser = session.user;
          await this.loadProfile(session.user.id);
        }
      } catch(e) {
        console.warn('[Supabase Auth] Session init check:', e);
      }
    }

    this.renderHeaderButton();
    this.bindAuthEvents();
  },

  getDisplayName() {
    if (this.currentProfile?.username) return this.currentProfile.username;
    if (this.guestName) return this.guestName;
    if (this.currentUser?.email) return this.currentUser.email.split('@')[0];
    return 'Player';
  },

  async loadProfile(userId) {
    if (!window._supabase || !userId) return;
    try {
      const { data, error } = await window._supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        this.currentProfile = data;
        localStorage.setItem('multiplayer_active_account', JSON.stringify({
          id: userId,
          email: this.currentUser?.email,
          username: data.username,
          avatar_url: data.avatar_url
        }));
      }
    } catch(e) {
      console.warn('[Supabase] loadProfile error:', e);
    }
  },

  async signUp(email, password, username) {
    if (!window._supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await window._supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } }
    });
    if (error) throw error;

    if (data.user) {
      this.currentUser = data.user;
      this.currentProfile = { username, avatar_url: null };
      try {
        await window._supabase.from('profiles').upsert({
          id: data.user.id,
          username,
          updated_at: new Date().toISOString()
        });
      } catch(err) {}

      localStorage.setItem('multiplayer_active_account', JSON.stringify({
        id: data.user.id,
        email,
        username,
        avatar_url: null
      }));
      this.renderHeaderButton();
    }
    return data;
  },

  async signInWithPassword(email, password) {
    if (!window._supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await window._supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data.user) {
      this.currentUser = data.user;
      await this.loadProfile(data.user.id);
      this.renderHeaderButton();
    }
    return data;
  },

  async signOut() {
    if (window._supabase) {
      try { await window._supabase.auth.signOut(); } catch(e) {}
    }
    this.currentUser = null;
    this.currentProfile = null;
    this.guestName = null;
    sessionStorage.removeItem('guestName');
    localStorage.removeItem('multiplayer_active_account');
    this.renderHeaderButton();
    this.renderProfileView();
  },

  setGuest(name) {
    const cleanName = (name || '').trim() || 'Guest Player';
    this.guestName = cleanName;
    this.currentUser = null;
    this.currentProfile = { username: cleanName, avatar_url: null };
    sessionStorage.setItem('guestName', cleanName);
    this.renderHeaderButton();
  },

  async updateProfile(newUsername) {
    if (!newUsername) return;
    if (this.currentProfile) this.currentProfile.username = newUsername;
    if (this.currentUser?.id && window._supabase) {
      try {
        await window._supabase.from('profiles').update({
          username: newUsername,
          updated_at: new Date().toISOString()
        }).eq('id', this.currentUser.id);
      } catch(e) {}
    }
    localStorage.setItem('multiplayer_active_account', JSON.stringify({
      id: this.currentUser?.id || null,
      email: this.currentUser?.email || null,
      username: newUsername,
      avatar_url: this.currentProfile?.avatar_url || null
    }));
    this.renderHeaderButton();
    alert('✅ Profile updated successfully!');
  },

  async uploadAvatar(file) {
    if (!file) return;
    if (window._supabase && this.currentUser?.id) {
      try {
        const fileExt = file.name.split('.').pop();
        const path = `${this.currentUser.id}-${Date.now()}.${fileExt}`;
        const { error: upErr } = await window._supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true });

        if (!upErr) {
          const { data: urlData } = window._supabase.storage.from('avatars').getPublicUrl(path);
          if (urlData?.publicUrl) {
            this.currentProfile = this.currentProfile || {};
            this.currentProfile.avatar_url = urlData.publicUrl;
            await window._supabase.from('profiles').update({
              avatar_url: urlData.publicUrl,
              updated_at: new Date().toISOString()
            }).eq('id', this.currentUser.id);

            this.renderHeaderButton();
            this.renderProfileView();
            return;
          }
        }
      } catch(e) {
        console.warn('[Avatar upload] Cloud error, falling back to local FileReader:', e);
      }
    }

    // Fallback: local DataURL
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentProfile = this.currentProfile || {};
      this.currentProfile.avatar_url = e.target.result;
      this.renderHeaderButton();
      this.renderProfileView();
    };
    reader.readAsDataURL(file);
  },

  renderHeaderButton() {
    const avatarMini = document.getElementById('accountAvatarMini');
    const labelMini = document.getElementById('accountLabelMini');
    if (!avatarMini || !labelMini) return;

    const name = this.getDisplayName();
    labelMini.textContent = name;

    if (this.currentProfile?.avatar_url) {
      avatarMini.innerHTML = `<img src="${this.currentProfile.avatar_url}" alt="${name}">`;
    } else {
      const initial = (name.charAt(0) || 'P').toUpperCase();
      avatarMini.innerHTML = initial;
    }
  },

  openModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('active');
    if (this.currentUser || this.guestName) {
      this.showAuthView('authViewProfile');
      this.renderProfileView();
    } else {
      this.showAuthView('authViewLogin');
    }
  },

  closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
  },

  showAuthView(viewId) {
    document.querySelectorAll('.auth-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));

    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active');

    const tabMap = {
      'authViewProfile': 'tabProfileBtn',
      'authViewLogin': 'tabLoginBtn',
      'authViewSignup': 'tabSignupBtn',
      'authViewGuest': 'tabGuestBtn'
    };
    const targetTab = document.getElementById(tabMap[viewId]);
    if (targetTab) targetTab.classList.add('active');
  },

  renderProfileView() {
    const nameInput = document.getElementById('profileDisplayName');
    const emailDisplay = document.getElementById('profileEmailDisplay');
    const avatarLg = document.getElementById('profileAvatarLg');

    const name = this.getDisplayName();
    if (nameInput) nameInput.value = name;

    if (emailDisplay) {
      if (this.currentUser?.email) {
        emailDisplay.textContent = `Logged in as: ${this.currentUser.email}`;
      } else if (this.guestName) {
        emailDisplay.textContent = `Playing as Guest (${this.guestName})`;
      } else {
        emailDisplay.textContent = 'Not logged in';
      }
    }

    if (avatarLg) {
      if (this.currentProfile?.avatar_url) {
        avatarLg.innerHTML = `<img src="${this.currentProfile.avatar_url}" alt="${name}">`;
      } else {
        const initial = (name.charAt(0) || 'P').toUpperCase();
        avatarLg.innerHTML = initial;
      }
    }
  },

  bindAuthEvents() {
    document.getElementById('accountToggleBtn')?.addEventListener('click', () => this.openModal());
    document.getElementById('authModalCloseBtn')?.addEventListener('click', () => this.closeModal());

    document.getElementById('tabProfileBtn')?.addEventListener('click', () => {
      this.showAuthView('authViewProfile');
      this.renderProfileView();
    });
    document.getElementById('tabLoginBtn')?.addEventListener('click', () => this.showAuthView('authViewLogin'));
    document.getElementById('tabSignupBtn')?.addEventListener('click', () => this.showAuthView('authViewSignup'));
    document.getElementById('tabGuestBtn')?.addEventListener('click', () => this.showAuthView('authViewGuest'));

    // Login submit
    document.getElementById('loginSubmitBtn')?.addEventListener('click', async () => {
      const email = document.getElementById('loginEmailInput')?.value.trim();
      const password = document.getElementById('loginPasswordInput')?.value;
      if (!email || !password) { alert('Please enter both email and password.'); return; }
      try {
        await this.signInWithPassword(email, password);
        alert(`🎉 Welcome back, ${this.getDisplayName()}!`);
        this.closeModal();
      } catch(err) {
        alert(`❌ Sign in failed: ${err.message}`);
      }
    });

    // Signup submit
    document.getElementById('signupSubmitBtn')?.addEventListener('click', async () => {
      const username = document.getElementById('signupUsernameInput')?.value.trim();
      const email = document.getElementById('signupEmailInput')?.value.trim();
      const password = document.getElementById('signupPasswordInput')?.value;
      if (!username || !email || !password) { alert('Please fill in all fields.'); return; }
      try {
        await this.signUp(email, password, username);
        alert(`🎉 Account created! Welcome, ${username}!`);
        this.closeModal();
      } catch(err) {
        alert(`❌ Registration failed: ${err.message}`);
      }
    });

    // Guest submit
    document.getElementById('guestSubmitBtn')?.addEventListener('click', () => {
      const name = document.getElementById('guestNameInput')?.value.trim();
      if (!name) { alert('Please enter a nickname.'); return; }
      this.setGuest(name);
      alert(`🎮 Playing as ${name}!`);
      this.closeModal();
    });

    // Save profile
    document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
      const newName = document.getElementById('profileDisplayName')?.value.trim();
      if (newName) this.updateProfile(newName);
    });

    // Sign out
    document.getElementById('authSignOutBtn')?.addEventListener('click', async () => {
      if (confirm('Are you sure you want to sign out?')) {
        await this.signOut();
        alert('You have been signed out.');
      }
    });

    // Avatar file input
    document.getElementById('avatarFileInput')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.uploadAvatar(file);
    });
  }
};


/* ==========================================================================
   2. MULTIPLAYER MANAGER — Real-Time Room Sync & Communication
   ========================================================================== */

const MultiplayerManager = {
  state: {
    roomCode: '',
    partyName: '',
    hostName: '',
    players: [],       // [{ name: string, isHost: boolean, isReady: boolean, joinedAt: number }]
    maxPlayers: 4,
    status: 'lobby',   // 'lobby' | 'active' | 'ended'
    settings: {
      mode: 'standard'
    },
    messages: [],      // [{ id: string, sender: string, text: string, time: string }]
    sharedData: {},    // Extensible data dictionary for the new project!
    joinedPlayer: null,
    isDisbanded: false
  },

  _realtimeChannel: null,

  init() {
    this.generateRoomCode();
    this.bindEvents();
    this.renderPlayerChips();
    this.listenStateSync();

    // Initialize Auth
    AuthManager.init();

    // Check for public URL direct room join hash (e.g. #room=ROOM-8294)
    if (window.location.hash && window.location.hash.includes('room=')) {
      const match = window.location.hash.match(/room=([A-Za-z0-9\-]+)/);
      if (match && match[1]) {
        const urlRoomCode = match[1].toUpperCase();
        setTimeout(() => {
          this.openJoinModal(urlRoomCode);
        }, 300);
      }
    }
  },

  /* ── Room Code Generation ─────────────────────────────────────────────── */
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `ROOM-${rand}`;
    this.state.roomCode = code;

    const displayEl = document.getElementById('roomCodeDisplay');
    if (displayEl) displayEl.textContent = code;

    const dashEl = document.getElementById('dashRoomCode');
    if (dashEl) dashEl.textContent = `ROOM: ${code}`;

    return code;
  },

  /* ── Database Real-Time Broadcasting (Supabase) ────────────────────────── */
  async broadcastStateUpdate() {
    if (!this.state.roomCode) return;
    try {
      const payload = {
        roomCode: this.state.roomCode.toUpperCase(),
        partyName: this.state.partyName || 'Multiplayer Room',
        hostName: this.state.hostName,
        players: this.state.players,
        maxPlayers: this.state.maxPlayers || 4,
        status: this.state.status || 'lobby',
        settings: this.state.settings,
        messages: this.state.messages || [],
        sharedData: this.state.sharedData || {},
        isDisbanded: !!this.state.isDisbanded,
        timestamp: Date.now()
      };

      if (window._supabase) {
        await window._supabase.from('game_rooms').upsert({
          room_code: this.state.roomCode.toUpperCase(),
          state: payload
        }, { onConflict: 'room_code' });
      }
    } catch(e) {
      console.warn('[Supabase] broadcastStateUpdate error:', e);
    }
  },

  async getRoomData(roomCode) {
    if (!roomCode) return null;
    const cleanCode = roomCode.trim().toUpperCase();
    try {
      if (window._supabase) {
        const { data, error } = await window._supabase
          .from('game_rooms')
          .select('state')
          .eq('room_code', cleanCode)
          .maybeSingle();
        if (error) { console.warn('[Supabase] getRoomData error:', error); return null; }
        return data?.state || null;
      }
      return null;
    } catch(e) {
      console.warn('[Supabase] getRoomData exception:', e);
      return null;
    }
  },

  listenStateSync() {
    try {
      if (!window._supabase) {
        console.warn('[Supabase] client not ready, realtime sync disabled');
        return;
      }

      this._realtimeChannel = window._supabase
        .channel('game_rooms_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'game_rooms' },
          (payload) => {
            const newState = payload.new?.state;
            if (newState) this.handleRemoteSync(newState);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[Supabase] Realtime connected ✅');
            const badge = document.getElementById('dbStatusBadge');
            if (badge) badge.innerHTML = `<span class="pulse-dot"></span> Supabase Connected`;
          }
        });
    } catch(e) {
      console.warn('[Supabase] listenStateSync error:', e);
    }
  },

  handleRemoteSync(data) {
    if (!data || !data.roomCode) return;
    // Only process sync if it matches this tab's active room
    if (!this.state.roomCode || data.roomCode.toUpperCase() !== this.state.roomCode.toUpperCase()) {
      return;
    }

    if (data.isDisbanded) {
      if (this.state.isDisbanded) return;
      this.state.isDisbanded = true;
      this.state.players = [];
      this.state.joinedPlayer = null;
      this.state.roomCode = '';

      document.getElementById('partyModal')?.classList.remove('active');
      document.getElementById('joinPartyModal')?.classList.remove('active');

      if (window.location.hash && window.location.hash.includes('room=')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      alert('💥 The room has been disbanded by the host!');
      return;
    }

    this.state.partyName = data.partyName || this.state.partyName;
    this.state.hostName = data.hostName || this.state.hostName;
    this.state.players = data.players || [];
    this.state.maxPlayers = data.maxPlayers || this.state.maxPlayers;
    this.state.status = data.status || this.state.status;
    this.state.messages = data.messages || [];
    this.state.sharedData = data.sharedData || {};

    // Refresh UI Components
    this.renderPlayerChips();
    this.renderWaitingLobby();
    this.renderDashboardPlayers();
    this.renderChatMessages();

    // Synchronize joined client step based on room status
    if (this.state.joinedPlayer) {
      if (this.state.status === 'active') {
        this.showStepInModal('joinPartyModal', 'joinDashboardStep');
      } else if (this.state.status === 'lobby') {
        this.showStepInModal('joinPartyModal', 'joinWaitingStep');
      }
    }
  },

  /* ── Player Management & UI Rendering ─────────────────────────────────── */
  renderPlayerChips() {
    const listEl = document.getElementById('playersChipsList');
    const badgeEl = document.getElementById('playerCountBadge');
    if (!listEl) return;

    listEl.innerHTML = '';
    if (badgeEl) badgeEl.textContent = this.state.players.length;

    this.state.players.forEach((player, idx) => {
      const chip = document.createElement('div');
      chip.className = `player-chip ${player.isHost ? 'is-host' : ''}`;
      chip.innerHTML = `
        <span>${player.isHost ? '👑 ' : '👤 '}${player.name}</span>
        ${!player.isHost ? `<button class="player-chip-remove" data-index="${idx}" title="Remove player">&times;</button>` : ''}
      `;
      listEl.appendChild(chip);
    });

    listEl.querySelectorAll('.player-chip-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        this.removePlayerByIndex(idx);
      });
    });
  },

  addPlayer(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    if (this.state.players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Player "${trimmed}" is already in the room!`);
      return;
    }
    if (this.state.players.length >= this.state.maxPlayers) {
      alert(`Maximum player capacity (${this.state.maxPlayers}) reached!`);
      return;
    }

    this.state.players.push({
      name: trimmed,
      isHost: this.state.players.length === 0,
      isReady: true,
      joinedAt: Date.now()
    });

    this.renderPlayerChips();
    this.broadcastStateUpdate();
  },

  removePlayerByIndex(idx) {
    if (idx >= 0 && idx < this.state.players.length) {
      this.state.players.splice(idx, 1);
      this.renderPlayerChips();
      this.broadcastStateUpdate();
    }
  },

  renderWaitingLobby() {
    const roomTitle = document.getElementById('waitingRoomTitle');
    const countEl = document.getElementById('waitingPlayerCount');
    const chipsEl = document.getElementById('waitingPlayersChips');

    if (roomTitle) roomTitle.textContent = `ROOM: ${this.state.roomCode}`;
    if (countEl) countEl.textContent = `${this.state.players.length} / ${this.state.maxPlayers}`;

    if (chipsEl) {
      chipsEl.innerHTML = '';
      this.state.players.forEach(p => {
        const chip = document.createElement('div');
        chip.className = `player-chip ${p.isHost ? 'is-host' : ''}`;
        chip.textContent = `${p.isHost ? '👑 ' : '👤 '}${p.name}`;
        chipsEl.appendChild(chip);
      });
    }
  },

  renderDashboardPlayers() {
    const hostGrid = document.getElementById('dashPlayersGrid');
    const clientGrid = document.getElementById('clientPlayersGrid');

    const renderGrid = (container, isClient) => {
      if (!container) return;
      container.innerHTML = '';
      this.state.players.forEach(p => {
        const isSelf = isClient && this.state.joinedPlayer?.name === p.name;
        const card = document.createElement('div');
        card.className = `dash-player-card ${isSelf ? 'is-self' : ''}`;
        const initial = (p.name.charAt(0) || 'P').toUpperCase();
        card.innerHTML = `
          <div class="avatar">${initial}</div>
          <div class="name">${p.isHost ? '👑 ' : ''}${p.name}</div>
          <div class="status">🟢 Online</div>
        `;
        container.appendChild(card);
      });
    };

    renderGrid(hostGrid, false);
    renderGrid(clientGrid, true);
  },

  /* ── Live Room Chat ────────────────────────────────────────────────────── */
  async sendChatMessage(sender, text) {
    const cleanText = (text || '').trim();
    if (!cleanText) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const msg = {
      id: Date.now() + Math.random().toString(36).substr(2, 4),
      sender: sender || 'Player',
      text: cleanText,
      time: timeStr
    };

    this.state.messages = this.state.messages || [];
    this.state.messages.push(msg);
    if (this.state.messages.length > 50) this.state.messages.shift();

    this.renderChatMessages();
    await this.broadcastStateUpdate();
  },

  renderChatMessages() {
    const hostBox = document.getElementById('dashChatMessages');
    const clientBox = document.getElementById('clientChatMessages');

    const renderBox = (container, selfName) => {
      if (!container) return;
      container.innerHTML = '';
      (this.state.messages || []).forEach(msg => {
        const bubble = document.createElement('div');
        const isSelf = selfName && msg.sender.toLowerCase() === selfName.toLowerCase();
        bubble.className = `chat-bubble ${isSelf ? 'is-self' : ''}`;
        bubble.innerHTML = `
          <div class="chat-sender">${msg.sender} <span class="chat-time">${msg.time}</span></div>
          <div class="chat-text">${msg.text}</div>
        `;
        container.appendChild(bubble);
      });
      container.scrollTop = container.scrollHeight;
    };

    renderBox(hostBox, this.state.hostName);
    renderBox(clientBox, this.state.joinedPlayer?.name);
  },

  /* ── Modal Step Navigation ─────────────────────────────────────────────── */
  showStepInModal(modalId, stepId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.querySelectorAll('.party-step').forEach(step => step.classList.remove('active'));
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');
  },

  openHostModal() {
    this.generateRoomCode();
    this.state.isDisbanded = false;
    this.state.status = 'lobby';
    this.state.messages = [];
    this.state.sharedData = {};

    const hostName = AuthManager.getDisplayName();
    const hostInput = document.getElementById('hostNameInput');
    if (hostInput) hostInput.value = hostName;
    this.state.hostName = hostName;

    this.state.players = [{
      name: hostName,
      isHost: true,
      isReady: true,
      joinedAt: Date.now()
    }];

    this.renderPlayerChips();
    this.broadcastStateUpdate();
    this.showStepInModal('partyModal', 'partySetupStep');
  },

  openJoinModal(prefillCode = '') {
    const codeInput = document.getElementById('joinRoomCodeInput');
    const nameInput = document.getElementById('joinPlayerNameInput');
    if (codeInput && prefillCode) codeInput.value = prefillCode;
    if (nameInput) nameInput.value = AuthManager.getDisplayName();
    this.showStepInModal('joinPartyModal', 'joinSetupStep');
  },

  async joinParty(code, name) {
    let cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) { alert('Please enter a valid Room Code.'); return; }
    if (!cleanCode.startsWith('ROOM-') && !cleanCode.includes('-')) {
      cleanCode = 'ROOM-' + cleanCode;
    }

    const cleanName = (name || '').trim();
    if (!cleanName) { alert('Please enter your player name.'); return; }

    const roomData = await this.getRoomData(cleanCode);
    if (!roomData) {
      alert(`Room "${cleanCode}" was not found or is no longer active!`);
      return;
    }

    this.state.roomCode = cleanCode;
    this.state.partyName = roomData.partyName || 'Multiplayer Room';
    this.state.hostName = roomData.hostName || 'Host';
    this.state.maxPlayers = roomData.maxPlayers || 4;
    this.state.players = roomData.players || [];
    this.state.status = roomData.status || 'lobby';
    this.state.messages = roomData.messages || [];
    this.state.sharedData = roomData.sharedData || {};

    const existing = this.state.players.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
    if (!existing) {
      if (this.state.players.length >= this.state.maxPlayers) {
        alert('This room is currently full!');
        return;
      }
      this.state.players.push({
        name: cleanName,
        isHost: false,
        isReady: true,
        joinedAt: Date.now()
      });
      await this.broadcastStateUpdate();
    }

    this.state.joinedPlayer = { name: cleanName, isHost: false };

    const tag = document.getElementById('joinRoomTag');
    if (tag) tag.textContent = `ROOM: ${cleanCode}`;
    const header = document.getElementById('joinPlayerHeader');
    if (header) header.textContent = `${cleanName.toUpperCase()} — DASHBOARD`;

    if (this.state.status === 'active') {
      this.showStepInModal('joinPartyModal', 'joinDashboardStep');
      this.renderDashboardPlayers();
      this.renderChatMessages();
    } else {
      this.showStepInModal('joinPartyModal', 'joinWaitingStep');
      this.renderWaitingLobby();
    }
  },

  async launchSession() {
    if (this.state.players.length < 1) {
      alert('You need at least 1 player in the room to launch!');
      return;
    }

    this.state.status = 'active';
    await this.broadcastStateUpdate();

    this.showStepInModal('partyModal', 'partyDashboardStep');
    this.renderDashboardPlayers();
    this.renderChatMessages();
  },

  async resetSession() {
    this.state.status = 'lobby';
    await this.broadcastStateUpdate();
    this.showStepInModal('partyModal', 'partySetupStep');
    this.renderPlayerChips();
  },

  async disbandParty() {
    if (!confirm('💥 Are you sure you want to disband this room for all players?')) return;
    this.state.isDisbanded = true;
    await this.broadcastStateUpdate();

    this.state.players = [];
    this.state.joinedPlayer = null;
    this.state.roomCode = '';

    document.getElementById('partyModal')?.classList.remove('active');
    document.getElementById('joinPartyModal')?.classList.remove('active');
  },

  closeHostParty() {
    document.getElementById('partyModal')?.classList.remove('active');
  },

  closeJoinParty() {
    document.getElementById('joinPartyModal')?.classList.remove('active');
  },

  copyPublicRoomLink() {
    if (!this.state.roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}#room=${this.state.roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`📋 Room Link Copied!\n\n${url}`);
    }).catch(() => {
      prompt('Copy this room link:', url);
    });
  },

  /* ── Event Listeners ───────────────────────────────────────────────────── */
  bindEvents() {
    // Header Buttons
    document.getElementById('hostPartyBtn')?.addEventListener('click', () => this.openHostModal());
    document.getElementById('joinPartyBtn')?.addEventListener('click', () => this.openJoinModal());

    // Hero CTA Buttons
    document.getElementById('heroHostBtn')?.addEventListener('click', () => this.openHostModal());
    document.getElementById('heroJoinBtn')?.addEventListener('click', () => this.openJoinModal());

    // Close Modals
    document.getElementById('partyModalCloseBtn')?.addEventListener('click', () => this.closeHostParty());
    document.getElementById('joinModalCloseBtn')?.addEventListener('click', () => this.closeJoinParty());

    // Exit Buttons
    document.getElementById('exitHostPartyBtn')?.addEventListener('click', () => this.closeHostParty());
    document.getElementById('exitHostDashBtn')?.addEventListener('click', () => this.closeHostParty());
    document.getElementById('exitJoinPartyBtn')?.addEventListener('click', () => this.closeJoinParty());
    document.getElementById('exitWaitingBtn')?.addEventListener('click', () => this.closeJoinParty());
    document.getElementById('exitJoinDashBtn')?.addEventListener('click', () => this.closeJoinParty());

    // Disband Buttons
    document.getElementById('disbandHostPartyBtn')?.addEventListener('click', () => this.disbandParty());
    document.getElementById('disbandHostDashBtn')?.addEventListener('click', () => this.disbandParty());

    // Share link buttons
    document.getElementById('shareRoomLinkBtn')?.addEventListener('click', () => this.copyPublicRoomLink());
    document.getElementById('shareRoomLinkBtnDash')?.addEventListener('click', () => this.copyPublicRoomLink());

    // Regen Code button
    document.getElementById('regenCodeBtn')?.addEventListener('click', () => this.generateRoomCode());

    // Add Player manually in Host Setup
    const addBtn = document.getElementById('addPlayerBtn');
    const playerInput = document.getElementById('newPlayerNameInput');
    if (addBtn && playerInput) {
      addBtn.addEventListener('click', () => {
        this.addPlayer(playerInput.value);
        playerInput.value = '';
      });
      playerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addPlayer(playerInput.value);
          playerInput.value = '';
        }
      });
    }

    // Party Name & Host Name inputs
    document.getElementById('partyNameInput')?.addEventListener('input', (e) => {
      this.state.partyName = e.target.value;
    });
    document.getElementById('hostNameInput')?.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        this.state.hostName = val;
        if (this.state.players.length > 0 && this.state.players[0].isHost) {
          this.state.players[0].name = val;
          this.renderPlayerChips();
        }
      }
    });

    // Max players select
    document.getElementById('playerCountSelect')?.addEventListener('change', (e) => {
      this.state.maxPlayers = parseInt(e.target.value, 10) || 4;
      const note = document.getElementById('maxPlayerNote');
      if (note) note.textContent = `Max ${this.state.maxPlayers}`;
    });

    // Launch Session Button
    document.getElementById('startGameDealBtn')?.addEventListener('click', () => this.launchSession());

    // Reset Session Button
    document.getElementById('endGameResetBtn')?.addEventListener('click', () => this.resetSession());

    // Submit Join Party Form
    document.getElementById('submitJoinPartyBtn')?.addEventListener('click', () => {
      const code = document.getElementById('joinRoomCodeInput')?.value;
      const name = document.getElementById('joinPlayerNameInput')?.value;
      this.joinParty(code, name);
    });

    // Host Chat send
    const hostChatBtn = document.getElementById('dashChatSendBtn');
    const hostChatInput = document.getElementById('dashChatInput');
    if (hostChatBtn && hostChatInput) {
      hostChatBtn.addEventListener('click', () => {
        this.sendChatMessage(this.state.hostName || 'Host', hostChatInput.value);
        hostChatInput.value = '';
      });
      hostChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendChatMessage(this.state.hostName || 'Host', hostChatInput.value);
          hostChatInput.value = '';
        }
      });
    }

    // Client Chat send
    const clientChatBtn = document.getElementById('clientChatSendBtn');
    const clientChatInput = document.getElementById('clientChatInput');
    if (clientChatBtn && clientChatInput) {
      clientChatBtn.addEventListener('click', () => {
        this.sendChatMessage(this.state.joinedPlayer?.name || 'Player', clientChatInput.value);
        clientChatInput.value = '';
      });
      clientChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendChatMessage(this.state.joinedPlayer?.name || 'Player', clientChatInput.value);
          clientChatInput.value = '';
        }
      });
    }

    // Test Real-Time Event button
    document.getElementById('testBroadcastBtn')?.addEventListener('click', async () => {
      this.state.sharedData = this.state.sharedData || {};
      this.state.sharedData.lastPing = Date.now();
      await this.sendChatMessage('SYSTEM', `⚡ Ping test triggered at ${new Date().toLocaleTimeString()}!`);
    });
  }
};

// Aliases for complete backward compatibility
window.PartyManager = MultiplayerManager;
window.MultiplayerManager = MultiplayerManager;
window.AuthManager = AuthManager;

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MultiplayerManager.init());
} else {
  MultiplayerManager.init();
}
