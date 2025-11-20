import { getStorageItem, setStorageItem } from './storage.js';
import { STORAGE_KEYS } from './config.js';
import { api } from './api.js';

// Fallback dummy data (first 4 alumni)
const fallbackAlumniData = [
    {
        id: 1,
        username: "alumni_rahul",
        name: "Rahul Verma",
        branch: "Information Technology",
        graduationYear: 2022,
        currentRole: "Software Engineer",
        company: "Google",
        email: "rahul.v@example.com",
        linkedin: "https://linkedin.com/in/rahulverma"
    },
    {
        id: 2,
        username: "alumni_sneha",
        name: "Sneha Reddy",
        branch: "Electrical Engineering",
        graduationYear: 2021,
        currentRole: "Hardware Engineer",
        company: "Intel",
        email: "sneha.r@example.com",
        linkedin: "https://linkedin.com/in/snehareddy"
    },
    {
        id: 3,
        username: "alumni_arjun",
        name: "Arjun Mehta",
        branch: "Mechanical Engineering",
        graduationYear: 2020,
        currentRole: "Design Engineer",
        company: "Tesla",
        email: "arjun.m@example.com",
        linkedin: "https://linkedin.com/in/arjunmehta"
    },
    {
        id: 4,
        username: "alumni_priya",
        name: "Priya Jain",
        branch: "Information Technology",
        graduationYear: 2023,
        currentRole: "Data Scientist",
        company: "Microsoft",
        email: "priya.j@example.com",
        linkedin: "https://linkedin.com/in/priyajain"
    }
];

// Check if we're on the alumni page by looking for the alumni container
document.addEventListener("DOMContentLoaded", async () => {
    // Check if we're on the alumni page
    const alumniContainer = document.getElementById("alumni-container");
    if (!alumniContainer) {
        console.log('⚠️ Alumni script loaded but alumni-container not found (not on alumni page)');
        return;
    }
    
    console.log('✅ Alumni profile script loaded and alumni-container found');
    console.log('✅ DOMContentLoaded fired');
    
    // --- ELEMENTS ---
    const loggedInUser = getStorageItem(STORAGE_KEYS.LOGGED_IN_USER);
    console.log('👤 Logged in user:', loggedInUser);
    
    const actionContainer = document.getElementById("profile-action-container");
    const modal = document.getElementById("profile-modal");
    const profileForm = document.getElementById("profile-form");
    const cancelBtn = document.getElementById("cancel-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const yearFilter = document.getElementById("year-filter");
    const branchFilter = document.getElementById("branch-filter");

    console.log('🔍 Elements check:', {
        actionContainer: !!actionContainer,
        modal: !!modal,
        profileForm: !!profileForm,
        alumniContainer: !!alumniContainer,
        yearFilter: !!yearFilter,
        branchFilter: !!branchFilter
    });

    let allAlumni = [];
    let userProfile = null;

    // --- DATA MANAGEMENT ---
    const loadAlumni = async () => {
        try {
            console.log('📡 Loading alumni from API...');
            try {
                allAlumni = await api.getAlumni();
                console.log('✅ Alumni loaded from API:', allAlumni);
            } catch (fetchError) {
                console.error('❌ Error fetching alumni:', fetchError);
                allAlumni = [];
            }
            
            // Always try to seed dummy data (backend will skip if they already exist)
            // This ensures dummy data is always present even after adding new profiles
            try {
                console.log('📦 Ensuring dummy data exists...');
                const seedResult = await api.seedAlumni();
                console.log('📦 Seed result:', seedResult);
                // Reload to get all alumni including newly seeded ones
                allAlumni = await api.getAlumni();
                console.log('✅ Alumni after ensuring dummy data:', allAlumni);
            } catch (seedError) {
                console.error('❌ Error seeding alumni:', seedError);
                // If seeding fails, check if we have any data
                if (allAlumni.length === 0) {
                    console.log('🔄 No data from API, using fallback dummy data');
                    allAlumni = fallbackAlumniData;
                } else {
                    console.log('⚠️ Seeding failed but we have some data, continuing...');
                }
            }
            
            // Final check - if still no data, use fallback
            if (!allAlumni || allAlumni.length === 0) {
                console.log('🔄 No alumni data, using fallback dummy data');
                allAlumni = [...fallbackAlumniData]; // Create a copy
            }
            
            console.log('📊 Final alumni count:', allAlumni.length);
            
            // Map backend 'year' to frontend 'graduationYear' for consistency
            allAlumni = allAlumni.map(alumnus => ({
                ...alumnus,
                graduationYear: alumnus.graduationYear || alumnus.year,
                _id: alumnus._id || alumnus.id
            }));
            
            console.log('✅ Processed alumni:', allAlumni);
            
            // Find user's profile
            if (loggedInUser) {
                console.log('🔍 Looking for user profile. Logged in username:', loggedInUser.username);
                console.log('🔍 All alumni:', allAlumni.map(a => ({ 
                    id: a._id, 
                    username: a.username, 
                    name: a.name 
                })));
                
                // First try exact match
                userProfile = allAlumni.find(
                    (a) => a.username && a.username === loggedInUser.username
                );
                
                // If not found, try case-insensitive match
                if (!userProfile) {
                    console.log('⚠️ User profile not found by exact username, trying case-insensitive match...');
                    userProfile = allAlumni.find(
                        (a) => a.username && a.username.toLowerCase() === loggedInUser.username.toLowerCase()
                    );
                }
                
                // If still not found and there's only one profile without username, it might be the user's
                // (This handles old profiles created before username field was added)
                if (!userProfile && allAlumni.length === 1 && !allAlumni[0].username) {
                    console.log('⚠️ Found profile without username, assuming it belongs to logged in user');
                    userProfile = allAlumni[0];
                }
                
                console.log('👤 User profile found:', userProfile);
                if (userProfile) {
                    console.log('✅ Profile details:', {
                        id: userProfile._id,
                        username: userProfile.username,
                        name: userProfile.name
                    });
                } else {
                    console.log('❌ No profile found for username:', loggedInUser.username);
                }
            }
            
            applyFilters();
            populateYearFilter();
            setupProfileActions();
        } catch (error) {
            console.error('❌ Error loading alumni:', error);
            console.log('🔄 Using fallback dummy data due to error');
            // Use fallback data on error
            allAlumni = fallbackAlumniData;
            
            // Find user's profile in fallback data
            if (loggedInUser) {
                userProfile = allAlumni.find(
                    (a) => a.username === loggedInUser.username
                );
            }
            
            applyFilters();
            populateYearFilter();
            setupProfileActions();
        }
    };

    // --- PROFILE ACTIONS (ADD/EDIT) ---
    function setupProfileActions() {
        console.log('🔧 Setting up profile actions...');
        console.log('👤 Logged in user:', loggedInUser);
        console.log('👤 Current userProfile:', userProfile);
        console.log('📦 Action container:', actionContainer);
        
        // Only show "Add Alumni Profile" button for students
        if (!loggedInUser) {
            console.log('⚠️ No logged in user, hiding button');
            if (actionContainer) {
                actionContainer.innerHTML = "";
            }
            return;
        }
        
        if (loggedInUser.role !== "student") {
            console.log('⚠️ User is not a student, hiding button. Role:', loggedInUser.role);
            if (actionContainer) {
                actionContainer.innerHTML = "";
            }
            return;
        }
        
        if (!actionContainer) {
            console.error('❌ Action container not found!');
            return;
        }
        
        console.log('✅ Creating button for student');
        console.log('🔍 userProfile check:', {
            exists: !!userProfile,
            hasId: !!(userProfile && userProfile._id),
            username: userProfile?.username,
            loggedInUsername: loggedInUser.username
        });

        const button = document.createElement("button");
        button.className = "profile-action-btn";
        const buttonText = userProfile && userProfile._id ? "Edit Your Alumni Profile" : "Add Your Alumni Profile";
        button.textContent = buttonText;
        console.log('🔘 Button text set to:', buttonText);

        button.addEventListener("click", () => {
            console.log('🔘 Button clicked, opening modal');
            if (!modal) {
                console.error('❌ Modal not found!');
                alert('Modal not found. Please refresh the page.');
                return;
            }
            
            const modalTitle = document.getElementById("modal-title");
            if (modalTitle) {
                modalTitle.textContent = userProfile
                    ? "Edit Your Alumni Profile"
                    : "Add Your Alumni Profile";
            }

            if (userProfile) {
                const nameInput = document.getElementById("profile-name");
                const branchInput = document.getElementById("profile-branch");
                const yearInput = document.getElementById("profile-graduationYear");
                const roleInput = document.getElementById("profile-currentRole");
                const companyInput = document.getElementById("profile-company");
                const linkedinInput = document.getElementById("profile-linkedin");
                
                if (nameInput) nameInput.value = userProfile.name || "";
                if (branchInput) branchInput.value = userProfile.branch || "Information Technology";
                if (yearInput) yearInput.value = userProfile.graduationYear || userProfile.year || "";
                if (roleInput) roleInput.value = userProfile.currentRole || "";
                if (companyInput) companyInput.value = userProfile.company || "";
                if (linkedinInput) linkedinInput.value = userProfile.linkedin || "";
            } else {
                if (profileForm) profileForm.reset();
            }
            modal.classList.add("active");
            console.log('✅ Modal opened');
        });

        actionContainer.innerHTML = "";
        actionContainer.appendChild(button);
        console.log('✅ Button added to container');
        console.log('🔘 Button text:', button.textContent);
    }

    // --- MODAL & FORM HANDLING ---
    if (modal) {
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => modal.classList.remove("active"));
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", async () => {
                if (!userProfile || !userProfile._id) {
                    console.log('⚠️ No user profile to delete');
                    return;
                }

                if (confirm("Are you sure you want to delete your alumni profile?")) {
                    try {
                        await api.deleteAlumni(userProfile._id);
                        userProfile = null;
                        await loadAlumni();
                        modal.classList.remove("active");
                    } catch (error) {
                        console.error('❌ Error deleting alumni profile:', error);
                        alert(`Error: ${error.message || 'Failed to delete profile'}`);
                    }
                }
            });
        }

        if (profileForm) {
            profileForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const formData = {
                    username: loggedInUser.username,
                    name: document.getElementById("profile-name").value,
                    branch: document.getElementById("profile-branch").value,
                    year: parseInt(document.getElementById("profile-graduationYear").value),
                    currentRole: document.getElementById("profile-currentRole").value,
                    company: document.getElementById("profile-company").value,
                    linkedin: document.getElementById("profile-linkedin").value || "",
                    email: userProfile?.email || `${loggedInUser.username}@example.edu`
                };

                try {
                    if (userProfile && userProfile._id) {
                        console.log('📝 Updating alumni profile:', userProfile._id);
                        const updated = await api.updateAlumni(userProfile._id, formData);
                        console.log('✅ Profile updated:', updated);
                    } else {
                        console.log('➕ Creating new alumni profile');
                        console.log('📤 Sending form data:', formData);
                        const created = await api.createAlumni(formData);
                        console.log('✅ Profile created:', created);
                    }
                    
                    modal.classList.remove("active");
                    console.log('🔄 Reloading alumni data...');
                    await loadAlumni();
                    console.log('✅ Alumni data reloaded');
                } catch (error) {
                    console.error('❌ Error saving alumni profile:', error);
                    alert(`Error: ${error.message || 'Failed to save profile'}`);
                }
            });
        }
    }

    // --- RENDER ALUMNI CARDS ---
    function renderAlumni(data) {
        console.log('🎨 Rendering alumni:', data);
        
        if (!alumniContainer) {
            console.error('❌ Alumni container not found!');
            return;
        }
        
        alumniContainer.innerHTML = "";

        if (data.length === 0) {
            console.log('⚠️ No alumni data to render');
            alumniContainer.innerHTML = "<p class='no-data-message'>No alumni found for this filter.</p>";
            return;
        }
        
        console.log(`✅ Rendering ${data.length} alumni cards`);

        data.forEach((alumnus) => {
            const card = document.createElement("div");
            card.className = "profile-card alumni-card";
            const graduationYear = alumnus.graduationYear || alumnus.year;
            const email = alumnus.email || '';
            card.innerHTML = `
                <h3>${alumnus.name || 'Unknown'}</h3>
                <p class="alumni-status">${alumnus.currentRole || 'N/A'} at <strong>${alumnus.company || 'N/A'}</strong></p>
                <p><strong>Branch:</strong> ${alumnus.branch || 'N/A'}</p>
                <p><strong>Graduated:</strong> ${graduationYear || 'N/A'}</p>
                <div class="social-links">
                    ${email ? `<a href="mailto:${email}" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
                    ${alumnus.linkedin ? `<a href="${alumnus.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
                </div>
            `;
            alumniContainer.appendChild(card);
        });
        
        console.log('✅ Alumni cards rendered');
    }

    // --- FILTERING LOGIC ---
    function applyFilters() {
        if (!yearFilter || !branchFilter) {
            console.log('⚠️ Filters not found, rendering all alumni');
            renderAlumni(allAlumni);
            return;
        }
        
        const selectedYear = yearFilter.value;
        const selectedBranch = branchFilter.value;

        let filteredAlumni = allAlumni;
        if (selectedYear !== "all") {
            filteredAlumni = filteredAlumni.filter((a) => {
                const year = a.graduationYear || a.year;
                return year == selectedYear;
            });
        }
        if (selectedBranch !== "all") {
            filteredAlumni = filteredAlumni.filter(
                (a) => a.branch === selectedBranch
            );
        }
        renderAlumni(filteredAlumni);
    }

    function populateYearFilter() {
        if (!yearFilter) {
            console.log('⚠️ Year filter not found');
            return;
        }
        
        yearFilter.innerHTML = '<option value="all">All</option>';
        
        const years = [...new Set(allAlumni.map(a => a.graduationYear || a.year).filter(y => y))].sort((a, b) => b - a);
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        console.log('✅ Year filter populated with:', years);
    }

    if (yearFilter && branchFilter) {
        yearFilter.addEventListener("change", applyFilters);
        branchFilter.addEventListener("change", applyFilters);
    }

    // --- INITIALIZATION ---
    console.log('🚀 Starting initialization...');
    
    // Show loading state
    if (alumniContainer) {
        alumniContainer.innerHTML = "<p>Loading alumni data...</p>";
    }
    
    await loadAlumni();
    
    // Final check - if still no data, show fallback
    if (allAlumni.length === 0) {
        console.log('🔄 No alumni data after load, using fallback');
        allAlumni = fallbackAlumniData;
        applyFilters();
        populateYearFilter();
        setupProfileActions();
    }
    
    console.log('✅ Initialization complete. Alumni count:', allAlumni.length);
});
