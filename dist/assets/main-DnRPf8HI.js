import { I as d } from "./class1-EWktIZu5.js";
import { G as m } from "./class3-x2Yg0yuN.js";
import "./class2-CSisn1Kv.js";
const i = document.getElementById("guest-name"),
  l = document.getElementById("guest-list"),
  y = document.getElementById("submit-button"),
  f = document.getElementById("allDay"),
  v = document.getElementById("evening"),
  h = document.getElementById("ceremony"),
  E = document.getElementById("children-checklist");
f.style.display = "none";
v.style.display = "none";
h.style.display = "none";
E.style.display = "none";
let u = [];
fetch("guests.json")
  .then((e) => e.json())
  .then((e) => {
    u = e.allDay.concat(e.evening, e.ceremony);
  })
  .catch((e) => {
    console.error("Error fetching guest list data:", e);
  });
let o = 0;
i.addEventListener("keyup", function (e) {
  const t = this.value.toLowerCase(),
    n = u.filter((s) => s.name.toLowerCase().includes(t));
  if (((l.innerHTML = ""), t.length >= 3 && n.length > 0)) {
    const s = document.createElement("ul");
    s.classList.add("guest-list"),
      n.forEach((g) => {
        const c = document.createElement("li");
        (c.textContent = g.name),
          c.addEventListener("click", function () {
            (i.value = this.textContent), r();
          }),
          s.appendChild(c);
      }),
      l.appendChild(s);
  } else l.textContent = t.length < 3 ? "Type at least 3 characters" : "No matches found.";
});
i.addEventListener("keydown", function (e) {
  const t = e.keyCode,
    n = document.getElementById("suggestions");
  if (n) {
    if (t === 40) o++, a(o);
    else if (t === 38) o--, a(o);
    else if (t === 13) {
      const s = n.querySelector("li.active");
      s && ((i.value = s.textContent), (o = 0), r());
    }
  }
});
function a(e) {
  const n = document.getElementById("suggestions").querySelectorAll("li");
  n && (p(n), e >= 0 && e < n.length && n[e].classList.add("active"));
}
function p(e) {
  e.forEach((t) => t.classList.remove("active"));
}
function r() {
  const e = document.getElementById("suggestions");
  e && e.parentNode.removeChild(e);
}
y.addEventListener("click", function () {
  const e = i.value.trim();
  if (!e) {
    alert("Please enter your name.");
    return;
  }
  const t = new m(u);
  if (t.verifyGuest(e)) {
    const n = t.getGuestType(e);
    t.showGuestInfo(n);
  } else alert("Sorry, guest not found.");
});
new d();
new RsvpManager();
