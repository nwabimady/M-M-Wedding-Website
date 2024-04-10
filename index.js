const guestListInput = document.getElementById('guest-name');
const guestListUl = document.getElementById('guest-list');
const submitButton = document.getElementById('submit-button');
const allDayDiv = document.getElementById('allDay');
const ceremonyAndEveningDiv = document.getElementById('ceremonyAndEvening');
const ceremonyDiv = document.getElementById('ceremony');

// Initially hide all divs
allDayDiv.style.display = 'none';
ceremonyAndEveningDiv.style.display = 'none';
ceremonyDiv.style.display = 'none';

let allGuests = []; // Array to store all guests from JSON

fetch('guests.json')
  .then(response => response.json())
  .then(data => {
    allGuests = data.allDay.concat(data.ceremonyAndEvening, data.ceremony); // Combine all guest lists
  })
  .catch(error => {
    console.error('Error fetching guest list data:', error);
  });

let currentFocus = 0; // Index of the currently focused suggestion

guestListInput.addEventListener('keyup', function(e) {
  const searchTerm = this.value.toLowerCase();
  const filteredGuests = allGuests.filter(guest => guest.toLowerCase().includes(searchTerm));

  guestListUl.innerHTML = ''; // Clear previous results

  // Only show dropdown if at least 3 characters are typed
  if (searchTerm.length >= 3 && filteredGuests.length > 0) {
    const suggestionList = document.createElement('ul');
    suggestionList.classList.add('guest-list'); // Add the CSS class 'guest-list'

    filteredGuests.forEach(guest => {
      const suggestionItem = document.createElement('li');
      suggestionItem.textContent = guest;
      suggestionItem.addEventListener('click', function() {
        guestListInput.value = this.textContent;
        closeAllSuggestions(); // Close list on selection
      });
      suggestionList.appendChild(suggestionItem);
    });
    guestListUl.appendChild(suggestionList);
  } else {
    guestListUl.textContent = searchTerm.length < 3 ? 'Type at least 3 characters' : 'No matches found.';
  }
});

guestListInput.addEventListener('keydown', function(e) {
  const keyCode = e.keyCode;
  const suggestionList = document.getElementById("suggestions");

  if (suggestionList) {
    // Handle up/down arrows and Enter key for selecting suggestions
    if (keyCode === 40) { // Down arrow
      currentFocus++;
      setActiveSuggestion(currentFocus);
    } else if (keyCode === 38) { // Up arrow
      currentFocus--;
      setActiveSuggestion(currentFocus);
    } else if (keyCode === 13) { // Enter key
      const selectedSuggestion = suggestionList.querySelector('li.active');
      if (selectedSuggestion) {
        guestListInput.value = selectedSuggestion.textContent;
        currentFocus = 0;
        closeAllSuggestions();
      }
    }
  }
});

function setActiveSuggestion(suggestionIndex) {
  const suggestionList = document.getElementById("suggestions");
  const suggestions = suggestionList.querySelectorAll('li');
  if (!suggestions) return;

  removeActiveClass(suggestions);

  if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
    suggestions[suggestionIndex].classList.add('active');
  }
}

function removeActiveClass(suggestions) {
  suggestions.forEach(suggestion => suggestion.classList.remove('active'));
}

function closeAllSuggestions() {
  const suggestionList = document.getElementById("suggestions");
  if (suggestionList) suggestionList.parentNode.removeChild(suggestionList);
}

class GuestManager {
  constructor(allGuests) {
    this.allGuests = allGuests;
  }

  verifyGuest(guestName) {
    return this.allGuests.some(guest => guest.toLowerCase() === guestName.toLowerCase());
  }

  getGuestType(guestName) {
    return this.allGuests.find(guest => guest.toLowerCase() === guestName.toLowerCase())?.type || 'ceremony';
  }

  showGuestInfo(guestType) {
    const rsvpDiv = document.getElementById('rsvp');
    rsvpDiv.style.display = 'none'; // Hide RSVP div after successful submission
  
    const allDayDiv = document.getElementById('allDay');
    const ceremonyAndEveningDiv = document.getElementById('ceremonyAndEvening');
    const ceremonyDiv = document.getElementById('ceremony');
  
    this.hideAllGuestTypeDivs(); // Hide all divs initially
  
    switch (guestType) {
      case 'All Day':
        allDayDiv.style.display = 'block';
        break;
      case 'Ceremony & Evening':
        ceremonyAndEveningDiv.style.display = 'block';
        break;
      case 'Ceremony':
        ceremonyDiv.style.display = 'block';
        break;
      default:
        console.error('Guest data has invalid type:', guestType?.type);
        
    }
  }
  
  hideAllGuestTypeDivs() {
    const allDayDiv = document.getElementById('allDay');
    const ceremonyAndEveningDiv = document.getElementById('ceremonyAndEvening');
    const ceremonyDiv = document.getElementById('ceremony');

    allDayDiv.style.display = 'none';
    ceremonyAndEveningDiv.style.display = 'none';
    ceremonyDiv.style.display = 'none';
  }
}
submitButton.addEventListener('click', function() {
  const guestName = guestListInput.value.trim();

  if (!guestName) {
    alert('Please enter your name.');
    return;
  }

  const guestManager = new GuestManager(allGuests); // Create a GuestManager instance

  if (guestManager.verifyGuest(guestName)) {
    const guestType = guestManager.getGuestType(guestName);
    guestManager.showGuestInfo(guestType); // Call showGuestInfo
  } else {
    alert('Sorry, guest not found.');
  }
});
