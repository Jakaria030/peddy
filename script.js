const petsCardContainer = document.getElementById("pets-card-container");
let arrayForSort = [];

// Load All Categories
const loadAllCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then(res => res.json())
        .then(data => displayALlCategories(data.categories))
        .catch(err => console.log("Server is busy."))
};

// Load Signle Pet Details
const loadSinglePetDetails = (petId) => {
    // console.log(petId);
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
        .then(res => res.json())
        .then(data => displaySinglePetDetails(data.petData))
        .catch(err => console.log("Server is busy."));
} 

// Display All Category
const displayALlCategories = (data) => {
    // console.log(data);
    const categoryButtonContainer = document.getElementById("category-button-container");

    categoryButtonContainer.innerHTML = "";
    data.forEach(categoryItem => {
        // console.log(categoryItem);
        categoryButtonContainer.innerHTML += `
        <button id="${categoryItem.category}" onclick="loadByCategory('${categoryItem.category}')" class="flex items-center justify-center space-x-3 border rounded-xl p-3 sm:p-5 lg:p-7">
            <img src=${categoryItem.category_icon}">
            <h3 class="text-2xl font-bold text-secondary font-inter">${categoryItem.category}</h3>
        </button>
        `;
    });
};

// Load By Category
const loadByCategory = (categoryName) =>{
    // console.log(categoryName);
    // active button class remove
    const categoryButtonContainer = document.querySelectorAll("#category-button-container button");
    categoryButtonContainer.forEach(categoryButton => {
        categoryButton.className = "flex items-center justify-center space-x-3 border rounded-xl p-3 sm:p-5 lg:p-7";
    });

    // set active button
    const categoryButton = document.getElementById(categoryName);
    categoryButton.className = "flex items-center justify-center space-x-3 border border-primary bg-primary/10 rounded-full p-3 sm:p-5 lg:p-7";

    // fetch url
    const url = `https://openapi.programming-hero.com/api/peddy/category/${categoryName}`;
    // console.log(url);
    
    fetch(url)
        .then(res => res.json())
        .then(pets => {
            petsCardContainer.innerHTML = "";
            showLoader();
            setTimeout(() => {
                hideLoader();
                
                // assign categories data into global array
                arrayForSort = [];
                arrayForSort = pets.data;

                displayAllPets(pets.data);
            }, 2000);
        })
        .catch(err => {
            console.log("Server is busy." + err);
            hideLoader();
        });
};

// Load All Pets
const loadAllPets = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then(res => res.json())
        .then(data => displayAllPets(data.pets))
        .catch(err => console.log("Server is busy."));
};

// Display All Pets
const displayAllPets = (data) => {
    // console.log(data.length);
    if(data.length){
        arrayForSort = data;
        data.forEach(pet => {
            const petId = pet.petId;
            const petName = pet.pet_name;
            const petImage = pet.image;
            const petBreed = pet.breed ? pet.breed : "Not available";
            const petDOB = pet.date_of_birth ? pet.date_of_birth : "Not available";
            const petGender = pet.gender ? pet.gender : "Not availbale";
            const petPrice = pet.price ? `${pet.price}$` : "Not available";

            petsCardContainer.innerHTML += `
            <div class="card card-compact border border-secondary/10 rounded-lg p-5 space-y-5">
                <figure>
                    <img class="w-full rounded-lg"
                        src=${petImage} />
                </figure>
                <div class="space-y-1">
                    <h2 class="text-2xl font-bold text-secondary font-inter">${petName}</h2>
                    <p class="text-secondary/70">
                        <i class="fa-solid fa-border-all mr-3"></i>
                        <span>Breed: ${petBreed}</span>
                    </p>
                    <p class="text-secondary/70">
                        <i class="fa-regular fa-calendar mr-3"></i>
                        <span>Birth: ${petDOB}</span>
                    </p>
                    <p class="text-secondary/70">
                        <i class="fa-solid fa-venus mr-3"></i>
                        <span>Gender: ${petGender}</span>
                    </p>
                    <p class="text-secondary/70">
                        <i class="fa-solid fa-money-check-dollar mr-2"></i>
                        <span>Price: ${petPrice}</span>
                    </p>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <button onclick="addPetImage('${petImage}')"
                        class="px-3 sm:px-4 py-2 border rounded-md hover:bg-primary hover:text-white transition duration-100 ease-in-out"><i
                            class="fa-solid fa-thumbs-up"></i></button>
                    <button id="adoption-btn-id-${petId}" onclick="adoptionProcessRunning(this)"
                        class="px-3 sm:px-4 py-2 border rounded-md text-primary font-bold sm:text-lg hover:bg-primary hover:text-white transition duration-100 ease-in-out">Adopt</button>
                    <button onclick="loadSinglePetDetails(${petId})"
                        class="px-3 sm:px-4 py-2 border rounded-md text-primary font-bold sm:text-lg hover:bg-primary hover:text-white transition duration-100 ease-in-out">Details</button>
                </div>
            </div>
            `;    
        });
    }else{
        noAvaialableData();
    }
    
};

// Add Pet Image To The Right Side
const addPetImage = (image) => {
    const imageContainer = document.getElementById("image-container");
    
    imageContainer.innerHTML += `
    <img class="round-lg border rounded-lg p-2" src=${image}>
    `;
};

// Adoption Proccess Running
const adoptionProcessRunning = (petAdoptionButtonId) =>{
    const congrates_modal = document.getElementById("congrates_modal");
    const adoptionButton = document.getElementById(petAdoptionButtonId.id);
    adoptionButton.onclick = congrates_modal.showModal();
    
    const intervalId = setInterval(() => {
        const counter = document.getElementById("counter");
        let counterValue = parseInt(counter.innerText);

        counterValue--;
        counter.innerText = counterValue;
        if(counterValue <= 0){
            clearInterval(intervalId);
            document.getElementById("close-button").click();
            adoptionButton.className = "px-3 sm:px-4 py-2 border rounded-md  font-bold sm:text-lg bg-stone-400 opacity-50 cursor-not-allowed";
            adoptionButton.innerText = "Adopted";
            counter.innerText = 3;
        }
    }, 1000);
    
};

// Show Details Of Single Pet
const displaySinglePetDetails = (pet) => {
    // console.log(pet);
    const petDetailsContainer = document.getElementById("pet-details-container");
    petDetailsContainer.innerHTML = "";

    const petImage = pet.image;
    const petName = pet.pet_name;
    const petBreed = pet.breed ? pet.breed : "Not available";
    const petDOB = pet.date_of_birth ? pet.date_of_birth : "Not available";
    const petGender = pet.gender ? pet.gender : "Not availbale";
    const petPrice = pet.price ? `${pet.price}$` : "Not available";
    const petIsVaccinated = pet.vaccinated_status ? pet.vaccinated_status : "Not available";
    const petDetails = pet.pet_details;
    
    petDetailsContainer.innerHTML = `
    <div class="space-y-4">
        <img class="w-full h-60 sm:h-80 rounded-lg" src=${petImage}>

        <h2 class="text-2xl font-bold text-secondary font-inter">${petName}</h2>
        <div class="space-y-1 grid grid-cols-1 sm:grid-cols-2">
            <p class="text-secondary/70">
                <i class="fa-solid fa-border-all mr-3"></i>
                <span>Breed: ${petBreed}</span>
            </p>
            <p class="text-secondary/70">
                <i class="fa-regular fa-calendar mr-3"></i>
                <span>Birth: ${petDOB}</span>
            </p>
            <p class="text-secondary/70">
                <i class="fa-solid fa-venus mr-3"></i>
                <span>Gender: ${petGender}</span>
            </p>
            <p class="text-secondary/70">
                <i class="fa-solid fa-money-check-dollar mr-2"></i>
                <span>Price: ${petPrice}</span>
            </p>
            <p class="text-secondary/70">
                <i class="fa-solid fa-syringe mr-2"></i>
                <span>Vaccinated Status: ${petIsVaccinated}</span>
            </p>
        </div>

        <div class="space-y-2">
            <h3 class="text-secondary font-inter font-semibold">Details Information</h3>
            <p class="text-secondary/70 text-justify font-inter">${petDetails}</p>
        </div>
    </div>

    <div class="pt-4">
        <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn w-full bg-primary/20 text-primary text-lg font-bold">Close</button>
        </form>
    </div>
    `;
    
    document.getElementById("pet_details_modal").showModal();
};

// Show no available data
const noAvaialableData = () => {
    const div = document.createElement("div");
    div.className = "col-span-3 flex flex-col justify-center items-center space-y-3";

    div.innerHTML = `
        <img class="w-24" src="./images/error.webp" alt="No Data Found">
        <h3 class="text-3xl font-bold font-inter text-secondary text-center">No information Available</h3>
        <p class="text-secondary/70 text-justify sm:w-3/4 mx-auto sm:text-center">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a.</p>
    `;

    petsCardContainer.appendChild(div);
};

// Show Loader
const showLoader = () => {
    const div = document.createElement("div");
    div.id = "loader";
    div.classList.add("col-span-3", "flex", "justify-center");

    div.innerHTML = `<span class="loading loading-bars loading-lg text-primary"></span>`;

    petsCardContainer.appendChild(div);
};

// Hide Loader
const hideLoader = () => {
    const loader = document.getElementById("loader");
    petsCardContainer.removeChild(loader);
};

// Sorting in descending order
document.getElementById("sorting-button").addEventListener("click", () => {
    // console.log(arrayForSort);

    arrayForSort.sort((petA, petB) => {
        let priceA = petA.price !== null && petA.price !== undefined ? petA.price : -Infinity;
        let priceB = petB.price !== null && petB.price !== undefined ? petB.price : -Infinity;

        return priceB - priceA;
    });

    // console.log(arrayForSort);
    petsCardContainer.innerHTML = "";
    displayAllPets(arrayForSort);
});

window.onload = () => {

    // Call loadAllCategories function
    loadAllCategories();
    
    // Show Loader
    showLoader();
    
    setTimeout(() => {
        hideLoader();
        loadAllPets();
    }, 2000);

};