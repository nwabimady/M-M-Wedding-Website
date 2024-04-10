export default class InvitationManager {
    constructor(guestListInput, guestListUl, submitButton) {
      this.guestListInput = guestListInput;
      this.guestListUl = guestListUl;
      this.submitButton = submitButton;
      this.allGuests = [];
  
      this.fetchGuestList();
      this.addSubmitButtonClickListener();
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
  
    addSubmitButtonClickListener() {
      this.submitButton.addEventListener('click', this.handleButtonClick.bind(this));
    }
  
    handleButtonClick() {
      const guestName = this.guestListInput.value.trim();
  
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
      this.redirectToGuestPage(guestData.type);
    }
  
    redirectToGuestPage(guestType) {
      let redirectUrl;
      switch (guestType) {
        case 'All Day':
          redirectUrl = 'allDay.html'; // Assuming allDay.html handles all day guests
          break;
        case 'Ceremony & Evening':
          redirectUrl = 'ceremonyAndEvening.html'; // Assuming ceremonyAndEvening.html handles ceremony & evening guests
          break;
        case 'Ceremony':
          redirectUrl = 'ceremony.html'; // Assuming ceremony.html handles ceremony guests
          break;
        default:
          console.error('Guest data has invalid type:', guestType);
      }
  
      if (redirectUrl) {
        window.location.href = redirectUrl;
        this.guestListInput.value = ''; // Clear input field after successful RSVP
      }
    }
  }
  