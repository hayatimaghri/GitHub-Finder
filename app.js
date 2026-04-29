const state = {
    currentUser: null,      
    bookmarks: [],          
    isViewingBookmarks: false ,
    repos :[]
};
let searchInput=document.getElementById("searchInput");
let searchBtn= document.getElementById("searchBtn");
let resultProfil=document.getElementById("resultProfil");
let RepositoriesProfil=document.getElementById("RepositoriesProfil");
let welcomeState=document.getElementById("welcomeState");
let laodingStatut=document.getElementById("laodingStatut");
let errorStatut=document.getElementById("errorStatut");
let BookmarksList=document.getElementById("BookmarksList");
let bookmarkCount=document.getElementById("bookmarkCount");


async function fetchUser(userName){
    try {
        let response = await fetch(`https://api.github.com/users/${userName}`);

        if (!response.ok) {
            throw new Error("User not found ❌");
        }

        let data = await response.json();
        return data;

    } catch (err) {
        console.log(err.message);
        return null;
    }
}
async function fetchRespo(userName) {
    try{
        let res= await fetch(`https://api.github.com/users/${userName}/repos?sort=stars&per_page=5`)
        if(!res.ok){
            throw new Error("repos not found")
        }
        let data= await res.json()
        return data
    } catch (err){
        console.log(err.message);
        return null
    }
}
function displayProfil(user , respo){
    let profilContainer = document.getElementById("resultProfil");
profilContainer.innerHTML = ""

    let card = document.createElement("div");
    card.className = "profile-card";

    card.innerHTML = `
        <div class="top">
            <img src="${user.avatar_url}" class="avatar">

            <div class="info">
                <h2>${user.name}</h2>
                <p>@${user.login}</p>
                <p class="bio">${user.bio || "No bio available"}</p>

                <div class="stats">
                    <span>Followers <b>${user.followers}</b></span>
                    <span>Following <b>${user.following}</b></span>
                    <span>Public Repos <b>${user.public_repos}</b></span>
                </div>
            </div>

            <button class="bookmark">★ Bookmark</button>
        </div>

        <a class="link" href="https://github.com/${user.login}" target="_blank">
            Visit GitHub Profile →
        </a>
    `;
     profilContainer.appendChild(card);

     let respoContainer = document.getElementById("RepositoriesProfil");
    respoContainer.innerHTML = "<h1>Top Repositories</h1>";

    respo.forEach(respo => {

        let div = document.createElement("div");
        div.className = "repo-card";

        div.innerHTML = `
            <div class="repo-top">
                <h3>${respo.name}</h3>
                <span>⭐ ${respo.stargazers_count}</span>
            </div>

            <p>${respo.description || "No description"}</p>

            <div class="respo-bottom">
                <span>${respo.language}</span>
                <a href="${respo.html_url}" target="_blank">Open</a>
            </div>
        `;

        respoContainer.appendChild(div);
    });
}

function showLoading() {
    laodingStatut.style.display = "block";
    errorStatut.style.display = "none";
    welcomeState.style.display = "none";
}
function showError(message) {
errorStatut.style.display = "block";
errorStatut.innerText = message;

    laodingStatut.style.display = "none";
    welcomeState.style.display = "none";
}
function showWelcome() {
    welcomeState.style.display = "block";
    laodingStatut.style.display = "none";
    errorStatut.style.display = "none";
}

searchBtn.addEventListener('click', () => {
let userName= searchInput.value.trim()
if ( userName !==""){
    loaderUser(userName)
}
   
});
searchInput.addEventListener('keypress', (event) => {
   if(event.key=== "Enter"){
    let userName= searchInput.value.trim()
 }
 if ( userName !==""){
    loaderUser(userName)
 }
});

async function loaderUser(userName){
try{
    showLoading()
    let user= await fetchUser(userName);
    let respo= await fetchRespo(userName);
    displayProfil(user,respo)
    }
    catch (error){
            showError(error.message);
  }
    }
