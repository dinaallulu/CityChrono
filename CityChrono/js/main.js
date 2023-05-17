// START ToDO & Spotify & Radio Section

// START To-Do-List Div

// start of Create Todo Element function
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
    const response = await fetch(apiurl + query)
    var data = await response.json();          //diaplay as json formate
    console.log(data);                        //display data
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp); //لتقريب الرقم الى عدد صحيح
    document.querySelector(".status").innerHTML = data.weather[0].description;

    //  ...........check for image status...........
    if (data.weather[0].main == "Clouds") {
        weatherImg.src = "image/clouds.png";
    }
    else if (data.weather[0].main == "Clear") {
        weatherImg.src = "image/clear.png";
    }
    else if (data.weather[0].main == "Rain") {
        weatherImg.src = "image/rain.png";
    }
    else if (data.weather[0].main == "Drizzle") {
        weatherImg.src = "image/drizzle.png";
    }
    else if (data.weather[0].main == "Mist") {
        weatherImg.src = "image/mist.png";
    }
    else if (data.weather[0].main == "Snow") {
        weatherImg.src = "image/snow.png";
    }
    // else if (data.weather[0].main == "fog") {
    //     weatherImg.src = "image/fog.png";
    // }

    checkDateTime(data["coord"]["lon"], data["coord"]["lat"]);
}

async function checkDateTime(lon, lat) {
    const response = await fetch('https://api.ipgeolocation.io/timezone?apiKey=9ee80e5230a846c590b7559c62101142&lat=' + lat + '&long=' + lon);
    var data = await response.json();          //diaplay as json formate

    console.log(data);

    const myArray = data["date_time_txt"].split(" ");
    document.querySelector(".day").innerHTML = myArray[0];
    document.querySelector(".date_month").innerHTML = myArray[1];
    document.querySelector(".date_num").innerHTML = myArray[2];

    // console.log(myArray[0])
    // console.log(myArray[1])

    const myArray2 = data["time_12"].split(" ");
    document.querySelector(".statusTime").innerHTML = myArray2[1];
    const myArray3 = data["time_12"].split(":");
    document.querySelector(".currentTimeInHour").innerHTML = myArray3[0] + ':';
    document.querySelector(".currentTimeInMin").innerHTML = myArray3[1];
    // console.log(myArray2[1])


    //START Background & Color Theam

    //change time depend on time
    let time1 = data["date"] + ' 20:00';
    let time2 = data["date"] + ' 07:00';
    //night
    if (data["date_time"] > time1 || data["date_time"] < time2) {
        //Body
        document.querySelector(".body").style.background = "#071420";
        document.querySelectorAll(".body, .headerSection, .textFooter, .aFooter").forEach(el => el.style.color = "#fff");
        document.querySelector(".headerSection .material-symbols-outlined").style.color = "#ffffffd4";

        //BackGround Feature
        document.querySelectorAll(".BGfeature").forEach(el => el.style.background = "#253141");
        document.querySelectorAll(".innerBG").forEach(el => el.style.background = "#546a7b66");

        //Color Font
        document.querySelectorAll(".colorFont").forEach(el => el.style.color = "#fff");

        //ToDo
        document.querySelectorAll(".item").forEach(el => el.style.background = "#546a7e59");
        document.querySelector(".item input[type='text']").style.color = "#fff";
        document.querySelector(".item input[type='checkbox']").style.border = "2px solid #fff";

        items.forEach(item => {
            const input = item.querySelector('input[type="text"]');
            input.style.fontSize = '16px';
            input.style.color = '#fff';
        });

        const checkboxInputs = document.querySelectorAll('.item input[type="checkbox"]');
        checkboxInputs.forEach(input => {
            input.style.border = "2px solid #fff";
            input.addEventListener('change', function () {
                if (this.checked) {
                    this.style.backgroundColor = "#fff";
                    this.style.borderColor = "#fff";
                    this.style.position = "relative";
                } else {
                    this.style.backgroundColor = "";
                    this.style.borderColor = "#fff";
                    this.style.position = "";
                }
            });
        });

        const completedItems = document.querySelectorAll('.item.complete input[type="text"]');

        for (let i = 0; i < completedItems.length; i++) {
            completedItems[i].style.textDecoration = "line-through";
            completedItems[i].style.textDecorationThickness = "2px";
            completedItems[i].style.textDecorationColor = "#fff";
            completedItems[i].style.textDecorationStyle = "solid";
        }


        const checkedCheckboxInputs = document.querySelectorAll('.item input[type="checkbox"]:checked');
        checkedCheckboxInputs.forEach(input => {
            input.style.backgroundColor = "#fff";
            input.style.borderColor = "#fff";
            input.style.position = "relative";
        });

        const checkedCheckboxInputBefore = document.querySelectorAll('.item input[type="checkbox"]:checked::before');
        checkedCheckboxInputBefore.forEach(input => {
            input.style.content = "'\\2713'";
            input.style.fontSize = "18px";
            input.style.fontWeight = "900";
            input.style.position = "absolute";
            input.style.top = "50%";
            input.style.left = "50%";
            input.style.transform = "translate(-50%, -50%)";
        });

        //Spotify
        document.querySelectorAll(".media-wrapper span, .media-wrapper svg").forEach(el => el.style.fill = "#fff");
        document.querySelectorAll(".media-wrapper span, .media-wrapper svg").forEach(el => el.style.color = "#fff");

        //Radio
        document.querySelectorAll(".radio-content #radioContainer .imgRadio img").forEach(el => el.style.border = "10px solid #071420");
        document.querySelector(".radio-content #radioControls").style.background = "#071420";

        //News
        document.querySelectorAll(".dropdown-item, lastestNews").forEach(el => el.style.color = "#fff");
        document.querySelectorAll("#newsdisplay .newsCards .newsTitle .newsTitleH5, #newsdisplay .newsCards .newsTitle .newsTitleP").forEach(el => el.style.color = "#fff");
    } 

    //morning
    else { 
        //Body
        document.querySelector(".body").style.background = "#93bfcf7d";
        document.querySelectorAll(".body, .headerSection, .textFooter, .aFooter").forEach(el => el.style.color = "#062232");
        document.querySelector(".headerSection .material-symbols-outlined").style.color = "#000000bd";

        //BackGround Feature
        document.querySelectorAll(".BGfeature").forEach(el => el.style.background = "#93BFCF");
        document.querySelectorAll(".innerBG").forEach(el => el.style.background = "#93bfcf4d");

        //Color Font
        document.querySelectorAll(".colorFont").forEach(el => el.style.color = "#062232");

        //ToDo
        document.querySelectorAll(".item").forEach(el => el.style.background = "#93BFCF");
        document.querySelector(".item input[type='text']").style.color = "#062232";
        document.querySelector(".item input[type='checkbox']").style.border = "2px solid #062232";

        items.forEach(item => {
            const input = item.querySelector('input[type="text"]');
            input.style.fontSize = '16px';
            input.style.color = '#000';
        });

        const checkboxInputs = document.querySelectorAll('.item input[type="checkbox"]');
        checkboxInputs.forEach(input => {
            input.style.border = "2px solid #000";
            input.addEventListener('change', function () {
                if (this.checked) {
                    this.style.backgroundColor = "#062232";
                    this.style.borderColor = "#062232";
                    this.style.position = "relative";
                } else {
                    this.style.backgroundColor = "";
                    this.style.borderColor = "#062232";
                    this.style.position = "";
                }
            });
        });

        const completedItems = document.querySelectorAll('.item.complete input[type="text"]');

        for (let i = 0; i < completedItems.length; i++) {
            completedItems[i].style.textDecoration = "line-through";
            completedItems[i].style.textDecorationThickness = "2px";
            completedItems[i].style.textDecorationColor = "#062232";
            completedItems[i].style.textDecorationStyle = "solid";
        }


        const checkedCheckboxInputs = document.querySelectorAll('.item input[type="checkbox"]:checked');
        checkedCheckboxInputs.forEach(input => {
            input.style.backgroundColor = "#062232";
            input.style.borderColor = "#062232";
            input.style.position = "relative";
        });

        const checkedCheckboxInputBefore = document.querySelectorAll('.item input[type="checkbox"]:checked::before');
        checkedCheckboxInputBefore.forEach(input => {
            input.style.content = "'\\2713'";
            input.style.fontSize = "18px";
            input.style.fontWeight = "900";
            input.style.position = "absolute";
            input.style.top = "50%";
            input.style.left = "50%";
            input.style.transform = "translate(-50%, -50%)";
        });

        //Spotify
        document.querySelectorAll(".media-wrapper span, .media-wrapper svg").forEach(el => el.style.fill = "#062232");
        document.querySelectorAll(".media-wrapper span, .media-wrapper svg").forEach(el => el.style.color = "#062232");

        //Radio
        document.querySelectorAll(".radio-content #radioContainer .imgRadio img").forEach(el => el.style.border = "10px solid #93BFCF");

        //News
        document.querySelectorAll(".dropdown-item, lastestNews").forEach(el => el.style.color = "#000");
        document.querySelectorAll("#newsdisplay .newsCards .newsTitle , #newsdisplay .newsCards .newsTitle .newsTitleP").forEach(el => el.style.color = "#000");
    }
    //END Background & Color Theam
}
//END Time & Temp Section
