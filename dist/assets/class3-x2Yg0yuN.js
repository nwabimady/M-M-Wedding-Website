import { F as c } from "./class2-CSisn1Kv.js";
const r = document.getElementById("guest-name"),
  d = document.getElementById("allDay"),
  a = document.getElementById("evening"),
  y = document.getElementById("ceremony");
class v {
  constructor(t) {
    (this.allGuests = t), (this.findChildren = new c(t));
  }
  verifyGuest(t) {
    const e = this.allGuests.find(
      (n) => n.name.toLowerCase() === t.toLowerCase()
    );
    return console.log("Found Guest:", e), !!e;
  }
  getGuestType(t) {
    const e = this.allGuests.find(
      (n) => n.name.toLowerCase() === t.toLowerCase()
    );
    return e == null ? void 0 : e.type;
  }
  getCeremonyAndEveningGuestType(t) {
    const e = this.allGuests.find(
      (n) => n.name.toLowerCase() === t.toLowerCase()
    );
    return (e == null ? void 0 : e.type) || "Ceremony & Evening";
  }
  getCeremonyGuestType(t) {
    const e = this.allGuests.find(
      (n) => n.name.toLowerCase() === t.toLowerCase()
    );
    return (e == null ? void 0 : e.type) || "Ceremony";
  }
  showGuestInfo(t) {
    const e = document.getElementById("rsvp");
    (e.style.display = "none"), this.hideAllGuestTypeDivs();
    const n = t == null ? void 0 : t.toLowerCase();
    if (
      (n === "ceremony"
        ? (y.style.display = "block")
        : n === "evening"
        ? (a.style.display = "block")
        : n === "all day"
        ? (d.style.display = "block")
        : console.error("Guest data has invalid type:", t),
      document.querySelector(".container.block"))
    ) {
      const s = r.value.trim();
      if (
        this.allGuests.find((o) => o.name.toLowerCase() === s.toLowerCase())
      ) {
        const o = this.findChildren.findChildrenForGuest(s),
          i = document.getElementById("children-checklist");
        (i.style.display = o.length > 0 ? "block" : "none"),
          this.findChildren.showGuestChildrenInfo(s, "children-names");
      }
    }
  }
  hideAllGuestTypeDivs() {
    const t = document.getElementById("allDay"),
      e = document.getElementById("evening"),
      n = document.getElementById("ceremony");
    (t.style.display = "none"),
      (e.style.display = "none"),
      (n.style.display = "none");
    const l = document.getElementById("children-checklist");
    l.style.display = "none";
  }
}
export { v as G };
