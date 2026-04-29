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
        let res= await fetch('https://api.github.com/users/{username}/repos?sort=stars&per_page=5')
        if(res.ok){
            throw new Error("repos not found")
        }
        let data= await res.json()
        return data
    } catch (err){
        console.log(err.message);
        return null
    }
}