// Gör kategorimenyn kompakt på mobilskärmar utan att ändra datorns meny.
document.querySelectorAll(".category-nav").forEach((nav) => {
  const menu = nav.querySelector("ul");
  if (!menu) {
    return;
  }

  const toggle = document.createElement("button");
  toggle.className = "mobile-nav-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Öppna navigeringsmenyn");
  menu.id = menu.id || "category-menu";
  toggle.setAttribute("aria-controls", menu.id);
  toggle.innerHTML = `
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
  `;
  nav.insertBefore(toggle, menu);

  const homeLink = menu.querySelector(".home-button");
  if (homeLink) {
    // Håll startsidans genväg synlig även när mobilmenyn är stängd.
    homeLink.closest("li").remove();
    nav.insertBefore(homeLink, toggle);
  }

  nav.classList.add("mobile-nav-ready");

  const setMenuOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Stäng navigeringsmenyn" : "Öppna navigeringsmenyn"
    );
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenuOpen(false);
      toggle.focus();
    }
  });
});
