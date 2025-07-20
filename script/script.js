// Function to add the "navbarDark" class to the navbar on scroll
function handleNavbarScroll() {
  const header = document.querySelector(".navbar");
  window.onscroll = function () {
    const top = window.scrollY;
    if (top >= 100) {
      header.classList.add("navbarDark");
    } else {
      header.classList.remove("navbarDark");
    }
  };
}

// Function to handle navbar collapse on small devices after a click
function handleNavbarCollapse() {
  const navLinks = document.querySelectorAll(".nav-item");
  const menuToggle = document.getElementById("navbarSupportedContent");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      new bootstrap.Collapse(menuToggle).toggle();
    });
  });
}

// Function to dynamically create HTML elements from the JSON file
function createSkillsFromJSON() {
  const container = document.querySelector("#skills .container");
  let row = document.createElement("div");
  row.classList.add("row");

  // Load the JSON file
  fetch("data/skills.json")
    .then((response) => response.json())
    .then((data) => {
      // Iterate through the JSON data and create HTML elements
      data.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("col-lg-4", "mt-4");
        card.innerHTML = `
                    <div class="card skillsText">
                        <div class="card-body">
                             <img src="./images/${item.image}" alt="${item.alt}" />
                            <h3 class="card-title mt-3">${item.title}</h3>
                            <p class="card-text mt-3">${item.text}</p>
                        </div>
                    </div>
                `;

        // Append the card to the current row
        row.appendChild(card);

        // If the index is a multiple of 3 or it's the last element, create a new row
        if ((index + 1) % 3 === 0 || index === data.length - 1) {
          container.appendChild(row);
          row = document.createElement("div");
          row.classList.add("row");
        }
      });
    });
}
// Function to dynamically create HTML elements from the JSON file
function createPortfolioFromJSON() {
  const container = document.querySelector("#portfolio .container");
  let row = document.createElement("div");
  row.classList.add("row");

  // Load the JSON file
  fetch("data/portfolio.json")
    .then((response) => response.json())
    .then((data) => {
      // Iterate through the JSON data and create HTML elements
      data.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("col-lg-4", "mt-4");
        card.innerHTML = `
                    <div class="card portfolioContent">
                    <img class="card-img-top" src="images/${item.image}" alt="${
          item.alt
        }" style="width:100%">
                    <div class="card-body">
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-text">${item.text}</p>
                        <div class="text-center">
                            <a href="${item.link}" 
         target="${item.target || "_self"}" 
         rel="${item.target === "_blank" ? "noopener noreferrer" : ""}" 
         class="btn btn-success">
         Lien
      </a>
                        </div>
                    </div>
                </div>
                `;

        // Append the card to the current row
        row.appendChild(card);

        // If the index is a multiple of 3 or it's the last element, create a new row
        if ((index + 1) % 3 === 0 || index === data.length - 1) {
          container.appendChild(row);
          row = document.createElement("div");
          row.classList.add("row");
        }
      });
    });
}

// Call the functions to execute the code
handleNavbarScroll();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
//handleNavbarScroll();//
//handleNavbarCollapse();//
//createSkillsFromJSON();//
//createPortfolioFromJSON();//

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const messageBox = document.getElementById("confirmationMessage");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");

  // Vérification que les éléments existent
  if (!form || !messageBox || !submitBtn) {
    console.error("Éléments du formulaire manquants");
    return;
  }

  // Fonction pour afficher les messages
  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `alert alert-${type} text-center fw-bold`;
    messageBox.classList.remove("d-none");

    // Scroll vers le message
    messageBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Masquer après 5 secondes pour les erreurs
    if (type === "danger") {
      setTimeout(() => {
        messageBox.classList.add("d-none");
      }, 5000);
    }
  }

  // Vérifier si on revient avec un paramètre de succès
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success") === "true") {
    showMessage(
      "Votre message a été envoyé avec succès ! Je vous répondrai rapidement.",
      "success"
    );
    // Nettoyer l'URL
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + "#contact"
    );
  }

  // Fonction de validation email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validation avant soumission
  form.addEventListener("submit", (e) => {
    // Détection honeypot (anti-bot)
    const honeypot = form.querySelector("[name='_honey']");
    if (honeypot && honeypot.value !== "") {
      e.preventDefault();
      showMessage("Formulaire bloqué.", "danger");
      return;
    }

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const subject = form.querySelector("#subject").value.trim();
    const message = form.querySelector("#message").value.trim();

    // Validation des champs
    if (!name || name.length < 2) {
      e.preventDefault();
      showMessage("Le nom doit contenir au moins 2 caractères.", "danger");
      return;
    }

    if (!email || !isValidEmail(email)) {
      e.preventDefault();
      showMessage("Veuillez entrer une adresse email valide.", "danger");
      return;
    }

    if (!subject || subject.length < 3) {
      e.preventDefault();
      showMessage("Le sujet doit contenir au moins 3 caractères.", "danger");
      return;
    }

    if (!message || message.length < 10) {
      e.preventDefault();
      showMessage("Le message doit contenir au moins 10 caractères.", "danger");
      return;
    }

    // Validation anti-script
    const scriptRegex = /<\s*script\b[^>]*>(.*?)<\s*\/\s*script>/gi;
    const inputs = [name, email, subject, message];

    if (inputs.some((input) => scriptRegex.test(input))) {
      e.preventDefault();
      showMessage(
        "Le contenu du formulaire contient du code interdit.",
        "danger"
      );
      return;
    }

    // Animation de loading
    submitBtn.disabled = true;
    btnText.textContent = "Envoi en cours...";
    if (spinner) {
      spinner.classList.remove("d-none");
    }
  });
});
