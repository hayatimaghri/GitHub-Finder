const state = {
  currentUser: null,
  bookmarks: JSON.parse(localStorage.getItem('githubBookmarks')) || [],
  isViewingBookmarks: false,
  repos: []
};

let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let resultProfil = document.getElementById("resultProfil");
let RepositoriesProfil = document.getElementById("RepositoriesProfil");
let welcomeState = document.getElementById("welcomeState");
let laodingStatut = document.getElementById("laodingStatut");
let errorStatut = document.getElementById("errorStatut");
let BookmarksList = document.getElementById("BookmarksList");
let bookmarkCount = document.getElementById("bookmarkCount");

async function fetchUser(userName) {
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
  try {
    let res = await fetch(`https://api.github.com/users/${userName}/repos?sort=stars&per_page=5`,);
    if (!res.ok) {
      throw new Error("repos not found");
    }
    let data = await res.json();
    return data;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

function displayProfil(user, respo) {
  state.currentUser = user;

  let profilContainer = document.getElementById("resultProfil");
  profilContainer.innerHTML = "";

  let card = document.createElement("div");
  card.className = "profile-card";

  card.innerHTML = `
    <div class="top">
      <img src="${user.avatar_url}" class="avatar">
      <div class="info">
        <h2>${user.name || user.login}</h2>
        <p>@${user.login}</p>
        <p class="bio">${user.bio || "No bio available"}</p>
        <div class="stats">
          <span>Followers <b>${user.followers}</b></span>
          <span>Following <b>${user.following}</b></span>
          <span>Public Repos <b>${user.public_repos}</b></span>
        </div>
      </div>
      <button class="bookmark" id="bookmarkBtn">★ Bookmark</button>
    </div>
    <a class="link" href="https://github.com/${user.login}" target="_blank">
      Visit GitHub Profile →
    </a>
  `;

  profilContainer.appendChild(card);

  profilContainer.style.display = "block";
  RepositoriesProfil.style.display = "block";
  BookmarksList.style.display = "none";
  laodingStatut.style.display = "none";
  errorStatut.style.display = "none";
  welcomeState.style.display = "none";

  
  const isAlreadyBookmarked = state.bookmarks.some(u => u.id === user.id);
  addBtnBookmarks(isAlreadyBookmarked);

  
  document.getElementById('bookmarkBtn').addEventListener('click', toggleBookmarks);

  let respoContainer = document.getElementById("RepositoriesProfil");
  respoContainer.innerHTML = "<h1>Top Repositories</h1>";

  respo.forEach(repo => {
    let div = document.createElement("div");
    div.className = "repo-card";
    div.innerHTML = `
      <div class="repo-top">
        <h3>${repo.name}</h3>
        <span>⭐ ${repo.stargazers_count}</span>
      </div>
      <p>${repo.description || "No description"}</p>
      <div class="respo-bottom">
        <span>${repo.language || "Unknown"}</span>
        <a href="${repo.html_url}" target="_blank">Open</a>
      </div>
    `;
    respoContainer.appendChild(div);
  });
}

function showLoading() {
  laodingStatut.style.display = "block";
  errorStatut.style.display = "none";
  welcomeState.style.display = "none";
  resultProfil.style.display = "none";
  RepositoriesProfil.style.display = "none";
  BookmarksList.style.display = "none";
}

function showError(message) {
  errorStatut.style.display = "block";
  errorStatut.innerText = message;
  laodingStatut.style.display = "none";
  welcomeState.style.display = "none";
  resultProfil.style.display = "none";
  RepositoriesProfil.style.display = "none";
  BookmarksList.style.display = "none";
}

function showWelcome() {
  welcomeState.style.display = "block";
  laodingStatut.style.display = "none";
  errorStatut.style.display = "none";
  resultProfil.style.display = "none";
  RepositoriesProfil.style.display = "none";
  BookmarksList.style.display = "none";
}

searchBtn.addEventListener('click', () => {
  let userName = searchInput.value.trim();
  if (userName !== "") {
    loaderUser(userName);
  }
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    let userName = searchInput.value.trim();
    if (userName !== "") {
      loaderUser(userName);
    }
  }
});

async function loaderUser(userName) {
  try {
    showLoading();
    let user = await fetchUser(userName);
    if (!user) {
      showError("Utilisateur non trouvé ❌");
      return;
    }
    let respo = await fetchRespo(userName);
    displayProfil(user, respo);
    addCountBookmarks();
  } catch (error) {
    showError(error.message);
  }
}

function loaderBookmarks() {
  let data = localStorage.getItem("githubBookmarks"); 
  if (data) {
    state.bookmarks = JSON.parse(data);
  } else {
    state.bookmarks = [];
  }
}

function saveBookmarks() {
  localStorage.setItem("githubBookmarks", JSON.stringify(state.bookmarks)); 
}

function toggleBookmarks() {
  if (!state.currentUser) return;

  let index = state.bookmarks.findIndex(u => u.id === state.currentUser.id); 
  if (index === -1) {
    state.bookmarks.push(state.currentUser);
    addBtnBookmarks(true);
  } else {
    state.bookmarks.splice(index, 1);
    addBtnBookmarks(false);
  }
  saveBookmarks();
  addCountBookmarks();
}

function removeBookmarks(id) {
  if (!confirm("Supprimer ce favori ?")) return;
  state.bookmarks = state.bookmarks.filter(u => u.id !== id);
  saveBookmarks();
  displayBookmarks();
  addCountBookmarks();
}

function addBtnBookmarks(isBookmarked) {
  const btn = document.getElementById("bookmarkBtn");
  btn.textContent = isBookmarked ? "Retirer ❌" : "Ajouter ⭐";
}

function addCountBookmarks() {
  document.getElementById("bookmarkCount").textContent = state.bookmarks.length;
}

function displayBookmarks() {
  const bookmarkContainer = document.getElementById("BookmarksList");
  bookmarkContainer.innerHTML = "";

  if (state.bookmarks.length === 0) {
    bookmarkContainer.innerHTML = "<p>Aucun favori 😢</p>";
    return;
  }

  state.bookmarks.forEach(user => {
    bookmarkContainer.innerHTML += `
      <div class="card">
        <img src="${user.avatar_url}" width="80">
        <h3>${user.login}</h3>
        <button onclick="loaderUser('${user.login}')">👁️ Voir profil</button>
        <button onclick="removeBookmarks(${user.id})">🗑️ Supprimer</button>
      </div>
    `;
  });
}

function toggleBookmarksView() {
  state.isViewingBookmarks = !state.isViewingBookmarks;

  if (state.isViewingBookmarks) {
    BookmarksList.style.display = "block";
    welcomeState.style.display = "none";
    resultProfil.style.display = "none";
    RepositoriesProfil.style.display = "none";
    laodingStatut.style.display = "none";
    errorStatut.style.display = "none";
    displayBookmarks();
  } else {
    BookmarksList.style.display = "none";
    showWelcome();
  }
}

document.getElementById('toggleBookmarks').addEventListener('click', toggleBookmarksView);

loaderBookmarks();
addCountBookmarks();