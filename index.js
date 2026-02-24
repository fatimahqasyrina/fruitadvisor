const { ipcRenderer } = require('electron');

const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');
const viewListBtn = document.getElementById('viewListBtn');

searchBtn.addEventListener('click', () => {
    const goal = document.getElementById("goalInput").value.toLowerCase();
    

    fetch(`https://www.fruityvice.com/api/fruit/all`)
        .then(res => res.json())
        .then(allFruits => {
            
            // filtering
            let filtered = allFruits.filter(fruit => {
                if (goal.includes("sugar")) {
                    return fruit.nutritions.sugar < 5;
                } else if (goal.includes("protein")) {
                    return fruit.nutritions.protein > 0.8;
                } else if (goal.includes("energy")) {
                    return fruit.nutritions.calories > 60;
                } else {
                    return fruit.name.toLowerCase().includes(goal);
                }
            });
            
            // untuk senarai 10 buah
            let topTen = filtered.slice(0, 10);

            resultDiv.innerHTML = `<h3 style="margin-top: 20px;">Suggestions for: "${goal}"</h3>`;

            if (topTen.length === 0) {
                resultDiv.innerHTML += `<p>No fruits found for this goal. Try "sugar", "protein", or "energy".</p>`;
                return;
            }

            topTen.forEach(fruit => {
                resultDiv.innerHTML += `
                    <div class="card">
                        <h4>${fruit.name}</h4>
                        <p style="font-size: 0.85em; color: #666; margin-top: -10px;">Family: ${fruit.family} | Genus: ${fruit.genus}</p>
                        <p>Calories: ${fruit.nutritions.calories} kcal</p>
                        <p>Sugar: ${fruit.nutritions.sugar}g | Protein: ${fruit.nutritions.protein}g</p>
                        <p>Fat: ${fruit.nutritions.fat}g | Carbs: ${fruit.nutritions.carbohydrates}g</p>
                        <button onclick='addFruit(${JSON.stringify(fruit)})'> Add to Plan</button>
                    </div>`;
            });
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            resultDiv.innerHTML = "<p>Failed to load data. Please check your connection.</p>";
        });
});

// Bagitahu buah added
window.addFruit = (fruit) => {
    ipcRenderer.send('save-fruit', fruit);
    alert(`${fruit.name} added to your health plan!`);
};

// Buka window analysis
viewListBtn.addEventListener('click', () => {
    ipcRenderer.send('open-analysis-window');
});