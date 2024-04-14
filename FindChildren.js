class FindChildren {
    constructor(allGuests) {
      this.allGuests = allGuests;
    }
  
    // Method to find children for a specific guest
    findChildrenForGuest(guestName) {
      const foundGuest = this.allGuests.find(guest => guest.name.toLowerCase() === guestName.toLowerCase());
      if (foundGuest) {
        // Extract children's names from the guest data (assuming 'children' property)
        const children = foundGuest.children?.split(' & ') || []; // Split by '&' (adjust delimiter if needed)
        return children.map(childName => childName.trim()); // Remove leading/trailing spaces
      } else {
        return []; // Return empty array if guest not found
      }
    }
  
    showGuestChildrenInfo(guestName, targetElementId) {
      const children = this.findChildrenForGuest(guestName);
      const targetElement = document.getElementById(targetElementId);
  
      if (targetElement) {
        if (children.length > 0) {
          // Update target element content to display children's names (replace with your desired formatting)
          targetElement.textContent = ` ${children.join(', ')}`;
          targetElement.style.display = 'block'; // Show the element
        } else {
          targetElement.textContent = 'This guest does not have any children registered.';
          targetElement.style.display = 'block'; // Show the element (optional)
        }
      } else {
        console.error(`Target element with ID "${targetElementId}" not found.`);
      }
    }
  }

  export default FindChildren;