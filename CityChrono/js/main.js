// START ToDO & Spotify & Radio Section

// START To-Do-List Div
const list_el = document.getElementById("list");
const create_btn_el = document.getElementById("create");

let todos = [];

create_btn_el.addEventListener('click', CreateNewTodo);
function CreateNewTodo() {
    // check the number of tasks if its 50 
    if (todos.length >= 50) {
        alert("You have reached the maximum number of tasks.");
        return;
    }
    // a new Todo object
    const item = {
        id: new Date().getTime(),
        text: "",
        complete: false
    }
    // check if todo already exists in array
    if (todos.find(todo => todo.id === item.id)) {
        return;
    }
    todos.unshift(item);

    const { item_el, input_el } = CreateTodoElement(item);

    list_el.prepend(item_el);

    input_el.removeAttribute("disabled");
    input_el.focus();

    save(); //this will save our data to the local storage
}

// start of Create Rodo Element function
function CreateTodoElement(item) {
    const item_el = document.createElement("div");
    item_el.classList.add("item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.complete;

    if (item.complete) {
        item_el.classList.add("complete");
    }

    const input_el = document.createElement("input");
    input_el.type = "text";
    input_el.value = item.text;
    input_el.setAttribute("disabled", "");

    const actions_el = document.createElement("div");
    actions_el.classList.add("actions");

    const edit_btn_el = document.createElement("button");
    edit_btn_el.classList.add("material-icons");
    edit_btn_el.innerHTML = '<span class="material-symbols-outlined icon">edit</span>';

    const remove_btn_el = document.createElement("button");
    remove_btn_el.classList.add("material-icons", "remove-btn");
    remove_btn_el.innerHTML = '<span class="material-symbols-outlined icon">close</span>';

    actions_el.append(edit_btn_el);
    actions_el.append(remove_btn_el);

    item_el.append(checkbox);
    item_el.append(input_el);
    item_el.append(actions_el);

    // events when creating the elements
    checkbox.addEventListener("change", () => {
        item.complete = checkbox.checked;

        if (item.complete) {
            item_el.classList.add("complete");
        } else {
            item_el.classList.remove("complete");
        }

        save();
    });

    input_el.addEventListener('input', () => {
        item.text = input_el.value;
    });

    input_el.addEventListener("blur", () => {
        input_el.setAttribute("disabled", "");
        save();
    });

    edit_btn_el.addEventListener("click", () => {
        input_el.removeAttribute("disabled");
        input_el.focus();
    });

    remove_btn_el.addEventListener("click", () => {
        todos = todos.filter(t => t.id != item.id);

        item_el.remove();

        save();
    });

    return { item_el, input_el, edit_btn_el, remove_btn_el }

}
// to make the Tasks when refreshing 
function DisplayTodos() {
    load();

    for (let i = 0; i < todos.length; i++) {
        const item = todos[i];

        const { item_el } = CreateTodoElement(item);

        list_el.append(item_el);
    }
}

DisplayTodos();

// to remove the removed tasks from the local storage
function save() {
    // Remove deleted items from the `todos` array
    todos = todos.filter(todo => !todo.deleted);

    // Save the updated `todos` array to local storage
    const save = JSON.stringify(todos);
    localStorage.setItem("tasks", save);
}


function load() {
    const data = localStorage.getItem("tasks");

    if (data) {
        todos = JSON.parse(data);
    }
}

const items = document.querySelectorAll('.item');

items.forEach(item => {
    const input = item.querySelector('input[type="text"]');
    input.style.appearance = 'none';
    input.style.background = 'none';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.fontWeight = '700';
    input.style.fontSize = '16px';
    input.style.color = '#E5ECE9';
    input.style.flex = '1 1 0%';
});
// END To-Do-List Div
// START Radio Div
// Set up API endpoint
const url = "https://de1.api.radio-browser.info/json/stations/bycountry/canada";

// Keep track of currently playing audio and current station
let currentAudio = null;
let currentStationIndex = 0;
let stations = [];

// Make an AJAX request to fetch the stations
$.ajax({
    contentType: "application/json",
    method: "POST",
    url: url,
    data: {
        countrycode: "CA",
    },
    success: function (data) {
        stations = data;
        for (let i = 0; i < stations.length; i++) {
            const station = stations[i];
            const name = station.name;
            const url = station.url;
            const stationElement = createStationElement(name, url);
            $("#radioContainer").append(stationElement);
        }
    },
});

// Function to create station element
function createStationElement(name, url) {
    const element = $(`
    <div class="radioDiv">
        <audio src="${url}"></audio>
    </div>
`);
    return element;
}

function togglePlayPause() {
    const currentAudioElement = getCurrentAudioElement();
    const playPauseButton = $("#playPauseButton");

    if (currentAudioElement.paused) {
        playStation(currentStationIndex);
        playPauseButton.html(
            '<span class="material-symbols-outlined">pause_circle</span>'
        );
    } else {
        pauseStation();
        playPauseButton.html(
            '<span class="material-symbols-outlined">play_circle</span>'
        );
    }
}

// Function to play a station by index
function playStation(index) {
    if (index < 0 || index >= stations.length) {
        return;
    }

    const currentAudioElement = getCurrentAudioElement();
    if (currentAudioElement) {
        currentAudioElement.pause();
        $("#playButton").show();
        $("#pauseButton").hide();
    }

    const stationElement = $(".radioDiv").eq(index);
    const audioElement = stationElement.find("audio")[0];

    audioElement.play();
    currentStationIndex = index;

    // Update the currently playing station name
    const currentStationName = stations[index].name;
    $("#currentStationName").text(currentStationName);

    // Toggle visibility of play/pause buttons
    stationElement.find("#playButton").hide();
    stationElement.find("#pauseButton").show();
}

// Function to pause the currently playing station
function pauseStation() {
    const currentAudioElement = getCurrentAudioElement();
    if (currentAudioElement) {
        currentAudioElement.pause();
        $("#playButton").show();
        $("#pauseButton").hide();
    }

    // Toggle visibility of play/pause buttons
    const stationElement = $(".radioDiv").eq(currentStationIndex);
    stationElement.find("#playButton").show();
    stationElement.find("#pauseButton").hide();
}

// Function to play the previous station
function playPrevious() {
    playStation(currentStationIndex - 1);
}

// Function to play the next station
function playNext() {
    playStation(currentStationIndex + 1);
}

// Function to get the current audio element
function getCurrentAudioElement() {
    const currentStationElement = $(".radioDiv").eq(currentStationIndex);
    if (currentStationElement.length) {
        return currentStationElement.find("audio")[0];
    }
    return null;
}
// END Radio Div

// START Spotify Div 
const playlistContainer = document.getElementById("playlist-container");
const backToMainButton = document.getElementById("back-to-main");
const showPlaylistButtons = document.querySelectorAll("[id^='show-playlist']");

// Hide all playlists except the first one
const playlists = playlistContainer.querySelectorAll("iframe");
for (let i = 0; i < playlists.length; i++) {
    playlists[i].style.display = "none";
}

// Show the playlist associated with the pressed button
function showPlaylist() {
    // Get the playlist number from the button ID
    const playlistNumber = parseInt(this.id.slice(-1));
    // Hide all playlists except the selected one
    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === `playlist${playlistNumber}-iframe`) {
            playlists[i].style.display = "block";
        } else {
            playlists[i].style.display = "none";
        }
    }
    // Show the back to main button
    backToMainButton.style.display = "block";
    // Hide all show playlist buttons
    for (let i = 0; i < showPlaylistButtons.length; i++) {
        showPlaylistButtons[i].style.display = "none";
    }
}

// Add event listeners to all show playlist buttons
for (let i = 0; i < showPlaylistButtons.length; i++) {
    showPlaylistButtons[i].addEventListener("click", showPlaylist);
}

// Show all show playlist buttons and hide the back to main button
function backToMain() {
    for (let i = 0; i < showPlaylistButtons.length; i++) {
        showPlaylistButtons[i].style.display = "inline-block";
    }
    for (let i = 0; i < playlists.length; i++) {
        playlists[i].style.display = "none";
    }
    backToMainButton.style.display = "none";
}

// Add event listener to back to main button
backToMainButton.addEventListener("click", backToMain);

// END Spotify Div

// END ToDO & Spotify & Radio Section

// START News Section
const API_KEY = "6a48f4f797c8464498e112e7628e2c8b"
const URLNews = "https://newsapi.org/v2/everything?q="

async function fetchData(query) {
    const res = await fetch(`${URLNews}${query}&apiKey=${API_KEY}`)
    const data = await res.json()
    return data
}

fetchData("all").then(data => renderMain(data.articles))

function renderMain(arr) {

    let newsdisplayHTML = ''
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].urlToImage) {
            if (i === 0 || i == 5 || (i > 5 && (i + 1) % 5 === 0)) {
                newsdisplayHTML += `
                <div class="newsCard">
                    <a class="newsDetails" href=${arr[i].url} target="_blank">
                    <img src=${arr[i].urlToImage} alt="">
                    <div class="overlay"></div>
                    <div class="newsTitle colorFont">
                        <h4 class="newsTitleH4">${arr[i].title}</h4>
                        <p class="newsTitleP">${arr[i].description}</p>
                    </div>
                    </a>
                </div>
                `;
            } else {
                newsdisplayHTML += `
                <div class="newsCards">
                    <a class="newsDetails" href=${arr[i].URLNews} target="_blank">
                    <img src=${arr[i].urlToImage} alt="">
                    <div class="newsTitle colorFont">
                        <h5 class="newsTitleH5 colorFont">${arr[i].title}</h5>
                        <p class="newsTitleP colorFont">${arr[i].description}</p>
                    </div>
                    </a>
                </div>
                `;
            }
        }
    }

    document.getElementById("newsdisplay").innerHTML = newsdisplayHTML
}

// Search Section
const searchBtn = document.getElementById("searchForm")
const searchInput = document.getElementById("searchInput")

const apiurl = "https://api.openweathermap.org/data/2.5/weather?&appid=567973fdab5e69ef7945f272ce1591d2&units=metric&q=";
const weatherImg = document.querySelector(".weather_img");


searchBtn.addEventListener("submit", async (e) => {
    e.preventDefault()
    Search(searchInput.value)
    console.log(searchInput.value)

    const data = await fetchData(searchInput.value)
    renderMain(data.articles)

})

async function Search(query) {
    const dataD = await fetchData(query)
    renderMain(dataD.articles)

    // END News Section

    // START Time & Temp Section
    
    //END Background & Color Theam
}
//END Time & Temp Section
