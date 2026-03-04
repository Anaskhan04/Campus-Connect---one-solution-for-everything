import { getStorageItem, setStorageItem } from './storage.js';
import { STORAGE_KEYS } from './config.js';
import { showToast } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = getStorageItem(STORAGE_KEYS.LOGGED_IN_USER);
    if (!loggedInUser) return;

    // --- ELEMENTS ---
    const resourcesContainer = document.getElementById("resources-container");
    const uploadBtn = document.getElementById("upload-resource-btn");
    const modal = document.getElementById("resource-modal");
    const modalTitle = document.getElementById("resource-modal-title");
    const cancelBtn = document.getElementById("cancel-resource-btn");
    const resourceForm = document.getElementById("resource-form");
    const resourceIdInput = document.getElementById("resource-id");

    // Filter elements
    const searchBar = document.getElementById("resource-search-bar");
    const branchFilter = document.getElementById("resource-branch-filter");
    const yearFilter = document.getElementById("resource-year-filter");
    const myUploadsBtn = document.getElementById("my-uploads-btn");
    
    // NEW: My Uploads Modal elements
    const myUploadsModal = document.getElementById("my-uploads-modal");
    const closeMyUploadsBtn = document.getElementById("close-my-uploads-modal-btn");
    const myUploadsListContainer = document.getElementById("my-uploads-list");

    const RESOURCES_KEY = 'campus_resources';

    // --- DATA MANAGEMENT ---
    // NEW: Function to initialize with dummy data
    function initializeDummyResources() {
        let resources = getStorageItem(RESOURCES_KEY);
        if (!resources || resources.length === 0) {
            const dummyResources = [
                { id: 1, title: 'Data Structures Notes (Unit 1)', description: 'Complete notes for the first unit of DS.', branch: 'Information Technology', year: '2', fileName: 'ds_unit1.pdf', fileData: '#', uploadedBy: 'faculty_user' },
                { id: 2, title: 'Thermodynamics Problem Set', description: 'Practice questions for the final exam.', branch: 'Mechanical Engineering', year: '3', fileName: 'thermo_problems.pdf', fileData: '#', uploadedBy: 'faculty_user' },
                { id: 3, title: 'Circuit Theory Lab Manual', description: 'Manual for the EE lab sessions.', branch: 'Electrical Engineering', year: '2', fileName: 'circuit_lab.pdf', fileData: '#', uploadedBy: 'faculty_user' },
                { id: 4, title: 'Web Tech Previous Year Paper', description: '2023 question paper for Web Technology.', branch: 'Information Technology', year: '3', fileName: 'wt_pyq.pdf', fileData: '#', uploadedBy: 'student_user' },
                { id: 5, title: 'AI Introduction Slides', description: 'Lecture slides covering the basics of AI.', branch: 'Information Technology', year: '4', fileName: 'ai_intro.pptx', fileData: '#', uploadedBy: 'faculty_user' },
            ];
            setStorageItem(RESOURCES_KEY, dummyResources);
        }
    }

    function getResources() {
        return getStorageItem(RESOURCES_KEY, []);
    }

    function saveResources(resources) {
        setStorageItem(RESOURCES_KEY, resources);
    }

    // --- RENDER RESOURCES ---
    function renderResources() {
        if (!resourcesContainer) return;

        const allResources = getResources();
        const searchTerm = searchBar.value.toLowerCase();
        const selectedBranch = branchFilter.value;
        const selectedYear = yearFilter.value;

        const filteredResources = allResources.filter(resource => { // Renamed from allResources
            const matchesSearch = searchTerm === '' ||
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.uploadedBy.toLowerCase().includes(searchTerm);

            const matchesBranch = selectedBranch === 'all' || resource.branch === selectedBranch;
            const matchesYear = selectedYear === 'all' || resource.year === selectedYear;
            
            return matchesSearch && matchesBranch && matchesYear;
        });

        resourcesContainer.innerHTML = "";
        if (filteredResources.length === 0) {
            resourcesContainer.innerHTML = "<p>No resources found matching your criteria.</p>";
            return;
        }

        filteredResources.forEach(resource => {
            const card = document.createElement("div");
            card.className = "profile-card resource-card";

            card.innerHTML = `
                <h3>${resource.title}</h3>
                <p class="resource-meta">
                    <span>Branch: ${resource.branch}</span> | <span>Year: ${resource.year}</span>
                </p>
                <p>${resource.description}</p>
                <div class="resource-footer">
                    <span class="uploader">Uploaded by: ${resource.uploadedBy}</span>
                    <a href="${resource.fileData}" download="${resource.fileName}" class="download-btn">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>
            `;
            resourcesContainer.appendChild(card);
        });
    }

    // --- MODAL & FORM HANDLING ---
    function openModal(resource = null) {
        resourceForm.reset();
        if (resource) {
            modalTitle.textContent = "Edit Resource";
            resourceIdInput.value = resource.id;
            document.getElementById("resource-title").value = resource.title;
            document.getElementById("resource-description").value = resource.description;
            document.getElementById("resource-branch").value = resource.branch;
            document.getElementById("resource-year").value = resource.year;
            resourceForm.querySelector('button[type="submit"]').textContent = "Save Changes";
        } else {
            modalTitle.textContent = "Upload a New Resource";
            resourceIdInput.value = "";
            resourceForm.querySelector('button[type="submit"]').textContent = "Upload";
        }
        modal.classList.add("active");
    }

    if (uploadBtn) uploadBtn.addEventListener("click", () => openModal());
    if (cancelBtn) cancelBtn.addEventListener("click", () => modal.classList.remove("active"));

    if (resourceForm) {
        resourceForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const resourceId = resourceIdInput.value;
            const fileInput = document.getElementById("resource-file"); // Corrected typo
            const file = fileInput.files[0]; // Corrected typo

            const processAndSave = (fileData, fileName) => { // Corrected typo
                let allResources = getResources(); // Corrected typo
                const formData = {
                    title: document.getElementById("resource-title").value,
                    description: document.getElementById("resource-description").value,
                    branch: document.getElementById("resource-branch").value,
                    year: document.getElementById("resource-year").value,
                };

                if (resourceId) { // Editing existing resource // Corrected typo
                    const index = allResources.findIndex(r => r.id == resourceId);
                    if (index > -1) {
                        allResources[index] = { ...allResources[index], ...formData };
                        if (fileData && fileName) { // If a new file was uploaded
                            allResources[index].fileData = fileData;
                            allResources[index].fileName = fileName;
                        }
                    }
                } else { // Adding new resource
                    const newResource = {
                        ...formData,
                        id: Date.now(),
                        fileData: fileData,
                        fileName: fileName,
                        uploadedBy: loggedInUser.username,
                    };
                    allResources.unshift(newResource);
                }
                saveResources(allResources); // Corrected typo
                renderResources(); // Corrected typo
                modal.classList.remove("active");
                renderMyUploads(); // Refresh the "My Uploads" modal list as well
            };

            if (file) { // If a file is selected (for new upload or to replace existing) // Corrected typo
                const reader = new FileReader();
                reader.onload = (event) => processAndSave(event.target.result, file.name);
                reader.readAsDataURL(file);
            } else if (resourceId) { // If editing without changing the file
                processAndSave(null, null);
            } else {
                showToast("Please select a file to upload.", "warning");
            }
        });
    }

    // --- NEW: "My Uploads" Modal Logic ---
    function renderMyUploads() {
        if (!myUploadsListContainer) return;

        const allResources = getResources();
        const myResources = allResources.filter(r => r.uploadedBy === loggedInUser.username);

        myUploadsListContainer.innerHTML = "";
        if (myResources.length === 0) {
            myUploadsListContainer.innerHTML = "<p>You have not uploaded any resources yet.</p>";
            return;
        }

        myResources.forEach(resource => {
            const item = document.createElement('div');
            item.className = 'my-uploads-item';
            item.innerHTML = `
                <h4>${resource.title}</h4>
                <p>Branch: ${resource.branch} | Year: ${resource.year}</p>
                <div class="resource-actions">
                    <button class="edit-resource-btn" data-id="${resource.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-resource-btn" data-id="${resource.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            myUploadsListContainer.appendChild(item);
        });
    }

    if (myUploadsBtn) {
        myUploadsBtn.addEventListener("click", () => {
            renderMyUploads();
            myUploadsModal.classList.add("active");
        });
    }

    if (closeMyUploadsBtn) {
        closeMyUploadsBtn.addEventListener("click", () => myUploadsModal.classList.remove("active"));
    }

    // --- NEW: Event delegation for Edit/Delete now on the "My Uploads" modal ---
    if (myUploadsListContainer) {
        myUploadsListContainer.addEventListener("click", (e) => {
            const editBtn = e.target.closest(".edit-resource-btn");
            const deleteBtn = e.target.closest(".delete-resource-btn");

            if (editBtn) {
                const resourceId = editBtn.dataset.id;
                const resourceToEdit = getResources().find(r => r.id == resourceId);
                if (resourceToEdit) {
                    myUploadsModal.classList.remove("active"); // Close this modal
                    openModal(resourceToEdit); // Open the edit modal
                }
            }

            if (deleteBtn) {
                const resourceId = deleteBtn.dataset.id;
                if (confirm("Are you sure you want to delete this resource?")) {
                    let resources = getResources();
                    resources = resources.filter(r => r.id != resourceId); // Corrected typo
                    saveResources(resources);
                    renderMyUploads(); // Re-render the list in the modal
                    renderResources(); // Also re-render the main page view
                    showToast("Resource deleted.", "success");
                }
            }
        });
    }


    // --- FILTERING ---
    if (searchBar) searchBar.addEventListener("input", renderResources);
    if (branchFilter) branchFilter.addEventListener("change", renderResources);
    if (yearFilter) yearFilter.addEventListener("change", renderResources);

    // --- INITIALIZATION ---
    initializeDummyResources();
    renderResources();
});