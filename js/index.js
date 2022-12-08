// we begin by selecting the form to extract input value entered by user
const searchForm = document.querySelector("form#github-form");
const searchInp = document.querySelector("input#search");
// extraction process begins when submit is clicked
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clear(); //seeks to remove any search result that might have queried before
  const searchVal = searchInp.value; //sets the value entered by user into a variable
  getUser(searchVal); //fetch process
});
function clear() {
  const clear = document.querySelector("ul#user-list");
  clear.innerHTML = "";
}
function getUser(user) {
  fetch(`https://api.github.com/search/users?q=${user}`, {
    headers: {
      Accept: "application / vnd.github.v3 + json",
    },
  })
    .then((promise) => promise.json())
    .then(showUser) //showUser is for iterating over the elements of the response.json then returns a new array filtering the users with their details
    .catch((error) => console.log(error));
}
function showUser(objectUsers) {
  const userArr = objectUsers.items;
  userArr.forEach(showUserCard); //this function creates a frontend ui that displays user details: (avatar, username, url)
}

const userList = document.querySelector("ul#user-list");
function showUserCard(user) {
  const profile = document.createElement("div");
  profile.className = "profile";
  profile.addEventListener("click", () => {
    //listening for a click on either (avatar, username, url) to reveal the repositories of the clicked user
    const username = profile.querySelector(".username").textContent;
    getRepos(username, profile); // we pass in the 'profile' DOM selector to get access to the repo-list that will be created later in this function and used in the funtion showRepoCard down below
    profile.style.cursor = "pointer";
  });
  userList.appendChild(profile);

  const picture = document.createElement("div");
  picture.className = "profile-pic";
  const dp = document.createElement("img");
  dp.className = "avatar";
  dp.src = `${user["avatar_url"]}`;
  picture.appendChild(dp);
  profile.appendChild(picture);

  const description = document.createElement("div");
  description.className = "profile-description";
  const name = document.createElement("p");
  name.className = "username";
  name.textContent = user["login"];
  description.appendChild(name);
  const url = document.createElement("a");
  url.className = "git-url";
  url.href = `${user["html_url"]}`;
  url.textContent = `${user["html_url"]}`;
  description.appendChild(url);
  profile.appendChild(description);

  const repoList = document.createElement("ul");
  repoList.id = "repos-list";
  profile.appendChild(repoList);
}

function getRepos(username, profile) {
  //keep passing the profile arg until showRepoCard
  fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Accept: "application / vnd.github.v3 + json",
    },
  })
    .then((promise) => promise.json())
    .then((repositories) => {
      showRepo(repositories, profile); //keep passing the profile arg until showRepoCard
    })
    .catch((error) => console.log(error));
}

function showRepo(repositories, profile) {
  repositories.forEach((repository) => {
    showRepoCard(repository, profile); //keep passing the profile arg until showRepoCard
  });
}

function showRepoCard(repository, profile) {
  const repoList = profile.querySelector("ul#repos-list");
  const repoLink = document.createElement("a");
  repoLink.className = "repo-url";
  repoLink.href = repository["html_url"];
  repoLink.textContent = repository["full_name"];
  repoList.appendChild(repoLink);
}
