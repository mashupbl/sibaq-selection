/**
 * SIBĀQ ’26 — Programme Mentor Selection
 */
const CONFIG = {
  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbywwEIDx2KZlhjRq5EoP73NrNcbQhVLA-hK5iLUlTdtPaBdUQgYdMgqJ2ZZZTAqsEAh/exec",
  POLL_INTERVAL_MS: 6000,
  ADMIN_PIN: "2026"
};

// 16 Standard Teacher Codes
const TEACHER_CODES = [
  "AYS", "ADL", "ARF", "FRQ",
  "BSR", "NSM", "FZL", "AFL",
  "MHD", "SRT", "SMD", "ASF",
  "JBR", "MSD", "SHR", "KBR"
];

// All 118 exact programmes as specified
const PROGRAMMES = [
  // CATEGORY 1 — BIDĀYAH (34 Programmes)
  { code: "BS1",  category: "BIDĀYAH", section: "S", name: "QIRĀʾAH" },
  { code: "BS2",  category: "BIDĀYAH", section: "S", name: "ḤIFẒ" },
  { code: "BS3",  category: "BIDĀYAH", section: "S", name: "ADHĀN" },
  { code: "BS4",  category: "BIDĀYAH", section: "S", name: "WAʿẒ" },
  { code: "BS5",  category: "BIDĀYAH", section: "S", name: "SPEECH ARB" },
  { code: "BS6",  category: "BIDĀYAH", section: "S", name: "SPEECH ENG" },
  { code: "BS7",  category: "BIDĀYAH", section: "S", name: "SPEECH MLM" },
  { code: "BS8",  category: "BIDĀYAH", section: "S", name: "SPEECH URD" },
  { code: "BS9",  category: "BIDĀYAH", section: "S", name: "SPEECH & SONG MLM" },
  { code: "BS10", category: "BIDĀYAH", section: "S", name: "NA'TH" },
  { code: "BS11", category: "BIDĀYAH", section: "S", name: "NASHEED" },
  { code: "BS12", category: "BIDĀYAH", section: "S", name: "MADḤ SONG" },
  { code: "BS13", category: "BIDĀYAH", section: "S", name: "GROUP SONG" },
  { code: "BS14", category: "BIDĀYAH", section: "S", name: "CHAIN STORY MLM" },
  { code: "BS15", category: "BIDĀYAH", section: "S", name: "CONVERSATION MLM" },
  { code: "BS16", category: "BIDĀYAH", section: "S", name: "WORD FIGHT ENG" },
  { code: "BN17", category: "BIDĀYAH", section: "N", name: "CAPTION MAKING MLM" },
  { code: "BN18", category: "BIDĀYAH", section: "N", name: "DIARY WRITING ENG" },
  { code: "BN19", category: "BIDĀYAH", section: "N", name: "ESSAY MLM" },
  { code: "BN20", category: "BIDĀYAH", section: "N", name: "POEM MLM" },
  { code: "BN21", category: "BIDĀYAH", section: "N", name: "PICTURE STORY MLM" },
  { code: "BN22", category: "BIDĀYAH", section: "N", name: "PARAGRAPH WRITING ARB" },
  { code: "BN23", category: "BIDĀYAH", section: "N", name: "PARAGRAPH WRITING URD" },
  { code: "BN24", category: "BIDĀYAH", section: "N", name: "DICTIONARY MAKING ARB" },
  { code: "BN25", category: "BIDĀYAH", section: "N", name: "PENCIL DRAWING" },
  { code: "BN26", category: "BIDĀYAH", section: "N", name: "PIXEL ART" },
  { code: "BN27", category: "BIDĀYAH", section: "N", name: "SHIKAKU" },
  { code: "BX29", category: "BIDĀYAH", section: "X", name: "GK QUIZ" },
  { code: "BX30", category: "BIDĀYAH", section: "X", name: "MAP STUDY" },
  { code: "BX31", category: "BIDĀYAH", section: "X", name: "NUMERICAL APTITUDE" },
  { code: "BX32", category: "BIDĀYAH", section: "X", name: "VOCABULARY" },
  { code: "BX33", category: "BIDĀYAH", section: "X", name: "MS WORD" },
  { code: "BX34", category: "BIDĀYAH", section: "X", name: "TYPING MASTER ENG" },
  { code: "BO35", category: "BIDĀYAH", section: "O", name: "MEMORY TEST" },
  { code: "BO36", category: "BIDĀYAH", section: "O", name: "MR CRaFTIE" },

  // CATEGORY 2 — ʾŪLĀ (45 Programmes)
  { code: "US1",  category: "ʾŪLĀ", section: "S", name: "QIRĀʾAH" },
  { code: "US2",  category: "ʾŪLĀ", section: "S", name: "ḤIFẒ" },
  { code: "US3",  category: "ʾŪLĀ", section: "S", name: "WAʿẒ" },
  { code: "US4",  category: "ʾŪLĀ", section: "S", name: "SPEECH ARB" },
  { code: "US5",  category: "ʾŪLĀ", section: "S", name: "SPEECH ENG" },
  { code: "US6",  category: "ʾŪLĀ", section: "S", name: "SPEECH MLM" },
  { code: "US7",  category: "ʾŪLĀ", section: "S", name: "SPEECH URD" },
  { code: "US8",  category: "ʾŪLĀ", section: "S", name: "SPEECH & SONG MLM" },
  { code: "US9",  category: "ʾŪLĀ", section: "S", name: "ANA 'ARABIYYUN" },
  { code: "US10", category: "ʾŪLĀ", section: "S", name: "STORY NARRATION ENG" },
  { code: "US11", category: "ʾŪLĀ", section: "S", name: "CONVERSATION URD" },
  { code: "US12", category: "ʾŪLĀ", section: "S", name: "DEVOTIONAL SONG MLM" },
  { code: "US13", category: "ʾŪLĀ", section: "S", name: "NA'TH" },
  { code: "US14", category: "ʾŪLĀ", section: "S", name: "NASHĪD" },
  { code: "US15", category: "ʾŪLĀ", section: "S", name: "PADHYAPARAYANAM" },
  { code: "US16", category: "ʾŪLĀ", section: "S", name: "GROUP SONG" },
  { code: "US17", category: "ʾŪLĀ", section: "S", name: "WORD FIGHT ENG" },
  { code: "US18", category: "ʾŪLĀ", section: "S", name: "MULĀFAẒAH ARB" },
  { code: "US19", category: "ʾŪLĀ", section: "S", name: "MULĀFAẒAH URD" },
  { code: "UN20", category: "ʾŪLĀ", section: "N", name: "ESSAY MLM" },
  { code: "UN21", category: "ʾŪLĀ", section: "N", name: "SHORT STORY MLM" },
  { code: "UN22", category: "ʾŪLĀ", section: "N", name: "STORY COMPLETION ARB" },
  { code: "UN23", category: "ʾŪLĀ", section: "N", name: "STORY COMPLETION ENG" },
  { code: "UN24", category: "ʾŪLĀ", section: "N", name: "STORY COMPLETION HIN" },
  { code: "UN25", category: "ʾŪLĀ", section: "N", name: "STORY COMPLETION URD" },
  { code: "UN26", category: "ʾŪLĀ", section: "N", name: "NEWS WRITING MLM" },
  { code: "UN27", category: "ʾŪLĀ", section: "N", name: "APPRECIATION MLM" },
  { code: "UN28", category: "ʾŪLĀ", section: "N", name: "POEM ENG" },
  { code: "UN29", category: "ʾŪLĀ", section: "N", name: "POEM MLM" },
  { code: "UN30", category: "ʾŪLĀ", section: "N", name: "LETTER WRITING ENG" },
  { code: "UN31", category: "ʾŪLĀ", section: "N", name: "PENCIL DRAWING" },
  { code: "UN32", category: "ʾŪLĀ", section: "N", name: "CANVAS PAINTING" },
  { code: "UN33", category: "ʾŪLĀ", section: "N", name: "DICTIONARY MAKING HIN" },
  { code: "UN34", category: "ʾŪLĀ", section: "N", name: "NONOGRAM" },
  { code: "UX35", category: "ʾŪLĀ", section: "X", name: "GEO GIANT" },
  { code: "UX36", category: "ʾŪLĀ", section: "X", name: "GK QUIZ" },
  { code: "UX37", category: "ʾŪLĀ", section: "X", name: "HINDI VIDVAN" },
  { code: "UX38", category: "ʾŪLĀ", section: "X", name: "MATH TALENT" },
  { code: "UX39", category: "ʾŪLĀ", section: "X", name: "ṢARF IQ" },
  { code: "UX40", category: "ʾŪLĀ", section: "X", name: "SPELLING BEE" },
  { code: "UX41", category: "ʾŪLĀ", section: "X", name: "VOCABULARY" },
  { code: "UX42", category: "ʾŪLĀ", section: "X", name: "TYPING BILINGUAL" },
  { code: "UX43", category: "ʾŪLĀ", section: "X", name: "POWERPOINT CREATION" },
  { code: "UX44", category: "ʾŪLĀ", section: "X", name: "DIGITAL POSTER DESIGNING" },
  { code: "UO45", category: "ʾŪLĀ", section: "O", name: "MEMORY TEST" },

  // CATEGORY 3 — THĀNIYAH (38 Programmes)
  { code: "TS1",  category: "THĀNIYAH", section: "S", name: "ḤIFẒ & QIRĀʾAH" },
  { code: "TS2",  category: "THĀNIYAH", section: "S", name: "WAʿẒ" },
  { code: "TS3",  category: "THĀNIYAH", section: "S", name: "MAPPILAPPATT" },
  { code: "TS4",  category: "THĀNIYAH", section: "S", name: "NA'TH" },
  { code: "TS5",  category: "THĀNIYAH", section: "S", name: "NASHEED" },
  { code: "TS6",  category: "THĀNIYAH", section: "S", name: "BURDA" },
  { code: "TS7",  category: "THĀNIYAH", section: "S", name: "PADIPPARAYAL" },
  { code: "TS8",  category: "THĀNIYAH", section: "S", name: "GENERAL SPEECH MLM" },
  { code: "TS9",  category: "THĀNIYAH", section: "S", name: "HIKAYA ARB" },
  { code: "TS10", category: "THĀNIYAH", section: "S", name: "HISTORY TALK ENG" },
  { code: "TS11", category: "THĀNIYAH", section: "S", name: "SPEECH URD" },
  { code: "TS12", category: "THĀNIYAH", section: "S", name: "FACE TO FACE ENG" },
  { code: "TS13", category: "THĀNIYAH", section: "S", name: "TALENT HUNT" },
  { code: "TS14", category: "THĀNIYAH", section: "S", name: "LSRW TRILINGUAL" },
  { code: "TN15", category: "THĀNIYAH", section: "N", name: "ESSAY ARB" },
  { code: "TN16", category: "THĀNIYAH", section: "N", name: "ESSAY ENG" },
  { code: "TN17", category: "THĀNIYAH", section: "N", name: "ESSAY MLM" },
  { code: "TN18", category: "THĀNIYAH", section: "N", name: "ESSAY URD" },
  { code: "TN19", category: "THĀNIYAH", section: "N", name: "ARTICLE DIGEST ARB" },
  { code: "TN20", category: "THĀNIYAH", section: "N", name: "ARTICLE DIGEST ENG" },
  { code: "TN21", category: "THĀNIYAH", section: "N", name: "SHORT STORY ARB" },
  { code: "TN22", category: "THĀNIYAH", section: "N", name: "SHORT STORY ENG" },
  { code: "TN23", category: "THĀNIYAH", section: "N", name: "SHORT STORY HIN" },
  { code: "TN24", category: "THĀNIYAH", section: "N", name: "SHORT STORY MLM" },
  { code: "TN25", category: "THĀNIYAH", section: "N", name: "SHORT STORY URD" },
  { code: "TN26", category: "THĀNIYAH", section: "N", name: "POEM ARB" },
  { code: "TN27", category: "THĀNIYAH", section: "N", name: "POEM ENG" },
  { code: "TN28", category: "THĀNIYAH", section: "N", name: "POEM MLM" },
  { code: "TN29", category: "THĀNIYAH", section: "N", name: "POEM URD" },
  { code: "TN30", category: "THĀNIYAH", section: "N", name: "PALABRA" },
  { code: "TN31", category: "THĀNIYAH", section: "N", name: "CARTOON" },
  { code: "TN32", category: "THĀNIYAH", section: "N", name: "ACRYLIC PAINTING" },
  { code: "TN33", category: "THĀNIYAH", section: "N", name: "SLITHERLINK" },
  { code: "TX34", category: "THĀNIYAH", section: "X", name: "GRAMMAR QUIZ" },
  { code: "TX35", category: "THĀNIYAH", section: "X", name: "VOCABULARY" },
  { code: "TX36", category: "THĀNIYAH", section: "X", name: "EXCEL MASTER" },
  { code: "TX37", category: "THĀNIYAH", section: "X", name: "POSTER DESIGNING DIGITAL" },
  { code: "TO38", category: "THĀNIYAH", section: "O", name: "INSTANT NEWSPAPER MLM" }
];

// STATE MANAGEMENT
const state = {
  assignments: {},
  candidates: {},
  activeCategory: "ALL",
  activeSection: "ALL",
  searchQuery: "",
  teacherFilter: "",
  isAdmin: false,
  pendingSelection: null
};

// DOM ELEMENTS
const grid = document.getElementById("programme-grid");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const teacherFilterSelect = document.getElementById("my-teacher-filter");
const syncStatusEl = document.getElementById("sync-status");
const confirmModal = document.getElementById("confirm-modal");
const confirmModalText = document.getElementById("confirm-modal-text");
const modalConfirmBtn = document.getElementById("modal-confirm-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const adminModal = document.getElementById("admin-modal");
const adminToggleBtn = document.getElementById("admin-toggle-btn");
const adminPinInput = document.getElementById("admin-pin-input");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminCloseBtn = document.getElementById("admin-close-btn");

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initTeacherDropdown();
  renderGrid();
  updateStats();
  setupEventListeners();

  loadLocalBackup();
  fetchCloudState();
  setInterval(fetchCloudState, CONFIG.POLL_INTERVAL_MS);
});

function initTeacherDropdown() {
  TEACHER_CODES.forEach(code => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `Teacher: ${code}`;
    teacherFilterSelect.appendChild(opt);
  });
}

function setupEventListeners() {
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCategory = btn.dataset.category;
      applyFilters();
    });
  });

  document.querySelectorAll(".pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeSection = btn.dataset.section;
      applyFilters();
    });
  });

  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = state.searchQuery ? "block" : "none";
    applyFilters();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.style.display = "none";
    applyFilters();
  });

  teacherFilterSelect.addEventListener("change", (e) => {
    state.teacherFilter = e.target.value;
    applyFilters();
  });

  modalCancelBtn.addEventListener("click", () => {
    confirmModal.classList.remove("active");
    if (state.pendingSelection) {
      const select = document.getElementById(`select-${state.pendingSelection.code}`);
      if (select) select.value = state.pendingSelection.prevTeacher || "";
    }
    state.pendingSelection = null;
  });

  modalConfirmBtn.addEventListener("click", () => {
    confirmModal.classList.remove("active");
    if (state.pendingSelection) {
      commitSelection(state.pendingSelection.code, state.pendingSelection.teacherCode);
      state.pendingSelection = null;
    }
  });

  adminToggleBtn.addEventListener("click", () => {
    if (state.isAdmin) {
      state.isAdmin = false;
      adminToggleBtn.textContent = "Admin Tools 🔒";
      showToast("Admin mode disabled", "info");
      renderGrid();
    } else {
      adminModal.classList.add("active");
      adminPinInput.value = "";
      adminPinInput.focus();
    }
  });

  adminCloseBtn.addEventListener("click", () => {
    adminModal.classList.remove("active");
  });

  adminLoginBtn.addEventListener("click", () => {
    if (adminPinInput.value === CONFIG.ADMIN_PIN) {
      state.isAdmin = true;
      adminModal.classList.remove("active");
      adminToggleBtn.textContent = "Admin Mode ON (Exit 🔓)";
      showToast("Admin override mode unlocked!", "success");
      renderGrid();
    } else {
      showToast("Invalid Admin PIN", "error");
    }
  });
}

// RENDER PROGRAMME CARDS WITH CANDIDATES
function renderGrid() {
  grid.innerHTML = "";

  PROGRAMMES.forEach(prog => {
    const isAssigned = !!state.assignments[prog.code];
    const assignedTeacher = state.assignments[prog.code] || "";
    const candidateList = state.candidates[prog.code] || [];

    const card = document.createElement("div");
    card.className = `prog-card ${isAssigned ? "is-selected" : "is-unselected"}`;
    card.id = `card-${prog.code}`;
    card.dataset.code = prog.code;
    card.dataset.category = prog.category;
    card.dataset.section = prog.section;
    card.dataset.name = prog.name;
    card.dataset.teacher = assignedTeacher;

    let optionsHtml = `<option value="">Select Teacher</option>`;
    TEACHER_CODES.forEach(teacher => {
      const selected = assignedTeacher === teacher ? "selected" : "";
      optionsHtml += `<option value="${teacher}" ${selected}>${teacher}</option>`;
    });

    const isDisabled = isAssigned && !state.isAdmin;

    let candidateBadges = "";
    if (candidateList.length > 0) {
      candidateBadges = `
        <div class="candidate-box">
          <span class="candidate-label">Candidates:</span>
          <div class="candidate-list">
            ${candidateList.map(c => `<span class="candidate-chip">${c}</span>`).join("")}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="prog-code">${prog.code}</span>
          <span class="category-tag">${prog.category} • Sec ${prog.section}</span>
        </div>
        <div class="prog-name">${prog.name}</div>
        ${candidateBadges}
      </div>

      <div>
        <div class="card-action">
          <label class="mentor-select-label" for="select-${prog.code}">Mentor:</label>
          <select class="mentor-select" id="select-${prog.code}" data-code="${prog.code}" ${isDisabled ? "disabled" : ""}>
            ${optionsHtml}
          </select>
        </div>

        <div class="status-indicator ${isAssigned ? "selected" : "not-selected"}" id="status-${prog.code}">
          <span>${isAssigned ? `🟢 SELECTED — ${assignedTeacher}` : `🔴 NOT SELECTED`}</span>
          ${state.isAdmin && isAssigned ? `<button class="admin-release-btn" onclick="releaseAssignment('${prog.code}')">Release</button>` : ""}
        </div>
      </div>
    `;

    const selectEl = card.querySelector(".mentor-select");
    selectEl.addEventListener("change", (e) => {
      const selectedValue = e.target.value;
      const prev = state.assignments[prog.code] || "";
      if (!selectedValue) return;

      state.pendingSelection = {
        code: prog.code,
        teacherCode: selectedValue,
        prevTeacher: prev
      };

      confirmModalText.innerHTML = `Select <strong>${selectedValue}</strong> as mentor for <br><strong>${prog.code} — ${prog.name}</strong>?`;
      confirmModal.classList.add("active");
    });

    grid.appendChild(card);
  });

  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll(".prog-card");
  cards.forEach(card => {
    const cardCat = card.dataset.category;
    const cardSec = card.dataset.section;
    const cardCode = card.dataset.code.toLowerCase();
    const cardName = card.dataset.name.toLowerCase();
    const cardTeacher = card.dataset.teacher;

    const matchesCat = (state.activeCategory === "ALL" || cardCat === state.activeCategory);
    const matchesSec = (state.activeSection === "ALL" || cardSec === state.activeSection);
    const matchesSearch = (!state.searchQuery || cardCode.includes(state.searchQuery) || cardName.includes(state.searchQuery));
    const matchesTeacher = (!state.teacherFilter || cardTeacher === state.teacherFilter);

    if (matchesCat && matchesSec && matchesSearch && matchesTeacher) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function updateStats() {
  const total = PROGRAMMES.length;
  const selectedCount = Object.keys(state.assignments).length;
  const availableCount = Math.max(0, total - selectedCount);
  const percent = Math.round((selectedCount / total) * 100);

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-selected").textContent = selectedCount;
  document.getElementById("stat-available").textContent = availableCount;
  document.getElementById("stat-percent").textContent = `${percent}%`;
}

function commitSelection(code, teacherCode) {
  state.assignments[code] = teacherCode;
  updateCardVisualState(code, teacherCode);
  updateStats();
  saveLocalBackup();
  showToast(`✓ ${code} assigned to ${teacherCode}`, "success");

  if (CONFIG.APPS_SCRIPT_URL && !CONFIG.APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID_HERE")) {
    syncStatusEl.textContent = "Syncing with cloud...";

    const payload = {
      action: "SELECT",
      programmeCode: code,
      teacherCode: teacherCode
    };

    fetch(CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(() => {
      syncStatusEl.textContent = `Synced: ${new Date().toLocaleTimeString()}`;
    })
    .catch((err) => {
      console.error(err);
      syncStatusEl.textContent = "Cloud sync delayed (offline).";
    });
  }
}

window.releaseAssignment = function(code) {
  if (!confirm(`Remove mentor from ${code}?`)) return;

  delete state.assignments[code];
  updateCardVisualState(code, "");
  updateStats();
  saveLocalBackup();
  showToast(`Mentor removed from ${code}`, "info");

  if (CONFIG.APPS_SCRIPT_URL && !CONFIG.APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID_HERE")) {
    fetch(CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REMOVE", programmeCode: code })
    });
  }
};

function updateCardVisualState(code, teacherCode) {
  const card = document.getElementById(`card-${code}`);
  if (!card) return;

  const isAssigned = !!teacherCode;
  card.dataset.teacher = teacherCode;
  card.className = `prog-card ${isAssigned ? "is-selected" : "is-unselected"}`;

  const select = document.getElementById(`select-${code}`);
  if (select) {
    select.value = teacherCode;
    select.disabled = isAssigned && !state.isAdmin;
  }

  const statusIndicator = document.getElementById(`status-${code}`);
  if (statusIndicator) {
    statusIndicator.className = `status-indicator ${isAssigned ? "selected" : "not-selected"}`;
    statusIndicator.innerHTML = `
      <span>${isAssigned ? `🟢 SELECTED — ${teacherCode}` : `🔴 NOT SELECTED`}</span>
      ${state.isAdmin && isAssigned ? `<button class="admin-release-btn" onclick="releaseAssignment('${code}')">Release</button>` : ""}
    `;
  }

  applyFilters();
}

function fetchCloudState() {
  if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID_HERE")) {
    syncStatusEl.textContent = "Local preview mode";
    return;
  }

  fetch(`${CONFIG.APPS_SCRIPT_URL}?action=GET_STATE`)
    .then(res => res.json())
    .then(data => {
      if (data && data.assignments) {
        let changed = false;

        if (data.candidates) {
          state.candidates = data.candidates;
        }

        Object.keys(data.assignments).forEach(code => {
          if (state.assignments[code] !== data.assignments[code]) {
            state.assignments[code] = data.assignments[code];
            changed = true;
          }
        });

        Object.keys(state.assignments).forEach(code => {
          if (!data.assignments[code]) {
            delete state.assignments[code];
            changed = true;
          }
        });

        if (changed || Object.keys(data.candidates || {}).length > 0) {
          renderGrid();
          updateStats();
          saveLocalBackup();
        }

        syncStatusEl.textContent = `Last cloud check: ${new Date().toLocaleTimeString()}`;
      }
    })
    .catch(() => {
      syncStatusEl.textContent = "Cloud sync delayed (offline)";
    });
}

function saveLocalBackup() {
  localStorage.setItem("sibaq_26_assignments", JSON.stringify(state.assignments));
}

function loadLocalBackup() {
  try {
    const raw = localStorage.getItem("sibaq_26_assignments");
    if (raw) {
      state.assignments = JSON.parse(raw);
      Object.keys(state.assignments).forEach(code => {
        updateCardVisualState(code, state.assignments[code]);
      });
      updateStats();
    }
  } catch (e) {
    console.error(e);
  }
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}