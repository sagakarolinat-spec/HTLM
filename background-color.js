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
      localStorage.setItem(storageKey, colorInput.value); // sparar den valda färgen i localStorage, det gör iaf så att färgen kan återställas vid nästa besök. Om ngn väljer exempelvis rosa, på srartsidan, så sparas färgen i hens webbläsare. När hen då öppnar artikelsidan kan hens webbläsare läsa samma sparade färg och också bli rosa för att färgskriptet finns där. 
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

// Denna kod har jag ej kommenterat helt eftersom jag fått hjälp av co-pilot och https://developer.mozilla.org/ med denna, så inte jag som skrivit koden själv. Räknar ej att bli bedömd på denna sidas JS-kodning.) 