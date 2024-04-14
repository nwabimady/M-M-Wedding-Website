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
    this.rsvpData.push(rsvpData); // Add data to array

    // Determine selected table ID (implementation needed)
    const tableId = this.getSelectedTable();

    // Populate the table with the RSVP data
    this.populateTable(rsvpData, tableId);

    // Clear guest input field
    this.clearGuestInput();

    // Update totals
    this.updateTotals(rsvpData);
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
    const tableRow = document.createElement("tr");

    // Create table cells and populate with data
    tableRow.innerHTML = `
      <td>${rsvpData.guestName}</td>
      <td>${rsvpData.guestType}</td>
      <td>${rsvpData.attendingChildren ? "Yes" : "No"}</td>
      <td>${rsvpData.dietaryRequirements}</td>
      <td>
        <input type="checkbox" class="delete-checkbox">
        <label for="delete-checkbox"></label>
      </td>
    `;

    tableBody.appendChild(tableRow);

    // Add click event listener for the label (to simulate checkbox click)
    tableRow
      .querySelector(".delete-checkbox + label")
      .addEventListener("click", () => {
        this.deleteRsvpEntry(rsvpData, tableId);
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
