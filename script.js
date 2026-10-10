/**
 * SIBĀQ ’26 — Programme Mentor Selection
 * Dynamic categories, multi-filter for Student Mentors, Candidates (with Ad No/Name search), and Staff Mentors.
 */
const CONFIG = {
  // PASTE YOUR REAL GOOGLE APPS SCRIPT WEB APP URL HERE:
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbywwEIDx2KZlhjRq5EoP73NrNcbQhVLA-hK5iLUlTdtPaBdUQgYdMgqJ2ZZZTAqsEAh/exec",
  POLL_INTERVAL_MS: 7000,
  ADMIN_PIN: "2026"
};

// 16 Standard Teacher Codes
const TEACHER_CODES = [
  "AYS", "ADL", "ARF", "FRQ",
  "BSR", "NSM", "FZL", "AFL",
  "MHD", "SRT", "SMD", "ASF",
  "JBR", "MSD", "SHR", "KBR"
];

// STATE MANAGEMENT
const state = {
  programmes: [],
  categories: [],
  assignments: {},
  activeCategory: "ALL",
  activeSection: "ALL",
  searchQuery: "",
  selectedStudentMentor: "",
  selectedCandidate: "",
  selectedStaffMentor: "",
  isAdmin: false,
  pendingSelection: null
};

// DOM ELEMENTS
const grid = document.getElementById("programme-grid");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const resetAllBtn = document.getElementById("reset-all-btn");

const searchStudentMentorInput = document.getElementById("search-student-mentor");
const studentMentorSelect = document.getElementById("filter-student-mentor");

const searchCandidateInput = document.getElementById("search-candidate");
const candidateSelect = document.getElementById("filter-candidate");

const staffMentorSelect = document.getElementById("filter-staff-mentor");
const categoryTabsContainer = document.getElementById("category-tabs");
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
  setupEventListeners();

  const hasCache = loadLocalBackup();
  if (hasCache && state.programmes.length > 0) {
    rebuildCategoryTabs();
    populateFilterDropdowns();
    renderGrid();
    updateStats();
  }

  fetchCloudState();
  setInterval(fetchCloudState, CONFIG.POLL_INTERVAL_MS);
});

function setupEventListeners() {
  // General programme search
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

  // Reset all filters button
  resetAllBtn.addEventListener("click", resetAllFilters);

  // Student Mentor: live typing search & dropdown select
  if (searchStudentMentorInput) {
    searchStudentMentorInput.addEventListener("input", (e) => {
      state.selectedStudentMentor = e.target.value.trim().toLowerCase();
      studentMentorSelect.value = "";
      applyFilters();
    });
  }

  studentMentorSelect.addEventListener("change", (e) => {
    state.selectedStudentMentor = e.target.value.trim().toLowerCase();
    if (searchStudentMentorInput) searchStudentMentorInput.value = e.target.value;
    applyFilters();
  });

  // Candidate: live typing search (by Ad No or Name) & dropdown select
  if (searchCandidateInput) {
    searchCandidateInput.addEventListener("input", (e) => {
      state.selectedCandidate = e.target.value.trim().toLowerCase();
      candidateSelect.value = "";
      applyFilters();
    });
  }

  candidateSelect.addEventListener("change", (e) => {
    state.selectedCandidate = e.target.value.trim().toLowerCase();
    if (searchCandidateInput) searchCandidateInput.value = e.target.value;
    applyFilters();
  });

  // Staff Mentor dropdown
  staffMentorSelect.addEventListener("change", (e) => {
    state.selectedStaffMentor = e.target.value;
    applyFilters();
  });

  // Section filter pills
  document.querySelectorAll(".pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeSection = btn.dataset.section;
      applyFilters();
    });
  });

  // Modal actions
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

  // Admin controls
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

function resetAllFilters() {
  state.searchQuery = "";
  state.activeCategory = "ALL";
  state.activeSection = "ALL";
  state.selectedStudentMentor = "";
  state.selectedCandidate = "";
  state.selectedStaffMentor = "";

  searchInput.value = "";
  clearSearchBtn.style.display = "none";

  if (searchStudentMentorInput) searchStudentMentorInput.value = "";
  studentMentorSelect.value = "";

  if (searchCandidateInput) searchCandidateInput.value = "";
  candidateSelect.value = "";

  staffMentorSelect.value = "";

  document.querySelectorAll(".cat-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.category === "ALL");
  });

  document.querySelectorAll(".pill-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.section === "ALL");
  });

  applyFilters();
  showToast("Filters reset to all programmes", "info");
}

function rebuildCategoryTabs() {
  const currentCategory = state.activeCategory;
  categoryTabsContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = `cat-btn ${currentCategory === "ALL" ? "active" : ""}`;
  allBtn.dataset.category = "ALL";
  allBtn.textContent = "ALL PROGRAMMES";
  allBtn.addEventListener("click", () => selectCategory("ALL"));
  categoryTabsContainer.appendChild(allBtn);

  state.categories.forEach(cat => {
    if (!cat) return;
    const btn = document.createElement("button");
    btn.className = `cat-btn ${currentCategory === cat ? "active" : ""}`;
    btn.dataset.category = cat;
    btn.textContent = cat;
    btn.addEventListener("click", () => selectCategory(cat));
    categoryTabsContainer.appendChild(btn);
  });
}

function selectCategory(cat) {
  state.activeCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.category === cat);
  });
  applyFilters();
}

function populateFilterDropdowns() {
  const studentMentors = new Set();
  const candidates = new Set();
  const staffMentors = new Set();

  state.programmes.forEach(p => {
    if (p.studentMentor) studentMentors.add(p.studentMentor);
    if (p.staffMentor) staffMentors.add(p.staffMentor);
    if (Array.isArray(p.candidates)) {
      p.candidates.forEach(c => { if (c) candidates.add(c); });
    }
  });

  TEACHER_CODES.forEach(t => staffMentors.add(t));

  // 1. Student Mentors
  const currStudent = studentMentorSelect.value;
  studentMentorSelect.innerHTML = `<option value="">All Student Mentors (${studentMentors.size})</option>`;
  Array.from(studentMentors).sort().forEach(sm => {
    const opt = document.createElement("option");
    opt.value = sm;
    opt.textContent = sm;
    if (currStudent === sm) opt.selected = true;
    studentMentorSelect.appendChild(opt);
  });

  // 2. Candidates
  const currCand = candidateSelect.value;
  candidateSelect.innerHTML = `<option value="">All Candidates (${candidates.size})</option>`;
  Array.from(candidates).sort().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    if (currCand === c) opt.selected = true;
    candidateSelect.appendChild(opt);
  });

  // 3. Staff Mentors
  const currStaff = state.selectedStaffMentor;
  staffMentorSelect.innerHTML = `<option value="">All Staff Mentors (${staffMentors.size})</option>`;
  Array.from(staffMentors).sort().forEach(sm => {
    const opt = document.createElement("option");
    opt.value = sm;
    opt.textContent = `Staff: ${sm}`;
    if (currStaff === sm) opt.selected = true;
    staffMentorSelect.appendChild(opt);
  });
}

function renderGrid() {
  grid.innerHTML = "";

  if (state.programmes.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-box">
        <h3>No programmes available</h3>
        <p>Could not find any programme data in the connected Google Sheet.</p>
      </div>
    `;
    return;
  }

  state.programmes.forEach(prog => {
    const staffMentor = state.assignments[prog.code] || prog.staffMentor || "";
    const isAssigned = !!staffMentor;
    const studentMentor = prog.studentMentor || "";
    const candidateList = Array.isArray(prog.candidates) ? prog.candidates : [];

    const card = document.createElement("div");
    card.className = `prog-card ${isAssigned ? "is-selected" : "is-unselected"}`;
    card.id = `card-${prog.code}`;
    card.dataset.code = prog.code;
    card.dataset.category = prog.category;
    card.dataset.section = prog.section;
    card.dataset.name = prog.name;
    card.dataset.staff = staffMentor;
    card.dataset.student = studentMentor;
    card.dataset.candidates = candidateList.join(" | ");

    let optionsHtml = `<option value="">Select Teacher</option>`;
    TEACHER_CODES.forEach(teacher => {
      const selected = staffMentor === teacher ? "selected" : "";
      optionsHtml += `<option value="${teacher}" ${selected}>${teacher}</option>`;
    });

    const isDisabled = isAssigned && !state.isAdmin;

    let studentMentorHtml = "";
    if (studentMentor) {
      studentMentorHtml = `
        <div class="student-mentor-box">
          <span>🎓</span>
          <div>Student Mentor: <strong>${studentMentor}</strong></div>
        </div>
      `;
    }

    let candidateChipsHtml = "";
    if (candidateList.length > 0) {
      candidateChipsHtml = `
        <div class="candidate-box">
          <span class="candidate-label">Candidates (${candidateList.length}):</span>
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
        ${studentMentorHtml}
        ${candidateChipsHtml}
      </div>

      <div>
        <div class="card-action">
          <label class="mentor-select-label" for="select-${prog.code}">Staff Mentor:</label>
          <select class="mentor-select" id="select-${prog.code}" data-code="${prog.code}" ${isDisabled ? "disabled" : ""}>
            ${optionsHtml}
          </select>
        </div>

        <div class="status-indicator ${isAssigned ? "selected" : "not-selected"}" id="status-${prog.code}">
          <span>${isAssigned ? `🟢 SELECTED — ${staffMentor}` : `🔴 NOT SELECTED`}</span>
          ${state.isAdmin && isAssigned ? `<button class="admin-release-btn" onclick="releaseAssignment('${prog.code}')">Release</button>` : ""}
        </div>
      </div>
    `;

    const selectEl = card.querySelector(".mentor-select");
    selectEl.addEventListener("change", (e) => {
      const selectedValue = e.target.value;
      const prev = state.assignments[prog.code] || prog.staffMentor || "";
      if (!selectedValue) return;

      state.pendingSelection = {
        code: prog.code,
        teacherCode: selectedValue,
        prevTeacher: prev
      };

      confirmModalText.innerHTML = `Select <strong>${selectedValue}</strong> as staff mentor for <br><strong>${prog.code} — ${prog.name}</strong>?`;
      confirmModal.classList.add("active");
    });

    grid.appendChild(card);
  });

  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll(".prog-card");
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCat = card.dataset.category || "";
    const cardSec = card.dataset.section || "";
    const cardCode = (card.dataset.code || "").toLowerCase();
    const cardName = (card.dataset.name || "").toLowerCase();
    const cardStaff = card.dataset.staff || "";
    const cardStudent = (card.dataset.student || "").toLowerCase();
    const cardCandidates = (card.dataset.candidates || "").toLowerCase();

    // 1. Category Filter
    const matchesCat = (state.activeCategory === "ALL" || cardCat.toUpperCase() === state.activeCategory.toUpperCase());

    // 2. Section Filter
    const matchesSec = (state.activeSection === "ALL" || cardSec.toUpperCase() === state.activeSection.toUpperCase());

    // 3. Programme code/name search
    const matchesSearch = (!state.searchQuery || cardCode.includes(state.searchQuery) || cardName.includes(state.searchQuery));

    // 4. Student Mentor (matches typed input or dropdown)
    const matchesStudent = (!state.selectedStudentMentor || cardStudent.includes(state.selectedStudentMentor));

    // 5. Staff Mentor
    const matchesStaff = (!state.selectedStaffMentor || cardStaff === state.selectedStaffMentor);

    // 6. Candidate (matches typed Ad No / Name across all 5 candidate positions)
    const matchesCandidate = (!state.selectedCandidate || cardCandidates.includes(state.selectedCandidate));

    if (matchesCat && matchesSec && matchesSearch && matchesStudent && matchesStaff && matchesCandidate) {
      card.style.display = "flex";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  let emptyState = document.getElementById("no-results-message");
  if (visibleCount === 0) {
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.id = "no-results-message";
      emptyState.className = "empty-state-box";
      grid.appendChild(emptyState);
    }
    emptyState.innerHTML = `
      <h3>No matching programmes found</h3>
      <p>Try adjusting your category, mentors, or candidate filter criteria.</p>
      <button class="btn btn-primary" style="margin-top:0.8rem" onclick="resetAllFilters()">Reset Filters</button>
    `;
    emptyState.style.display = "block";
  } else if (emptyState) {
    emptyState.style.display = "none";
  }
}

function updateStats() {
  const total = state.programmes.length;
  let selectedCount = 0;

  state.programmes.forEach(p => {
    if (state.assignments[p.code] || p.staffMentor) {
      selectedCount++;
    }
  });

  const availableCount = Math.max(0, total - selectedCount);
  const percent = total > 0 ? Math.round((selectedCount / total) * 100) : 0;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-selected").textContent = selectedCount;
  document.getElementById("stat-available").textContent = availableCount;
  document.getElementById("stat-percent").textContent = `${percent}%`;
}

function commitSelection(code, teacherCode) {
  state.assignments[code] = teacherCode;

  const p = state.programmes.find(x => x.code === code);
  if (p) p.staffMentor = teacherCode;

  updateCardVisualState(code, teacherCode);
  updateStats();
  saveLocalBackup();
  populateFilterDropdowns();
  showToast(`✓ ${code} assigned to ${teacherCode}`, "success");

  if (CONFIG.APPS_SCRIPT_URL && !CONFIG.APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID_HERE")) {
    syncStatusEl.textContent = "Syncing with cloud...";

    fetch(CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SELECT",
        programmeCode: code,
        teacherCode: teacherCode
      })
    })
    .then(() => {
      syncStatusEl.textContent = `Synced: ${new Date().toLocaleTimeString()}`;
    })
    .catch(() => {
      syncStatusEl.textContent = "Cloud sync delayed (offline).";
    });
  }
}

window.releaseAssignment = function(code) {
  if (!confirm(`Remove staff mentor from ${code}?`)) return;

  delete state.assignments[code];
  const p = state.programmes.find(x => x.code === code);
  if (p) p.staffMentor = "";

  updateCardVisualState(code, "");
  updateStats();
  saveLocalBackup();
  populateFilterDropdowns();
  showToast(`Staff mentor removed from ${code}`, "info");

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
  card.dataset.staff = teacherCode;
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
      if (data && data.status === "success" && Array.isArray(data.programmes)) {
        state.programmes = data.programmes;
        state.categories = data.categories || [];

        data.programmes.forEach(p => {
          if (p.staffMentor) {
            state.assignments[p.code] = p.staffMentor;
          }
        });

        rebuildCategoryTabs();
        populateFilterDropdowns();
        renderGrid();
        updateStats();
        saveLocalBackup();

        syncStatusEl.textContent = `Last cloud check: ${new Date().toLocaleTimeString()}`;
      }
    })
    .catch(() => {
      syncStatusEl.textContent = "Cloud sync delayed (offline)";
    });
}

function saveLocalBackup() {
  try {
    localStorage.setItem("sibaq_26_data", JSON.stringify({
      programmes: state.programmes,
      categories: state.categories,
      assignments: state.assignments
    }));
  } catch (e) {
    console.error(e);
  }
}

function loadLocalBackup() {
  try {
    const raw = localStorage.getItem("sibaq_26_data");
    if (raw) {
      const parsed = JSON.parse(raw);
      state.programmes = parsed.programmes || [];
      state.categories = parsed.categories || [];
      state.assignments = parsed.assignments || {};
      return true;
    }
  } catch (e) {
    console.error(e);
  }
  return false;
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