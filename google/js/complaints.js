import { getStorageItem } from './storage.js';
import { STORAGE_KEYS } from './config.js';
import { api } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  const complaintForm = document.getElementById("complaint-form");
  const complaintTracker = document.getElementById("complaint-tracker");
  const loggedInUser = getStorageItem(STORAGE_KEYS.LOGGED_IN_USER);
  if (!loggedInUser) return;

  let complaints = [];

  const loadComplaints = async () => {
    try {
      complaints = await api.getComplaints();
      renderComplaints();
    } catch (error) {
      console.error('Error loading complaints:', error);
      complaints = [];
      renderComplaints();
    }
  };

  // --- NEW: Category data structure from your image ---
  const complaintCategories = {
    "Director": [],
    "HOD": ["IT", "EE", "ME"],
    "Dean (DSW)": [],
    "Placement Cell": [],
    "Anti Ragging": [],
    "Hostel Warden": ["A Block", "B Block", "C Block", "Mandakini", "Transit"],
    "Registrar": [],
    "Direct to AKTU": [],
    "Other": []
  };

  const categorySelect = document.getElementById("category");
  const subCategoryContainer = document.getElementById("sub-category-container");
  const subCategorySelect = document.getElementById("sub-category");

  // --- NEW: Populate the main category dropdown ---
  function populateCategories() {
    if (!categorySelect) return;
    categorySelect.innerHTML = '<option value="">-- Select a Category --</option>';
    for (const category in complaintCategories) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }
  }

  // --- NEW: Handle category changes to show/hide the sub-category dropdown ---
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      const selectedCategory = categorySelect.value;
      const subCategories = complaintCategories[selectedCategory];

      if (subCategories && subCategories.length > 0) {
        subCategorySelect.innerHTML = ""; // Clear previous options
        subCategories.forEach(sub => {
          const option = document.createElement("option");
          option.value = sub;
          option.textContent = sub;
          subCategorySelect.appendChild(option);
        });
        subCategoryContainer.style.display = "block"; // Show the dropdown
      } else {
        subCategoryContainer.style.display = "none"; // Hide it
      }
    });
  }

  function renderComplaints() {
    if (!complaintTracker) return;
    complaintTracker.innerHTML = "";

    if (complaints.length === 0) {
      complaintTracker.innerHTML = "<p>You have no submitted complaints.</p>";
      return;
    }

    complaints.forEach((c) => {
      const statusClass = c.status.toLowerCase().replace(" ", "-");
      const complaintCard = document.createElement("div");
      complaintCard.className = `complaint-card status-${statusClass}`;
      complaintCard.innerHTML = `
                <div class="complaint-card-header">
                  <h4>ID: ${c._id.substring(0, 8)} - ${c.subject}</h4>
                  <button class="delete-complaint-btn" data-id="${c._id}" title="Delete Complaint">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                <p>Category: ${c.category}${c.subCategory ? ` - ${c.subCategory}` : ''}</p>
                <p>Status: <span class="status-badge">${c.status}</span></p>
                <p>Description: ${c.description}</p>
            `;
      complaintTracker.appendChild(complaintCard);
    });
  }

  if (complaintTracker) {
    complaintTracker.addEventListener('click', async (e) => {
      const deleteButton = e.target.closest('.delete-complaint-btn');
      if (deleteButton) {
        const complaintIdToDelete = deleteButton.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this complaint?')) {
          try {
            await api.deleteComplaint(complaintIdToDelete);
            await loadComplaints();
          } catch (error) {
            alert(`Error: ${error.message}`);
          }
        }
      }
    });
  }

  if (complaintForm) {
    complaintForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const category = categorySelect.value;
      const subCategory = subCategorySelect.value || '';

      const complaintData = {
        category: category,
        subCategory: subCategory,
        subject: document.getElementById("title").value,
        description: document.getElementById("description").value,
      };

      try {
        const newComplaint = await api.createComplaint(complaintData);
        alert(`Complaint submitted! Your Complaint ID is ${newComplaint._id.substring(0, 8)}`);
        complaintForm.reset();
        subCategoryContainer.style.display = "none";
        await loadComplaints();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }
  
  // --- Initialize ---
  populateCategories();
  loadComplaints();
});