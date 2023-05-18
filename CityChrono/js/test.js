
//Function to simulate manual testing
async function testSearchFunction() {
    // Test case 1: Search for a valid city
    const validCity = "London";
    console.log(`Test case 1: Searching for ${validCity}`);
    searchInput.value = validCity;
    searchBtn.dispatchEvent(new Event("submit"));

    await new Promise((resolve) => setTimeout(resolve, 7000));

    // Test case 2: Search for an invalid city
    const invalidCity = "InvalidCity";
    console.log(`Test case 2: Searching for ${invalidCity}`);
    searchInput.value = invalidCity;
    searchBtn.dispatchEvent(new Event("submit"));

    await new Promise((resolve) => setTimeout(resolve, 5500));

    // Test case 3: Search for a valid city in the morning theme
    const valiCity = "sYdney";
    console.log(`Test case 2: Searching for ${valiCity}`);
    searchInput.value = valiCity;
    searchBtn.dispatchEvent(new Event("submit"));

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Test case 4: Search for a valid city in Arabic
    const jerCity = "القدس";
    console.log(`Test case 2: Searching for ${jerCity}`);
    searchInput.value = jerCity;
    searchBtn.dispatchEvent(new Event("submit"));

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Manual testing completed.");
}

// Call the test function
testSearchFunction();


//a test function for the To do list 
//Test creating a new todo
create_btn_el.click();

// Test marking a todo as complete
const checkbox = document.querySelector('.item input[type="checkbox"]');
checkbox.click(); 

// Test editing a todo
const input = document.querySelector('.item input[type="text"]');
input.value = "Updated todo";
input.dispatchEvent(new Event('input')); 

// Test removing a todo
const removeBtn = document.querySelector('.remove-btn');
removeBtn.click(); 

// Test maximum number of tasks reached
for (let i = 0; i < 51; i++) {
  create_btn_el.click(); // Create 50 todos
}

// Test loading and saving todos from/to local storage
localStorage.clear();
load(); 
todos.push({ id: 1, text: "Test todo", complete: false });
save();
localStorage.clear();

load(); 
console.log(todos); 

// test function to the radio function
// Test playing a station
playStation(80);
playStation(0);

// Test pausing a station
pauseStation();

// Test playing the previous station
playPrevious();

// Test playing the next station
playNext();

// Test toggling play/pause
togglePlayPause(); 



