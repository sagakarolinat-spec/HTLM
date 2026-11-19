// Visar vad som händer i prototypen utan att skicka meddelandet.
const contactForm = document.querySelector(".contact-form"); // hämtar kontaktformuläret från DOM:en
const contactResult = document.querySelector("#contact-result"); // hämtar elementet där resultatmeddelandet ska visas

if (contactForm && contactResult) { // kollar att både formuläret och resultat-elementet finns innan vi lägger till eventlyssnare
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();  // förhindrar att formuläret skickas på vanligt sätt
    contactResult.textContent = "Detta är en prototyp. Ditt meddelande har inte skickats."; // visar meddelandet i resultat-elementet
  });
}
