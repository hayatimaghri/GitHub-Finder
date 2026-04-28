const testUsers=[
    {
        id: 1,
        login: "torvalds",
        name: "Linus Torvalds",
        avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4",
        bio: "Linux creator",
        followers: 200000,
        following: 0,
        public_repos: 50
    },
    {
        id: 2,
        login: "gvanrossum",
        name: "Guido van Rossum",
        avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4",
        bio: "Python creator",
        followers: 50000,
        following: 50,
        public_repos: 30
    },
    {
        id: 3,
        login: "gaearon",
        name: "Dan Abramov",
        avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4",
        bio: "React developer",
        followers: 90000,
        following: 200,
        public_repos: 270
    },
    
]
const testRepos = [
    {
        name: "linux",
        description: "Linux kernel",
        language: "C",
        stargazers_count: 15000,
        forks_count: 2000,
        html_url: "https://github.com/torvalds/linux"
    },
    {
        name: "cpython",
        description: "Python interpreter",
        language: "C",
        stargazers_count: 50000,
        forks_count: 23000,
        html_url: "https://github.com/python/cpython"
    },
    {
        name: "react",
        description: "Frontend JavaScript library",
        language: "JavaScript",
        stargazers_count: 210000,
        forks_count: 45000,
        html_url: "https://github.com/facebook/react"
    },
    {
        name: "vue",
        description: "Progressive JavaScript framework",
        language: "JavaScript",
        stargazers_count: 200000,
        forks_count: 33000,
        html_url: "https://github.com/vuejs/vue"
    },
    {
        name: "tensorflow",
        description: "Machine learning library",
        language: "Python",
        stargazers_count: 180000,
        forks_count: 88000,
        html_url: "https://github.com/tensorflow/tensorflow"
    }
]
const state = {
    currentUser: null,      
    bookmarks: [],         
    isViewingBookmarks: false 
}
let searchInput=document.getElementById("searchInput");
let searchBtn= document.getElementById("searchBtn");
let resultProfil=document.getElementById("resultProfil");
let RepositoriesProfil=document.getElementById("RepositoriesProfil");
let welcomeState=document.getElementById("welcomeState");
let laodingStatut=document.getElementById("laodingStatut");
let errorStatut=document.getElementById("errorStatut");
let BookmarksList=document.getElementById("BookmarksList");
let bookmarkCount=document.getElementById("bookmarkCount");

function displayProfil(user){
    let container = document.getElementById("resultProfil");
    container.innerHTML = ""

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

    container.appendChild(card);
}

function displayRepos(){
    let container = document.getElementById("RepositoriesProfil");
    container.innerHTML = "<h1>Top Repositories</h1>";

    testRepos.forEach(repo => {

        let div = document.createElement("div");
        div.className = "repo-card";

        div.innerHTML = `
            <div class="repo-top">
                <h3>${repo.name}</h3>
                <span>⭐ ${repo.stargazers_count}</span>
            </div>

            <p>${repo.description || "No description"}</p>

            <div class="repo-bottom">
                <span>${repo.language}</span>
                <a href="${repo.html_url}" target="_blank">Open</a>
            </div>
        `;

        container.appendChild(div);
    });
}
searchBtn.addEventListener("click", () => {

    showLoading();

    setTimeout(() => {
        let value = searchInput.value.trim().toLowerCase();

        let user = testUsers.find(u =>
            u.login.toLowerCase() === value ||
            u.name.toLowerCase() === value
        );

        if(!user){
            showError("User not found ❌");
            return;
        }

        laodingStatut.style.display = "none";

        state.currentUser = user;
        

        displayProfil(user);
        displayRepos();

        resultProfil.style.display = "block";
        RepositoriesProfil.style.display = "block";

    }, 1000);
});

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