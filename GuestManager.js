import FindChildren from "./FindChildren";

const guestListInput = document.getElementById('guest-name');
const allDayDiv = document.getElementById('allDay');
const eveningDiv = document.getElementById('evening');
const ceremonyDiv = document.getElementById('ceremony');

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
  export default GuestManager;