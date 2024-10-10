const loadBtnCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
      .then((res) => res.json())
      .then((data) => displayBtnCategories(data.categories))
      .catch((error) => console.log(error));
  };

const loadCategoryImage = (category) => {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = ""; 
  
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("hidden");
  
    setTimeout(() => {
      fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
        .then((res) => res.json())
        .then((data) => {
          spinner.classList.add("hidden"); 
          displayCards(data.data); 
        })
        .catch((error) => {
          console.log(error);
          spinner.classList.add("hidden");
        });
    }, 1500); 
};

const displayBtnCategories = (categories) => {

    const categoryContainer = document.getElementById("btn-container");
  
    for (const category of categories) {
      const buttonContainer = document.createElement("div");
  
      buttonContainer.innerHTML = `
        <div class="flex sm:flex-row-1 md:flex-row-2 justify-evenly">
          <button id="btn-${category.id}" onclick="loadCategoryImage('${category.category}')" class="category-btn flex items-center justify-center gap-5 w-[200px] h-[70px] bg-white hover:bg-teal-700 hover:text-white active:bg-teal-700-500 active:text-white transition-colors duration-300 border border-gray-300 rounded-lg">
            <img src=${category.category_icon} class="w-[40px]">
            <p class="text-[25px]">${category.category}</p> 
          </button>
        </div>
      `;
  
      const button = buttonContainer.querySelector(`#btn-${category.id}`);
  
      button.addEventListener("click", function () {
        const allButtons = document.querySelectorAll(".category-btn");
        allButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
      });
  
      categoryContainer.append(buttonContainer);
    }
  };  

const loadPets = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => displayCards(data.pets))
    .catch((error) => console.log(error));
};

const displayCards = (pets) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  // Handle empty state
  if (pets.length == 0) {
    cardContainer.classList.remove("grid");
    cardContainer.innerHTML = ` 
    <div class="text-center bg-[#ececec] m-5 rounded-lg p-5">
      <img class="mx-auto" src="./images/error.webp"/>
      <h3 class="text-[32px] font-bold text-[#131313]">No Information Available</h3>
      <p>"We appreciate your interest in adopting a pet! Unfortunately, we currently have no information available. Please check back regularly for updates on available animals, adoption events, and resources to help you find your perfect furry companion. Thank you!"</p>
    </div>`;
    return;
  } else {
    cardContainer.classList.add("grid");
  }

  for (const pet of pets) {
    const card = document.createElement("div");
    card.classList = "card border-2 bg-base-100 shadow-xl p-5 h-full";
    card.innerHTML = `
      <img src=${pet.image} class="w-full rounded-xl mb-4" />
      <div class="card-body p-0">
        <h1 class="font-bold text-xl">${pet.pet_name}</h1>
        <div class="flex gap-3 items-center">
          <i class="fa-solid fa-border-all"></i>
          <span>Breed: ${pet?.breed || 'Mini Rex'}</span>
        </div>
        <div class="flex gap-3 items-center">
          <i class="fa-solid fa-calendar-days"></i>
          <span>Birth: ${pet?.date_of_birth || '2023-02-20'}</span>
        </div>
        <div class="flex gap-3 items-center">
          <i class="fa-solid fa-venus-mars"></i>
          <span>Gender: ${pet?.gender || 'male'}</span>
        </div>
        <div class="flex gap-3 items-center">
          <i class="fa-solid fa-dollar-sign"></i>
          <span>Price: $${pet?.price || '150'}</span>
        </div>
      </div>
      <hr class="my-3">
      <div class="flex justify-between">
        <button onclick="handleAdd('${pet.image}')" class="bg-white hover:bg-teal-100 hover:text-white hover:border-teal-700 hover:border-solid hover:border-2 transition-colors duration-300 border border-1 flex justify-center rounded-lg items-center w-[56px] h-[38px]"><i class="fa-solid fa-thumbs-up" style="color: #0f766e;"></i></button>
        <button id="adopt-button" class=" w-[92px] h-[40px] rounded-lg border border-1 text-teal-700 hover:bg-teal-700 hover:text-white  transition-colors duration-300 flex justify-center items-center font-bold text-[18px]" onclick="openCounterModal()">Adopt</button>
        <button class=" w-[92px] h-[40px] rounded-lg border border-1 text-teal-700 hover:bg-teal-700 hover:text-white transition-colors duration-300 flex justify-center items-center font-bold text-[18px]" onclick="openModal(${pet.petId})">Details</button>
      </div>
    `;
    cardContainer.appendChild(card);
  }
};

// Function to sort pets by price in descending order
const sortByPriceDescending = () => {
    const sortedPets = pets.slice().sort((a, b) => b.price - a.price);
    displayCards(sortedPets);
  };
  
// Event listener for the Sort button
 document.getElementById("sort-button").addEventListener("click", sortByPriceDescending);

// Fetch and display pets when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    pets = await fetchPets();
    displayCards(pets);
  });
  
  // Fetching pets from the API
async function fetchPets() {
    try {
      const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
      const data = await response.json();
      return data.pets;
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
}
  
  // open modal
const openModal = (petId) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
      .then((res) => res.json())
      .then((data) => {
        const pet = data.pets.find((pet) => pet.petId === petId);
  
        if (!pet) {
          console.log("Pet not found");
          return;
        }
  
        document.getElementById("modal-pet-name").textContent = pet.pet_name;
        document.getElementById("modal-pet-image").src = pet.image;
        document.getElementById(
          "modal-pet-details"
        ).innerHTML = ` ${pet.pet_details}`;
        document.getElementById(
          "modal-pet-breed"
        ).innerHTML = ` <i class="fa-solid fa-border-all"></i> Breed: ${pet.breed}`;
        document.getElementById(
          "modal-pet-birth"
        ).innerHTML = ` <i class="fa-solid fa-calendar-days"></i> Birth: ${pet.date_of_birth}`;
        document.getElementById(
          "modal-pet-gender"
        ).innerHTML = `<i class="fa-solid fa-venus-mars"></i> Gender: ${pet.gender}`;
        document.getElementById(
          "modal-pet-price"
        ).innerHTML = ` <i class="fa-solid fa-dollar-sign"></i> Price: ${pet.price}`;
        document.getElementById("shared-modal").showModal();
      })
      .catch((error) => console.log(error));
};
  
const openCounterModal = () => {
    document.getElementById("congrats-image").src = "./images/congrats.png";
    document.getElementById("counter-h1").textContent = "Congratulations";
    document.getElementById("counter-desc").textContent = "Your adoption request was successful!";
    document.getElementById("counter-modal").showModal();
    countDown();
    setTimeout(() => {
      document.getElementById("counter-modal").close();  
    }, 2000);
};
  
function countDown() {
    let countdown = 3;
  
    document.getElementById("counter-count").innerText = countdown;
  
    const countdownInterval = setInterval(() => {
      countdown--;
      document.getElementById("counter-count").innerText = countdown;
  
      if (countdown < 1) {
        clearInterval(countdownInterval);
        document.getElementById("counter-count").innerText = "";
      }
    }, 1000);
}
  
function handleAdd(image) {
    const likedPetsGrid = document.getElementById("liked-pets-grid");
    const h2 = document.getElementById("h2");
    h2.classList.add("hidden");
    const div = document.createElement("div");
    div.innerHTML = `
        <img src=${image} class="rounded-lg w-[200px]"/>
      `;
  
    likedPetsGrid.appendChild(div);
}
  
loadBtnCategories();
loadPets();