export default class InvitationManager {
    constructor(submitButton) {
      this.submitButton = submitButton;
      this.allGuests = [];
  
      this.submitButton.addEventListener('click', this.handleButtonClick.bind(this));
      this.fetchGuestList();
    }
  
    fetchGuestList() {
      fetch('guests.json')
        .then(response => response.json())
        .then(data => {
          this.allGuests = data.allDay.concat(data.ceremonyAndEvening, data.ceremony); // Combine all guest lists
        })
        .catch(error => {
          console.error('Error fetching guest list data:', error);
        });
    }
  
    handleButtonClick() {
      const guestName = document.getElementById('guest-name').value.trim();
  
      if (!guestName) {
        alert('Please enter your name.');
        return;
      }
  
      const guestFound = this.allGuests.some(guest => guest.toLowerCase() === guestName.toLowerCase());
  
      if (!guestFound) {
        alert('Sorry, guest not found.');
        return;
      }
  
      const guestData = this.allGuests.find(guest => guest.toLowerCase() === guestName.toLowerCase());
      this.showGuestPage(guestData.type);
    }
  
    showGuestPage(guestType) {
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
          console.error('Guest data has invalid type:', guestType);
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
  