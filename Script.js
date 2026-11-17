// Skriver ett testmeddelande i webbläsarens utvecklarkonsol.
console.log("Unga Universum"); 

// Hittar logotypknappen. På sidor utan knappen blir värdet null.
const logoButton = document.querySelector(".home-logo");

// Kör logotypkoden endast på sidan där logotypknappen finns.
if (logoButton) {
  // Hämtar själva bilden som ligger inuti knappen.
  const logo = logoButton.querySelector(".site-logo");

  // Fortsätter bara om knappen faktiskt innehåller en logotypbild.
  if (logo) {
    // Den här funktionen startar eller startar om logotypens CSS-animation.
    const spinLogo = () => {
      // Tar bort animationsklassen först, så att samma animation kan spelas igen när en besökare på min webbsida trycker på logotypen.
      logo.classList.remove("is-spinning");
      // Tvingar webbläsaren att registrera att klassen tagits bort.
      void logo.offsetWidth;
      // Lägger tillbaka klassen; CSS-regeln startar då snurrningen.
      logo.classList.add("is-spinning");
    };

    // Spelar snurranimationen en gång när sidan öppnas, som en effekt, tycket det stör om den fortsätter snurra och så vill jag att besökaren ska kunna göra det.
    spinLogo();
    // Spelar animationen igen när besökaren klickar på logotypknappen.
    logoButton.addEventListener("click", spinLogo);

    // Tar bort klassen när animationen är klar, så den kan startas igen senare om ngn trycker.
    logo.addEventListener("animationend", () => {
      logo.classList.remove("is-spinning");
    });
  }
}

//nedanstående har jag fått hjälp med av copilot, som finns i CScode.
// Hittar delarna på engelska quizsidan som behövs för att rätta svaren.
//  formuläret som innehåller frågorna och svarsalternativen.
const quizForm = document.querySelector("#english-quiz");
//  knappen som besökaren klickar på för att rätta quizet.
const checkQuizButton = document.querySelector("#check-quiz");
//  elementet där resultatet visas.
const quizResult = document.querySelector("#quiz-result");

// Quizkoden körs bara om alla tre HTML-element finns på sidan.
if (quizForm && checkQuizButton && quizResult) {
  // Väntar tills besökaren klickar på knappen "Check answers".
  checkQuizButton.addEventListener("click", () => {
    // Börjar med noll rätta svar varje gång quizet rättas.
    let score = 0;

    // Frågorna 1–5 och 7 har ett svarsalternativ var.
    for (const questionNumber of [1, 2, 3, 4, 5, 7]) {
      // Hittar det markerade svaret för frågan, om besökaren har valt ett.
      const answer = quizForm.querySelector(
        `input[name="q${questionNumber}"]:checked`
      );

      // Lägg till en poäng om det valda svarets värde är "correct".
      // ?. gör att koden fungerar även om inget svar har valts.
      if (answer?.value === "correct") {
        score++;
      }
    }

    // Fråga 6 tillåter flera svar. Samlar alla kryssrutor som är markerade.
    const animalAnswers = [
      ...quizForm.querySelectorAll('input[name="q6"]:checked')
    ];
    // Frågan ger poäng endast om exakt tre svar är valda och alla är rätt.
    if (
      animalAnswers.length === 3 &&
      animalAnswers.every((answer) => answer.value === "correct")
    ) {
      score++;
    }

    // Skriver poängen direkt på sidan, utan att ladda om den.
    quizResult.textContent = `You got ${score} out of 7 correct!`;
  });
}

// Hittar formuläret och HTML-elementen på sidan för egna glosor.

const vocabForm = document.querySelector("#vocab-form");
// Hittar listan där de tillagda glosorna visas.
const vocabList = document.querySelector("#vocab-list");
// Hämtar området där meddelanden om glosorna visas.
const vocabStatus = document.querySelector("#vocab-status");
// Hämtar området som innehåller glosquizet.
const vocabQuiz = document.querySelector("#vocab-quiz");

// Egna glosor-funktionen körs bara när sidans nödvändiga element finns.
if (vocabForm && vocabList && vocabStatus && vocabQuiz) {
  // Fält där besökaren skriver in den engelska glosan och dess svenska betydelse.
  const englishWordInput = vocabForm.querySelector("#english-word");
  const swedishWordInput = vocabForm.querySelector("#swedish-word");

  // Knappar och områden som används i glosquizet.
  const startQuizButton = vocabQuiz.querySelector("#start-vocab-quiz");
  const answerForm = vocabQuiz.querySelector("#vocab-answer-form");
  const answerInput = vocabQuiz.querySelector("#vocab-answer");
  const questionText = vocabQuiz.querySelector("#vocab-question");
  const quizResult = vocabQuiz.querySelector("#vocab-quiz-result");
  const nextQuestionButton = vocabQuiz.querySelector("#next-vocab-question");

  // Nyckeln bestämmer namnet på listan som sparas i webbläsarens localStorage.
  const storageKey = "unga-universum-vocabulary";

  // vocabulary innehåller alla sparade ordpar.
  // quizWords är ordparen i den ordning de ställs i det pågående quizet.
  let vocabulary = [];
  let quizWords = [];

  // Håller reda på vilket ord och vilken poäng quizet har nått.
  let currentQuestion = 0;
  let score = 0;

  // Försöker läsa in glosor som sparats tidigare i samma webbläsare.
  try {
    const savedVocabulary = localStorage.getItem(storageKey);
    // JSON.parse omvandlar den sparade texten tillbaka till en JavaScript-lista.
    vocabulary = savedVocabulary ? JSON.parse(savedVocabulary) : [];

    // Säkerställer att sparade data faktiskt är en lista.
    if (!Array.isArray(vocabulary)) {
      throw new Error("Sparade glosor har fel format.");
    }
  } catch {
    // Visar ett meddelande om sparade data inte går att läsa.
    vocabStatus.textContent = "Kunde inte läsa sparade glosor. Du kan ändå lägga till nya.";
    vocabulary = [];
  }

  // Bygger om listan på sidan så att den visar alla glosor i vocabulary.
  const renderVocabulary = () => {
    // Tömmer den gamla listan innan den aktuella listan visas.
    vocabList.replaceChildren();

    vocabulary.forEach((vocab) => {
      // Skapar en rad per glosa och visar användarens text som vanlig text.
      const item = document.createElement("li");
      item.textContent = `${vocab.english} — ${vocab.swedish}`;
      vocabList.append(item);
    });
  };

  renderVocabulary();
  // Visar quizdelen om det redan finns minst en sparad glosa.
  vocabQuiz.hidden = vocabulary.length === 0;

  // Visar den svenska betydelsen för den aktuella frågan.
  const showQuestion = () => {
    questionText.textContent = vocabulary.length
      ? `What is the English word for "${quizWords[currentQuestion].swedish}"?`
      : "";
    // Tömmer och aktiverar svarsfältet för nästa fråga.
    answerInput.value = "";
    answerInput.disabled = false;
    answerForm.hidden = false;
    nextQuestionButton.hidden = true;
    // Visar numret på frågan, till exempel "Question 2 of 5".
    quizResult.textContent = `Question ${currentQuestion + 1} of ${quizWords.length}`;
    answerInput.focus();
  };

  // Startar ett quiz med alla sparade glosor i slumpad ordning.
  startQuizButton.addEventListener("click", () => {
    // Kopierar ordlistan så originalordningen i vocabulary inte ändras.
    quizWords = [...vocabulary];

    // Blandar kopian: varje ord byter plats med ett slumpmässigt valt ord.
    for (let index = quizWords.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [quizWords[index], quizWords[randomIndex]] = [quizWords[randomIndex], quizWords[index]];
    }

    // Återställer frågenummer och poäng och visar quizets första fråga.
    currentQuestion = 0;
    score = 0;
    startQuizButton.hidden = true;
    showQuestion();
  });

  // Rättar besökarens svar när svarformuläret skickas.
  answerForm.addEventListener("submit", (event) => {
    // Hindrar formuläret från att ladda om sidan.
    event.preventDefault();
    // Tar bort extra mellanslag och gör jämförelsen okänslig för stora/små bokstäver.
    const answer = answerInput.value.trim().toLocaleLowerCase();
    const correctAnswer = quizWords[currentQuestion].english.trim().toLocaleLowerCase();

    if (answer === correctAnswer) {
      score++;
      quizResult.textContent = "Correct!";
    } else {
      // Visar det rätta ordet om svaret inte stämmer.
      quizResult.textContent = `Not quite. The correct answer is "${quizWords[currentQuestion].english}".`;
    }

    // Hindrar svar från att ändras efter rättning och visar knappen för nästa fråga.
    answerInput.disabled = true;
    nextQuestionButton.hidden = false; // Hidden är ett värde som bara kan vara sant (true) eller falskt (false) answerForm.hidden = false; betyder att formuläret ska visas. = True betyder att formuläret ska vara dolt
  });

  // Visar nästa fråga, eller slutpoängen när alla ord har frågats.
  nextQuestionButton.addEventListener("click", () => {
    currentQuestion++;

    if (currentQuestion < quizWords.length) {
      // Det finns fler ord kvar: visa nästa fråga.
      showQuestion();
      return;
    }

    // Quizet är klart: dölj svarsfältet och visa poängen.
    answerForm.hidden = true; //svarsformuläret är dolt genom true.
    nextQuestionButton.hidden = true; //nästa fråga är dold genom = true.
    questionText.textContent = "Quiz complete!";
    quizResult.textContent = `You got ${score} out of ${quizWords.length} correct.`;
    // Låter besökaren starta ett nytt försök.
    startQuizButton.textContent = "Play again";
    startQuizButton.hidden = false;
  });

  // Körs när besökaren skickar formuläret för att lägga till en glosa.
  vocabForm.addEventListener("submit", (event) => {
    // Hindrar sidan från att laddas om när formuläret skickas.
    event.preventDefault();

    // Hämtar texten och tar bort onödiga mellanslag i början och slutet.
    const english = englishWordInput.value.trim();
    const swedish = swedishWordInput.value.trim();

    // Avbryter om något av fälten saknar text.
    if (!english || !swedish) {
      vocabStatus.textContent = "Fyll i både det engelska ordet och betydelsen.";
      return;
    }

    // Lägger ordparet till i listan, uppdaterar sidan och gör quizdelen synlig.
    vocabulary.push({ english, swedish });
    renderVocabulary();
    vocabQuiz.hidden = false;

    // Sparar hela listan som JSON-text i webbläsaren.
    try {
      localStorage.setItem(storageKey, JSON.stringify(vocabulary));
      vocabStatus.textContent = "Glosan har lagts till och sparats i den här webbläsaren.";
    } catch {
      // Visar tydligt om webbläsaren inte kan spara, trots att glosan visas på sidan.
      vocabStatus.textContent = "Glosan har lagts till, men kunde inte sparas i webbläsaren.";
    }

    // Tömmer formuläret och placerar markören i första fältet för nästa glosa.
    vocabForm.reset();
    englishWordInput.focus();
  });
}