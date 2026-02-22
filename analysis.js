const { ipcRenderer } = require('electron');

async function loadAndAnalyze() {
    const fruits = await ipcRenderer.invoke('load-fruits');
    const listContainer = document.getElementById("fruitList");
    
    listContainer.innerHTML = ""; 

    if (!fruits || fruits.length === 0) {
        listContainer.innerHTML = "<p>No fruits in your plan yet.</p>";
        document.getElementById('avgCal').innerText = "Average Calories: 0 kcal";
        document.getElementById('highSugar').innerText = "Highest Sugar Fruit: -";
        return;
    }

    let totalCal = 0;
    let maxSugar = -1;
    let sweetName = "";

    fruits.forEach((fruit, index) => {
        totalCal += fruit.nutritions.calories;

        if (fruit.nutritions.sugar > maxSugar) {
            maxSugar = fruit.nutritions.sugar;
            sweetName = fruit.name;
        }

        const currentNote = fruit.notes || "";

        const card = document.createElement("div");
        card.className = "fruit-card"; 

        card.innerHTML = `
            <div class="card-header">
                <strong style="color: #00796b; font-size: 1.1em;">${fruit.name}</strong> 
                <button onclick="deleteFruit(${index})" class="delete-btn">Delete</button>
            </div>
            <p class="nutri-info">Cal: ${fruit.nutritions.calories} | Sugar: ${fruit.nutritions.sugar}g</p>
            
            <div class="note-section">
                <input type="text" id="note-input-${index}" value="${currentNote}" placeholder="Add personal note...">
                <button onclick="saveNote(${index})" class="save-btn">Save Note</button>
            </div>
        `;
        listContainer.appendChild(card);
    });

    const average = (totalCal / fruits.length).toFixed(2);
    document.getElementById('avgCal').innerText = `Average Calories: ${average} kcal`;
    document.getElementById('highSugar').innerText = `Highest Sugar Fruit: ${sweetName} (${maxSugar}g)`;
}

// simpan nota ke JSON
window.saveNote = (index) => {
    const noteValue = document.getElementById(`note-input-${index}`).value;
    
    ipcRenderer.send('update-fruit-note', { index: index, note: noteValue });
    
    alert(`Note for fruit saved to database!`);
};

//confirmation del buah
window.deleteFruit = (index) => {
    if(confirm("Remove this fruit from your plan?")) {
        ipcRenderer.send('delete-fruit', index);
        setTimeout(loadAndAnalyze, 100);
    }
};

loadAndAnalyze();