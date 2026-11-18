(() => {
  const storageKey = "unga-universum-background-color";
  const control = document.createElement("details");
  control.className = "background-color-control";
  control.innerHTML = `
    <summary>Byt bakgrundsfärg</summary>
    <label>
      Välj färg
      <input type="color" value="#000000">
    </label>
    <button type="button">Återställ</button>
    <p class="background-color-status" role="status" aria-live="polite"></p>
  `;
  document.body.append(control);

  const colorInput = control.querySelector('input[type="color"]');
  const resetButton = control.querySelector("button");
  const status = control.querySelector(".background-color-status");

  const applyColor = (color, hasCustomColor = true) => {
    document.documentElement.style.setProperty("--page-background", color);
    document.body.classList.toggle("has-custom-background", hasCustomColor);
    colorInput.value = color;
  };

  try {
    const savedColor = localStorage.getItem(storageKey);
    if (savedColor && CSS.supports("color", savedColor)) {
      applyColor(savedColor);
    }
  } catch {
    status.textContent = "Färgen kan inte sparas i den här webbläsaren.";
  }

  colorInput.addEventListener("input", () => {
    applyColor(colorInput.value);
    status.textContent = "";

    try {
      localStorage.setItem(storageKey, colorInput.value);
    } catch {
      status.textContent = "Färgen används, men kunde inte sparas.";
    }
  });

  resetButton.addEventListener("click", () => {
    applyColor("#000000", false);
    status.textContent = "";

    try {
      localStorage.removeItem(storageKey);
    } catch {
      status.textContent = "Standardfärgen används, men valet kunde inte raderas.";
    }
  });
})();
