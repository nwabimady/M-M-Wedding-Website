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

  export default FindChildren;