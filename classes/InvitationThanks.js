class InvitationThanks {
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

export default InvitationThanks;
