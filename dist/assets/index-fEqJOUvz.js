(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const i of s)
      if (i.type === "childList")
        for (const r of i.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && n(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(s) {
    const i = {};
    return (
      s.integrity && (i.integrity = s.integrity),
      s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const i = t(s);
    fetch(s.href, i);
  }
})();
class g {
  constructor(e) {
    (this.allGuests = e),
      (this.thanksDiv = document.getElementById("thanks")),
      (this.otherDivs = document.querySelectorAll(".container:not(#thanks)")),
      this.addClickEventListener();
  }
  addClickEventListener() {
    const e = document.querySelectorAll("#rsvp-button");
    e.forEach((t) => {
      t.addEventListener("click", this.showThanks.bind(this));
    }),
      e.length === 0 && console.log("rsvp-button not found.");
  }
  showThanks() {
    (this.thanksDiv.style.display = "block"),
      this.otherDivs.forEach((e) => (e.style.display = "none"));
  }
}
class f {
  constructor(e) {
    this.allGuests = e;
  }
  findChildrenForGuest(e) {
    var n;
    const t = this.allGuests.find(
      (s) => s.name.toLowerCase() === e.toLowerCase()
    );
    return t
      ? (((n = t.children) == null ? void 0 : n.split(" & ")) || []).map((i) =>
          i.trim()
        )
      : [];
  }
  showGuestChildrenInfo(e, t) {
    const n = this.findChildrenForGuest(e),
      s = document.getElementById(t);
    s
      ? n.length > 0
        ? ((s.textContent = ` ${n.join(", ")}`), (s.style.display = "block"))
        : ((s.textContent =
            "This guest does not have any children registered."),
          (s.style.display = "block"))
      : console.error(`Target element with ID "${t}" not found.`);
  }
}
const v = document.getElementById("guest-name"),
  p = document.getElementById("allDay"),
  C = document.getElementById("evening"),
  E = document.getElementById("ceremony");
class L {
  constructor(e) {
    (this.allGuests = e), (this.findChildren = new f(e));
  }
  verifyGuest(e) {
    const t = this.allGuests.find(
      (n) => n.name.toLowerCase() === e.toLowerCase()
    );
    return console.log("Found Guest:", t), !!t;
  }
  getGuestType(e) {
    const t = this.allGuests.find(
      (n) => n.name.toLowerCase() === e.toLowerCase()
    );
    return t == null ? void 0 : t.type;
  }
  getCeremonyAndEveningGuestType(e) {
    const t = this.allGuests.find(
      (n) => n.name.toLowerCase() === e.toLowerCase()
    );
    return (t == null ? void 0 : t.type) || "Ceremony & Evening";
  }
  getCeremonyGuestType(e) {
    const t = this.allGuests.find(
      (n) => n.name.toLowerCase() === e.toLowerCase()
    );
    return (t == null ? void 0 : t.type) || "Ceremony";
  }
  showGuestInfo(e) {
    const t = document.getElementById("rsvp");
    (t.style.display = "none"), this.hideAllGuestTypeDivs();
    const n = e == null ? void 0 : e.toLowerCase();
    if (
      (n === "ceremony"
        ? (E.style.display = "block")
        : n === "evening"
        ? (C.style.display = "block")
        : n === "all day"
        ? (p.style.display = "block")
        : console.error("Guest data has invalid type:", e),
      document.querySelector(".container.block"))
    ) {
      const i = v.value.trim();
      if (
        this.allGuests.find((d) => d.name.toLowerCase() === i.toLowerCase())
      ) {
        const d = this.findChildren.findChildrenForGuest(i),
          h = document.getElementById("children-checklist");
        (h.style.display = d.length > 0 ? "block" : "none"),
          this.findChildren.showGuestChildrenInfo(i, "children-names");
      }
    }
  }
  hideAllGuestTypeDivs() {
    const e = document.getElementById("allDay"),
      t = document.getElementById("evening"),
      n = document.getElementById("ceremony");
    (e.style.display = "none"),
      (t.style.display = "none"),
      (n.style.display = "none");
    const s = document.getElementById("children-checklist");
    s.style.display = "none";
  }
}
const c = document.getElementById("guest-name"),
  u = document.getElementById("guest-list"),
  G = document.getElementById("submit-button"),
  D = document.getElementById("allDay"),
  I = document.getElementById("evening"),
  w = document.getElementById("ceremony"),
  k = document.getElementById("children-checklist");
D.style.display = "none";
I.style.display = "none";
w.style.display = "none";
k.style.display = "none";
let a = [];
fetch("guests.json")
  .then((o) => o.json())
  .then((o) => {
    a = o.allDay.concat(o.evening, o.ceremony);
  })
  .catch((o) => {
    console.error("Error fetching guest list data:", o);
  });
let l = 0;
c.addEventListener("keyup", function (o) {
  const e = this.value.toLowerCase(),
    t = a.filter((n) => n.name.toLowerCase().includes(e));
  if (((u.innerHTML = ""), e.length >= 3 && t.length > 0)) {
    const n = document.createElement("ul");
    n.classList.add("guest-list"),
      t.forEach((s) => {
        const i = document.createElement("li");
        (i.textContent = s.name),
          i.addEventListener("click", function () {
            (c.value = this.textContent), m();
          }),
          n.appendChild(i);
      }),
      u.appendChild(n);
  } else u.textContent = e.length < 3 ? "Type at least 3 characters" : "No matches found.";
});
c.addEventListener("keydown", function (o) {
  const e = o.keyCode,
    t = document.getElementById("suggestions");
  if (t) {
    if (e === 40) l++, y(l);
    else if (e === 38) l--, y(l);
    else if (e === 13) {
      const n = t.querySelector("li.active");
      n && ((c.value = n.textContent), (l = 0), m());
    }
  }
});
function y(o) {
  const t = document.getElementById("suggestions").querySelectorAll("li");
  t && (B(t), o >= 0 && o < t.length && t[o].classList.add("active"));
}
function B(o) {
  o.forEach((e) => e.classList.remove("active"));
}
function m() {
  const o = document.getElementById("suggestions");
  o && o.parentNode.removeChild(o);
}
G.addEventListener("click", function () {
  const o = c.value.trim();
  if (!o) {
    alert("Please enter your name.");
    return;
  }
  const e = new L(a);
  if (e.verifyGuest(o)) {
    const t = e.getGuestType(o);
    e.showGuestInfo(t);
  } else alert("Sorry, guest not found.");
});
new g();
