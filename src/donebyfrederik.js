let REPOS = [];
let CONTRIBUTORS = [];
let SELECTED_REPO_INDEX = -1;

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === "html") {
      elem.innerHTML = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

async function onSelectRepo(e) {
  console.log(e.target.value);
  const name = e.target.value;
  SELECTED_REPO_INDEX = REPOS.findIndex(repo => repo.name === name);
  const repo = REPOS[SELECTED_REPO_INDEX];

  const res = await fetch(repo.contributors_url);
  const json = await res.json();
  console.log(json);
  CONTRIBUTORS = json;

  update();
}

function update() {
  const $root = document.querySelector("#root");
  $root.innerHTML = "";

  // Select menu
  const $select = createAndAppend("select", $root);
  $select.addEventListener("change", onSelectRepo);
  for (const repo of REPOS) {
    const $option = createAndAppend("option", $select, { html: repo.name });
    //$option.innerHTML = repo.name;
  }

  // Render repo details
  if (SELECTED_REPO_INDEX >= 0) {
    const repo = REPOS[SELECTED_REPO_INDEX];
    const repoUrl = `https://github.com/hackyourfuture/${repo.name}`;
    const $detailsDiv = createAndAppend("div", $root, {
      className: "repo-details"
    });
    const $repoName = createAndAppend("p", $detailsDiv, {
      className: "repo-name"
    });
    const $repoLink = createAndAppend("a", $repoName, {
      href: repoUrl,
      html: repo.name
    });

    const $contributorsDiv = createAndAppend("div", $root, {
      className: "contributors"
    });
    const $contributorsList = createAndAppend("ul", $contributorsDiv, {
      className: "contributors-list"
    });

    for (contributor of CONTRIBUTORS) {
      const $contributorItem = createAndAppend("li", $contributorsList, {
        className: "contributor"
      });
      const $contributorLogin = createAndAppend("p", $contributorItem, {
        className: "contributor-login",
        html: contributor.login
      });
    }
  }
}

async function fetchRepos() {
  const res = await fetch(
    "https://api.github.com/orgs/HackYourFuture/repos?per_page=100"
  );
  const json = await res.json();
  console.log(json);
  REPOS = json;
  SELECTED_REPO_INDEX = 3;
  update();
}

fetchRepos();
