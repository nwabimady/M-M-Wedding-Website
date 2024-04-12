import FindChildren from "./classes/FindChildren";

const guestListInput = document.getElementById('guest-name');
const guestListUl = document.getElementById('guest-list');
const submitButton = document.getElementById('submit-button');
const allDayDiv = document.getElementById('allDay');
const eveningDiv = document.getElementById('evening');
const ceremonyDiv = document.getElementById('ceremony');
const childrenchecklistDiv = document.getElementById('children-checklist');

// Initially hide all divs
allDayDiv.style.display = 'none';
eveningDiv.style.display = 'none';
ceremonyDiv.style.display = 'none';
childrenchecklistDiv.style.display = 'none';

let allGuests = [];

fetch('guests.json')
  .then(response => response.json())
  .then(data => {
    allGuests = data.allDay.concat(data.evening, data.ceremony); // Combine all guest lists
  })
  .catch(error => {
    console.error('Error fetching guest list data:', error);
  });

let currentFocus = 0; // Index of the currently focused suggestion

guestListInput.addEventListener('keyup', function(e) {
  const searchTerm = this.value.toLowerCase();
  const filteredGuests = allGuests.filter(guest => guest.name.toLowerCase().includes(searchTerm));

  guestListUl.innerHTML = ''; // Clear previous results

  // Only show dropdown if at least 3 characters are typed
  if (searchTerm.length >= 3 && filteredGuests.length > 0) {
    const suggestionList = document.createElement('ul');
    suggestionList.classList.add('guest-list'); // Add the CSS class 'guest-list'

    filteredGuests.forEach(guest => {
      const suggestionItem = document.createElement('li');
      suggestionItem.textContent = guest.name;
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
    this.findChildren = new FindChildren(allGuests);
  }

  verifyGuest(guestName) {
    const foundGuest = this.allGuests.find(guest => guest.name.toLowerCase() === guestName.toLowerCase());
    console.log("Found Guest:", foundGuest);
    return !!foundGuest; // Return true if a guest is found
  }

  getGuestType(guestName) {
    const foundGuest = this.allGuests.find(guest => guest.name.toLowerCase() === guestName.toLowerCase());
    return foundGuest?.type; // Return type if found, otherwise undefined
  }
  

  getCeremonyAndEveningGuestType(guestName) {
    const foundGuest = this.allGuests.find(guest => guest.name.toLowerCase() === guestName.toLowerCase());
    return foundGuest?.type || 'Ceremony & Evening';
  }

  getCeremonyGuestType(guestName) {
    const foundGuest = this.allGuests.find(guest => guest.name.toLowerCase() === guestName.toLowerCase());
    return foundGuest?.type || 'Ceremony';
  }

  showGuestInfo(guestType) {
    const rsvpDiv = document.getElementById('rsvp');
    rsvpDiv.style.display = 'none'; // Hide RSVP div after successful submission

    this.hideAllGuestTypeDivs(); // Hide all divs initially

    const lowerCaseGuestType = guestType?.toLowerCase();

    if (lowerCaseGuestType === 'ceremony') {
      ceremonyDiv.style.display = 'block';
    } else if (lowerCaseGuestType === 'evening') {
      eveningDiv.style.display = 'block'; // Show evening information (optional)
    } else if (lowerCaseGuestType === 'all day') {
      allDayDiv.style.display = 'block';
    } else {
      console.error('Guest data has invalid type:', guestType);
    }

    const guestName = guestListInput.value.trim();
    const foundGuest = this.allGuests.find(guest => guest.name.toLowerCase() === guestName.toLowerCase());

    if (foundGuest) {
      const children = this.findChildren.findChildrenForGuest(guestName);

      // Show/Hide Checklist Based on Children Existence
      const childrenchecklistDiv = document.getElementById('children-checklist');
      childrenchecklistDiv.style.display = children.length > 0 ? 'block' : 'none';

      // Optionally call showGuestChildrenInfo to display children's names in a separate element
      this.findChildren.showGuestChildrenInfo(guestName, 'children-names'); // Replace 'children-names' with your target element ID
    }
  }

  hideAllGuestTypeDivs() {
    const allDayDiv = document.getElementById('allDay');
    const eveningDiv = document.getElementById('evening');
    const ceremonyDiv = document.getElementById('ceremony');

    allDayDiv.style.display = 'none';
    eveningDiv.style.display = 'none';
    ceremonyDiv.style.display = 'none';

    // Hide childrenchecklistDiv as well
    const childrenchecklistDiv = document.getElementById('children-checklist');
    childrenchecklistDiv.style.display = 'none';
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

