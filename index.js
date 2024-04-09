const guestListInput = document.getElementById('guest-name');
const guestListUl = document.getElementById('guest-list');
const submitButton = document.getElementById('submit-button');

let allGuests = []; // Array to store all guests from JSON

fetch('guests.json')
  .then(response => response.json())
  .then(data => {
    allGuests = data.allDay.concat(data.ceremonyAndEvening, data.reception); // Combine all guest lists
  })
  .catch(error => {
    console.error('Error fetching guest list data:', error);
  });

let currentFocus = 0; // Index of the currently focused suggestion

guestListInput.addEventListener('keyup', function(e) {
  const inputValue = this.value.toLowerCase();
  const inputLength = inputValue.length;
  closeAllSuggestions(); // Close any previous suggestions

  if (!inputValue) {
    return; // No input, no suggestions
  }

  const suggestions = allGuests.filter(guest => guest.toLowerCase().startsWith(inputValue));

  if (suggestions.length > 0) {
    createSuggestionList(suggestions);
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

function createSuggestionList(suggestions) {
  const suggestionList = document.createElement('ul');
  suggestionList.id = "suggestions";
  currentFocus = 0;

  suggestions.forEach(guest => {
    const suggestionItem = document.createElement('li');
    suggestionItem.textContent = guest;
    suggestionItem.addEventListener('click', function() {
      guestListInput.value = this.textContent;
      currentFocus = 0;
      closeAllSuggestions();
    });
    suggestionList.appendChild(suggestionItem);
  });

  guestListUl.parentNode.insertBefore(suggestionList, guestListUl.nextSibling); // Insert after the guest list element
}

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
