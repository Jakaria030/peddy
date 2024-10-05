const petsCardContainer = document.getElementById("pets-card-container");

// Load All Categories
const loadAllCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then(res => res.json())
        .then(data => displayALlCategories(data.categories))
        .catch(err => console.log("Server is busy."))
};

// Display All Category
const displayALlCategories = (data) => {
    // console.log(data);
    const categoryButtonContainer = document.getElementById("category-button-container");

    categoryButtonContainer.innerHTML = "";
    data.forEach(categoryItem => {
        // console.log(categoryItem);
        categoryButtonContainer.innerHTML += `
        <button onclick="displayByCategory('${categoryItem.category}')" class="flex items-center justify-center space-x-3 border rounded-xl p-3 sm:p-5 lg:p-8">
            <img src=${categoryItem.category_icon}">
            <h3 class="text-2xl font-bold text-secondary font-inter">${categoryItem.category}</h3>
        </button>
        `;
    });
};

// Display By Category
const displayByCategory = (categoryName) => {
    // console.log(categoryName);
    loadByCategory(categoryName);
};

// Load By Category
const loadByCategory = (categoryName) =>{
    const url = `https://openapi.programming-hero.com/api/peddy/category/${categoryName}`;

    // console.log(url);
    
    fetch(url)
        .then(res => res.json())
        .then(pets => {
            petsCardContainer.innerHTML = "";
            showLoader();
            setTimeout(() => {
                hideLoader();
                displayAllPets(pets.data);
            }, 2000);
        })
        .catch(err => {
            console.log("Server is busy.");
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
        data.forEach(pet => {
            const petImage = pet.image;
            const petBreed = pet.breed ? pet.breed : "Not available";
            const petDOB = pet.date_of_birth ? pet.date_of_birth : "Not available";
            const petGender = pet.gender ? pet.gender : "Not availbale";
            const petPrice = pet.price ? `${pet.price}$` : "Not available";

            petsCardContainer.innerHTML += `
            <div class="card card-compact border border-secondary/10 rounded-lg p-5 space-y-5">
                <figure>
                    <img class="w-full rounded-lg"
                        src=${pet.image} />
                </figure>
                <div class="space-y-1">
                    <h2 class="text-2xl font-bold text-secondary font-inter">${pet.pet_name}</h2>
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
                    <button
                        class="px-3 sm:px-4 py-2 border rounded-md text-primary font-bold sm:text-lg hover:bg-primary hover:text-white transition duration-100 ease-in-out">Adopt</button>
                    <button
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