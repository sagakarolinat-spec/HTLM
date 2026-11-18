// Visar vad som händer i prototypen utan att skicka meddelandet.
const contactForm = document.querySelector(".contact-form"); // hämtar kontaktformuläret från DOM:en
const contactResult = document.querySelector("#contact-result"); // hämtar elementet där resultatmeddelandet ska visas

if (contactForm && contactResult) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    contactResult.textContent = "Detta är en prototyp. Ditt meddelande har inte skickats.";
  });
}
