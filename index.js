const guestListInput = document.getElementById('guest-name');
const guestListUl = document.getElementById('guest-list');
const submitButton = document.getElementById('submit-button');
const allDayDiv = document.getElementById('allDay');
const eveningDiv = document.getElementById('evening');
const ceremonyDiv = document.getElementById('ceremony');
const childrenchecklistDiv = document.getElementById('children-checklist');

allDayDiv.style.display = 'none';
eveningDiv.style.display = 'none';
ceremonyDiv.style.display = 'none';
childrenchecklistDiv.style.display = 'none';

let allGuests = [];

fetch('guests.json')
  .then(response => response.json())
  .then(data => {
    allGuests = data.allDay.concat(data.evening, data.ceremony);
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
    const suggestionList = document.createElement('div');
    suggestionList.classList.add('guest-list'); // Add the CSS class 'guest-list'

    filteredGuests.forEach(guest => {
      const suggestionItem = document.createElement('p');
      suggestionItem.textContent = guest.name;
      suggestionItem.addEventListener('click', function() {
        guestListInput.value = this.textContent;
        closeAllSuggestions(); // Close list on selection
      });
      suggestionList.appendChild(suggestionItem);
    });
    guestListUl.appendChild(suggestionList);
  } else {
    guestListUl.textContent = searchTerm.length < 3 ? 'Type at least 3 characters. Select your name from the list below.' : 'No matches found.';
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
      const selectedSuggestion = suggestionList.querySelector('p.active');
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
  const suggestions = suggestionList.querySelectorAll('p');
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

class FindChildren {
  constructor(allGuests) {
    this.allGuests = allGuests;
  }

  findChildrenForGuest(guestName) {
    const foundGuest = this.allGuests.find(guest => guest.name.toLowerCase() === guestName.toLowerCase());
    if (foundGuest) {

      const children = foundGuest.children?.split(' & ') || [];
      return children.map(childName => childName.trim()); 
    } else {
      return [];
    }
  }

  showGuestChildrenInfo(guestName, targetElementId) {
    const children = this.findChildrenForGuest(guestName);
    const targetElement = document.getElementById(targetElementId);

    if (targetElement) {
      if (children.length > 0) {
       
        targetElement.textContent = ` ${children.join(', ')}`;
        targetElement.style.display = 'block';
      } else {
        targetElement.textContent = 'This guest does not have any children registered.';
        targetElement.style.display = 'block'; 
      }
    } else {
      console.error(`Target element with ID "${targetElementId}" not found.`);
    }
  }
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
      return foundGuest?.type; 
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
        rsvpDiv.style.display = 'none';
      
        this.hideAllGuestTypeDivs();
      
        const lowerCaseGuestType = guestType?.toLowerCase();
      
        if (lowerCaseGuestType === 'ceremony') {
          ceremonyDiv.style.display = 'block';
        } else if (lowerCaseGuestType === 'evening') {
          eveningDiv.style.display = 'block';
        } else if (lowerCaseGuestType === 'all day') {
          allDayDiv.style.display = 'block';
        } else {
          console.error('Guest data has invalid type:', guestType);
        }
      
        const currentGuestTypeDiv = document.querySelector('.container.block');  // Assuming 'block' class is added on click
      
        if (currentGuestTypeDiv) {      
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

/* class InvitationThanks {
  constructor(allGuests) {
    this.allGuests = allGuests;
    this.thanksDiv = document.getElementById("thanks");
    this.otherDivs = document.querySelectorAll(".container:not(#thanks)");
    this.addClickEventListener();
  }

  addClickEventListener() {
    const rsvpButtons = document.querySelectorAll('#rsvp-button');
    rsvpButtons.forEach(button => {
      button.addEventListener("click", this.showThanks.bind(this));
    });
    if (rsvpButtons.length === 0) {
      console.log ("rsvp-button not found.")
    }
  }

  showThanks() {
    this.thanksDiv.style.display = "block";
    this.otherDivs.forEach((div) => (div.style.display = "none"));
  }
}
new InvitationThanks(); */


class RsvpManager {
  constructor() {
    // DOM element references
    this.guestNameInput = document.getElementById('guest-name');
    this.rsvpListDiv = document.getElementById('rsvp-list');
    this.rsvpDiv = document.getElementById('rsvp');

    // Event listener for guest name input
    this.guestNameInput.addEventListener('keyup', this.handleGuestNameInput.bind(this));
  }

  handleGuestNameInput(event) {
    const guestName = event.target.value.trim();
    if (guestName === 'Admin') {
      this.rsvpListDiv.style.display = 'block';
      this.rsvpDiv.style.display = 'none';
    } else {
      this.rsvpListDiv.style.display = 'none';
      this.rsvpDiv.style.display = 'block';
    }
  }

  async handleRsvp() {
    const guestName = this.guestNameInput.value.trim();
    const password = this.passwordInput.value.trim(); // Get password value

    // Check for admin or regular guest
    if (guestName.toLowerCase() === "admin") {
      const isAdmin = await this.verifyAdmin(password); // Verify admin with password
      if (isAdmin) {
        this.showRsvpManager();
        return; // Skip further processing for verified admin
      } else {
        alert("Invalid password for admin login.");
        return; // Prevent further processing if password is wrong
      }
    }
  }

  async verifyAdmin(password) {
    try {
      const response = await fetch("guests.json"); // Fetch guests data
      const guestsData = await response.json();

      if (guestsData && guestsData.admin && guestsData.admin.length > 0) {
        const admin = guestsData.admin[0];
        return admin.password === password; // Check password against fetched data
      } else {
        console.error(
          "Error fetching or processing admin data from guests.json"
        );
        return false;
      }
    } catch (error) {
      console.error("Error fetching guests.json:", error);
      return false;
    }
  }

  showRsvpManager() {
    // Hide any other divs
    const allDivs = document.querySelectorAll("div");
    for (const div of allDivs) {
      if (div !== this.rsvpListDiv) {
        div.style.display = "none";
      }
    }

    // Show RSVP list div
    this.rsvpListDiv.style.display = "block";

    // Override fetch guests.json on submit for admin
    this.submitButton.addEventListener("click", () => {
      // Implement logic to handle admin submission (e.g., edit data, etc.)
      console.log("Admin submission"); // Placeholder for admin functionality
    });
  }

  handleRsvp() {
    const guestName = this.guestNameInput.value.trim();
  
    // Limit to 1 guest per submission and prevent resubmission
    if (!guestName || this.rsvpData.length > 0) {
      return;
    }
  
    // Collect RSVP data
    const rsvpData = this.collectRsvpData();
    rsvpData.rsvpStatus = 'Yes';
    this.rsvpData.push(rsvpData);
  
    const tableId = this.getSelectedTable();
  
    this.populateTable(rsvpData, tableId);
  
    this.clearGuestInput();
  
    this.updateTotals(rsvpData);
  
    const selectedCheckBoxes = document.querySelectorAll('.delete-checkbox:checked');
    if (selectedCheckBoxes.length > 0) {
      console.log('Selected guests for deletion:', selectedCheckBoxes);
    }
  }  
}
new RsvpManager();

function scrollToTop() {
  document.getElementById("submit-button").addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

scrollToTop();

