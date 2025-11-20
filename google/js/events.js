import { getStorageItem } from './storage.js';
import { STORAGE_KEYS } from './config.js';
import { api } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = getStorageItem(STORAGE_KEYS.LOGGED_IN_USER);
  if (!loggedInUser) return;

  // --- ELEMENTS ---
  const eventsContainer = document.getElementById("events-container");
  const addEventContainer = document.getElementById("add-event-container");
  const modal = document.getElementById("event-modal");
  const modalTitle = document.getElementById("modal-title");
  const eventForm = document.getElementById("event-form");
  const cancelBtn = document.getElementById("cancel-event-btn");
  const eventIdInput = document.getElementById("event-id");

  // --- DATA MANAGEMENT ---
  let events = [];

  const loadEvents = async () => {
    try {
      events = await api.getEvents();
      renderEvents();
    } catch (error) {
      console.error('Error loading events:', error);
      events = [];
      renderEvents();
    }
  };

  // --- RENDER EVENTS ---
  function renderEvents() {
    if (!eventsContainer) return;
    eventsContainer.innerHTML = "";

    if (events.length === 0) {
      eventsContainer.innerHTML =
        "<p>There are no upcoming events scheduled.</p>";
      return;
    }

    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    events.forEach((event) => {
      const card = document.createElement("div");
      card.className = "profile-card event-card"; // Reusing profile-card style

      // Show edit/delete buttons only if the logged-in user is the one who created it or is faculty
      const isOwner = loggedInUser.username === event.createdBy || loggedInUser.role === 'faculty';
      const actionButtons = isOwner
        ? `
            <div class="event-actions">
                <button class="edit-event-btn" data-id="${event._id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-event-btn" data-id="${event._id}"><i class="fas fa-trash"></i> Delete</button>
            </div>`
        : "";

     card.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${new Date(
          event.date
        ).toLocaleDateString()}${event.time ? ` at ${event.time}` : ''}</p>
        ${event.location ? `<p><strong>Venue:</strong> ${event.location}</p>` : ''}
        <p><strong>Organizer:</strong> ${event.organizer}</p>
        <p>${event.description}</p>
        <p class="event-creator">Posted by: ${event.createdBy}</p>
        ${actionButtons}
      `;
      eventsContainer.appendChild(card);
    });
  }

  // --- UI SETUP ---
  function setupUI() {
    // Show the "Add Event" button if any user is logged in
    if (loggedInUser && addEventContainer) {
      const addEventBtn = document.createElement("button");
      addEventBtn.className = "profile-action-btn";
      addEventBtn.textContent = "Add New Event";
      addEventBtn.addEventListener("click", () => openModal());
      addEventContainer.appendChild(addEventBtn);
    }
  }
  // --- MODAL HANDLING ---
  function openModal(event = null) {
    eventForm.reset();
    if (event) {
      // Editing mode
      modalTitle.textContent = "Edit Event";
      eventIdInput.value = event._id;
      document.getElementById("event-title").value = event.title;
      document.getElementById("event-description").value = event.description;
      document.getElementById("event-date").value = new Date(event.date).toISOString().split('T')[0];
      document.getElementById("event-time").value = event.time || '';
      document.getElementById("event-venue").value = event.location || '';
      document.getElementById("event-organizer").value = event.organizer;
    } else {
      // Adding mode
      modalTitle.textContent = "Add New Event";
      eventIdInput.value = "";
    }
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  // --- FORM SUBMISSION ---
  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const eventData = {
        title: document.getElementById("event-title").value,
        description: document.getElementById("event-description").value,
        date: document.getElementById("event-date").value,
        time: document.getElementById("event-time").value,
        location: document.getElementById("event-venue").value,
        organizer: document.getElementById("event-organizer").value,
      };

      try {
        if (eventIdInput.value) {
          // Update existing event
          await api.updateEvent(eventIdInput.value, eventData);
        } else {
          // Add new event
          await api.createEvent(eventData);
        }
        await loadEvents();
        closeModal();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }

  // --- EVENT DELEGATION FOR EDIT/DELETE ---
  if (eventsContainer) {
    eventsContainer.addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".edit-event-btn");
      const deleteBtn = e.target.closest(".delete-event-btn");

      if (editBtn) {
        const eventId = editBtn.dataset.id;
        const eventToEdit = events.find((event) => event._id === eventId);
        if (eventToEdit) {
          openModal(eventToEdit);
        }
      }

      if (deleteBtn) {
        if (confirm("Are you sure you want to delete this event?")) {
          try {
            const eventId = deleteBtn.dataset.id;
            await api.deleteEvent(eventId);
            await loadEvents();
          } catch (error) {
            alert(`Error: ${error.message}`);
          }
        }
      }
    });
  }

  // --- INITIALIZATION ---
  setupUI();
  loadEvents();
});