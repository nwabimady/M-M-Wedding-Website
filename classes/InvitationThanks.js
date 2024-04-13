class InvitationThanks {
    constructor(allGuests) {
        this.allGuests = allGuests;
      this.thanksDiv = document.getElementById('thanks');
      this.otherDivs = document.querySelectorAll('.container:not(#thanks)'); // Selects all containers except thanks
      this.addClickEventListener();
    }
  
    addClickEventListener() {
      const rsvpButton = document.getElementById('rsvp-button');
      if (rsvpButton) {
        rsvpButton.addEventListener('click', this.showThanks.bind(this));
      } else {
        console.error('RSVP button not found in GuestManager');
      }
    }
  
    showThanks() {
      this.thanksDiv.style.display = 'block';
      this.otherDivs.forEach(div => div.style.display = 'none');
    }
  }
  
  export default InvitationThanks;  