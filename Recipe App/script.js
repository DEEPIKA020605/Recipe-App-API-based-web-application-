const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');

// Modal elements for displaying detailed recipes
const recipeDetailsModal = document.createElement('div');
recipeDetailsModal.classList.add('recipe-details');
document.body.appendChild(recipeDetailsModal);

const modalOverlay = document.createElement('div');
modalOverlay.classList.add('modal-overlay');
document.body.appendChild(modalOverlay);

// Function to close the modal
const closeModal = () => {
    recipeDetailsModal.style.display = 'none';
    modalOverlay.style.display = 'none';
};

// Function to show detailed recipe in a modal
const showRecipeDetails = (meal) => {
    const ingredients = [];

    // Collect ingredients and measures (up to 20 possible ingredients in the API)
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }

    // Modal content
    recipeDetailsModal.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; border-radius: 10px;"/>
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
        <h3>Ingredients</h3>
        <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank">Watch Recipe Video</a>` : ''}
        <button onclick="closeModal()">Close</button>
    `;

    recipeDetailsModal.style.display = 'block';
    modalOverlay.style.display = 'block';
};

// Function to fetch and display recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    recipeContainer.innerHTML = ""; // Clear the "Fetching Recipes..." message

    if (response.meals) {
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>Area: ${meal.strArea}</span></p>
                <p><span>Category: ${meal.strCategory}</span></p>
            `;
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Event listener to show the details when "View Recipe" is clicked
            button.addEventListener('click', () => showRecipeDetails(meal));

            recipeContainer.appendChild(recipeDiv);
        });
    } else {
        recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
    }
};

// Event listener for search button click
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipeContainer.innerHTML = "<h2>Please enter a recipe name to search.</h2>";
    }
});

// Close the modal when the overlay is clicked
modalOverlay.addEventListener('click', closeModal);
