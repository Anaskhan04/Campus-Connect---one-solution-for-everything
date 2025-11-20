import { getStorageItem, setStorageItem } from './storage.js';
import { STORAGE_KEYS } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = getStorageItem(STORAGE_KEYS.LOGGED_IN_USER);
    const studentProfile = getStorageItem(STORAGE_KEYS.STUDENT_PROFILES, []).find(p => p.username === loggedInUser.username);

    if (!loggedInUser || loggedInUser.role !== 'student' || !studentProfile) {
        const section = document.querySelector('.attendance-section');
        if(section) {
            section.innerHTML = `<h1>Attendance Log</h1>
            <div class="card"><p>This feature requires a student profile to know your year and branch.</p>
            <p>Please go to the <strong>Students</strong> page and click <strong>'Add Your Profile'</strong> to get started.</p></div>`;
        }
        return;
    }

    const attendanceDateInput = document.getElementById('attendance-date');
    const subjectListContainer = document.getElementById('subject-list');
    const saveBtn = document.getElementById('save-attendance-btn');
    const clearBtn = document.getElementById('clear-attendance-btn');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const showStatsBtn = document.getElementById('show-stats-btn');
    const statsModal = document.getElementById('attendance-stats-modal');
    const closeStatsModalBtn = document.getElementById('close-stats-modal-btn');
    const statsModalBody = document.getElementById('stats-modal-body');
    const statsStartDateInput = document.getElementById('stats-start-date');
    const statsEndDateInput = document.getElementById('stats-end-date');
    const recalculateStatsBtn = document.getElementById('recalculate-stats-btn');
    
    // --- NEW: Subject Management Modal Elements ---
    const manageSubjectsBtn = document.getElementById('manage-subjects-btn');
    const subjectsModal = document.getElementById('subjects-modal');
    const closeSubjectsModalBtn = document.getElementById('close-subjects-modal-btn');
    const addSubjectForm = document.getElementById('add-subject-form');
    const subjectManagerList = document.getElementById('subject-manager-list');

    const ATTENDANCE_KEY = `attendance_${loggedInUser.username}`;
    const SUBJECTS_KEY = `subjects_${loggedInUser.username}`;

    function getStudentSubjects() {
        return getStorageItem(SUBJECTS_KEY, []);
    }

    function getAttendanceData() {
        return getStorageItem(ATTENDANCE_KEY, {});
    }

    function renderSubjectsForDate(date) {
        const studentSubjects = getStudentSubjects();
        if (studentSubjects.length === 0) {
            subjectListContainer.innerHTML = '<p>You have not added any subjects yet. Click "Manage Subjects" to get started.</p>';
            saveBtn.style.display = 'none';
            clearBtn.style.display = 'none';
            return;
        }

        const attendanceData = getAttendanceData();
        const dailyLog = attendanceData[date] || {};

        subjectListContainer.innerHTML = '';
        studentSubjects.forEach(subject => {
            const subjectRow = document.createElement('div');
            subjectRow.className = 'subject-log-row';

            const status = dailyLog[subject.id] || 'unmarked';

            subjectRow.innerHTML = `
                <div class="subject-name-wrapper">
                    <span class="subject-name">${subject.name}</span>
                    <span class="subject-type">${subject.type}</span>
                </div>
                <div class="attendance-options" data-subject-id="${subject.id}">
                    <label>
                        <input type="radio" name="status-${subject.id}" value="attended" ${status === 'attended' ? 'checked' : ''}>
                        <span>Attended</span>
                    </label>
                    <label>
                        <input type="radio" name="status-${subject.id}" value="missed" ${status === 'missed' ? 'checked' : ''}>
                        <span>Missed</span>
                    </label>
                    <label>
                        <input type="radio" name="status-${subject.id}" value="cancelled" ${status === 'cancelled' ? 'checked' : ''}>
                        <span>Cancelled</span>
                    </label>
                </div>
            `;
            subjectListContainer.appendChild(subjectRow);
        });

        saveBtn.style.display = 'block';
        clearBtn.style.display = 'block';
    }

    attendanceDateInput.addEventListener('change', () => {
        const selectedDate = attendanceDateInput.value;
        if (!selectedDate) return;

        const dateObj = new Date(selectedDate + 'T00:00:00'); // Ensure local timezone
        const day = dateObj.getDay();

        // 0 is Sunday, 6 is Saturday
        if (day === 0 || day === 6) {
            subjectListContainer.innerHTML = '<p>College is off on weekends. Please select a weekday.</p>';
            saveBtn.style.display = 'none';
            clearBtn.style.display = 'none';
            selectedDateDisplay.textContent = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return;
        }

        selectedDateDisplay.textContent = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        renderSubjectsForDate(selectedDate);
    });

    // --- FINAL FIX: Allow unchecking radio buttons ---
    subjectListContainer.addEventListener('click', (e) => {
        const radio = e.target;
        // Only act if the clicked element is a radio button
        if (radio.type !== 'radio') return;

        // The 'data-was-checked' attribute will store the state *before* the click.
        const wasChecked = radio.getAttribute('data-was-checked') === 'true';

        if (wasChecked) {
            // If it was already checked, this click should uncheck it.
            radio.checked = false;
        }
    });
    subjectListContainer.addEventListener('mousedown', (e) => {
        // Before the click happens, record the current state of the radio button.
        const radio = e.target;
        if (radio.type === 'radio') {
            radio.setAttribute('data-was-checked', radio.checked);
        }
    }, true); // Use capture phase to ensure this runs before the click.

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all selections for this date?')) {
            const checkedRadios = subjectListContainer.querySelectorAll('input[type="radio"]:checked');
            checkedRadios.forEach(radio => {
                radio.checked = false;
            });
        }
    });
    saveBtn.addEventListener('click', () => {
        const selectedDate = attendanceDateInput.value;
        if (!selectedDate) {
            alert('Please select a date first.');
            return;
        }

        const allAttendanceData = getAttendanceData();
        const newDailyLog = {}; // Create a fresh log for the day
        const rows = document.querySelectorAll('.attendance-options');

        rows.forEach(row => {
            const subjectId = row.dataset.subjectId;
            const checkedRadio = row.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
                // Only add to the log if a status is explicitly selected
                newDailyLog[subjectId] = checkedRadio.value;
            }
        });

        if (Object.keys(newDailyLog).length > 0) {
            allAttendanceData[selectedDate] = newDailyLog;
        } else {
            // If the log for the day is empty, delete it entirely
            delete allAttendanceData[selectedDate];
        }

        setStorageItem(ATTENDANCE_KEY, allAttendanceData);
        alert('Attendance for ' + selectedDate + ' saved successfully!');

        // Dispatch a custom event to notify the dashboard to update
        window.dispatchEvent(new CustomEvent('attendanceUpdated'));

    });

    // --- Statistics Modal Logic ---
    function calculateAndShowStats(startDateFilter = null, endDateFilter = null) {
        const attendanceData = getAttendanceData(); // Always get the latest data
        const dates = Object.keys(attendanceData).sort();

        if (dates.length === 0) {
            statsModalBody.innerHTML = '<p>No attendance data has been logged yet.</p>';
            if (statsStartDateInput) statsStartDateInput.value = '';
            if (statsEndDateInput) statsEndDateInput.value = '';
            return;
        }

        // Set default filter dates if not provided
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        if (statsStartDateInput && !statsStartDateInput.value) statsStartDateInput.value = firstDate;
        if (statsEndDateInput && !statsEndDateInput.value) statsEndDateInput.value = lastDate;

        const finalStartDate = startDateFilter || firstDate;
        const finalEndDate = endDateFilter || lastDate;

        let content = `<div class="stats-summary">Showing data from <strong>${new Date(finalStartDate + 'T00:00:00').toLocaleDateString()}</strong> to <strong>${new Date(finalEndDate + 'T00:00:00').toLocaleDateString()}</strong></div>`;

        const studentSubjects = getStudentSubjects();
        studentSubjects.forEach(subject => {
            let attended = 0;
            let missed = 0;
            let cancelled = 0;

            // Filter dates based on the selected range
            const filteredDates = dates.filter(d => {
                if (d < finalStartDate || d > finalEndDate) return false;
                // --- FIX: Explicitly ignore weekends from the calculation ---
                const dateObj = new Date(d + 'T00:00:00');
                const day = dateObj.getDay();
                return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
            });

            for (const date of filteredDates) {
                const status = attendanceData[date][subject.id];
                if (status === 'attended') attended++;
                if (status === 'missed') missed++;
                if (status === 'cancelled') cancelled++;
            }

            const totalClassesRun = attended + missed + cancelled;

            content += `
                <div class="subject-stat-item">
                    <h4>${subject.name}</h4>
                    <div class="stat-numbers">
                        <div>
                            <span>${totalClassesRun}</span>
                            <span>Classes Run</span>
                        </div>
                        <div>
                            <span>${attended}</span>
                            <span>Attended</span>
                        </div>
                        <div>
                            <span>${missed}</span>
                            <span>Missed</span>
                        </div>
                    </div>
                </div>
            `;
        });

        statsModalBody.innerHTML = content;
    }

    if (showStatsBtn && statsModal && closeStatsModalBtn && recalculateStatsBtn) {
        showStatsBtn.addEventListener('click', () => {
            calculateAndShowStats();
            statsModal.classList.add('active');
        });

        closeStatsModalBtn.addEventListener('click', () => {
            statsModal.classList.remove('active');
        });

        recalculateStatsBtn.addEventListener('click', () => {
            // Recalculate with the new date range from the inputs
            calculateAndShowStats(statsStartDateInput.value, statsEndDateInput.value);
        });

        statsModal.addEventListener('click', (e) => {
            if (e.target === statsModal) {
                statsModal.classList.remove('active');
            }
        });
    }

    // --- NEW: Subject Management Modal Logic ---
    function renderSubjectManager() {
        const subjects = getStudentSubjects();
        subjectManagerList.innerHTML = '';
        if (subjects.length === 0) {
            subjectManagerList.innerHTML = '<p>No subjects added yet.</p>';
        } else {
            subjects.forEach(subject => {
                const item = document.createElement('div');
                item.className = 'subject-manager-item';
                item.innerHTML = `
                    <div class="subject-details">
                        ${subject.name} <span class="subject-type">${subject.type}</span>
                    </div>
                    <button class="delete-btn" data-id="${subject.id}" title="Delete Subject"><i class="fas fa-trash"></i></button>
                `;
                subjectManagerList.appendChild(item);
            });
        }
    }

    if (manageSubjectsBtn) {
        manageSubjectsBtn.addEventListener('click', () => {
            renderSubjectManager();
            subjectsModal.classList.add('active');
        });

        closeSubjectsModalBtn.addEventListener('click', () => subjectsModal.classList.remove('active'));

        addSubjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('new-subject-name');
            const typeInput = document.getElementById('new-subject-type');
            const name = nameInput.value.trim();
            const type = typeInput.value;

            if (name) {
                const subjects = getStudentSubjects();
                const newSubject = { id: `sub_${Date.now()}`, name, type };
                subjects.push(newSubject);
                setStorageItem(SUBJECTS_KEY, subjects);
                renderSubjectManager();
                renderSubjectsForDate(attendanceDateInput.value); // Refresh main view
                window.dispatchEvent(new CustomEvent('attendanceUpdated')); // Update dashboard
                nameInput.value = '';
            }
        });

        subjectManagerList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-btn');
            if (deleteBtn) {
                const subjectId = deleteBtn.dataset.id;
                if (confirm('Are you sure you want to delete this subject? This cannot be undone.')) {
                    let subjects = getStudentSubjects();
                    subjects = subjects.filter(s => s.id !== subjectId);
                    setStorageItem(SUBJECTS_KEY, subjects);
                    renderSubjectManager();
                    renderSubjectsForDate(attendanceDateInput.value); // Refresh main view
                    window.dispatchEvent(new CustomEvent('attendanceUpdated')); // Update dashboard
                }
            }
        });
    }

    // --- INITIALIZATION ---
    function initialize() {
        // Set date input to today by default
        const today = new Date().toISOString().split('T')[0];
        attendanceDateInput.value = today;
        attendanceDateInput.dispatchEvent(new Event('change')); // Trigger change to render
    }

    initialize();
});

/**
 * Calculates and returns attendance percentages.
 * This function is exported to be used by other modules (like script.js for the dashboard).
 * @param {string} username The student's username.
 * @param {Array} subjects The list of subjects for the student.
 * @returns {Object} An object containing subject-wise percentages.
 */
export function calculateAttendance(username) {
    const subjectsKey = `subjects_${username}`;
    const attendanceKey = `attendance_${username}`;

    const currentSubjects = getStorageItem(subjectsKey, []);

    if (currentSubjects.length === 0) {
        return {}; // No subjects, no stats.
    }

    const attendanceData = getStorageItem(`attendance_${username}`, {});
    // console.log("4. Found Attendance Log:", attendanceData);

    const stats = {};
    // console.log("--- 5. Calculating percentage for each subject... ---");

    currentSubjects.forEach(subject => {
        let attended = 0;
        let totalClasses = 0;
        for (const date in attendanceData) {
            const dailyLog = attendanceData[date];
            if (dailyLog && dailyLog[subject.id]) {
                const status = dailyLog[subject.id];
                if (status === 'attended') {
                    attended++;
                    totalClasses++;
                } else if (status === 'missed') {
                    totalClasses++;
                } else if (status === 'cancelled') {
                    // Correct logic: Cancelled classes should not be counted in the total.
                    // The bug was that 'cancelled' was being added to totalClasses.
                }
            }
        }
        const percentage = totalClasses > 0 ? (attended / totalClasses) * 100 : 100;
        stats[subject.id] = { name: subject.name, percentage: Math.round(percentage) };
        
    });
    
    return stats;
}