// START To-Do-List Div
// in the name of allah
const list_el = document.getElementById("list");
const create_btn_el = document.getElementById("create");

// global vriable thatll hold todos info on the screen
let todos = [];

create_btn_el.addEventListener('click', CreateNewTodo);

// function CreateNewTodo() {
//     // a new Todo object
//     const item = {
//         id: new Date().getTime(),
//         text: "",
//         complete: false
//     }
//     todos.unshift(item);

//     const { item_el, input_el } = CreateTodoElement(item);

//     list_el.prepend(item_el);

//     input_el.removeAttribute("disabled");
//     input_el.focus();

//     save(); //this will save our data to the local storage
// }
function CreateNewTodo() {
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
// END To-Do-List Div

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

// START News Section
const API_KEY = "6a48f4f797c8464498e112e7628e2c8b"
const URL = "https://newsapi.org/v2/everything?q="

async function fetchData(query) {
    const res = await fetch(`${URL}${query}&apiKey=${API_KEY}`) //&category=${category}
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
                    <div class="newsTitle">
                        <h4 class="newsTitleH4">${arr[i].title}</h4>
                        <p class="newsTitleP">${arr[i].description}</p>
                    </div>
                    </a>
                </div>
                `;
            } else {
                newsdisplayHTML += `
                <div class="newsCards">
                    <a class="newsDetails" href=${arr[i].url} target="_blank">
                    <img src=${arr[i].urlToImage} alt="">
                    <div class="newsTitle">
                        <h5 class="newsTitleH5">${arr[i].title}</h5>
                        <p class="newsTitleP">${arr[i].description}</p>
                    </div>
                    </a>
                </div>
                `;
            }
        }
    }

    document.getElementById("newsdisplay").innerHTML = newsdisplayHTML
}


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
        document.querySelector(".timpsec").style.background = "#071420";
        document.querySelector(".time").style.background = "#546a7e59";
        document.querySelector(".time").style.boxShadow = "1px 1px 2px 2px #00000073";
        document.querySelector(".weather").style.background = "#546a7e59";
        document.querySelector(".weather").style.boxShadow = "1px 1px 2px 2px #00000073";
        document.querySelector(".iconOfTime").style.color = "rgba(229, 236, 233, 0.4)";
        document.querySelector(".verticalLine").style.background = "rgba(229, 236, 233, 0.4)";
        document.querySelector(".city").style.color = "#ffff";
        document.querySelector(".currentTimeInHour").style.color = "#ffff";
        document.querySelector(".currentTimeInMin").style.color = "#ffff";
        document.querySelector(".statusTime").style.color = "rgba(229, 236, 233, 0.6)";
        document.querySelector(".day").style.color = "#ffff";
        document.querySelector(".date_month").style.color = "#ffff";
        document.querySelector(".date_num").style.color = "#ffff";
        document.querySelector(".temp").style.color = "#ffff";
        document.querySelector(".cel").style.color = "#ffff";
        document.querySelector(".status").style.color = "#ffff";


        //morning
    } else {
        document.querySelector(".timpsec").style.background = "#BDCDD6";
        document.querySelector(".time").style.background = "#93BFCF";
        document.querySelector(".time").style.boxShadow = "1px 1px 2px 2px #b9b7b7";
        document.querySelector(".weather").style.background = "#93BFCF";
        document.querySelector(".weather").style.boxShadow = "1px 1px 2px 2px #b9b7b7";
        document.querySelector(".iconOfTime").style.color = "#0000008c";
        document.querySelector(".verticalLine").style.background = "rgba(229, 236, 233, 0.4)";
        document.querySelector(".city").style.color = "#062232";
        document.querySelector(".currentTimeInHour").style.color = "#062232";
        document.querySelector(".currentTimeInMin").style.color = "#062232";
        document.querySelector(".statusTime").style.color = "rgba(6, 34, 50, 0.6)";
        document.querySelector(".day").style.color = "#062232";
        document.querySelector(".date_month").style.color = "#062232";
        document.querySelector(".date_num").style.color = "#062232";
        document.querySelector(".temp").style.color = "#062232";
        document.querySelector(".cel").style.color = "#062232";
        document.querySelector(".status").style.color = "#062232";

        //Body
        document.querySelector(".body").style.background = "#93bfcf7d";
        document.querySelector(".headerSection").style.color = "#000";
        document.querySelector(".headerSection .material-symbols-outlined").style.color = "#000000bd";
        //ToDo
        document.querySelector(".todo-wrapper header").style.background = "#93BFCF";
        document.querySelector(".todo-wrapper header .title").style.color = "#000";
        document.querySelector(".todo-wrapper header h1").style.color = "#000";
        document.querySelector(".todo-wrapper .icon").style.color = "#000";
        document.querySelector(".todo-wrapper").style.background = "#93bfcf4d";
        document.querySelector(".item input[type='text']").style.color = "#000";
        document.querySelector(".item input[type='checkbox']").style.border = "2px solid #000";
        //spotify
        document.querySelector(".media-wrapper .media-tabs").style.background = "#93BFCF";
        document.querySelector(".media-wrapper .material-symbols-outlined").style.color = "#000";

        document.querySelector(".media-wrapper .spot-content").style.background = "#93bfcf4d";
        document.querySelector("#back-to-main").style.background = "#93BFCF";
        //News
        document.querySelector(".newsSection .container .newsNav").style.background = "#93BFCF";
        document.querySelector(".newsSection .container").style.background = "#93bfcf4d";
        document.querySelector("#newsdisplay .newsCard .newsTitle").style.color = "#000";
        document.querySelector("#newsdisplay .newsCards .newsTitle").style.color = "#000";
        document.querySelector("#newsdisplay .newsCard .newsTitle .newsTitleP").style.color = "#000";
        document.querySelector("#newsdisplay .newsCards .newsTitle .newsTitleP").style.color = "#000";


    }
    //END Background & Color Theam
}
//END Time & Temp Section