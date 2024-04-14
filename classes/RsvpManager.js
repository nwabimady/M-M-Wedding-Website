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

  collectRsvpData() {
    // Extract data from relevant DOM elements
    const guestType = this.getSelectedType(); // Implement logic to get selected type (e.g., radio buttons)
    const attendingChildren = this.isAttendingChildrenChecked();
    const dietaryRequirements = document.getElementById(
      "dietary-requirements"
    ).value;
    return { guestName, guestType, attendingChildren, dietaryRequirements };
  }

  populateTable(rsvpData, tableId) {
    const tableBody = document.getElementById(`${tableId}-body`);
    const tableRow = document.createElement('tr');
    const cellColor = rsvpData.rsvpStatus === 'Yes' ? 'green' : 'gray';  
  
    let rsvpDate = rsvpData.rsvpDate;
    if (rsvpDate) {
      // Ensure rsvpDate is a Date object
      if (!(rsvpDate instanceof Date)) {
        rsvpDate = new Date(rsvpDate);
      }
      // Format the date as 'dd mm yyyy'
      const day = String(rsvpDate.getDate()).padStart(2, '0');
      const month = String(rsvpDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
      const year = rsvpDate.getFullYear();
      rsvpDate = `${day} ${month} ${year}`;
    }  

    tableRow.innerHTML = `
      <td style="color: ${cellColor}">${rsvpData.rsvpStatus ? "Yes" : "No"}</td>
      <td style="color: ${cellColor}">${rsvpData.name || ''}</td>
      <td style="color: ${cellColor}">${rsvpData.type || ''}</td>
      <td style="color: ${cellColor}">${rsvpData.attendingChildren ? "Yes" : "No"}</td>
      <td style="color: ${cellColor}">${rsvpData.children || ''}</td>
      <td style="color: ${cellColor}">${rsvpData.dietaryRequirements || ''}</td>
      <td style="color: ${cellColor}">${rsvpData.ceremony ? "Yes" : "No"}</td>
      <td style="color: ${cellColor}">${rsvpData.reception ? "Yes" : "No"}</td>
      <td style="color: ${cellColor}">${rsvpData.evening ? "Yes" : "No"}</td>
      <td style="color: ${cellColor}">${rsvpData.rsvpDate || ''}</td> 
      <td><input type="checkbox" class="delete-checkbox"></td>
    `;
    tableBody.appendChild(tableRow);
  
    tableRow.querySelector(".delete-checkbox").addEventListener("click", function() {
      // Check if RSVP status is 'Yes'
      const rsvpStatusCell = this.parentNode.parentNode.querySelector('td:first-child');
      if (rsvpStatusCell.textContent.trim() === 'Yes') {
        // Ask the user to confirm the deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this row?');
        if (confirmDelete) {
          // Delete the row
          this.parentNode.parentNode.remove();
        }
      }
    });
  }
  
  clearGuestInput() {
    this.guestNameInput.value = "";
  }

  getSelectedTable() {
    // Replace with your implementation to determine the selected table ID based on user input
    // (e.g., radio buttons, dropdown)
    return "";
  }

  isAttendingChildrenChecked() {
    return document.getElementById("children-yes").checked;
  }

  deleteRsvpEntry(rsvpData, tableId) {
    const tableBody = document.getElementById(`${tableId}-body`);
    const rows = tableBody.querySelectorAll("tr");

    // Find the row to delete based on guest name
    for (const row of rows) {
      if (row.querySelector("td").textContent === rsvpData.guestName) {
        row.remove();
        this.rsvpData = this.rsvpData.filter(
          (data) => data.guestName !== rsvpData.guestName
        ); // Remove data from array
        this.updateTotals({
          ...rsvpData,
          attendingChildren: -rsvpData.attendingChildren,
        }); // Update totals with negative values for deletion
        break;
      }
    }
  }

  // Update the totals displayed on the page (implement logic to update HTML elements)
  updateTotals(rsvpData) {
    this.totalCounts.guests++;
    this.totalCounts.attendingChildren += rsvpData.attendingChildren ? 1 : 0;

    // Update the totals displayed on the page
    document.getElementById("total-guests").textContent =
      this.totalCounts.guests;
    document.getElementById("total-attending-children").textContent =
      this.totalCounts.attendingChildren;
  }
}

// Export the RsvpManager class as the default module
export default RsvpManager;
