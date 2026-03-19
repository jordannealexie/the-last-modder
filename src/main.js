// ═══════════════════════════════════════════════════════════════
// THE LAST MODDER — main.js
// Full spec implementation: all zones, buildings, NPCs, systems
// ═══════════════════════════════════════════════════════════════

"use strict";

const TILE        = 32;
const WORLD_W     = 70;
const WORLD_H     = 48;
const GAME_W      = window.innerWidth;
const GAME_H      = window.innerHeight;
const RENDER_SCALE = 1;
const SAVE_KEY    = "tlm-save-v3";

// ── ZONE CONFIG ────────────────────────────────────────────────
const ZONES = {
  brennan:  { name: "Brennan's Crossing", ambient: 0x151210, base: 0  },
  ashfield: { name: "The Ashfield",       ambient: 0x131210, base: 5  },
  archive:  { name: "Forum Archive",      ambient: 0x0e0c14, base: 10 },
  dungeon:  { name: "Gorrath's Tomb",     ambient: 0x0a0810, base: 12 },
  server:   { name: "Server Room",        ambient: 0x07070e, base: 14 }
};
const ZONE_ORDER = ["brennan", "ashfield", "archive", "dungeon", "server"];

// ── DIALOGUE ────────────────────────────────────────────────────
const DIALOGUE = {
  mira: [
    "Welcome back, traveler.",
    "Name's Enix. I keep the inn lit so the dark doesn't win.",
    "The red bloom survived another night. I watch it like a heartbeat.",
    "Black cloth hides the ash, but not the memories.",
    "Miguel's steel at dawn is the only sound that feels alive."
  ],
  aldric: [
    "Measure twice, strike once. That's what my build guide said.",
    "I've had this build memorized for fifteen years. Never got to use it.",
    "Your stance improved. I can tell from the footstep pattern.",
    "Seventy-two pages. The Gorrath raid strategy document. Never used."
  ],
  herald: [
    "The dead cherry tree shed petals at dawn. Third time this week.",
    "I logged it. Day 5,694. 09:00 server time. Petal event. Three seconds.",
    "I have logged every event since day two. I am not sure why anymore.",
    "The weather is the same every day now. I still write it down."
  ],
  voss: [
    "Terminal six has been corrupted for six years. I don't touch it.",
    "No one remembers why we archived the apology thread. I kept it anyway.",
    "I laminated the forum rules in 2011. I wanted to preserve them properly.",
    "Someone started a post and never finished it. The cursor blinks."
  ],
  gorrath: [
    "You dare enter the tomb of Gorrath the—",
    "...wait.",
    "Without forty challengers this speech lands very strangely.",
    "I have draft forty-eight of the monologue. I've been working on the pacing."
  ],
  sable: [
    "[sys.msg] deleted_character_2007 persisted.",
    "[warn] world_instance_loneliness = rising",
    "[note] you can see me. that is unusual.",
    "[query] are you also still here by accident?"
  ],
  ewen: [
    "The crops don't take.",
    "I've tried everything the farming guide said. The soil won't respond.",
    "Except that one. Southeast corner. I didn't plant it.",
    "I look at it every morning on my walk. It just keeps growing."
  ],
  gm: [
    "[INSTANCE_GM01] Queue empty.",
    "[INSTANCE_GM01] Standing by for moderation requests.",
    "[INSTANCE_GM01] I have been standing by for 5,694 days.",
    "[INSTANCE_GM01] The moderation queue has been empty since Friday."
  ]
};

// ── NPC DISPLAY NAMES ──────────────────────────────────────────
const NPC_NAMES = {
  mira: "Enix", aldric: "Miguel", herald: "The Herald",
  voss: "Voss", gorrath: "Gorrath", sable: "Sable",
  ewen: "Ewen", gm: "INSTANCE_GM01"
};

// ── WORLD INTERACTABLES ────────────────────────────────────────
const INTERACTABLES = [
  // Brennan's Crossing
  { id:"inn-sign",     zone:"brennan",  x:6,  y:7,  text:"The sign reads THE EMBER INN. The E is hanging lower than the rest — the nail worked loose years ago.", journal:"Ember Inn sign still crooked. The E nail never got fixed." },
  { id:"market-board", zone:"brennan",  x:25, y:8,  text:"Message board: 'LFG Gorrath raid — need tank/healer — Dex_Slayer99.' 'WTS Enchanted Boots +3 DEX 500g.' 'this game is dying lol.' 'goodbye everyone. it was fun. — Kira'", journal:"Found old market board messages. Kira's goodbye is still pinned." },
  { id:"fountain-bag", zone:"brennan",  x:35, y:28, text:"A worn bag by the fountain. Inside: a corrupted map (shows only water tiles), and a note: 'brb dinner' — dated 6,843 days ago.", journal:"Found a bag at the fountain. The note says 'brb dinner'. They never came back.", secret:"brb-note" },
  { id:"dead-tree",    zone:"brennan",  x:14, y:24, text:"The dead cherry tree. Gray branches. No leaves. And yet, once a day, it chooses to bloom.", journal:"The dead cherry tree blooms once a day. No explanation." },
  { id:"darkrift88",   zone:"brennan",  x:11, y:17, text:"A frozen logout silhouette. Name tag: DarkRift_88 [OFFLINE]. The chair across from them is pulled out slightly. Someone sits there sometimes.", journal:"Found DarkRift_88 still logged in at their usual table.", secret:"darkrift-table" },
  { id:"flower-bloom", zone:"brennan",  x:7,  y:9,  text:"One red bloom in the flower box. Three dead stalks. One stubborn, living thing.", journal:"One flower is still alive at the inn. Enix tends it.", secret:"red-bloom" },
  { id:"glitch-kiosk",  zone:"brennan",  x:31, y:12, text:"A broken event kiosk flashes old tournament brackets. Every champion slot now says [OFFLINE].", journal:"Found a glitched tournament kiosk in Brennan's Crossing." },
  { id:"cable-nest",    zone:"brennan",  x:42, y:24, text:"A nest of Ethernet cables braided through a cracked lantern post. Someone labeled one cable: 'to nowhere'.", journal:"Saw cable-vines wrapped around a dead lamp post.", secret:"cable-vines" },
  // Ashfield
  { id:"windmill-stump",zone:"ashfield",x:40, y:15, text:"Three sails rotate. The fourth was never replaced after it broke in 2011. The imbalance makes the whole thing wobble slightly.", journal:"Ashfield windmill: three sails. The fourth is missing." },
  { id:"single-crop",  zone:"ashfield", x:46, y:35, text:"One tile of green in a field of ash. No marker, no stake. Ewen didn't plant it. It just grows.", journal:"Found the single surviving crop. Green. Unexplained.", secret:"green-crop" },
  { id:"chimney-alone",zone:"ashfield", x:55, y:38, text:"A chimney standing alone. Walls gone. Foundation cracked. A single boot sits on the stone. No explanation given.", journal:"Farm C: just a chimney and one boot." },
  { id:"wall-tally",   zone:"ashfield", x:12, y:14, text:"7,304 tick marks filling three walls of the farmhouse. Groups of five. One mark per day. The count is current.", journal:"Ewen has made 7,304 marks on his walls. One per day.", secret:"tally-marks" },
  { id:"farmb-journal",zone:"ashfield", x:38, y:22, text:"A journal on the floor. Farming notes, guild plans, crop rotation schedules. Last entry: 'logging off for finals week. back soon.'", journal:"Found the abandoned farming journal. Last entry: 'back soon'." },
  { id:"child-drawing",zone:"ashfield", x:20, y:22, text:"A child's drawing pinned to the wall — a player character sketched with the in-game art tool in 2004. Rough lines. Clearly happy.", journal:"Found a child's drawing of their character from 2004." },
  { id:"drone-husk",   zone:"ashfield", x:33, y:34, text:"A rusted delivery drone half-buried in ash. Inventory slot still contains one potion and a birthday cupcake.", journal:"Found a wrecked delivery drone in Ashfield." },
  { id:"pixel-totem",  zone:"ashfield", x:50, y:19, text:"A tilted holographic totem keeps trying to render grass textures. The files are missing, so it paints static instead.", journal:"A farm totem now renders static where crops should be." },
  // Archive
  { id:"terminal-1",   zone:"archive",  x:16, y:18, terminal:"general",    text:"General Discussion terminal hums awake." },
  { id:"terminal-2",   zone:"archive",  x:22, y:18, terminal:"guild",      text:"Guild Recruitment terminal. The Ashveil post is still at the top." },
  { id:"terminal-3",   zone:"archive",  x:28, y:18, terminal:"trade",      text:"Trade terminal. Prices in currency that no longer exists." },
  { id:"terminal-4",   zone:"archive",  x:16, y:24, terminal:"support",    text:"Help & Support. Most questions have zero replies." },
  { id:"terminal-5",   zone:"archive",  x:22, y:24, terminal:"offtopic",   text:"Off-Topic. The most human place in the archive." },
  { id:"terminal-6",   zone:"archive",  x:28, y:24, terminal:"corrupted",  text:"Terminal Six. Voss watches it from across the room.", secret:"corrupted-terminal" },
  { id:"unfinished",   zone:"archive",  x:33, y:14, terminal:"unfinished", text:"A terminal with a blinking cursor. A post that was never finished." },
  { id:"archive-bell", zone:"archive",  x:20, y:38, text:"A small reception bell. The kind that means someone is waiting.", journal:"Rang the archive reception bell. Voss heard it." },
  { id:"lam-rules",    zone:"archive",  x:18, y:40, text:"Forum rules, 2003 edition, laminated. The lamination is smooth and precise. Voss laminated them in 2011.", journal:"Found the laminated forum rules. Voss wanted to preserve them properly." },
  { id:"backup-cassettes", zone:"archive", x:24, y:36, text:"Crates of backup cassettes, each tagged by month. Most are blank. One is labeled: 'LAST FRIDAY, DO NOT ERASE'.", journal:"Found backup cassettes in the archive basement stacks." },
  { id:"wire-altar",      zone:"archive", x:30, y:40, text:"A coil of old modem lines arranged like a shrine around an unplugged router. Someone left candles made of melted keycaps.", journal:"Found a strange cable shrine in the Forum Archive.", secret:"wire-altar" },
  // Dungeon
  { id:"raid-banners", zone:"dungeon", x:34, y:28, text:"Torn raid banners from guilds that never got their attempt. Names faded, logos still visible in the dust.", journal:"Saw torn raid banners in Gorrath's Tomb." },
  { id:"cracked-orb",  zone:"dungeon", x:48, y:19, text:"A cracked orb displays frozen party frames: 40 slots, all disconnected.", journal:"A dungeon orb still tracks a raid that never assembled." },
  // Server
  { id:"srv-console",  zone:"server",   x:44, y:18, text:"Server metrics: players online: 1 human, 7 persistent entities. Uptime: 5,694 days. No scheduled maintenance.", journal:"Server room: 5,694 days uptime. No maintenance scheduled." },
  { id:"error-log",    zone:"server",   x:30, y:22, text:"Error log, 2009-08-14: 'SHUTDOWN SEQUENCE INITIATED. SHUTDOWN SEQUENCE ABORTED — OPERATOR DISCONNECT DURING SEQUENCE.' The shutdown never finished.", journal:"Found the shutdown error log. The server was never properly stopped.", secret:"shutdown-abort" },
  { id:"coolant-puddle", zone:"server", x:38, y:30, text:"A neon coolant puddle ripples like liquid CRT glass. It reflects lines of code instead of your face.", journal:"Found a coolant leak reflecting scrolling code." },
  { id:"cable-spine",    zone:"server", x:18, y:16, text:"A backbone trunk cable as thick as a tree root runs through the floor and disappears into the wall. Status LED: still blinking.", journal:"Traced the server backbone cable through the room.", secret:"backbone-spine" }
];

// ── FORUM TERMINAL CONTENT ─────────────────────────────────────
const TERMINALS = {
  general: {
    label:"General Discussion",
    threads:[
      { title:"is the game dying", body:"[2006] DarkRift_88: is the game dying lol\n\n[2006] GrassyBoy47: no way, they just added the dungeon zone\n\n[2007] Kira: maybe. my whole guild quit\n\n[2007] Dex_Slayer99: still here\n\n[2008] TavernKnight: logging in every day\n\n[2009] herald_npc: [SERVER ENTITY] I am still here.\n\n[2009] Dex_Slayer99: see you friday." },
      { title:"Patch 1.14.2 CELEBRATION", body:"Patch 1.14.2 deployed!\n\nPlayers posted ASCII fireworks for 19 pages.\n\n╔══════╗\n║ ★  ★ ║\n╚══════╝\n\n/dance /dance /dance\n\n'best patch ever' — GrassyBoy47\n'THIS IS THE GREATEST DAY' — DarkRift_88\n\n[2009] server_entity_mira: [SERVER ENTITY] I remember this day." },
      { title:"anyone else see the dead tree?", body:"[2007] DarkRift_88: there's a dead tree in the fountain square that drops pink petals every morning at exactly 9am\n\n[2007] DarkRift_88: I've watched it three days in a row\n\n[2007] DarkRift_88: is this intentional??\n\n0 replies.\n\nThe tree is still doing it." }
    ]
  },
  guild: {
    label:"Guild Recruitment",
    threads:[
      { title:"[RECRUITING] Ashveil Guild — family-friendly", body:"We are a family-friendly guild looking for healers, crafters, and patient people.\n\nRaid nights: Tuesday and Thursday, 8pm EST.\nNo drama. No elitism. Just good people playing a good game together.\n\nCurrent roster:\n- Kira (support/heal lead)\n- DarkRift_88 (pending — we're waiting)\n- GrassyBoy47 (farmer liaison)\n- Dex_Slayer99 (DPS lead)\n- TavernKnight (economics/trade)\n\nWe're going to get Gorrath down together. I believe in this group.\n\nStatus: guild never formally launched.\nKira logged off in October.\nEveryone waited a while.\nThen they waited a little longer." },
      { title:"Gorrath Raid — Strategy Doc v7.2", body:"Phase 1 (100-80%): Tank holds aggro at entrance. All healers stay back.\nPhase 2 (80-40%): DPS rotation begins. Watch for Tomb Veil mechanic.\nPhase 3 (40-20%): SPREAD OUT. Tomb Veil hits the whole group.\nPhase 4 (<20%): All in. Everything you have.\n\n72 pages of notes attached.\nRaid leader: DarkRift_88 (proposed)\n\nStatus: document was never used.\nGorrath is still at 100% health." }
    ]
  },
  trade: {
    label:"Trade",
    threads:[
      { title:"[WTS] Ember Cloak — 2,500g or best offer", body:"[2008] Kira: WTS [Ember Cloak] 2,500g or best offer. Stats: +15 fire res, +8 DEX, unique glow effect. DM me!\n\n2 players expressed interest. Neither followed up.\nLast activity: 2009.\n\nThe cloak is still in her inventory." },
      { title:"[WTS] Worn Leather Glove — 75g", body:"[2008] TavernKnight: Item: Worn Leather Glove\nCondition: patched twice, still durable\nPrice: 75g firm\n\n'This was my first crafted item. I thought it was worth something.\nIf you're reading this — I never came back to check if it sold.'\n\n— Message to seller available.", contactSeller: true }
    ]
  },
  support: {
    label:"Help & Support",
    threads:[
      { title:"How do I get to Gorrath's Tomb?", body:"[2007] new_player_4: How do I get to Gorrath's Tomb? I've been looking for an hour.\n\n0 replies.\n\nThe player found it eventually. Or didn't.\nWe can't know for certain." },
      { title:"Is anyone getting disconnected today?", body:"[2009] Dex_Slayer99: Is anyone else getting disconnected every 10 minutes? It's only happening to me.\n\n0 replies.\n\nThe servers were having issues that week.\nFive days later, the shutdown announcement went up." },
      { title:"The servers are going down Friday", body:"[2009] ADMIN_VALDRIS: After six incredible years, Valdris Online will be shutting down this Friday at midnight.\n\nThank you to our community. It has been an honor.\n\n47 replies:\n\nDex_Slayer99: no.\nKira: I'm not ready.\nGrassyBoy47: this can't be real.\nTavernKnight: I'll be online until the last second.\nDarkRift_88: see you guys.\nDex_Slayer99: see you friday.\n\n[The remaining 40 replies are goodbyes.]\n\nFriday came.\nThe server did not go down." }
    ]
  },
  offtopic: {
    label:"Off-Topic",
    threads:[
      { title:"my dog died today", body:"[2007] GrassyBoy47: my dog died today. just wanted to tell someone.\n\nDex_Slayer99: im sorry man. that sucks.\nKira: sending hugs. what was their name?\nGrassyBoy47: charlie\nTavernKnight: RIP charlie\nDarkRift_88: :(\n\nTwo more replies offering condolences.\nThen the thread went quiet.\n\nGrassyBoy47 logged in the next morning anyway.\nHe always did." },
      { title:"happy new year 2008!!!!", body:"[2008] Kira: happy new year everyone!!!! 2008 is gonna be great!!\n\n14 replies of celebration and optimism.\n\n'best year ever, calling it now' — DarkRift_88\n'finally going to get gorrath' — Dex_Slayer99\n'I love you all honestly' — GrassyBoy47\n\n2008 was the last full year.\nIt was a pretty good year, actually." },
      { title:"what do you all do irl", body:"[2006] GrassyBoy47: anyone wanna share what they do in real life?\n\nKira: high school. junior year.\nGrassyBoy47: farming. obviously haha\nDex_Slayer99: security work. night shifts.\nTavernKnight: small shop. always busy.\nDarkRift_88: just graduated. not sure what's next.\n\nSome of them are still doing those things.\nSome of them aren't.\nWe don't know which is which." }
    ]
  },
  corrupted: {
    label:"[CORRUPTED]",
    threads:[
      { title:"signal fragments", body:"whitenoise//user:[UNKNOWN]\nassembling...\ndissolving...\n\n─────────────────────────────\nfragment 01:\n'I didn't mean to stay'\n─────────────────────────────\nfragment 02:\n'the others left but I couldn't'\n─────────────────────────────\nfragment 03:\n[REGISTRY MISMATCH]\n[character not found in account database]\n\nERROR: this entity has no registered owner\nERROR: entity persists regardless\nERROR: this is not supposed to be possible" },
      { title:"unregistered entity", body:"name detected: __sable.thread\nstatus: NOT IN ACCOUNT RECORDS\n\ncharacter data: exists\nlogin history: [CORRUPTED]\ncreation date: [CORRUPTED]\nfirst login: [CORRUPTED]\n\nnote: this character was deleted in 2007\nnote: deletion sequence did not complete\nnote: Voss is aware\nnote: Voss does not discuss it" }
    ]
  },
  unfinished: {
    label:"Unfinished Post",
    threads:[
      { title:"Draft — To the Ashveil guild", body:"To everyone in the Ashveil guild —\n\nI wanted to say that this past year has been the best I've ever had online. You guys made this game feel like home. I'm sorry I've been away. Things at home have been", isUnfinished: true }
    ]
  }
};

// ── CHARACTER PALETTES ─────────────────────────────────────────
const PALETTES = {
  player:  { skin:"#c89a6a", hair:"#3d2b1f", coat:"#2d3a5c", coatD:"#1d2a4c", pant:"#2a2a35", shoe:"#5c3d2e", acc:"#c8b890", shadow:true,  special:null      },
  mira:    { skin:"#d8c8c3", hair:"#05060b", coat:"#10121a", coatD:"#090b12", pant:"#0a0c13", shoe:"#0b0d14", acc:"#5b4678", shadow:true,  special:"enix"    },
  aldric:  { skin:"#d6c9c2", hair:"#090b12", coat:"#7a7060", coatD:"#4a4030", pant:"#3a3a3a", shoe:"#3a2a1a", acc:"#c8a870", shadow:true,  special:null      },
  herald:  { skin:"#b89070", hair:"#9a8060", coat:"#6a4a3a", coatD:"#4a2a1a", pant:"#4a3a30", shoe:"#3a2a20", acc:"#ccaa88", shadow:true,  special:null      },
  voss:    { skin:"#d4c4a8", hair:"#e8e0d0", coat:"#7a7a8a", coatD:"#5a5a6a", pant:"#4a4a5a", shoe:"#2a2a35", acc:"#d0c8b8", shadow:true,  special:null      },
  gorrath: { skin:"#7a5060", hair:"#1a1a25", coat:"#1a1a25", coatD:"#2a2a35", pant:"#2a2a35", shoe:"#2a2a2a", acc:"#6a1020", shadow:true,  special:"gorrath" },
  sable:   { skin:"#a8a0b0", hair:"#d8d0e8", coat:"#4a4a6a", coatD:"#2a2a4a", pant:"#3a3a5a", shoe:"#2a2a40", acc:"#7a8ab0", shadow:false, special:"sable"   },
  ewen:    { skin:"#a07050", hair:"#6a4a2a", coat:"#4a5a3a", coatD:"#3a4a2a", pant:"#3a3a2a", shoe:"#3a2a1a", acc:"#8a9a6a", shadow:true,  special:null      },
  gm:      { skin:"#8090a0", hair:"#1a1a20", coat:"#203060", coatD:"#101840", pant:"#202840", shoe:"#1a1a30", acc:"#2060ff", shadow:true,  special:null      }
};

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

function rn(min, max) { return Phaser.Math.Between(min, max); }
function rc(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}
function outl(ctx, x, y, w, h) {
  ctx.strokeStyle="#1a1020"; ctx.lineWidth=1;
  ctx.strokeRect(x+.5,y+.5,w-1,h-1);
}
function shadeHex(hex, d) {
  try {
    const c = Phaser.Display.Color.HexStringToColor(hex).color;
    const rgb = Phaser.Display.Color.IntegerToRGB(c);
    return Phaser.Display.Color.RGBToString(
      Phaser.Math.Clamp(rgb.r+d,0,255),
      Phaser.Math.Clamp(rgb.g+d,0,255),
      Phaser.Math.Clamp(rgb.b+d,0,255),255,"#");
  } catch(_){ return hex; }
}

// ══════════════════════════════════════════════════════════════
// MAIN SCENE
// ══════════════════════════════════════════════════════════════

class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
    // state
    this.zone        = "brennan";
    this.dayMins     = 16*60+29;
    this.sessecs     = 0;
    this.chatLines   = [];
    this.chatScroll  = 0;
    this.inDialogue  = false;
    this.dlgState    = null;
    this.gameStarted = false;
    this.lastInteract= 0;
    this.activePanelId=null;
    this.photoMode   = false;
    this.showPerf    = false;
    this.switchLock  = false;
    this.bellRung    = false;
    this.unfinishedDone=false;
    this.petalBurstDay=-1;
    this.mmAccum     = 0;
    this.vaneAngle   = 0;
    this.ewenIdx     = 0;
    this.zoneLights  = [];
    // save defaults
    this.save = {
      spoken:{}, secrets:[], journal:[], playtime:0,
      dayMins:16*60+29, flags:{}
    };
    // settings
    this.cfg = { master:0.7, music:0.55, bright:0.08, uiScale:1 };
    // input helpers
    this.fbKeys = new Set();
  }

  // ─────────────────────────────────────────────────
  preload() {}

  // ─────────────────────────────────────────────────
  create() {
    this.loadSave();
    this.dayMins = this.save.dayMins;
    this.sessecs = this.save.playtime;

    // keyboard
    this.keys = this.input.keyboard.addKeys(
      "W,A,S,D,E,F,UP,DOWN,LEFT,RIGHT,J,C,P,O,H,L,I,ESC"
    );
    this._regFbKeys();
    this._canvasFocus();

    // build all textures
    this._buildTextures();

    // lighting
    this.lights.enable().setAmbientColor(ZONES[this.zone].ambient);

    // world, actors
    this.createWorld();
    this.createActors();
    this.createAnims();
    this.createHUD();
    this.createDarkness();
    this.createLoadScreen();
    this.createScreenFX();
    this.createDlgUI();
    this.createPrompt();
    this.createParticles();
    this.applyZoneLighting();
    this.createSpecialFX();
    this.createPerfOverlay();

    // camera
    this.cameras.main.setZoom(RENDER_SCALE)
      .setBounds(0,0,WORLD_W*TILE,WORLD_H*TILE)
      .startFollow(this.player,true,0.08,0.08);

    // init chat
    this.addChat("[SERVER]: Day 5,694 of continuous operation.","#cc8800");
    this.addChat("The Ember Inn is quiet. Miguel is sharpening something.","#888",true);
    this.addChat("[SYSTEM]: Select PLAY to begin.","#cc8800");

    // E interact
    this.input.keyboard.on("keydown-E",(e)=>{
      if(e.repeat) return;
      if(this.time.now-this.lastInteract<160) return;
      this.lastInteract=this.time.now;
      if(!this.gameStarted) return;
      if(this.inDialogue){ this.advanceDlg(); return; }
      const t=this.getNearby(); if(t) this.interact(t);
    });

    // click interact
    this.input.on("pointerdown",(ptr)=>{
      if(!this.gameStarted) return;
      if(this.inDialogue){ this.advanceDlg(); return; }
      const wp=ptr.positionToCamera(this.cameras.main);
      const n=this.npcs.filter(n=>n.sp.visible)
        .map(n=>({n,d:Phaser.Math.Distance.Between(wp.x,wp.y,n.sp.x,n.sp.y)}))
        .sort((a,b)=>a.d-b.d)[0];
      if(n&&n.d<=36) this.startDlg(n.n);
    });

    this.bindHotkeys();
    this.bindMenu();
    this.setupForum();
    this.refreshJournal();

    // Ewen patrol
    this._startEwenPatrol();

    // Mira idle blink
    this.time.addEvent({
      delay:rn(9000,15000), loop:true,
      callback:()=>{
        if(this.inDialogue||this.zone!=="brennan") return;
        const m=this.npcs.find(n=>n.id==="mira");
        if(!m||!m.sp.visible) return;
        m.sp.setFrame(17);
        this.time.delayedCall(1300,()=>m.sp.setFrame(16));
      }
    });

    // autosave
    this.time.addEvent({delay:4000,loop:true,callback:()=>this.persistSave()});
    window.addEventListener("beforeunload",()=>this.persistSave());
  }

  // ─────────────────────────────────────────────────
  // SAVE / LOAD
  // ─────────────────────────────────────────────────
  loadSave() {
    try {
      const raw=localStorage.getItem(SAVE_KEY);
      if(!raw) return;
      const p=JSON.parse(raw);
      this.save={
        spoken:p.spoken||{},
        secrets:Array.isArray(p.secrets)?p.secrets:[],
        journal:Array.isArray(p.journal)?p.journal:[],
        playtime:Number(p.playtime)||0,
        dayMins:Number(p.dayMins)||(16*60+29),
        flags:p.flags||{}
      };
    } catch(_){}
  }
  persistSave() {
    try {
      this.save.playtime=this.sessecs;
      this.save.dayMins=this.dayMins;
      localStorage.setItem(SAVE_KEY,JSON.stringify(this.save));
    } catch(_){}
  }

  // ─────────────────────────────────────────────────
  // KEYBOARD HELPERS
  // ─────────────────────────────────────────────────
  _regFbKeys() {
    this._kd=(e)=>{ if(e&&e.code) this.fbKeys.add(e.code.toUpperCase()); };
    this._ku=(e)=>{ if(e&&e.code) this.fbKeys.delete(e.code.toUpperCase()); };
    window.addEventListener("keydown",this._kd);
    window.addEventListener("keyup",this._ku);
  }
  _canvasFocus() {
    const c=this.game&&this.game.canvas;
    if(!c) return;
    c.setAttribute("tabindex","0"); c.style.outline="none";
    c.addEventListener("pointerdown",()=>c.focus()); c.focus();
  }
  isDown(code,name) {
    if(name&&this.keys[name]&&this.keys[name].isDown) return true;
    return this.fbKeys.has(code);
  }

  // ─────────────────────────────────────────────────
  // TEXTURE BUILDING
  // ─────────────────────────────────────────────────
  _buildTextures() {
    const addSheet=(k,c)=>{ if(!this.textures.exists(k)) this.textures.addSpriteSheet(k,c,{frameWidth:32,frameHeight:48}); };
    const addTex=(k,c)=>{   if(!this.textures.exists(k)) this.textures.addCanvas(k,c); };

    addTex("terrain", this._genTerrain());
    Object.keys(PALETTES).forEach(k=>addSheet(k,this._genChar(PALETTES[k])));
    addTex("t_inn",      this._genInn());
    addTex("t_shop",     this._genShop());
    addTex("t_auction",  this._genAuction());
    addTex("t_wmill",    this._genWindmillTower());
    addTex("t_sails",    this._genWindmillSails());
    addTex("t_throne",   this._genThrone());
    addTex("t_farmhouse",this._genFarmhouse());
    addTex("t_chimney",  this._genChimneyAlone());

    // light halo
    if(!this.textures.exists("lhalo")){
      const lc=document.createElement("canvas"); lc.width=256; lc.height=256;
      const lx=lc.getContext("2d");
      const g=lx.createRadialGradient(128,128,6,128,128,128);
      g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(.3,"rgba(255,255,255,.5)"); g.addColorStop(1,"rgba(255,255,255,0)");
      lx.fillStyle=g; lx.fillRect(0,0,256,256);
      this.textures.addCanvas("lhalo",lc);
    }
    // 1px white
    if(!this.textures.exists("px")){
      const pc=document.createElement("canvas"); pc.width=1; pc.height=1;
      pc.getContext("2d").fillStyle="#fff"; pc.getContext("2d").fillRect(0,0,1,1);
      this.textures.addCanvas("px",pc);
    }
  }

  // ─────────────────────────────────────────────────
  // WORLD
  // ─────────────────────────────────────────────────
  createWorld() {
    if(this.groundLayer){ this.groundLayer.destroy(); if(this.tmap) this.tmap.destroy(); }
    if(this.groundFB)    this.groundFB.destroy();
    if(this.decorGroup)  this.decorGroup.clear(true,true);

    // tilemap
    const data=this._genZoneData(this.zone);
    this.tmap=this.make.tilemap({data,tileWidth:TILE,tileHeight:TILE});
    const ts=this.tmap.addTilesetImage("terrain","terrain",TILE,TILE,0,0);
    this.groundLayer=this.tmap.createLayer(0,ts,0,0).setDepth(2).setVisible(false);

    // fallback ground
    this.groundFB=this.add.graphics().setDepth(1);
    this._drawFallbackGround();

    this.decorGroup=this.add.group();
    this._buildZoneDecor();
  }

  _drawFallbackGround() {
    const g=this.groundFB;
    const cols={brennan:0xc8a878,ashfield:0xb09870,archive:0x7a7a8a,dungeon:0x2a2535,server:0x141420};
    const base=cols[this.zone]||0xc8a878;
    g.fillStyle(base,1); g.fillRect(0,0,WORLD_W*TILE,WORLD_H*TILE);
    // grid
    g.lineStyle(1,0x1a1020,0.13);
    for(let x=0;x<=WORLD_W*TILE;x+=TILE){ g.beginPath();g.moveTo(x,0);g.lineTo(x,WORLD_H*TILE);g.strokePath(); }
    for(let y=0;y<=WORLD_H*TILE;y+=TILE){ g.beginPath();g.moveTo(0,y);g.lineTo(WORLD_W*TILE,y);g.strokePath(); }
    // zone specific
    if(this.zone==="brennan"){
      g.fillStyle(0x9a8868,.55);
      g.fillRect(8*TILE,21*TILE,24*TILE,3*TILE);
      g.fillRect(18*TILE,6*TILE,4*TILE,24*TILE);
    } else if(this.zone==="archive"){
      g.fillStyle(0x5a1a2a,.5);
      g.fillRect(21*TILE,0,3*TILE,WORLD_H*TILE);
    } else if(this.zone==="dungeon"){
      g.lineStyle(1,0x1a1525,.4);
      for(let x=0;x<WORLD_W*TILE;x+=8){g.beginPath();g.moveTo(x,0);g.lineTo(x,WORLD_H*TILE);g.strokePath();}
    } else if(this.zone==="server"){
      g.lineStyle(1,0x1e1e30,.4);
      for(let x=0;x<WORLD_W*TILE;x+=4){g.beginPath();g.moveTo(x,0);g.lineTo(x,WORLD_H*TILE);g.strokePath();}
    }
  }

  _buildZoneDecor() {
    const place=(k,tx,ty,d=8)=>{
      const i=this.add.image(tx*TILE,ty*TILE,k).setOrigin(.5,1).setDepth(d);
      this.decorGroup.add(i); return i;
    };

    if(this.zone==="brennan"){
      place("t_inn",6,9,8);
      place("t_shop",26,9,8);
      place("t_auction",47,10,8);
      this._placeFountain(35,28);
      this._placeDeadTree(14,24);
      this._placeLamp(22,26); this._placeLamp(28,26); this._placeLamp(15,30);
      this._placeLamp(20,32,true);  // flickering
      this._placeLamp(38,22); this._placeLamp(44,22,false,true); // out
      // Sable bench
      this._placeBench(35,30);
      this._placeScrapPile(31,12);
      this._placeCableBundle(42,24,true);
      this._placeDiscardedTerminal(24,13);
      this._placePosterWall(18,11);
    }
    if(this.zone==="ashfield"){
      place("t_wmill",40,17,8);
      const sails=this.add.image(40*TILE,6*TILE,"t_sails").setOrigin(.5,.5).setDepth(9);
      this.decorGroup.add(sails); this.windmillSails=sails;
      this.tweens.add({targets:sails,angle:360,duration:8000,repeat:-1,ease:"Sine.easeInOut"});
      place("t_farmhouse",12,16,8);
      this._placeChimneyAlone(55,38);
      this._placeGreenCrop(46,35);
      this._placeScrapPile(33,34,0x4a4a58);
      this._placeBrokenTotem(50,19);
      this._placeCableBundle(45,24);
    }
    if(this.zone==="archive"){
      this._placeArchiveRacks();
      this._placeCableBundle(30,40,true);
      this._placeTapeCrates(24,36);
      this._placeDiscardedTerminal(34,30,true);
    }
    if(this.zone==="dungeon"){
      place("t_throne",35,18,8);
      this._placeBrazier(28,20); this._placeBrazier(52,20);
      this._placeBannerShreds(34,28);
      this._placeRuneOrb(48,19);
      this._placeBonePile(44,31);
    }
    if(this.zone==="server"){
      this._placeServerRacks();
      this._placeCableSprawl(18,16);
      this._placeCoolantLeak(38,30);
      this._placeDiscardedTerminal(27,26,true);
    }
  }

  _placeFountain(tx,ty) {
    const g=this.add.graphics().setDepth(6);
    g.fillStyle(0xa0a0a0,1); g.fillRoundedRect(tx*TILE-32,ty*TILE-26,64,52,8);
    g.fillStyle(0x1a3a5a,1); g.fillRoundedRect(tx*TILE-20,ty*TILE-14,40,28,5);
    g.lineStyle(2,0x1a1020,1); g.strokeRoundedRect(tx*TILE-32,ty*TILE-26,64,52,8);
    this.decorGroup.add(g);
    // water shimmer tween via alpha
    const ws=this.add.rectangle(tx*TILE-16,ty*TILE-10,32,20,0x3060a0,.3).setDepth(7);
    this.decorGroup.add(ws);
    this.tweens.add({targets:ws,alpha:.6,duration:1200,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
    const fl=this.addLight(tx*TILE,ty*TILE,65,0x4080ff,.18); this.zoneLights.push(fl);
  }

  _placeDeadTree(tx,ty) {
    const g=this.add.graphics().setDepth(7);
    g.lineStyle(3,0x3d2010,1);
    g.beginPath();
    g.moveTo(tx*TILE,ty*TILE);
    g.lineTo(tx*TILE+2,ty*TILE-42);
    g.lineTo(tx*TILE-14,ty*TILE-64);
    g.moveTo(tx*TILE+2,ty*TILE-42);
    g.lineTo(tx*TILE+18,ty*TILE-58);
    g.lineTo(tx*TILE+26,ty*TILE-70);
    g.moveTo(tx*TILE+18,ty*TILE-58);
    g.lineTo(tx*TILE+10,ty*TILE-72);
    g.strokePath();
    this.decorGroup.add(g);
    this.deadTreeGfx={x:tx*TILE,y:ty*TILE};
  }

  _placeLamp(tx,ty,flicker=false,out=false) {
    const g=this.add.graphics().setDepth(7);
    g.fillStyle(0x2a2a2a,1); g.fillRect(tx*TILE-2,ty*TILE-40,4,40);
    g.fillStyle(0x4a4a3a,1); g.fillRect(tx*TILE-6,ty*TILE-44,12,8);
    if(!out){
      g.fillStyle(0xff8030,1); g.fillRect(tx*TILE-3,ty*TILE-42,6,4);
      const h=this.addLight(tx*TILE,ty*TILE-38,95,0xff7020,.65); this.zoneLights.push(h);
      if(flicker) this.tweens.add({targets:h,alpha:.15,duration:rn(100,350),yoyo:true,repeat:-1,ease:"Stepped"});
    }
    this.decorGroup.add(g);
  }

  _placeBench(tx,ty) {
    const g=this.add.graphics().setDepth(6);
    g.fillStyle(0x2a1a0a,1); g.fillRect(tx*TILE-24,ty*TILE-8,48,8);
    g.fillRect(tx*TILE-24,ty*TILE-16,4,8); g.fillRect(tx*TILE+20,ty*TILE-16,4,8);
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE-24,ty*TILE-8,48,8);
    this.decorGroup.add(g);
  }

  _placeScrapPile(tx,ty,col=0x6a5848) {
    const g=this.add.graphics().setDepth(6);
    g.fillStyle(col,1);
    g.fillCircle(tx*TILE-8,ty*TILE-6,8);
    g.fillCircle(tx*TILE+2,ty*TILE-4,9);
    g.fillCircle(tx*TILE+12,ty*TILE-7,7);
    g.fillStyle(0x2a2a2a,1);
    g.fillRect(tx*TILE-10,ty*TILE-12,4,2);
    g.fillRect(tx*TILE+6,ty*TILE-14,5,2);
    g.lineStyle(1,0x1a1020,.9);
    g.strokeCircle(tx*TILE-8,ty*TILE-6,8);
    g.strokeCircle(tx*TILE+2,ty*TILE-4,9);
    g.strokeCircle(tx*TILE+12,ty*TILE-7,7);
    this.decorGroup.add(g);
  }

  _placeCableBundle(tx,ty,glow=false) {
    const g=this.add.graphics().setDepth(7);
    g.lineStyle(2,0x202840,.95);
    g.beginPath();
    g.moveTo(tx*TILE-16,ty*TILE-4); g.lineTo(tx*TILE-5,ty*TILE-16); g.lineTo(tx*TILE+8,ty*TILE); g.lineTo(tx*TILE+18,ty*TILE-8);
    g.moveTo(tx*TILE-18,ty*TILE+2); g.lineTo(tx*TILE-2,ty*TILE+8); g.lineTo(tx*TILE+7,ty*TILE-14); g.lineTo(tx*TILE+16,ty*TILE+4);
    g.moveTo(tx*TILE-12,ty*TILE-10); g.lineTo(tx*TILE-1,ty*TILE+2); g.lineTo(tx*TILE+9,ty*TILE+2); g.lineTo(tx*TILE+20,ty*TILE-2);
    g.strokePath();
    g.fillStyle(0x2c3f70,1); g.fillRect(tx*TILE-5,ty*TILE-6,10,6);
    g.fillStyle(0x68a2ff,1); g.fillRect(tx*TILE-3,ty*TILE-4,2,2); g.fillRect(tx*TILE+1,ty*TILE-4,2,2);
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE-5,ty*TILE-6,10,6);
    this.decorGroup.add(g);
    if(glow){ const l=this.addLight(tx*TILE,ty*TILE-4,36,0x3b7dff,.25); this.zoneLights.push(l); }
  }

  _placeDiscardedTerminal(tx,ty,broken=false) {
    const g=this.add.graphics().setDepth(7);
    g.fillStyle(0x3a3a44,1); g.fillRect(tx*TILE-12,ty*TILE-18,24,16);
    g.fillStyle(0x1a2338,1); g.fillRect(tx*TILE-10,ty*TILE-16,20,10);
    g.fillStyle(broken?0x402020:0x40a8ff,.8); g.fillRect(tx*TILE-8,ty*TILE-14,16,6);
    g.fillStyle(0x2a2a35,1); g.fillRect(tx*TILE-6,ty*TILE-2,12,4);
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE-12,ty*TILE-18,24,16);
    g.strokeRect(tx*TILE-10,ty*TILE-16,20,10);
    if(broken){
      g.lineStyle(1,0x8a3030,1); g.beginPath(); g.moveTo(tx*TILE-8,ty*TILE-14); g.lineTo(tx*TILE+8,ty*TILE-8); g.strokePath();
    }
    this.decorGroup.add(g);
  }

  _placePosterWall(tx,ty) {
    const g=this.add.graphics().setDepth(7);
    g.fillStyle(0x2a1a0a,.65); g.fillRect(tx*TILE-18,ty*TILE-26,36,20);
    g.fillStyle(0x6a4a30,1); g.fillRect(tx*TILE-16,ty*TILE-24,14,8);
    g.fillStyle(0x4a8ac8,1); g.fillRect(tx*TILE+2,ty*TILE-24,12,7);
    g.fillStyle(0xa83848,1); g.fillRect(tx*TILE-8,ty*TILE-14,16,6);
    g.lineStyle(1,0x1a1020,.9); g.strokeRect(tx*TILE-18,ty*TILE-26,36,20);
    this.decorGroup.add(g);
  }

  _placeBrokenTotem(tx,ty) {
    const g=this.add.graphics().setDepth(7);
    g.fillStyle(0x2a2a35,1); g.fillRect(tx*TILE-8,ty*TILE-30,16,24);
    g.fillStyle(0x2b4f7f,.85); g.fillRect(tx*TILE-6,ty*TILE-26,12,10);
    g.fillStyle(0x606070,1); g.fillRect(tx*TILE-10,ty*TILE-6,20,6);
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE-8,ty*TILE-30,16,24);
    g.lineStyle(1,0x803030,1); g.beginPath(); g.moveTo(tx*TILE-5,ty*TILE-24); g.lineTo(tx*TILE+5,ty*TILE-18); g.strokePath();
    this.decorGroup.add(g);
  }

  _placeTapeCrates(tx,ty) {
    const g=this.add.graphics().setDepth(6);
    g.fillStyle(0x4a3a2a,1); g.fillRect(tx*TILE-18,ty*TILE-12,36,12);
    g.fillRect(tx*TILE-10,ty*TILE-22,20,10);
    g.fillStyle(0xb8aa80,1); g.fillRect(tx*TILE-6,ty*TILE-20,8,3);
    g.fillStyle(0x1a1020,1); g.fillRect(tx*TILE+3,ty*TILE-20,5,3);
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE-18,ty*TILE-12,36,12);
    g.strokeRect(tx*TILE-10,ty*TILE-22,20,10);
    this.decorGroup.add(g);
  }

  _placeBannerShreds(tx,ty) {
    const g=this.add.graphics().setDepth(7);
    g.fillStyle(0x5a1020,.95);
    g.fillRect(tx*TILE-22,ty*TILE-34,14,22);
    g.fillRect(tx*TILE+8,ty*TILE-30,12,18);
    g.fillStyle(0x2a2a35,1); g.fillRect(tx*TILE-24,ty*TILE-36,2,24); g.fillRect(tx*TILE+20,ty*TILE-32,2,20);
    this.decorGroup.add(g);
  }

  _placeRuneOrb(tx,ty) {
    const g=this.add.graphics().setDepth(8);
    g.fillStyle(0x251840,1); g.fillCircle(tx*TILE,ty*TILE-8,10);
    g.lineStyle(1,0x8a70d0,1); g.strokeCircle(tx*TILE,ty*TILE-8,10);
    g.fillStyle(0x9ac4ff,.85); g.fillCircle(tx*TILE-3,ty*TILE-10,2);
    this.decorGroup.add(g);
    const l=this.addLight(tx*TILE,ty*TILE-8,42,0x7050ff,.25); this.zoneLights.push(l);
  }

  _placeBonePile(tx,ty) {
    const g=this.add.graphics().setDepth(6);
    g.fillStyle(0x8a8070,1);
    g.fillRect(tx*TILE-14,ty*TILE-8,10,3); g.fillRect(tx*TILE-2,ty*TILE-6,12,3); g.fillRect(tx*TILE+6,ty*TILE-10,8,3);
    g.fillStyle(0x5a5042,1); g.fillRect(tx*TILE-12,ty*TILE-11,2,3); g.fillRect(tx*TILE+9,ty*TILE-13,2,3);
    this.decorGroup.add(g);
  }

  _placeCableSprawl(tx,ty) {
    const g=this.add.graphics().setDepth(7);
    g.lineStyle(2,0x1f3356,.95);
    for(let i=0;i<5;i++){
      const ox=tx*TILE+rn(-18,18), oy=ty*TILE+rn(-8,8);
      g.beginPath();
      g.moveTo(ox,oy);
      g.lineTo(ox+rn(-12,12),oy+rn(-12,12));
      g.lineTo(ox+rn(-14,14),oy+rn(-10,10));
      g.lineTo(ox+rn(-16,16),oy+rn(-10,10));
      g.strokePath();
    }
    g.fillStyle(0x2a2a35,1); g.fillRect(tx*TILE-8,ty*TILE-8,16,8);
    g.fillStyle(0x50a0ff,1); g.fillRect(tx*TILE-5,ty*TILE-5,3,2); g.fillRect(tx*TILE,ty*TILE-5,3,2);
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE-8,ty*TILE-8,16,8);
    this.decorGroup.add(g);
  }

  _placeCoolantLeak(tx,ty) {
    const g=this.add.graphics().setDepth(6);
    g.fillStyle(0x40d0ff,.45);
    g.fillCircle(tx*TILE-6,ty*TILE-2,8);
    g.fillCircle(tx*TILE+5,ty*TILE-2,9);
    g.fillCircle(tx*TILE+14,ty*TILE-1,6);
    g.fillStyle(0x80e0ff,.45);
    g.fillCircle(tx*TILE+3,ty*TILE-3,4);
    g.fillCircle(tx*TILE+10,ty*TILE-2,3);
    this.decorGroup.add(g);
    const l=this.addLight(tx*TILE,ty*TILE-2,48,0x40d0ff,.22); this.zoneLights.push(l);
  }

  _placeBrazier(tx,ty) {
    const g=this.add.graphics().setDepth(8);
    g.fillStyle(0x3a2a1a,1); g.fillRect(tx*TILE-14,ty*TILE-16,28,16);
    g.fillStyle(0xff6020,1); g.fillTriangle(tx*TILE-8,ty*TILE-16,tx*TILE+8,ty*TILE-16,tx*TILE,ty*TILE-34);
    g.lineStyle(2,0x1a1020,1); g.strokeRect(tx*TILE-14,ty*TILE-16,28,16);
    this.decorGroup.add(g);
    const l=this.addLight(tx*TILE,ty*TILE-20,140,0xff6010,.7); this.zoneLights.push(l);
    this.tweens.add({targets:l,alpha:.32,duration:900,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
  }

  _placeGreenCrop(tx,ty) {
    const g=this.add.graphics().setDepth(6);
    g.fillStyle(0x4a8a4a,1); g.fillRect(tx*TILE-4,ty*TILE-8,TILE,TILE);
    g.lineStyle(1,0x1a1020,.8); g.strokeRect(tx*TILE-4,ty*TILE-8,TILE,TILE);
    this.decorGroup.add(g);
    const gl=this.addLight(tx*TILE,ty*TILE,34,0x40ff40,.28); this.zoneLights.push(gl);
    this.tweens.add({targets:gl,alpha:.08,duration:3000,yoyo:true,repeat:-1});
  }

  _placeChimneyAlone(tx,ty) {
    const g=this.add.graphics().setDepth(7);
    // foundation remnant
    g.lineStyle(2,0x5a4a3a,1); g.strokeRect(tx*TILE-40,ty*TILE-2,80,4);
    // chimney bricks
    for(let r=0;r<10;r++){
      g.fillStyle(r%2===0?0x6a3020:0x5a2010,1);
      g.fillRect(tx*TILE-8,ty*TILE-80+r*8,16,8);
    }
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE-8,ty*TILE-80,16,80);
    // single boot
    g.fillStyle(0x3a2a1a,1); g.fillRect(tx*TILE+4,ty*TILE-6,12,8); g.fillRect(tx*TILE+2,ty*TILE-10,8,6);
    g.lineStyle(1,0x1a1020,1); g.strokeRect(tx*TILE+4,ty*TILE-6,12,8);
    this.decorGroup.add(g);
    // weathervane
    this.vaneGfx=this.add.graphics().setDepth(8);
    this.vaneX=tx*TILE; this.vaneY=ty*TILE-86;
    this._drawVane(0);
    this.decorGroup.add(this.vaneGfx);
  }

  _drawVane(ang) {
    if(!this.vaneGfx) return;
    const g=this.vaneGfx; g.clear();
    const x=this.vaneX, y=this.vaneY;
    const r=ang*Math.PI/180;
    g.lineStyle(2,0x4a4a4a,1);
    g.beginPath(); g.moveTo(x+Math.cos(r)*10,y+Math.sin(r)*10); g.lineTo(x-Math.cos(r)*8,y-Math.sin(r)*8); g.strokePath();
    g.fillStyle(0x3a3a3a,1); g.fillCircle(x,y,2);
  }

  _placeArchiveRacks() {
    const bookCols=[0x8a2020,0x206a20,0x20208a,0x8a6a20,0x8a2080,0x208a8a,0x6a6a6a,0xa04020,0x4a208a];
    for(let i=0;i<8;i++){
      const x=12+i*6;
      const shelf=this.add.rectangle(x*TILE,18*TILE,90,170,0x2a1a0a).setOrigin(.5,1).setDepth(7);
      this.decorGroup.add(shelf);
      // books
      const bg=this.add.graphics().setDepth(7);
      for(let j=0;j<10;j++){
        if(Math.random()<.82){
          bg.fillStyle(bookCols[j%bookCols.length],1);
          bg.fillRect((x-1)*TILE+j*8+4,10*TILE,6,28);
        }
      }
      this.decorGroup.add(bg);
      // amber lamp
      const lamp=this.add.graphics().setDepth(7);
      lamp.fillStyle(0xc07030,1); lamp.fillRect(x*TILE-3,22*TILE-8,6,8);
      lamp.fillStyle(0xffcc60,.8); lamp.fillCircle(x*TILE,22*TILE-10,5);
      lamp.lineStyle(1,0x1a1020,1); lamp.strokeCircle(x*TILE,22*TILE-10,5);
      this.decorGroup.add(lamp);
      const ll=this.addLight(x*TILE,22*TILE-8,62,0xffaa30,.45); this.zoneLights.push(ll);
    }
    // unfinished post terminal glow
    const ut=this.addLight(33*TILE,14*TILE,52,0x60c0ff,.38); this.zoneLights.push(ut);
    this.tweens.add({targets:ut,alpha:.15,duration:1900,yoyo:true,repeat:-1});
  }

  _placeServerRacks() {
    this.svrLights=[];
    for(let i=0;i<6;i++){
      const x=12+i*8;
      const rack=this.add.rectangle(x*TILE,30*TILE,44,180,0x1a1a25).setOrigin(.5,1).setDepth(7);
      this.decorGroup.add(rack);
      const rl=this.add.graphics().setDepth(7);
      for(let j=0;j<6;j++){
        rl.fillStyle(j%3===0?0x0040ff:0x00ff40,1);
        rl.fillRect(x*TILE-14,16*TILE+j*20,6,2);
      }
      this.decorGroup.add(rl);
      const l=this.addLight(x*TILE,24*TILE,52,0x0040ff,.45); this.zoneLights.push(l); this.svrLights.push(l);
      this.tweens.add({targets:l,alpha:.16,duration:1200+i*110,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
    }
  }

  // ─────────────────────────────────────────────────
  // ACTORS (NPCs + Player)
  // ─────────────────────────────────────────────────
  createActors() {
    this.player=this.add.sprite(11*TILE,14*TILE,"player",16).setOrigin(.5,1).setScale(1.4).setDepth(12);
    this.playerLight=this.addLight(this.player.x,this.player.y-10,150,0xfff0d0,.4);

    const npcDefs=[
      {id:"mira",   key:"mira",   x:9,  y:23,zone:"brennan", accent:0xc07030, icon:"◍"},
      {id:"aldric", key:"aldric", x:29, y:20,zone:"brennan", accent:0x8a6a3a, icon:"◍"},
      {id:"herald", key:"herald", x:20, y:30,zone:"brennan", accent:0x8a5a3a, icon:"◍"},
      {id:"ewen",   key:"ewen",   x:12, y:14,zone:"ashfield",accent:0x6a5a3a, icon:"◍"},
      {id:"voss",   key:"voss",   x:25, y:28,zone:"archive", accent:0xd0c8b8, icon:"◍"},
      {id:"gorrath",key:"gorrath",x:43, y:25,zone:"dungeon", accent:0x8a0010, icon:"♛"},
      {id:"sable",  key:"sable",  x:16, y:29,zone:"brennan", accent:0x2a4a8a, icon:"⌗",nightOnly:true},
      {id:"gm",     key:"gm",     x:35, y:26,zone:"server",  accent:0x2060ff, icon:"◍"}
    ];

    this.npcs=npcDefs.map(def=>{
      const sp=this.add.sprite(def.x*TILE,def.y*TILE,def.key,16).setOrigin(.5,1).setScale(1.25).setDepth(10);
      const col=Phaser.Display.Color.IntegerToColor(def.accent).rgba;
      const lb=this.add.text(sp.x,sp.y-62,NPC_NAMES[def.id]||def.id,{
        fontFamily:"VT323",fontSize:"13px",color:"#eaf1ff",
        backgroundColor:"rgba(8,12,20,.82)",padding:{left:4,right:4,top:2,bottom:2}
      }).setOrigin(.5,1).setDepth(14);
      if(def.id==="gorrath"){ sp.setScale(2); lb.y=sp.y-92; lb.setColor("#f0c0c8"); }
      if(def.id==="sable"){ sp.setAlpha(.84); lb.setColor("#9fb4e8");
        this.tweens.add({targets:sp,y:sp.y-4,duration:2200,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
        this.time.addEvent({delay:rn(12000,28000),loop:true,callback:()=>{
          this.tweens.add({targets:sp,alpha:0,duration:50,yoyo:true,repeat:3});
        }});
      }
      if(def.id==="gm") sp.setAlpha(.9);
      return {...def,sp,lb};
    });

    // Ewen patrol points
    this.ewenPts=[{x:12,y:14},{x:28,y:10},{x:28,y:30},{x:12,y:30}];
  }

  _startEwenPatrol() {
    const ewen=this.npcs.find(n=>n.id==="ewen");
    if(!ewen) return;
    const patrol=()=>{
      if(!ewen.sp.visible){this.time.delayedCall(2000,patrol);return;}
      this.ewenIdx=(this.ewenIdx+1)%this.ewenPts.length;
      const pt=this.ewenPts[this.ewenIdx];
      const dx=pt.x*TILE-ewen.sp.x; const dy=pt.y*TILE-ewen.sp.y;
      const dist=Math.hypot(dx,dy);
      const dir=Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up");
      ewen.sp.play(`ewen-walk-${dir}`,true);
      this.tweens.add({targets:ewen.sp,x:pt.x*TILE,y:pt.y*TILE,duration:(dist/55)*1000,ease:"Linear",
        onComplete:()=>{
          ewen.sp.play("ewen-idle",true);
          const pause=this.ewenIdx===1?30000:4000; // long pause at NE corner (near crop)
          this.time.delayedCall(pause,patrol);
        }
      });
    };
    this.time.delayedCall(3000,patrol);
  }

  // ─────────────────────────────────────────────────
  // ANIMATIONS
  // ─────────────────────────────────────────────────
  createAnims() {
    const keys=["player","mira","aldric","herald","ewen","voss","gorrath","sable","gm"];
    keys.forEach(k=>{
      if(this.anims.exists(`${k}-walk-down`)) return;
      this.anims.create({key:`${k}-walk-down`, frames:this.anims.generateFrameNumbers(k,{start:0,end:3}), frameRate:8,repeat:-1});
      this.anims.create({key:`${k}-walk-up`,   frames:this.anims.generateFrameNumbers(k,{start:4,end:7}), frameRate:8,repeat:-1});
      this.anims.create({key:`${k}-walk-left`, frames:this.anims.generateFrameNumbers(k,{start:8,end:11}),frameRate:8,repeat:-1});
      this.anims.create({key:`${k}-walk-right`,frames:this.anims.generateFrameNumbers(k,{start:12,end:15}),frameRate:8,repeat:-1});
      this.anims.create({key:`${k}-idle`,      frames:this.anims.generateFrameNumbers(k,{start:16,end:17}),frameRate:2,repeat:-1});
    });
    this.player.play("player-idle");
    this.npcs.forEach(n=>n.sp.play(`${n.key}-idle`));
  }

  // ─────────────────────────────────────────────────
  // HUD
  // ─────────────────────────────────────────────────
  createHUD() {
    this.ui=this.add.container(0,0).setScrollFactor(0).setDepth(150);
    const fs=Phaser.Math.Clamp(Math.min(GAME_W/1280,GAME_H/720),.9,1.45);
    const m=28;

    // border frame
    const fr=this.add.graphics();
    fr.fillStyle(0x07090f,.9); fr.fillRect(0,0,GAME_W,20); fr.fillRect(0,GAME_H-20,GAME_W,20);
    fr.fillRect(0,0,20,GAME_H); fr.fillRect(GAME_W-20,0,20,GAME_H);
    fr.lineStyle(1,0x1e2d54,1); fr.strokeRoundedRect(.5,.5,GAME_W-1,GAME_H-1,4);
    this.ui.add(fr);

    // clock panel
    this._pnl(m,m,224,68); // returns graphics added to ui in _pnl
    this.clockTxt=this.add.text(m+10,m+4,"16:29",{fontFamily:"VT323",fontSize:`${Math.floor(32*fs)}px`,color:"#8fd2ff"}).setScrollFactor(0);
    this.dayTxt=this.add.text(m+10,m+40,"MON · SPRING · D1",{fontFamily:"VT323",fontSize:`${Math.floor(13*fs)}px`,color:"#6c7ea8"}).setScrollFactor(0);
    this.ui.add(this.clockTxt); this.ui.add(this.dayTxt);

    // zone title
    this.zoneTxt=this.add.text(Math.floor(GAME_W*.5),m+16,ZONES[this.zone].name.toLowerCase(),{
      fontFamily:"VT323",fontSize:`${Math.floor(32*fs)}px`,color:"#d6e4ff",
      backgroundColor:"rgba(6,10,18,.9)",padding:{left:12,right:12,top:2,bottom:2}
    }).setOrigin(.5,0).setScrollFactor(0);
    this.ui.add(this.zoneTxt);

    // minimap
    this._pnl(GAME_W-m-174,m,174,224);
    this.mmMask=this.add.graphics().setScrollFactor(0).setDepth(151);
    this.mmMask.fillStyle(0xffffff,1).fillCircle(GAME_W-m-87,m+76,58);
    this.mmRT=this.add.renderTexture(GAME_W-m-147,m+16,120,120).setOrigin(0).setScrollFactor(0).setDepth(151);
    this.mmRT.setMask(this.mmMask.createGeometryMask()); this.mmMask.setVisible(false);
    this.ui.add(this.mmRT);
    const mmRing=this.add.graphics().setScrollFactor(0);
    mmRing.lineStyle(2,0x333344,1).strokeCircle(GAME_W-m-87,m+76,58);
    this.ui.add(mmRing);
    // compass letters
    [["N",GAME_W-m-91,m+9],["S",GAME_W-m-91,m+130],["W",GAME_W-m-150,m+72],["E",GAME_W-m-25,m+72]].forEach(([l,x,y])=>{
      this.ui.add(this.add.text(x,y,l,{fontFamily:"VT323",fontSize:"10px",color:"#555566"}).setScrollFactor(0));
    });
    this.ui.add(this.add.text(GAME_W-m-148,m+145,"YOU\nNPC\nROAD\nBLDG",{fontFamily:"VT323",fontSize:"14px",color:"#7a8ab8"}).setScrollFactor(0));
    const ldots=this.add.graphics().setScrollFactor(0);
    ldots.fillStyle(0xffffff,1).fillRect(GAME_W-m-162,m+150,8,8);
    ldots.fillStyle(0x44aa44,1).fillRect(GAME_W-m-162,m+168,8,8);
    ldots.fillStyle(0x8e7450,1).fillRect(GAME_W-m-162,m+186,8,8);
    ldots.fillStyle(0x5f5648,1).fillRect(GAME_W-m-162,m+204,8,8);
    this.ui.add(ldots);

    // chat panel
    this._pnl(m,GAME_H-m-196,420,168,.84);
    this.chatTxts=[];
    for(let i=0;i<6;i++){
      const t=this.add.text(m+12,GAME_H-m-184+i*22,"",{fontFamily:"VT323",fontSize:`${Math.floor(14*fs)}px`,color:"#b9c8e8"}).setScrollFactor(0);
      this.chatTxts.push(t); this.ui.add(t);
    }
    this.chatMeasure=this.add.text(-9999,-9999,"",{fontFamily:"VT323",fontSize:`${Math.floor(14*fs)}px`,color:"#fff"})
      .setScrollFactor(0)
      .setVisible(false);
    this.chatRenderLines=[];
    this.chatThumb=this.add.rectangle(m+410,GAME_H-m-178,4,34,0x555566).setOrigin(.5,0).setScrollFactor(0);
    this.ui.add(this.chatThumb);
    const cz=this.add.zone(m,GAME_H-m-196,420,168).setOrigin(0).setScrollFactor(0).setInteractive();
    cz.on("wheel",(_,_dx,dy)=>{
      const maxScroll=Math.max(0,(this.chatRenderLines?this.chatRenderLines.length:0)-6);
      this.chatScroll=Phaser.Math.Clamp(this.chatScroll+(dy>0?-1:1),0,maxScroll);
      this.renderChat();
    });

    // char panel
    const cx=GAME_W-m-284, cy=GAME_H-m-196;
    this._pnl(cx,cy,284,168,.92);
    this.charPortrait=this.add.renderTexture(cx+14,cy+14,52,52).setOrigin(0).setScrollFactor(0);
    this.charPortrait.fill(0x1a1020,1,0,0,52,52); this.charPortrait.drawFrame("player",16,4,2); this.charPortrait.setScale(.85);
    this.ui.add(this.charPortrait);
    this.charTxt=this.add.text(cx+86,cy+16,"",{fontFamily:"VT323",fontSize:`${Math.floor(15*fs)}px`,color:"#cbd7f4",lineSpacing:4}).setScrollFactor(0);
    this.ui.add(this.charTxt);
    // HP/MP bars
    this.hpTr=this.add.rectangle(cx+60,cy+134,200,8,0x1a0000).setOrigin(0,.5).setScrollFactor(0);
    this.hpFl=this.add.rectangle(cx+60,cy+134,200,8,0x8a0010).setOrigin(0,.5).setScrollFactor(0);
    this.mpTr=this.add.rectangle(cx+60,cy+150,200,8,0x00001a).setOrigin(0,.5).setScrollFactor(0);
    this.mpFl=this.add.rectangle(cx+60,cy+150,200,8,0x001a8a).setOrigin(0,.5).setScrollFactor(0);
    this.ui.add(this.add.text(cx+24,cy+126,"HP",{fontFamily:"VT323",fontSize:"13px",color:"#cc0010"}).setScrollFactor(0));
    this.ui.add(this.add.text(cx+24,cy+142,"MP",{fontFamily:"VT323",fontSize:"13px",color:"#0010cc"}).setScrollFactor(0));
    [this.hpTr,this.hpFl,this.mpTr,this.mpFl].forEach(e=>this.ui.add(e));
  }

  _pnl(x,y,w,h,alpha=1) {
    const g=this.add.graphics().setScrollFactor(0);
    g.fillGradientStyle(0x111828,0x111828,0x070a10,0x070a10,alpha);
    g.fillRoundedRect(x,y,w,h,3);
    g.lineStyle(1,0x21335e,1); g.strokeRoundedRect(x+.5,y+.5,w-1,h-1,3);
    g.lineStyle(1,0x03050a,1); g.strokeRoundedRect(x+1.5,y+1.5,w-3,h-3,3);
    this.ui.add(g); return g;
  }

  createDarkness() {
    if(this.darkness) this.darkness.destroy();
    this.darkness=this.add.rectangle(0,0,GAME_W,GAME_H,0x0a1028,.18).setOrigin(0).setScrollFactor(0).setDepth(38);
  }

  updateDayNight() {
    if(!this.darkness) return;
    const t=this.dayMins/1440;
    const nf=(1-Math.cos((t-.5)*Math.PI*2))*.5;
    this.darkness.setAlpha(Phaser.Math.Clamp(.45*nf,0,.45));
  }

  createLoadScreen() {
    this.loadLayer=this.add.container(0,0).setScrollFactor(0).setDepth(220).setVisible(false).setAlpha(0);
    const bg=this.add.rectangle(0,0,GAME_W,GAME_H,0x000000,.94).setOrigin(0);
    const ttl=this.add.text(GAME_W*.5,GAME_H*.42,"LOADING VALDRIS ONLINE",{fontFamily:"VT323",fontSize:"44px",color:"#9db2de"}).setOrigin(.5);
    const sub=this.add.text(GAME_W*.5,GAME_H*.48,"authentic 2003 recovery protocol",{fontFamily:"VT323",fontSize:"24px",color:"#6176a4"}).setOrigin(.5);
    this.loadTrack=this.add.rectangle(GAME_W*.5,GAME_H*.56,GAME_W*.56,18,0x1a1f34,1).setOrigin(.5);
    this.loadFill=this.add.rectangle(this.loadTrack.x-this.loadTrack.width/2,this.loadTrack.y,2,14,0x88a4d8,1).setOrigin(0,.5);
    this.loadZoneTxt=this.add.text(GAME_W*.5,GAME_H*.62,"",{fontFamily:"VT323",fontSize:"26px",color:"#d6e4ff"}).setOrigin(.5);
    this.loadLayer.add([bg,ttl,sub,this.loadTrack,this.loadFill,this.loadZoneTxt]);
  }

  runTransition(zoneName,done) {
    if(!this.loadLayer){done();return;}
    this.loadZoneTxt.setText(`entering ${zoneName.toLowerCase()}...`);
    this.loadFill.width=2;
    this.loadLayer.setVisible(true).setAlpha(0);
    this.tweens.add({targets:this.loadLayer,alpha:1,duration:260,ease:"Sine.easeOut",onComplete:()=>{
      this.tweens.add({targets:this.loadFill,width:this.loadTrack.width-6,duration:1700,ease:"Linear"});
      this.time.delayedCall(2200,()=>{
        done();
        this.tweens.add({targets:this.loadLayer,alpha:0,duration:280,ease:"Sine.easeIn",onComplete:()=>this.loadLayer.setVisible(false)});
      });
    }});
  }

  addLight(x,y,r,col,int) {
    const l=this.add.image(x,y,"lhalo").setDepth(39);
    l.setScale(r/128); l.setTint(col); l.setAlpha(Phaser.Math.Clamp(int*.75,.05,.92));
    l.setBlendMode(Phaser.BlendModes.ADD);
    return l;
  }

  createScreenFX() {
    const vc=document.createElement("canvas"); vc.width=GAME_W; vc.height=GAME_H;
    const vx=vc.getContext("2d");
    const vg=vx.createRadialGradient(GAME_W*.5,GAME_H*.5,GAME_H*.2,GAME_W*.5,GAME_H*.5,GAME_W*.56);
    vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(0,0,0,.55)");
    vx.fillStyle=vg; vx.fillRect(0,0,GAME_W,GAME_H);
    this.textures.addCanvas("vign",vc);

    const sc=document.createElement("canvas"); sc.width=2; sc.height=4;
    const sx=sc.getContext("2d");
    sx.fillStyle="rgba(255,255,255,0)"; sx.fillRect(0,0,2,2);
    sx.fillStyle="rgba(255,255,255,.024)"; sx.fillRect(0,2,2,1);
    sx.fillStyle="rgba(255,255,255,0)"; sx.fillRect(0,3,2,1);
    this.textures.addCanvas("scan",sc);

    this.scanline=this.add.tileSprite(0,0,GAME_W,GAME_H,"scan").setOrigin(0).setScrollFactor(0).setDepth(140);
    this.scanline.blendMode=Phaser.BlendModes.SCREEN;
    this.vignette=this.add.image(0,0,"vign").setOrigin(0).setScrollFactor(0).setDepth(141);
    this.grade=this.add.rectangle(0,0,GAME_W,GAME_H,0x1a2040,.055).setOrigin(0).setScrollFactor(0).setDepth(139);
  }

  // ─────────────────────────────────────────────────
  // DIALOGUE UI
  // ─────────────────────────────────────────────────
  createDlgUI() {
    this.dlgOverlay=this.add.rectangle(0,0,GAME_W,GAME_H,0x000000,0).setOrigin(0).setScrollFactor(0).setDepth(160);
    this.dlgCont=this.add.container(20,GAME_H+200).setScrollFactor(0).setDepth(170);

    const bg=this.add.graphics();
    bg.fillStyle(0x0d0d12,1).fillRoundedRect(0,0,GAME_W-40,192,4);
    bg.lineStyle(2,0x1a1a28,1).strokeRoundedRect(1,1,GAME_W-42,190,4);
    this.dlgCont.add(bg);

    this.dlgAccent=this.add.rectangle(0,0,GAME_W-40,1,0xc07030).setOrigin(0);
    this.dlgCont.add(this.dlgAccent);

    this.dlgPortFrame=this.add.rectangle(18,58,90,90,0x111018).setOrigin(0);
    this.dlgCont.add(this.dlgPortFrame);
    this.dlgPort=this.add.renderTexture(20,60,86,86);
    this.dlgCont.add(this.dlgPort);

    this.dlgName=this.add.text(18,14,"NPC",{fontFamily:"VT323",fontSize:"20px",color:"#c07030"});
    this.dlgCont.add(this.dlgName);
    this.dlgIcon=this.add.text(102,14,"◍",{fontFamily:"VT323",fontSize:"16px",color:"#c07030"});
    this.dlgCont.add(this.dlgIcon);
    this.dlgTxt=this.add.text(122,50,"",{fontFamily:"Crimson Text",fontSize:"24px",color:"#e8e0d0",wordWrap:{width:GAME_W-250},lineSpacing:4});
    this.dlgCont.add(this.dlgTxt);
    this.dlgCursor=this.add.text(GAME_W-116,164,"▮",{fontFamily:"VT323",fontSize:"16px",color:"#c07030"});
    this.dlgCont.add(this.dlgCursor);
    this.tweens.add({targets:this.dlgCursor,alpha:.3,yoyo:true,repeat:-1,duration:400});
    this.dlgAdv=this.add.text(GAME_W-78,164,"▶ E",{fontFamily:"VT323",fontSize:"14px",color:"#555566"});
    this.dlgCont.add(this.dlgAdv);
    this.tweens.add({targets:this.dlgAdv,alpha:.4,yoyo:true,repeat:-1,duration:900});
  }

  posDlgUI() {
    if(!this.dlgCont) return;
    this.dlgCont.x=20;
    this.dlgCont.y=this.inDialogue?GAME_H-208:GAME_H+200;
    this.dlgCont.setVisible(this.inDialogue);
  }

  createPrompt() {
    this.prompt=this.add.container(0,0).setScrollFactor(0).setDepth(145).setVisible(false);
    const bg=this.add.graphics();
    bg.fillGradientStyle(0x10162c,0x10162c,0x080b16,0x080b16,1).fillRoundedRect(0,0,106,30,10);
    bg.lineStyle(2,0x2f4f7f,1).strokeRoundedRect(1,1,104,28,10);
    bg.lineStyle(1,0x0a1020,1).strokeRoundedRect(3,3,100,24,8);
    bg.fillStyle(0x24498a,.25).fillRoundedRect(4,4,98,7,6);
    this.prompt.add(bg);
    this.prompt.add(this.add.text(8,7,"[E]",{fontFamily:"VT323",fontSize:"16px",color:"#eaf1ff"}));
    this.prompt.add(this.add.text(42,7,"interact",{fontFamily:"VT323",fontSize:"16px",color:"#9ec2ff"}));
    this.tweens.add({targets:this.prompt,y:"-=4",duration:900,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
  }

  // ─────────────────────────────────────────────────
  // PARTICLES
  // ─────────────────────────────────────────────────
  createParticles() {
    const pf=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)?1.6:1;

    this.dustEmt=this.add.particles(0,0,"px",{
      tint:[0xfff0d0,0xffe8b0,0xffd890],alpha:{start:.4,end:0},scale:{start:1,end:.5},
      speed:{min:2,max:8},angle:{min:0,max:360},lifespan:{min:3200,max:6400},
      frequency:Math.floor(220*pf),quantity:1,
      emitZone:{type:"random",source:new Phaser.Geom.Rectangle(0,0,WORLD_W*TILE,WORLD_H*TILE)}
    });
    this.ashEmt=this.add.particles(0,0,"px",{
      tint:0xc8c8b8,alpha:{start:.35,end:0},scale:{start:2,end:1},
      speed:{min:5,max:16},angle:{min:248,max:272},lifespan:{min:2600,max:4400},
      frequency:Math.floor(140*pf),quantity:1,
      emitZone:{type:"random",source:new Phaser.Geom.Rectangle(0,0,WORLD_W*TILE,WORLD_H*TILE)}
    });
    this.dataEmt=this.add.particles(0,0,"px",{
      tint:0xa0c0ff,alpha:{start:.6,end:0},scale:{start:1,end:0},
      speed:{min:6,max:20},angle:{min:258,max:282},lifespan:{min:1600,max:2800},
      frequency:Math.floor(130*pf),quantity:1,
      emitZone:{type:"edge",source:new Phaser.Geom.Rectangle(9*TILE,18*TILE,54*TILE,10*TILE)}
    });
    this.petalEmt=this.add.particles(0,0,"px",{
      tint:0xe8a0b0,alpha:{start:.88,end:0},scale:{start:3.5,end:1},
      speedY:{min:8,max:18},speedX:{min:-8,max:8},lifespan:3200,frequency:-1,quantity:26
    });
    this.ftnEmt=this.add.particles(35*TILE,28*TILE,"px",{
      tint:[0x80b0ff,0xa0c8ff],alpha:{start:.55,end:0},
      speed:{min:12,max:28},angle:{min:0,max:360},gravityY:32,
      lifespan:950,frequency:Math.floor(250*pf),quantity:1
    });
    [this.dustEmt,this.ashEmt,this.dataEmt,this.petalEmt,this.ftnEmt].forEach(e=>e&&e.setVisible(false));
  }

  setEmitters(dust,ash,data,ftn) {
    const set=(e,v)=>{if(e){e.setVisible(v);e.active=v;}};
    set(this.dustEmt,dust); set(this.ashEmt,ash); set(this.dataEmt,data); set(this.ftnEmt,ftn);
  }

  createSpecialFX() {
    // Gorrath eye glow
    const gorrath=this.npcs.find(n=>n.id==="gorrath");
    if(gorrath){
      gorrath.eyeL=this.addLight(gorrath.sp.x,gorrath.sp.y-32,34,0xff3010,.88);
      this.zoneLights.push(gorrath.eyeL);
      this.tweens.add({targets:gorrath.eyeL,alpha:.28,yoyo:true,repeat:-1,duration:2200,ease:"Sine.easeInOut"});
    }
    // Sable aura
    const sable=this.npcs.find(n=>n.id==="sable");
    if(sable){
      this.sableEmt=this.add.particles(sable.sp.x,sable.sp.y-22,"px",{
        tint:0x1a2a5a,alpha:{start:.65,end:0},scale:{start:.9,end:0},
        speed:{min:5,max:16},angle:{min:258,max:282},lifespan:2200,frequency:110,quantity:1
      });
    }
    // Red flower glow
    this.redFlowerL=this.addLight(7*TILE,9*TILE,22,0xff2020,.32);
    this.zoneLights.push(this.redFlowerL);
    this.tweens.add({targets:this.redFlowerL,alpha:.12,duration:2400,yoyo:true,repeat:-1});
  }

  createPerfOverlay() {
    this.perfTxt=this.add.text(26,96,"",{fontFamily:"VT323",fontSize:"17px",color:"#9ec2ff",
      backgroundColor:"rgba(6,10,18,.88)",padding:{left:6,right:6,top:4,bottom:4}
    }).setScrollFactor(0).setDepth(190).setVisible(false);
  }

  // ─────────────────────────────────────────────────
  // LIGHTING
  // ─────────────────────────────────────────────────
  applyZoneLighting() {
    this.zoneLights.forEach(l=>l.destroy()); this.zoneLights=[];
    this.lights.setAmbientColor(ZONES[this.zone].ambient);
    const pt=(tx,ty,col,r,int)=>{ const l=this.addLight(tx*TILE,ty*TILE,r,col,int); this.zoneLights.push(l); return l; };

    if(this.zone==="brennan"){
      pt(10,14,0xff7020,195,.88); pt(26,14,0xff7020,195,.88);
      pt(7,10,0xff8030,115,.72); pt(11,11,0xff8030,115,.72);
      pt(6,12,0xff1010,22,.28);  // red flower lamp
      pt(35,28,0x4080ff,68,.2);  // fountain
      this.setEmitters(true,false,false,true);
    } else if(this.zone==="ashfield"){
      pt(46,35,0x40ff40,36,.3); pt(12,14,0xffa000,68,.24);
      this.setEmitters(false,true,false,false);
    } else if(this.zone==="archive"){
      this.setEmitters(false,false,false,false);
      this._archiveArchiveDust();
    } else if(this.zone==="dungeon"){
      pt(32,16,0x8030c0,135,.34); pt(28,20,0xff4010,215,.68); pt(52,20,0xff4010,215,.68); pt(38,22,0xff8020,68,.58);
      this.setEmitters(false,false,false,false);
    } else if(this.zone==="server"){
      pt(35,26,0x2060ff,36,.34); pt(44,18,0xc07020,88,.58); pt(6,6,0xff0010,34,.14); pt(64,42,0xff0010,34,.14);
      this.setEmitters(false,false,true,false);
    }
    // re-add special FX lights that survive zone changes
    const g=this.npcs.find(n=>n.id==="gorrath");
    if(g&&g.eyeL){ this.zoneLights.push(g.eyeL); }
  }

  _archiveArchiveDust() {
    if(this.archiveDust) this.archiveDust.destroy();
    const pf=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)?1.6:1;
    this.archiveDust=this.add.particles(0,0,"px",{
      tint:0xe0d8c8,alpha:{start:.22,end:0},scale:{start:1,end:.5},
      speed:{min:1,max:4},lifespan:{min:2800,max:5400},frequency:Math.floor(190*pf),quantity:1,
      emitZone:{type:"random",source:new Phaser.Geom.Rectangle(0,0,WORLD_W*TILE,WORLD_H*TILE)}
    });
  }

  // ─────────────────────────────────────────────────
  // AUDIO
  // ─────────────────────────────────────────────────
  _ensureCtx() {
    if(this.audioCtx) return this.audioCtx;
    const C=window.AudioContext||window.webkitAudioContext; if(!C) return null;
    this.audioCtx=new C();
    this.masterGain=this.audioCtx.createGain();
    this.masterGain.gain.value=this.cfg.master;
    this.masterGain.connect(this.audioCtx.destination);
    return this.audioCtx;
  }

  _bootMenuMusic() {
    const ctx=this._ensureCtx();
    if(!ctx) return;
    const tryStart=()=>{
      if(this.gameStarted) return;
      if(ctx.state==="suspended") ctx.resume().catch(()=>{});
      this.startMenuMusic();
    };
    // Immediate attempt on load, then a few retries for browsers that delay unlock.
    tryStart();
    this.time.addEvent({delay:900,repeat:6,callback:tryStart});
  }

  startMenuMusic() {
    const ctx=this._ensureCtx(); if(!ctx||this.menuMusTimer) return;
    this.menuMusGain=ctx.createGain(); this.menuMusGain.gain.value=this.cfg.music*.12; this.menuMusGain.connect(this.masterGain);
    const notes=[220,247,262,294,262,247,220,196]; let step=0;
    this.menuMusTimer=this.time.addEvent({delay:340,loop:true,callback:()=>{
      if(!this.menuMusGain||this.gameStarted) return;
      const t=ctx.currentTime;
      const o=ctx.createOscillator(); const g=ctx.createGain();
      o.type="square"; o.frequency.value=notes[step%notes.length];
      g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.16,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.28);
      o.connect(g); g.connect(this.menuMusGain); o.start(t); o.stop(t+.30); step++;
    }});
  }

  stopMenuMusic() {
    if(this.menuMusTimer){this.menuMusTimer.remove();this.menuMusTimer=null;}
    if(this.menuMusGain){this.menuMusGain.disconnect();this.menuMusGain=null;}
  }

  startAmbient() {
    const ctx=this._ensureCtx(); if(!ctx||this.ambGain) return;
    this.ambGain=ctx.createGain(); this.ambGain.gain.value=this.cfg.music*.07; this.ambGain.connect(this.masterGain);
    const drone=(f,t,g)=>{ const o=ctx.createOscillator(); const gn=ctx.createGain(); o.type=t; o.frequency.value=f; gn.gain.value=g; o.connect(gn); gn.connect(this.ambGain); o.start(); return o; };
    this.drones=[drone(58,"triangle",.45),drone(87,"sine",.20)];
    this.time.addEvent({delay:2800,loop:true,callback:()=>{
      if(!this.gameStarted||!ctx) return;
      const t=ctx.currentTime; const o=ctx.createOscillator(); const g=ctx.createGain();
      o.type="triangle"; o.frequency.value=rn(160,280);
      g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.06,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.28);
      o.connect(g); g.connect(this.ambGain); o.start(t); o.stop(t+.30);
    }});
    // fountain drone
    this.time.addEvent({delay:600,loop:true,callback:()=>{
      if(this.zone!=="brennan"||this.ftnOsc) return;
      const o=ctx.createOscillator(); const g=ctx.createGain(); const f=ctx.createBiquadFilter();
      o.type="sine"; o.frequency.value=320; g.gain.value=.014; f.type="bandpass"; f.frequency.value=800; f.Q.value=.5;
      o.connect(f); f.connect(g); g.connect(this.ambGain); o.start();
      this.ftnOsc=o;
    }});
  }

  applySettings() {
    if(this.masterGain) this.masterGain.gain.value=this.cfg.master;
    if(this.menuMusGain) this.menuMusGain.gain.value=this.cfg.music*.12;
    if(this.ambGain) this.ambGain.gain.value=this.cfg.music*.07;
    if(this.ui) this.ui.setScale(this.cfg.uiScale);
    const mc=document.querySelector(".menu-card"); if(mc) mc.style.transform=`scale(${this.cfg.uiScale})`;
    const bm=.7+this.cfg.bright*1.2;
    const gc=document.querySelector("#game-root canvas"); const ml=document.getElementById("start-menu");
    if(gc) gc.style.filter=`brightness(${bm})`; if(ml) ml.style.filter=`brightness(${bm})`;
    if(!this.brightOv){ this.brightOv=this.add.rectangle(0,0,GAME_W,GAME_H,0x000000,.15).setOrigin(0).setScrollFactor(0).setDepth(148); }
    this.brightOv.setAlpha(Phaser.Math.Clamp(.25-this.cfg.bright*.3,0,.25));
  }

  // ─────────────────────────────────────────────────
  // MENU BINDING
  // ─────────────────────────────────────────────────
  bindMenu() {
    const play=document.getElementById("btn-play");
    const newg=document.getElementById("btn-new");
    const opts=document.getElementById("btn-options");
    const exit=document.getElementById("btn-exit");
    const panel=document.getElementById("options-panel");
    const clk=document.getElementById("menu-clock");

    const bind=(id,ov,fn)=>{
      const el=document.getElementById(id); const oel=document.getElementById(ov); if(!el) return;
      el.addEventListener("input",()=>{if(oel)oel.textContent=el.value; fn(Number(el.value)); this.applySettings();});
    };
    bind("opt-master","opt-master-v",v=>this.cfg.master=v/100);
    bind("opt-music","opt-music-v",v=>this.cfg.music=v/100);
    bind("opt-brightness","opt-brightness-v",v=>this.cfg.bright=v/100);
    bind("opt-uiscale","opt-uiscale-v",v=>this.cfg.uiScale=v/100);

    if(play) play.onclick=()=>this.startGame();
    if(newg) newg.onclick=()=>this.startGame();
    if(exit) exit.onclick=()=>this.addChat("[SYSTEM]: Exit unavailable in browser build.","#cc8800");
    if(opts) opts.onclick=()=>panel&&panel.classList.toggle("show");

    this._bootMenuMusic();
    const unlock=()=>this._bootMenuMusic();
    document.addEventListener("pointerdown",unlock,{once:true});
    document.addEventListener("keydown",unlock,{once:true});

    const menu=document.getElementById("start-menu");
    if(menu){
      const h=e=>{
        const t=e.target; if(!t) return;
        if(["btn-options","btn-exit","opt-master","opt-music","opt-brightness","opt-uiscale"].includes(t.id)) return;
        if(t.closest&&t.closest(".options-panel")) return;
        this.startGame();
      };
      menu.addEventListener("pointerdown",h); menu.addEventListener("keydown",h);
    }

    // clock update
    this.time.addEvent({delay:1000,loop:true,callback:()=>{
      if(!clk) return;
      clk.textContent=`${String(Math.floor(this.dayMins/60)).padStart(2,"0")}:${String(Math.floor(this.dayMins)%60).padStart(2,"0")}`;
    }});

    this.applySettings();
  }

  startGame() {
    if(this.gameStarted) return;
    this.gameStarted=true;
    this.stopMenuMusic(); this.startAmbient();
    const m=document.getElementById("start-menu"); if(m) m.style.display="none";
    this.addChat("[SYSTEM]: Connection established. Welcome back.","#cc8800");
    this.addChat("[Enix]: Welcome back, traveler.","#44aaff");
    if(!this.save.flags.intro){
      this.addJournal("Day 5,694: Returned to Brennan's Crossing.");
      this.addJournal("Objective: Find out who is still here.");
      this.save.flags.intro=true;
    }
  }

  // ─────────────────────────────────────────────────
  // UPDATE LOOP
  // ─────────────────────────────────────────────────
  update(_,dtMs) {
    const dt=dtMs/1000;
    this.sessecs+=dt; this.dayMins+=dt; // 1 real sec = 1 in-game min
    if(this.dayMins>=1440) this.dayMins-=1440;

    this.updateHUD(); this.updateDayNight(); this.updateNPCSchedules();
    if(this.gameStarted){
      this.updateMove(dt); this.updatePromptPos(); this.tickDlg(dtMs);
      this.tickPetals(); this._updateVane(dt); this._tickAshWobble();
    }
    if(this.showPerf&&this.perfTxt){
      this.perfTxt.setText(`FPS ${Math.round(this.game.loop.actualFps)}\nZone ${ZONES[this.zone].name}\nNPC ${this.npcs.filter(n=>n.sp.visible).length}\nTime ${String(Math.floor(this.dayMins/60)).padStart(2,"0")}:${String(Math.floor(this.dayMins)%60).padStart(2,"0")}`);
    }
    this.posDlgUI();
    this.mmAccum+=dtMs; if(this.mmAccum>=120){this.mmAccum=0;this.updateMM();}
  }

  updateHUD() {
    const hh=String(Math.floor(this.dayMins/60)).padStart(2,"0");
    const mm=String(Math.floor(this.dayMins)%60).padStart(2,"0");
    const day=Math.floor(this.sessecs/600)+1;
    const oh=String(Math.floor(this.sessecs/3600)).padStart(2,"0");
    const om=String(Math.floor((this.sessecs%3600)/60)).padStart(2,"0");
    const os=String(Math.floor(this.sessecs%60)).padStart(2,"0");
    if(this.clockTxt) this.clockTxt.setText(`${hh}:${mm}`);
    if(this.dayTxt)   this.dayTxt.setText(`MON · SPRING · D${day}`);
    if(this.zoneTxt)  this.zoneTxt.setText(ZONES[this.zone].name.toLowerCase());
    if(this.charTxt)  this.charTxt.setText(`Adventurer\nClass: ???\nGuild: -\nONLINE: ${oh}:${om}:${os}`);
  }

  updateNPCSchedules() {
    const hr=Math.floor(this.dayMins/60);
    this.npcs.forEach(n=>{
      let vis=n.zone===this.zone;
      if(n.nightOnly) vis=vis&&(hr>=20||hr<5);
      n.sp.setVisible(vis);
      if(n.lb){ n.lb.setVisible(vis); n.lb.x=n.sp.x; n.lb.y=n.sp.y-(n.id==="gorrath"?92:62); }
      if(n.eyeL) n.eyeL.setVisible(vis);
    });
    // Mira sleeps 2am–6am
    const mira=this.npcs.find(n=>n.id==="mira");
    if(mira&&this.zone==="brennan"){ const sleep=hr>=2&&hr<6; mira.sp.setVisible(!sleep); if(mira.lb) mira.lb.setVisible(!sleep); }
    // Sable emitter follows
    if(this.sableEmt){ const s=this.npcs.find(n=>n.id==="sable"); if(s&&s.sp.visible){this.sableEmt.setPosition(s.sp.x,s.sp.y-22);this.sableEmt.setVisible(true);}else{this.sableEmt.setVisible(false);} }
  }

  // ─────────────────────────────────────────────────
  // MOVEMENT
  // ─────────────────────────────────────────────────
  updateMove(dt) {
    let vx=0,vy=0;
    if(!this.inDialogue){
      if(this.isDown("KEYA","A")||this.isDown("ARROWLEFT","LEFT")) vx-=1;
      if(this.isDown("KEYD","D")||this.isDown("ARROWRIGHT","RIGHT"))vx+=1;
      if(this.isDown("KEYW","W")||this.isDown("ARROWUP","UP"))     vy-=1;
      if(this.isDown("KEYS","S")||this.isDown("ARROWDOWN","DOWN")) vy+=1;
    }
    if(vx||vy){const l=Math.hypot(vx,vy);vx/=l;vy/=l;}
    this.player.x=Phaser.Math.Clamp(this.player.x+vx*120*dt,14,WORLD_W*TILE-14);
    this.player.y=Phaser.Math.Clamp(this.player.y+vy*120*dt,14,WORLD_H*TILE-10);
    if(vx||vy){
      if(Math.abs(vx)>Math.abs(vy)) this.player.play(vx>0?"player-walk-right":"player-walk-left",true);
      else                           this.player.play(vy>0?"player-walk-down":"player-walk-up",true);
    } else { this.player.play("player-idle",true); }
    if(this.playerLight){this.playerLight.x=this.player.x;this.playerLight.y=this.player.y-10;}
    if(this.player.x>WORLD_W*TILE-16) this.gotoZone(1);
    if(this.player.x<16)              this.gotoZone(-1);
  }

  gotoZone(delta) {
    if(this.switchLock) return;
    const idx=ZONE_ORDER.indexOf(this.zone);
    const next=Phaser.Math.Clamp(idx+delta,0,ZONE_ORDER.length-1);
    if(next===idx) return;
    this.switchLock=true;
    const nz=ZONE_ORDER[next];
    this.runTransition(ZONES[nz].name,()=>{
      this.zone=nz;
      this.player.x=delta>0?20:WORLD_W*TILE-20; this.player.y=24*TILE;
      this.createWorld(); this.applyZoneLighting(); this.updateHUD();
      this.addChat(`[SERVER]: Entering ${ZONES[this.zone].name}.`,"#cc8800");
      this.time.delayedCall(280,()=>this.switchLock=false);
    });
  }

  _updateVane(dt) { if(this.zone!=="ashfield"||!this.vaneGfx) return; this.vaneAngle=(this.vaneAngle+dt*42)%360; this._drawVane(this.vaneAngle); }
  _tickAshWobble() { if(this.zone!=="ashfield"||!this.ashEmt) return; this.ashEmt.forEachAlive(p=>{p.x+=Math.sin((p.lifeT+p.y)*10)*.04;}); }

  tickPetals() {
    const di=Math.floor(this.sessecs/600);
    const mn=Math.floor(this.dayMins);
    if(this.zone==="brennan"&&mn===9*60&&this.petalBurstDay!==di){
      this.petalBurstDay=di;
      if(this.petalEmt&&this.deadTreeGfx){
        this.petalEmt.setPosition(this.deadTreeGfx.x,this.deadTreeGfx.y-42);
        this.petalEmt.setVisible(true); this.petalEmt.explode(26,this.deadTreeGfx.x,this.deadTreeGfx.y-42);
        this.time.delayedCall(3500,()=>{if(this.petalEmt)this.petalEmt.setVisible(false);});
      }
      this.addChat("The dead cherry tree releases petals. Three seconds of pink.","#e8a0b0",true);
      this.addChat("[The Herald]: Logged. Day 5,694. 09:00. Petal event. Three seconds.","#44aaff");
      const mira=this.npcs.find(n=>n.id==="mira");
      if(mira&&mira.sp.visible){mira.sp.setFrame(17);this.time.delayedCall(3400,()=>mira.sp.setFrame(16));}
    }
  }

  // ─────────────────────────────────────────────────
  // INTERACTION
  // ─────────────────────────────────────────────────
  getNearby() {
    const nNpc=this.npcs.filter(n=>n.sp.visible)
      .map(n=>({kind:"npc",npc:n,d:Phaser.Math.Distance.Between(this.player.x,this.player.y,n.sp.x,n.sp.y)}))
      .sort((a,b)=>a.d-b.d)[0];
    const nObj=INTERACTABLES.filter(i=>i.zone===this.zone)
      .map(i=>({kind:"obj",obj:i,d:Phaser.Math.Distance.Between(this.player.x,this.player.y,i.x*TILE,i.y*TILE)}))
      .sort((a,b)=>a.d-b.d)[0];
    const nIn=nNpc&&nNpc.d<=74?nNpc:null;
    const oIn=nObj&&nObj.d<=74?nObj:null;
    if(!nIn&&!oIn) return null; if(!nIn) return oIn; if(!oIn) return nIn;
    return nIn.d<=oIn.d?nIn:oIn;
  }

  interact(target) {
    if(target.kind==="npc"){this.startDlg(target.npc);return;}
    const item=target.obj; if(!item) return;
    this.addChat(`[INSPECT]: ${item.text}`,"#a6c4ff",true);
    if(item.journal) this.addJournal(item.journal);
    if(item.secret)  this.unlockSecret(item.secret);
    if(item.terminal) this.openTerminal(item.terminal);
    if(item.id==="archive-bell"&&this.zone==="archive") this._bellRing();
  }

  _bellRing() {
    if(this.bellRung) return; this.bellRung=true;
    const voss=this.npcs.find(n=>n.id==="voss");
    if(voss&&voss.sp.visible){
      this.addChat("[Voss]: *clears throat* ...one moment.","#44aaff");
      this.tweens.add({targets:voss.sp,x:20*TILE,y:40*TILE,duration:5000,ease:"Linear",onComplete:()=>{
        voss.sp.play("voss-idle");
        this.time.delayedCall(7000,()=>this.tweens.add({targets:voss.sp,x:25*TILE,y:28*TILE,duration:5000,ease:"Linear"}));
      }});
    }
  }

  addJournal(text) {
    if(this.save.journal.includes(text)) return;
    this.save.journal.push(text);
    this.refreshJournal();
    this.addChat(`[JOURNAL]: ${text}`,"#88b8ff",true);
  }

  unlockSecret(id) {
    if(this.save.secrets.includes(id)) return;
    this.save.secrets.push(id);
    this.addChat(`[SECRET FOUND]: ${id}`,"#e0a860");
    this.refreshJournal();
  }

  refreshJournal() {
    const list=document.getElementById("journal-list");
    const meta=document.getElementById("journal-meta");
    if(!list||!meta) return;
    list.innerHTML="";
    meta.textContent=`Entries: ${this.save.journal.length}  ·  Secrets: ${this.save.secrets.length}`;
    const af=document.querySelector(".jfilter.active");
    const filter=af?af.dataset.filter:"all";
    if(filter==="secrets"){
      if(!this.save.secrets.length){const d=document.createElement("div");d.className="panel-journal-item";d.textContent="No secrets found yet.";list.appendChild(d);}
      else this.save.secrets.slice().reverse().forEach(s=>{const d=document.createElement("div");d.className="panel-journal-item is-secret";d.textContent=`🔓 ${s}`;list.appendChild(d);});
    } else {
      if(!this.save.journal.length){const d=document.createElement("div");d.className="panel-journal-item";d.textContent="No entries yet. Explore and interact.";list.appendChild(d);}
      else this.save.journal.slice().reverse().forEach(j=>{const d=document.createElement("div");d.className="panel-journal-item";d.textContent=j;list.appendChild(d);});
    }
  }

  updatePromptPos() {
    if(this.inDialogue){this.prompt.setVisible(false);return;}
    const t=this.getNearby(); if(!t){this.prompt.setVisible(false);return;}
    const cam=this.cameras.main;
    const wx=t.kind==="npc"?t.npc.sp.x:t.obj.x*TILE;
    const wy=t.kind==="npc"?t.npc.sp.y:t.obj.y*TILE;
    const sx=(wx-cam.worldView.x)*cam.zoom;
    const sy=(wy-cam.worldView.y)*cam.zoom;
    this.prompt.setVisible(true).setPosition(Math.round(sx-53),Math.round(sy-78));
  }

  // ─────────────────────────────────────────────────
  // DIALOGUE
  // ─────────────────────────────────────────────────
  startDlg(npc) {
    if(this.activePanelId) this.closeAllPanels();
    if(!this.save.spoken[npc.id]) this.save.spoken[npc.id]={first:true,second:false};
    else if(!this.save.spoken[npc.id].second) this.save.spoken[npc.id].second=true;

    this.inDialogue=true;
    this.dlgState={npc,lines:DIALOGUE[npc.id]||["..."],li:0,ci:0,el:0};

    const dn=NPC_NAMES[npc.id]||npc.id;
    const col=Phaser.Display.Color.IntegerToColor(npc.accent).rgba;
    this.dlgName.setText(dn).setColor(col);
    this.dlgIcon.setText(npc.icon||"◍").setColor(col);
    this.dlgCursor.setColor(col);
    this.dlgAccent.fillColor=npc.accent;
    this.dlgPort.clear().fill(0x0f0f18,1,0,0,86,86).drawFrame(npc.key,16,8,4);
    this.dlgTxt.setText("");
    this.dlgCont.setVisible(true); this.dlgOverlay.setAlpha(0);
    this.tweens.add({targets:this.cameras.main,zoom:RENDER_SCALE+.14,duration:420,ease:"Sine.easeOut"});
    this.tweens.add({targets:this.dlgOverlay,alpha:.38,duration:320,ease:"Sine.easeOut"});
    const cc=npc.id==="sable"?"#6688cc":npc.id==="gm"?"#80a0ff":"#44aaff";
    this.addChat(`[${dn}]: ${this.dlgState.lines[0]}`,cc);
    if(npc.id==="gm") this.checkEnding();
    if(npc.id==="gorrath"&&npc.eyeL){npc.eyeL.setAlpha(.95);this.time.delayedCall(200,()=>npc.eyeL.setAlpha(.55));}
  }

  tickDlg(dtMs) {
    if(!this.inDialogue||!this.dlgState) return;
    const s=this.dlgState; const line=s.lines[s.li]||"";
    if(s.ci>=line.length) return;
    s.el+=dtMs;
    while(s.el>=28&&s.ci<line.length){s.el-=28;s.ci++;}
    this.dlgTxt.setText(line.slice(0,s.ci));
  }

  advanceDlg() {
    if(!this.inDialogue||!this.dlgState) return;
    const s=this.dlgState; const line=s.lines[s.li]||"";
    if(s.ci<line.length){s.ci=line.length;this.dlgTxt.setText(line);return;}
    s.li++;s.ci=0;s.el=0;
    if(s.li>=s.lines.length){this.closeDlg();return;}
    this.dlgTxt.setText("");
    const dn=NPC_NAMES[s.npc.id]||s.npc.id;
    const cc=s.npc.id==="sable"?"#6688cc":s.npc.id==="gm"?"#80a0ff":"#44aaff";
    this.addChat(`[${dn}]: ${s.lines[s.li]}`,cc);
  }

  closeDlg() {
    this.inDialogue=false; this.dlgState=null;
    this.tweens.add({targets:this.cameras.main,zoom:RENDER_SCALE,duration:310,ease:"Sine.easeOut"});
    this.tweens.add({targets:this.dlgOverlay,alpha:0,duration:310,ease:"Sine.easeOut"});
  }

  // ─────────────────────────────────────────────────
  // HOTKEYS & PANELS
  // ─────────────────────────────────────────────────
  bindHotkeys() {
    const fab=document.getElementById("controls-fab"); if(fab) fab.onclick=()=>this.togglePanel("panel-hotkeys");
    const kb=this.input.keyboard;
    kb.on("keydown-J",()=>this.togglePanel("panel-journal"));
    kb.on("keydown-F",()=>this.togglePanel("panel-forum"));
    kb.on("keydown-C",()=>this.togglePanel("panel-credits"));
    kb.on("keydown-H",()=>this.togglePanel("panel-hotkeys"));
    kb.on("keydown-L",()=>this.togglePanel("panel-changelog"));
    kb.on("keydown-I",()=>{this.showPerf=!this.showPerf;if(this.perfTxt)this.perfTxt.setVisible(this.showPerf);});
    kb.on("keydown-P",()=>this.togglePhoto());
    kb.on("keydown-O",()=>this.takePhoto());
    kb.on("keydown-ESC",()=>{this.closeAllPanels();if(this.photoMode)this.togglePhoto();if(this.inDialogue)this.closeDlg();});

    document.querySelectorAll(".jfilter").forEach(b=>{
      b.addEventListener("click",()=>{
        document.querySelectorAll(".jfilter").forEach(x=>x.classList.remove("active"));
        b.classList.add("active"); this.refreshJournal();
      });
    });
  }

  togglePanel(id) {
    const el=document.getElementById(id); if(!el) return;
    if(this.activePanelId===id){this.closeAllPanels();return;}
    this.closeAllPanels(); el.style.display="block"; this.activePanelId=id;
  }

  closeAllPanels() {
    ["panel-hotkeys","panel-journal","panel-changelog","panel-credits","panel-forum","panel-ending"].forEach(id=>{
      const el=document.getElementById(id); if(el) el.style.display="none";
    });
    this.activePanelId=null;
  }

  togglePhoto() {
    this.photoMode=!this.photoMode;
    if(this.ui) this.ui.setVisible(!this.photoMode);
    if(this.dlgCont) this.dlgCont.setVisible(!this.photoMode&&this.inDialogue);
    if(this.dlgOverlay) this.dlgOverlay.setVisible(!this.photoMode);
    const ind=document.getElementById("photo-indicator"); if(ind) ind.style.display=this.photoMode?"block":"none";
    this.addChat(this.photoMode?"[SYSTEM]: Photo mode on.":"[SYSTEM]: Photo mode off.","#cc8800");
  }

  takePhoto() {
    if(!this.photoMode){this.addChat("[SYSTEM]: Enable photo mode first (P).","#cc8800");return;}
    this.game.renderer.snapshot(img=>{
      const a=document.createElement("a"); a.href=img.src; a.download=`the-last-modder-${Date.now()}.png`; a.click();
      this.addChat("[SYSTEM]: Screenshot saved.","#cc8800");
    });
  }

  // ─────────────────────────────────────────────────
  // FORUM TERMINALS
  // ─────────────────────────────────────────────────
  setupForum() {
    const contact=document.getElementById("forum-contact");
    if(contact) contact.onclick=()=>{
      this.save.flags.contactedSeller=true;
      this.addChat("[SYSTEM]: Message sent to TavernKnight.","#cc8800");
      this.addChat("The terminal shows: 'Message delivered. Awaiting response.'","#888",true);
      if(this.computeEnding()==="C") this.time.delayedCall(30000,()=>{
        this.addChat("[TavernKnight]: still there?","#44aaff");
        this.addJournal("TavernKnight replied. They were still there.");
      });
    };
    const sub=document.getElementById("forum-type-submit"); if(sub) sub.onclick=()=>this.submitPost();
    const inp=document.getElementById("forum-type-input");
    if(inp) inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();this.submitPost();}});
  }

  submitPost() {
    if(this.unfinishedDone) return;
    const inp=document.getElementById("forum-type-input"); if(!inp||!inp.value.trim()) return;
    const typed=inp.value.trim();
    this.unfinishedDone=true; this.save.flags.completedPost=true;
    inp.style.display="none";
    const sb=document.getElementById("forum-type-submit"); if(sb) sb.style.display="none";
    const post=document.getElementById("forum-post");
    if(post) post.textContent+=typed+"\n\n— Posted by: you\n\n[Voss stood up from his desk.\nHe walked to the terminal.\nHe saved the post.\nHe nodded once.\nHe did not say anything.]";
    this.addChat("[SYSTEM]: Post submitted to Forum Archive.","#cc8800");
    this.addJournal("Completed the unfinished post in the Forum Archive.");
    this.unlockSecret("ashveil-post-completed");
    const voss=this.npcs.find(n=>n.id==="voss");
    if(voss&&voss.sp.visible){ voss.sp.play("voss-walk-right"); this.time.delayedCall(800,()=>voss.sp.play("voss-idle")); }
  }

  openTerminal(termId) {
    const term=TERMINALS[termId]; if(!term) return;
    this.activeTerminal=termId; this.activeThreadIdx=0;
    const heading=document.getElementById("forum-heading");
    const threads=document.getElementById("forum-threads");
    const post=document.getElementById("forum-post");
    const contact=document.getElementById("forum-contact");
    const typeArea=document.getElementById("forum-type-area");
    const typeInp=document.getElementById("forum-type-input");
    const label=document.getElementById("forum-terminal-label");
    if(!threads||!post) return;

    if(heading) heading.textContent=`Terminal: ${term.label}`;
    if(label) label.textContent=`· ${term.label}`;
    threads.innerHTML=""; if(contact) contact.style.display="none"; if(typeArea) typeArea.style.display="none";

    const renderThread=(idx)=>{
      const th=term.threads[idx]; if(!th) return;
      if(th.isUnfinished&&!this.unfinishedDone){
        post.textContent=th.body;
        if(typeArea) typeArea.style.display="block";
        if(typeInp){typeInp.value="";typeInp.focus();}
        if(contact) contact.style.display="none";
      } else if(th.isUnfinished&&this.unfinishedDone){
        post.textContent=th.body+"\n\n[Post was completed. Voss saved it.]";
        if(typeArea) typeArea.style.display="none";
      } else {
        post.textContent=th.body;
        if(typeArea) typeArea.style.display="none";
        if(contact) contact.style.display=th.contactSeller?"block":"none";
      }
      Array.from(threads.querySelectorAll(".forum-thread-btn")).forEach((b,i)=>b.classList.toggle("active",i===idx));
    };

    term.threads.forEach((th,idx)=>{
      const b=document.createElement("button"); b.className="forum-thread-btn"; b.textContent=th.title;
      b.onclick=()=>{this.activeThreadIdx=idx;renderThread(idx);}; threads.appendChild(b);
    });
    renderThread(0);
    this.togglePanel("panel-forum");

    if(termId!=="unfinished") this.addJournal(`Read archive terminal: ${term.label}`);
    if(termId==="corrupted"){ this.addChat("[Terminal 6]: static. fragments assembling. dissolving.","#cc4444"); this.unlockSecret("corrupted-terminal"); }
  }

  // ─────────────────────────────────────────────────
  // ENDING SYSTEM
  // ─────────────────────────────────────────────────
  _allMain() { return ["mira","aldric","herald","voss","gorrath","gm"].every(id=>this.save.spoken[id]&&this.save.spoken[id].first); }
  _secondPass() { return ["mira","aldric","herald","voss","gorrath","gm"].every(id=>this.save.spoken[id]&&this.save.spoken[id].second); }
  computeEnding() {
    const s=this.save.secrets.length, j=this.save.journal.length;
    const am=this._allMain(), sp=this._secondPass();
    const cs=!!this.save.flags.contactedSeller, cp=!!this.save.flags.completedPost;
    if(am&&sp&&s>=4&&j>=10&&cs&&cp) return "C";
    if(am&&(s>=2||j>=6)) return "B";
    return "A";
  }

  checkEnding() {
    if(this.zone!=="server"||this.sessecs<90||!this._allMain()) return;
    this.showEnding(this.computeEnding());
  }

  showEnding(route) {
    const titles={C:"Ending C · Reconnect",B:"Ending B · Witness",A:"Ending A · Last Observer"};
    const bodies={
      C:"Thirty seconds after you send the message, a reply appears: 'still there?'\n\nThe server is no longer just a museum.\nIt is a conversation again.\n\nSomewhere, in a browser tab that was never closed, TavernKnight was waiting.",
      B:"You catalogued enough traces to prove they were here.\nThe NPCs remain, but their history is no longer silent.\nYou were the first person to read it in years.\n\nThat matters. Probably.",
      A:"You came. You looked around.\nYou left marks only in volatile memory.\n\nValdris Online keeps running in the dark.\nThe Herald will log your visit.\nDay 5,694. Duration: unknown."
    };
    const t=document.getElementById("ending-title"); if(t) t.textContent=titles[route];
    const b=document.getElementById("ending-body"); if(b) b.textContent=bodies[route];
    const st=document.getElementById("ending-stats");
    if(st) st.textContent=`NPCs spoken to: ${Object.keys(this.save.spoken).length}/8  ·  Secrets: ${this.save.secrets.length}  ·  Journal entries: ${this.save.journal.length}`;
    this.save.flags.lastEnding=route;
    this.togglePanel("panel-ending");
    this.addChat(`[SYSTEM]: Ending route ${route} unlocked.`,"#cc8800");
  }

  // ─────────────────────────────────────────────────
  // MINIMAP
  // ─────────────────────────────────────────────────
  updateMM() {
    const sz=120; this.mmRT.clear();
    const bc={brennan:0xb99768,ashfield:0xa18664,archive:0x747488,dungeon:0x2a2535,server:0x161624};
    this.mmRT.fill(bc[this.zone]||0x808080,1,0,0,sz,sz);
    const dot=(x,y,c,s)=>this.mmRT.fill(c,1,x,y,s,s);
    const mmX=wx=>Phaser.Math.Clamp((wx/(WORLD_W*TILE))*sz,0,sz-3);
    const mmY=wy=>Phaser.Math.Clamp(((WORLD_H*TILE-wy)/(WORLD_H*TILE))*sz,0,sz-3);

    if(this.zone==="brennan"){
      this.mmRT.fill(0x8e7450,1,10,50,86,16); this.mmRT.fill(0x8e7450,1,38,12,12,96);
      this.mmRT.fill(0x3b2b1f,1,8,8,22,18); this.mmRT.fill(0x48403a,1,80,8,28,20); this.mmRT.fill(0x5f5648,1,94,70,22,22);
    } else if(this.zone==="ashfield"){
      this.mmRT.fill(0x5b3d24,1,12,70,96,24); this.mmRT.fill(0x4a3020,1,70,14,28,36);
    } else if(this.zone==="archive"){
      this.mmRT.fill(0x5a1a2a,1,48,0,14,120); this.mmRT.fill(0x2a1a0a,1,8,60,100,14);
    } else if(this.zone==="dungeon"){
      this.mmRT.fill(0x3a1a5a,1,16,20,12,80); this.mmRT.fill(0x3a1a5a,1,16,20,76,12);
    } else if(this.zone==="server"){
      for(let i=0;i<3;i++) this.mmRT.fill(0x1f2d5a,1,20,18+i*28,82,14);
    }
    this.npcs.forEach(n=>{
      if(!n.sp.visible||n.id==="sable") return;
      dot(mmX(n.sp.x),mmY(n.sp.y),0x44aa44,3);
    });
    const blink=Math.floor(this.sessecs*2)%2===0;
    dot(mmX(this.player.x),mmY(this.player.y),blink?0xffffff:0x888888,3);
  }

  // ─────────────────────────────────────────────────
  // CHAT
  // ─────────────────────────────────────────────────
  addChat(txt,col="#fff",italic=false) {
    this.chatLines.push({txt,col,italic});
    if(this.chatLines.length>80) this.chatLines.shift();
    this.chatScroll=0; this.renderChat();
  }

  _wrapChatEntry(entry,maxWidth) {
    if(!this.chatMeasure) return [entry];
    this.chatMeasure.setFontStyle(entry.italic?"italic":"normal");

    let remaining=entry.txt||"";
    if(!remaining.length) return [{txt:"",col:entry.col,italic:entry.italic}];

    const out=[];
    while(remaining.length>0){
      let lo=1, hi=remaining.length, fit=1;
      while(lo<=hi){
        const mid=(lo+hi)>>1;
        this.chatMeasure.setText(remaining.slice(0,mid));
        if(this.chatMeasure.width<=maxWidth){ fit=mid; lo=mid+1; }
        else hi=mid-1;
      }

      let cut=fit;
      if(cut<remaining.length){
        const ws=remaining.lastIndexOf(" ",cut);
        if(ws>0) cut=ws;
      }
      if(cut<=0) cut=fit;

      const line=remaining.slice(0,cut).trimEnd();
      out.push({txt:line,col:entry.col,italic:entry.italic});
      remaining=remaining.slice(cut).trimStart();
    }
    return out;
  }

  renderChat() {
    const wrapped=[];
    this.chatLines.forEach(l=>{
      this._wrapChatEntry(l,392).forEach(w=>wrapped.push(w));
    });
    this.chatRenderLines=wrapped;

    const maxScroll=Math.max(0,wrapped.length-6);
    this.chatScroll=Phaser.Math.Clamp(this.chatScroll,0,maxScroll);

    const end=wrapped.length-this.chatScroll;
    const start=Math.max(0,end-6);
    const vis=wrapped.slice(start,end);
    for(let i=0;i<6;i++){
      const l=vis[i]; const t=this.chatTxts[i]; if(!t) continue;
      if(l){
        t.setText(l.txt); t.setColor(l.col); t.setFontStyle(l.italic?"italic":"normal");
      }
      else t.setText("");
    }
    if(this.chatThumb){
      const maxS=Math.max(1,wrapped.length-6); const ratio=this.chatScroll/maxS;
      const m=28; this.chatThumb.setY(GAME_H-m-182+4+(1-ratio)*(134-40));
    }
  }

  // ─────────────────────────────────────────────────
  // ZONE DATA GENERATION
  // ─────────────────────────────────────────────────
  _genZoneData(zone) {
    const data=[]; const base=ZONES[zone].base;
    for(let y=0;y<WORLD_H;y++){
      const row=[];
      for(let x=0;x<WORLD_W;x++){
        let t=base;
        if(zone==="brennan"){
          t=base+rn(0,3);
          if((x>8&&x<32&&y>20&&y<24)||(x>17&&x<22&&y>6&&y<30)) t=4;
        } else if(zone==="ashfield"){
          t=base+rn(0,3); if(y>30&&x>10&&x<60) t=9;
        } else if(zone==="archive"){
          t=10; if(x>20&&x<25) t=11;
        } else if(zone==="dungeon"){
          t=rn(0,4)===0?13:12;
        } else if(zone==="server"){
          t=rn(0,7)===0?15:14;
        }
        row.push(t);
      }
      data.push(row);
    }
    return data;
  }

  // ─────────────────────────────────────────────────
  // TERRAIN TEXTURE SHEET (16 tiles × 32px)
  // ─────────────────────────────────────────────────
  _genTerrain() {
    const c=document.createElement("canvas"); c.width=TILE*16; c.height=TILE;
    const ctx=c.getContext("2d");

    const fill=(idx,col)=>{
      const x=idx*TILE; ctx.fillStyle=col; ctx.fillRect(x,0,TILE,TILE);
      ctx.strokeStyle="#1a1020"; ctx.lineWidth=1; ctx.strokeRect(x+.5,.5,TILE-1,TILE-1);
    };

    // 0-3: Brennan sandy stone variants
    fill(0,"#c8a878");
    ctx.fillStyle="#a08858"; for(let i=0;i<3;i++) ctx.fillRect(rn(2,28),rn(2,28),1,1);
    fill(1,"#c8a878");
    ctx.strokeStyle="#a08858";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(36,22);ctx.lineTo(39,19);ctx.stroke();
    fill(2,"#c8a878"); ctx.fillStyle="#b09868"; ctx.fillRect(2*TILE+1,1,2,2);
    fill(3,"#c8a878");
    // 4: cobblestone path
    fill(4,"#5a4830");
    for(let ry=0;ry<2;ry++) for(let rx=0;rx<2;rx++){
      const px=4*TILE+4+rx*13,py=4+ry*13,b=rn(-8,8);
      const base2=Phaser.Display.Color.GetColor(154+b,136+b,104+b);
      ctx.fillStyle=`#${base2.toString(16).padStart(6,"0")}`;
      rc(ctx,px,py,11,11,3); ctx.fill();
      ctx.strokeStyle="#6a5840";ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,10,10);
    }
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(4*TILE+.5,.5,TILE-1,TILE-1);
    // 5-8: ashfield cracked earth
    [5,6,7,8].forEach((idx,i)=>{
      fill(idx,"#b09870");
      _drawCracks(ctx,idx*TILE,"#7a6040");
      if(i%2===0) _drawGrass(ctx,idx*TILE,"#8a8460");
    });
    // 9: tilled soil
    fill(9,"#5a3a20");
    for(let r=0;r<8;r++){ctx.fillStyle=r%2===0?"#6a4a30":"#5a3a20";ctx.fillRect(9*TILE,r*4,TILE,4);}
    ctx.fillStyle="#7a5040";ctx.fillRect(9*TILE+TILE-4,0,4,TILE);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(9*TILE+.5,.5,TILE-1,TILE-1);
    // 10: archive cool gray
    fill(10,"#7a7a8a");
    ctx.fillStyle="#e0d8c8"; for(let i=0;i<3;i++) ctx.fillRect(10*TILE+rn(2,28),rn(2,28),1,1);
    // 11: archive rug burgundy
    fill(11,"#5a1a2a");
    ctx.strokeStyle="#7a3a4a";ctx.lineWidth=1;ctx.strokeRect(11*TILE+2.5,2.5,TILE-5,TILE-5);
    ctx.fillStyle="#4a0a1a"; for(let x=11*TILE+5;x<11*TILE+28;x+=6) ctx.fillRect(x,15,3,3);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(11*TILE+.5,.5,TILE-1,TILE-1);
    // 12: dungeon wet stone
    fill(12,"#2a2535");
    ctx.strokeStyle="#1a1525";ctx.lineWidth=1;
    for(let p=0;p<=TILE;p+=8){ctx.beginPath();ctx.moveTo(12*TILE+p,0);ctx.lineTo(12*TILE+p,TILE);ctx.stroke();ctx.beginPath();ctx.moveTo(12*TILE,p);ctx.lineTo(13*TILE,p);ctx.stroke();}
    for(let i=0;i<5;i++){ctx.fillStyle="#3a3545";ctx.fillRect(12*TILE+rn(2,28),rn(2,28),1,1);}
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(12*TILE+.5,.5,TILE-1,TILE-1);
    // 13: magic decay
    fill(13,"#2a2535"); ctx.fillStyle="#3a1a5a";ctx.fillRect(13*TILE+2,2,2,2);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(13*TILE+.5,.5,TILE-1,TILE-1);
    // 14: server grating
    fill(14,"#141420");
    ctx.strokeStyle="#1e1e30";ctx.lineWidth=1;
    for(let p=0;p<=TILE;p+=4){ctx.beginPath();ctx.moveTo(14*TILE+p,0);ctx.lineTo(14*TILE+p,TILE);ctx.stroke();ctx.beginPath();ctx.moveTo(14*TILE,p);ctx.lineTo(15*TILE,p);ctx.stroke();}
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(14*TILE+.5,.5,TILE-1,TILE-1);
    // 15: server LED reflection
    fill(15,"#141420");
    ctx.strokeStyle="#1e1e30";ctx.lineWidth=1;
    for(let p=0;p<=TILE;p+=4){ctx.beginPath();ctx.moveTo(15*TILE+p,0);ctx.lineTo(15*TILE+p,TILE);ctx.stroke();ctx.beginPath();ctx.moveTo(15*TILE,p);ctx.lineTo(16*TILE,p);ctx.stroke();}
    const g=ctx.createLinearGradient(15*TILE+8,12,15*TILE+20,12);
    g.addColorStop(0,"rgba(0,16,64,.6)");g.addColorStop(1,"rgba(0,16,64,0)");
    ctx.fillStyle=g;ctx.fillRect(15*TILE+8,12,12,8);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(15*TILE+.5,.5,TILE-1,TILE-1);
    return c;
  }

  // ─────────────────────────────────────────────────
  // CHARACTER SPRITE SHEET
  // ─────────────────────────────────────────────────
  _genChar(pal) {
    const c=document.createElement("canvas"); c.width=32*18; c.height=48;
    const ctx=c.getContext("2d");

    const drawFrame=(frame,dir)=>{
      const x0=frame*32; const wf=frame%4; const isIdle=frame>=16;
      const bounce=(!isIdle&&(wf===0||wf===2))?-1:(frame===17?1:0);
      const legShift=!isIdle?(wf===0?2:wf===2?-2:0):0;
      const bodyY=18+bounce; const headY=4+bounce;

      // shadow
      if(pal.shadow!==false){
        ctx.fillStyle="rgba(26,16,32,0.4)";
        ctx.beginPath(); ctx.ellipse(x0+16,45,pal.special==="gorrath"?14:10,pal.special==="gorrath"?3:2,0,0,Math.PI*2); ctx.fill();
      }

      // legs
      const llx=x0+11+(dir==="left"?-1:dir==="right"?1:0);
      const rlx=x0+17+(dir==="left"?-1:dir==="right"?1:0);
      ctx.fillStyle=pal.pant; ctx.fillRect(llx,30+Math.max(0,legShift),6,10); ctx.fillRect(rlx,30+Math.max(0,-legShift),6,10);
      outl(ctx,llx,30+Math.max(0,legShift),6,10); outl(ctx,rlx,30+Math.max(0,-legShift),6,10);
      // shoes
      ctx.fillStyle=pal.shoe; ctx.fillRect(llx,40+Math.max(0,legShift),6,4); ctx.fillRect(rlx,40+Math.max(0,-legShift),6,4);
      outl(ctx,llx,40+Math.max(0,legShift),6,4); outl(ctx,rlx,40+Math.max(0,-legShift),6,4);
      // body
      if(dir==="left"||dir==="right"){ ctx.fillStyle=pal.coatD; ctx.fillRect(x0+(dir==="left"?8:16),20,8,10); outl(ctx,x0+(dir==="left"?8:16),20,8,10); }
      ctx.fillStyle=pal.coat; ctx.fillRect(x0+10,bodyY,12,16); outl(ctx,x0+10,bodyY,12,16);
      ctx.fillStyle=shadeHex(pal.coat,14); ctx.fillRect(x0+10,bodyY,12,1);
      ctx.fillStyle=shadeHex(pal.coat,-14); ctx.fillRect(x0+10,bodyY+15,12,1);
      ctx.fillStyle=pal.coatD; ctx.fillRect(x0+8,bodyY+1,2,14); ctx.fillRect(x0+22,bodyY+1,2,14);
      ctx.fillStyle=pal.acc; ctx.fillRect(x0+14,bodyY+4,1,1); ctx.fillRect(x0+17,bodyY+4,1,1);
      // arms
      ctx.fillStyle=pal.skin;
      const aL=!isIdle&&wf===0?-1:!isIdle&&wf===2?1:0; const aR=-aL;
      ctx.fillRect(x0+6,bodyY+2+aL,4,10); ctx.fillRect(x0+22,bodyY+2+aR,4,10);
      outl(ctx,x0+6,bodyY+2+aL,4,10); outl(ctx,x0+22,bodyY+2+aR,4,10);
      // head
      if(dir!=="up"){
        ctx.fillStyle=pal.skin; ctx.fillRect(x0+10,headY,12,10); ctx.fillRect(x0+9,headY+2,14,8);
        outl(ctx,x0+10,headY,12,10);
        ctx.fillStyle=shadeHex(pal.skin,14); ctx.fillRect(x0+10,headY,12,2);
        ctx.fillStyle=shadeHex(pal.skin,-14); ctx.fillRect(x0+10,headY+9,12,1);
        ctx.fillStyle="#b8845a"; ctx.fillRect(x0+8,headY+6,1,1); ctx.fillRect(x0+23,headY+6,1,1);
        ctx.fillStyle=pal.hair;
        ctx.fillRect(x0+9,headY-1,14,3); ctx.fillRect(x0+8,headY+1,2,4); ctx.fillRect(x0+22,headY+1,2,4);
        ctx.fillRect(x0+15,headY-3,2,3); ctx.fillRect(x0+18,headY-3,2,3);
        outl(ctx,x0+9,headY-1,14,3);
        if(dir==="down"){
          ctx.fillStyle="#1a1a2e"; ctx.fillRect(x0+12,headY+6,2,2); ctx.fillRect(x0+17,headY+6,2,2);
          ctx.fillStyle="#f0e8d8"; ctx.fillRect(x0+12,headY+5,1,1); ctx.fillRect(x0+17,headY+5,1,1);
          ctx.fillStyle="#b8845a"; ctx.fillRect(x0+15,headY+8,1,1);
          ctx.fillStyle="#a06040"; ctx.fillRect(x0+14,headY+10,2,1);
        }
      } else {
        ctx.fillStyle=pal.skin; ctx.fillRect(x0+10,headY,12,10); ctx.fillRect(x0+9,headY+2,14,8);
        ctx.fillStyle=pal.hair; ctx.fillRect(x0+8,headY,16,6); outl(ctx,x0+9,headY+2,14,8);
      }
      // special overlays
      if(pal.special==="mira"&&dir==="down"){
        ctx.fillStyle="rgba(196,122,106,.4)"; ctx.fillRect(x0+11,headY+9,2,2); ctx.fillRect(x0+18,headY+9,2,2);
        ctx.fillStyle="#d0c8c0"; ctx.fillRect(x0+22,headY+2,6,6);
        ctx.fillStyle="#e8e0d0"; ctx.fillRect(x0+10,bodyY+2,12,14); outl(ctx,x0+10,bodyY+2,12,14);
      }
      if(pal.special==="enix"){
        // Enix silhouette: long dark hair with bangs.
        ctx.fillStyle=pal.hair;
        ctx.fillRect(x0+8,headY+2,2,9); ctx.fillRect(x0+22,headY+2,2,9);
        ctx.fillRect(x0+11,headY+1,10,2);
        if(dir==="down") ctx.fillRect(x0+10,headY+9,12,2);
      }
      if(pal.special==="gorrath"){
        ctx.fillStyle="#cc0010"; ctx.fillRect(x0+12,headY+6,2,2); ctx.fillRect(x0+18,headY+6,2,2);
        ctx.fillStyle="#1a1a25"; ctx.fillRect(x0+9,bodyY,14,12);
        ctx.fillStyle="#6a1020"; ctx.fillRect(x0+13,bodyY+4,6,3);
        ctx.fillStyle="#5a0a18"; ctx.fillRect(x0+5,bodyY+8,22,18);
        ctx.fillStyle="#c4a020"; ctx.strokeStyle="#c4a020"; ctx.lineWidth=1; ctx.strokeRect(x0+8.5,headY-3.5,15,4);
      }
      if(pal.special==="sable"){
        ctx.fillStyle="rgba(26,42,90,.45)"; ctx.fillRect(x0+8,bodyY+2,16,1);
      }
    };

    ["down","up","left","right"].forEach((dir,di)=>{ for(let i=0;i<4;i++) drawFrame(di*4+i,dir); });
    drawFrame(16,"down"); drawFrame(17,"down");
    return c;
  }

  // ─────────────────────────────────────────────────
  // BUILDING GENERATORS
  // ─────────────────────────────────────────────────

  _genInn() {
    const W=10*TILE,H=8*TILE;
    const c=document.createElement("canvas"); c.width=W; c.height=H;
    const ctx=c.getContext("2d");
    // foundation
    for(let x=0;x<W;x+=8){ctx.fillStyle=((x/8)%2===0)?"#4a3a2a":"#5a4a3a";ctx.fillRect(x,H-8,8,8);}
    // plaster walls — uneven brightness
    for(let y=34;y<H-8;y+=8) for(let x=0;x<W;x+=8){const d=rn(-5,5);ctx.fillStyle=shadeHex("#d4c4a8",d);ctx.fillRect(x,y,8,8);}
    // timber framing
    ctx.fillStyle="#3d2010";
    ctx.fillRect(8,32,4,H-42); ctx.fillRect(96,32,4,H-42); ctx.fillRect(192,32,4,H-42);
    ctx.fillRect(0,H/2-4,W,4);
    ctx.strokeStyle="#3d2010";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(24,76);ctx.lineTo(44,58);ctx.moveTo(120,76);ctx.lineTo(140,58);ctx.stroke();
    // slate roof
    ctx.fillStyle="#4a4555";ctx.fillRect(0,0,W,44);
    ctx.fillStyle="#5a5565";ctx.fillRect(0,10,W,1);
    ctx.fillStyle="#3a2a1a";ctx.fillRect(0,42,W,4);
    // moss blobs
    for(let i=0;i<8;i++){ctx.fillStyle="#3a4a2a";ctx.fillRect(rn(4,W-10),rn(4,30),rn(2,4),rn(2,4));}
    // missing roof tiles
    ctx.fillStyle="#1a1a25";ctx.fillRect(W-78,16,5,5);ctx.fillRect(W-58,9,5,5);ctx.fillRect(W-40,20,5,5);
    ctx.strokeStyle="#6a6a75";ctx.lineWidth=1;ctx.strokeRect(W-77.5,16.5,4,4);ctx.strokeRect(W-57.5,9.5,4,4);ctx.strokeRect(W-39.5,20.5,4,4);
    // chimney
    for(let row=0;row<8;row++){ctx.fillStyle=row%2===0?"#6a3020":"#5a2010";ctx.fillRect(W-70,row*5,24,5);}
    // windows
    const drawWin=(x,y,lit)=>{
      ctx.fillStyle="#3d2010"; rc(ctx,x,y,64,48,4); ctx.fill();
      if(lit){const g=ctx.createRadialGradient(x+32,y+24,2,x+32,y+24,24);g.addColorStop(0,"#e09050");g.addColorStop(1,"#c07030");ctx.fillStyle=g;}else ctx.fillStyle="#2a2035";
      ctx.fillRect(x+4,y+4,56,40);
      ctx.fillStyle="#3d2010";ctx.fillRect(x+31,y+4,2,40);ctx.fillRect(x+4,y+23,56,2);
      if(lit){ctx.fillStyle="#8a4030";ctx.beginPath();ctx.moveTo(x+4,y+4);ctx.lineTo(x+14,y+18);ctx.lineTo(x+4,y+24);ctx.fill();ctx.beginPath();ctx.moveTo(x+60,y+4);ctx.lineTo(x+50,y+18);ctx.lineTo(x+60,y+24);ctx.fill();}
    };
    drawWin(24,56,true);drawWin(128,56,true);drawWin(24,10,true);drawWin(128,10,false);
    // door (ajar)
    ctx.fillStyle="#2a1a08";ctx.fillRect(100,86,64,76);
    for(let dx=104;dx<160;dx+=6){ctx.fillStyle="#1a1000";ctx.fillRect(dx,86,1,76);}
    ctx.fillStyle="#b06020";ctx.fillRect(146,86,18,76); // warm interior glow through gap
    ctx.fillStyle="#4a4a4a";ctx.fillRect(100,100,6,2);ctx.fillRect(100,136,6,2);
    ctx.fillStyle="#8a7a6a";ctx.fillRect(98,162,68,2);
    // sign: THE EMBER INN — E slightly lower
    ctx.save();ctx.translate(128,74);ctx.rotate(2*Math.PI/180);
    ctx.fillStyle="#2a1a08";rc(ctx,-80,-14,160,28,4);ctx.fill();
    ctx.fillStyle="#c8a050";ctx.font="20px VT323";
    ctx.fillText("TH",    -68,7);
    ctx.fillText("E",     -40,9); // E nail loose — 2px lower
    ctx.fillText(" EMBER INN",-28,7);
    ctx.restore();
    // flower boxes
    ctx.fillStyle="#3a2010";ctx.fillRect(34,108,48,16);ctx.fillRect(138,108,48,16);
    // left box — 3 dead stalks, 1 red bloom
    for(let i=0;i<3;i++){ctx.fillStyle="#5a4030";ctx.fillRect(38+i*10,96,2,12);ctx.fillStyle="#6a6050";ctx.fillRect(37+i*10,94,4,4);}
    ctx.fillStyle="#8a1020";ctx.fillRect(69,94,4,4); // red bloom
    // right box — 4 dead stalks
    for(let i=0;i<4;i++){ctx.fillStyle="#5a4030";ctx.fillRect(142+i*8,96,2,12);ctx.fillStyle="#6a6050";ctx.fillRect(141+i*8,94,4,4);}
    // lantern
    ctx.fillStyle="#4a4a3a";ctx.fillRect(88,108,10,12);ctx.fillStyle="#ff8030";ctx.fillRect(90,110,6,6);
    // welcome mat
    ctx.fillStyle="#8a6a4a";ctx.fillRect(84,164,96,14);
    for(let x=84;x<180;x+=8){ctx.fillStyle="#6a4a2a";ctx.fillRect(x,164,4,14);}
    ctx.fillStyle="#5a3a1a";ctx.font="12px VT323";ctx.fillText("WELCOME",110,175);
    // DarkRift_88 silhouette at window table
    ctx.fillStyle="rgba(26,26,46,.82)";ctx.fillRect(28,68,14,28);
    // ivy on east wall
    ctx.strokeStyle="#2a3a1a";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W-10,H-10);ctx.lineTo(W-14,H-40);ctx.lineTo(W-8,H-70);ctx.lineTo(W-12,H-100);ctx.stroke();
    for(let i=0;i<6;i++){ctx.fillStyle="#2a4a1a";ctx.fillRect(W-16+rn(-3,6),H-40+i*16,2,2);}
    // abandoned patch cables and junk by the inn wall
    ctx.strokeStyle="#1f3356";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(180,166);ctx.bezierCurveTo(188,154,202,174,214,162);ctx.moveTo(174,170);ctx.bezierCurveTo(188,180,205,158,220,168);ctx.stroke();
    ctx.fillStyle="#2a2a35";ctx.fillRect(204,160,16,10);ctx.fillStyle="#68a2ff";ctx.fillRect(208,163,3,2);ctx.fillRect(213,163,3,2);
    ctx.fillStyle="#5a4a3a";ctx.fillRect(12,164,20,12);ctx.fillRect(18,158,10,6);
    // border
    ctx.strokeStyle="#1a1020";ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
    return c;
  }

  _genShop() {
    const W=8*TILE,H=7*TILE;
    const c=document.createElement("canvas");c.width=W;c.height=H;
    const ctx=c.getContext("2d");
    // stone block walls
    for(let y=0;y<H;y+=6) for(let x=0;x<W;x+=8){
      ctx.fillStyle="#7a7060";ctx.fillRect(x,y,8,6);
      ctx.fillStyle="#4a4030";ctx.fillRect(x,y,1,6);ctx.fillRect(x,y,8,1);
      ctx.fillStyle="#8a8070";for(let i=0;i<2;i++) ctx.fillRect(x+rn(1,7),y+rn(1,5),1,1);
    }
    // display window
    ctx.fillStyle="#3a3a3a";ctx.fillRect(20,54,96,60);
    ctx.fillStyle="#c8a870";ctx.fillRect(24,58,88,52);
    ctx.lineWidth=4;ctx.strokeStyle="#3a3a3a";ctx.strokeRect(22,56,92,56);
    ctx.fillStyle="#2a1a0a"; // sword silhouette
    ctx.fillRect(38,74,3,20);
    ctx.beginPath();ctx.moveTo(58,88);ctx.lineTo(72,88);ctx.lineTo(70,100);ctx.lineTo(60,100);ctx.closePath();ctx.fill(); // shield
    ctx.fillRect(88,72,4,22);ctx.fillRect(84,86,12,3); // axe
    // crenellations
    ctx.fillStyle="#7a7060"; for(let x=0;x<W;x+=12) ctx.fillRect(x,0,8,7);
    // sign
    ctx.fillStyle="#3a3a3a";rc(ctx,72,15,118,24,3);ctx.fill();
    ctx.fillStyle="#c8a870";ctx.font="16px VT323";ctx.fillText("MIGUEL'S ARMS",80,31);
    // discarded armor crates + small neon shard
    ctx.fillStyle="#4a3a2a";ctx.fillRect(8,H-24,22,12);ctx.fillRect(22,H-18,14,8);
    ctx.fillStyle="#141a2c";ctx.fillRect(170,H-22,26,10);
    ctx.fillStyle="#4090ff";ctx.fillRect(173,H-19,6,3);ctx.fillRect(182,H-19,4,3);
    ctx.fillStyle="#a83848";ctx.fillRect(158,H-14,8,2);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
    return c;
  }

  _genAuction() {
    const W=14*TILE,H=9*TILE;
    const c=document.createElement("canvas");c.width=W;c.height=H;
    const ctx=c.getContext("2d");
    ctx.fillStyle="#a09880";ctx.fillRect(0,62,W,H-62);
    // columns
    for(let i=0;i<4;i++){
      const x=52+i*92;
      ctx.fillStyle="#c8c0b0";ctx.fillRect(x,70,32,H-70);
      ctx.fillStyle="#b0a898";ctx.fillRect(x-4,66,40,6);
      ctx.strokeStyle="#8a8070";ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x+10,74);ctx.lineTo(x+10,H);ctx.moveTo(x+22,74);ctx.lineTo(x+22,H);ctx.stroke();
    }
    // arched windows
    const drawArch=(x,glow)=>{
      ctx.fillStyle=glow?"#b0c0ff":"#1a1c28";
      ctx.beginPath();ctx.moveTo(x,192);ctx.lineTo(x,130);ctx.quadraticCurveTo(x+48,80,x+96,130);ctx.lineTo(x+96,192);ctx.closePath();ctx.fill();
      ctx.strokeStyle="#2a2a34";ctx.stroke();
    };
    drawArch(100,false);drawArch(212,true);drawArch(324,false);
    // pediment
    ctx.fillStyle="#a09880";ctx.beginPath();ctx.moveTo(20,62);ctx.lineTo(W-20,62);ctx.lineTo(W/2,18);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#8a7860";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W/2-18,44);ctx.lineTo(W/2,28);ctx.lineTo(W/2+18,44);ctx.stroke();
    // corrupted banner
    ctx.fillStyle="#6a3040";
    ctx.beginPath();ctx.moveTo(42,74);ctx.quadraticCurveTo(W/2,88,W-42,74);ctx.lineTo(W-42,98);ctx.quadraticCurveTo(W/2,114,42,98);ctx.closePath();ctx.fill();
    ctx.fillStyle="#d8c8a8";ctx.font="22px VT323";ctx.fillText("V LDR S  A CT  N  HO SE",80,96);
    // steps
    for(let s=0;s<3;s++){ctx.fillStyle="#b0a888";ctx.fillRect(0,H-(s+1)*14,W,14);}
    ctx.fillStyle="#a09878";ctx.fillRect(W/2-64,H-42,128,42);
    // broken cables and abandoned kiosk shell
    ctx.strokeStyle="#203060";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(40,H-24);ctx.bezierCurveTo(70,H-36,86,H-12,120,H-24);ctx.moveTo(W-60,H-30);ctx.bezierCurveTo(W-42,H-14,W-26,H-32,W-8,H-18);ctx.stroke();
    ctx.fillStyle="#2a2a35";ctx.fillRect(W-98,H-30,24,12);
    ctx.fillStyle="#5a1010";ctx.fillRect(W-94,H-26,14,4);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
    return c;
  }

  _genWindmillTower() {
    const W=8*TILE,H=14*TILE;
    const c=document.createElement("canvas");c.width=W;c.height=H;
    const ctx=c.getContext("2d");
    for(let y=0;y<H;y+=6){
      const t=y/H;
      const width=Phaser.Math.Linear(W,5*TILE,t);
      const x0=(W-width)/2;
      for(let x=x0;x<x0+width;x+=8){ctx.fillStyle="#7a7060";ctx.fillRect(x,y,8,6);ctx.fillStyle="#4a4030";ctx.fillRect(x,y,1,6);ctx.fillRect(x,y,8,1);}
    }
    // arched door
    ctx.fillStyle="#1a1020";rc(ctx,W/2-18,H-82,36,78,18);ctx.fill();
    ctx.strokeStyle="#1a1020";ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
    return c;
  }

  _genWindmillSails() {
    const W=9*TILE,H=9*TILE;
    const c=document.createElement("canvas");c.width=W;c.height=H;
    const ctx=c.getContext("2d");
    const cx=W/2,cy=H/2;
    const drawSail=(ang,missing)=>{
      ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);
      if(missing){
        ctx.fillStyle="#3a2010";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(6,-2);ctx.lineTo(6,2);ctx.closePath();ctx.fill();
        ctx.restore();return;
      }
      ctx.fillStyle="#3a2010";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(68,-10);ctx.lineTo(82,0);ctx.lineTo(68,10);ctx.closePath();ctx.fill();
      ctx.fillStyle="#e8d8b8";ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(60,-6);ctx.lineTo(72,0);ctx.lineTo(60,6);ctx.closePath();ctx.fill();
      ctx.strokeStyle="#3a2010";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(22,-2);ctx.lineTo(56,2);ctx.moveTo(22,2);ctx.lineTo(56,-2);ctx.stroke();
      ctx.restore();
    };
    drawSail(0,false);drawSail(Math.PI/2,false);drawSail(Math.PI,true);drawSail(Math.PI*3/2,false);
    ctx.fillStyle="#3a2010";ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#1a1020";ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
    return c;
  }

  _genThrone() {
    const W=10*TILE,H=6*TILE;
    const c=document.createElement("canvas");c.width=W;c.height=H;
    const ctx=c.getContext("2d");
    ctx.fillStyle="#7a1a22";ctx.fillRect(0,100,W,44);
    ctx.fillStyle="#c4a020";ctx.fillRect(0,100,8,44);ctx.fillRect(W-8,100,8,44);
    ctx.fillStyle="#621420";ctx.fillRect(50,100,W-100,44);
    ctx.fillStyle="#2a2035";ctx.fillRect(96,28,128,108);ctx.fillRect(86,72,30,42);ctx.fillRect(204,72,30,42);ctx.fillRect(112,8,96,74);
    ctx.fillStyle="#6a0a18";ctx.fillRect(126,16,68,54);
    ctx.strokeStyle="#c4a020";ctx.lineWidth=1;ctx.strokeRect(126.5,16.5,67,53);
    ctx.fillStyle="#1a1025";ctx.fillRect(152,6,16,12);
    ctx.fillStyle="#cc0010";ctx.fillRect(156,10,2,2);ctx.fillRect(162,10,2,2);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
    return c;
  }

  _genFarmhouse() {
    const W=8*TILE,H=6*TILE;
    const c=document.createElement("canvas");c.width=W;c.height=H;
    const ctx=c.getContext("2d");
    ctx.fillStyle="#4a3020";ctx.fillRect(16,62,W-32,H-62);
    ctx.fillStyle="#3a2010";ctx.fillRect(16,62,4,H-62);ctx.fillRect(W-20,62,4,H-62);ctx.fillRect(16,62,W-32,4);ctx.fillRect(16,H/2+2,W-32,4);
    // old red tile roof
    ctx.fillStyle="#6a3020";ctx.beginPath();ctx.moveTo(0,62);ctx.lineTo(W,62);ctx.lineTo(W/2,0);ctx.closePath();ctx.fill();
    ctx.fillStyle="#1a1020";ctx.fillRect(58,22,8,10);ctx.fillRect(160,32,10,8); // missing tiles
    ctx.fillStyle="#3a2010";ctx.fillRect(180,0,16,62); // chimney
    // door
    ctx.fillStyle="#2a1a0a";ctx.fillRect(100,102,36,H-102);
    for(let dx=104;dx<132;dx+=6){ctx.fillStyle="#1a1000";ctx.fillRect(dx,102,1,H-102);}
    // window
    ctx.fillStyle="#2a2035";ctx.fillRect(32,80,38,34);
    ctx.fillStyle="#3d2010";ctx.fillRect(50,80,2,34);ctx.fillRect(32,96,38,2);
    ctx.strokeStyle="#1a1020";ctx.lineWidth=2;ctx.strokeRect(1,1,W-2,H-2);
    return c;
  }

  _genChimneyAlone() {
    const c=document.createElement("canvas");c.width=3*TILE;c.height=5*TILE;
    const ctx=c.getContext("2d");
    const cx=c.width/2;
    // foundation
    ctx.strokeStyle="#5a4a3a";ctx.lineWidth=2;ctx.strokeRect(0,c.height-4,c.width,4);
    // chimney
    for(let r=0;r<10;r++){ctx.fillStyle=r%2===0?"#6a3020":"#5a2010";ctx.fillRect(cx-8,c.height-84+r*8,16,8);}
    ctx.strokeStyle="#1a1020";ctx.lineWidth=1;ctx.strokeRect(cx-8,c.height-84,16,84);
    // boot
    ctx.fillStyle="#3a2a1a";ctx.fillRect(cx+4,c.height-6,12,7);ctx.fillRect(cx+2,c.height-10,8,6);
    outl(ctx,cx+4,c.height-6,12,7);
    return c;
  }

} // end class MainScene

// ─────────────────────────────────────────────────
// STANDALONE HELPERS (used inside canvas generators)
// ─────────────────────────────────────────────────
function _drawCracks(ctx,x0,color){
  ctx.strokeStyle=color;ctx.lineWidth=1;
  for(let i=0;i<3;i++){const x=x0+rn(4,28),y=rn(4,28),l=rn(2,5);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+l,y+l);ctx.lineTo(x+l+1,y+l+rn(-1,1));ctx.stroke();}
}
function _drawGrass(ctx,x0,color){
  ctx.strokeStyle=color;ctx.lineWidth=1;
  for(let i=0;i<4;i++){const bx=x0+rn(4,28),by=rn(18,28);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+rn(-2,2),by-3);ctx.stroke();}
}

// ══════════════════════════════════════════════════════════════
// PHASER CONFIG & BOOT
// ══════════════════════════════════════════════════════════════
const config = {
  type: Phaser.WEBGL,
  parent: "game-root",
  width: GAME_W,
  height: GAME_H,
  pixelArt: true,
  backgroundColor: "#0f0f16",
  scene: [MainScene]
};

new Phaser.Game(config);