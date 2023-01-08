const dotenv = require("dotenv").config();
const fs = require("fs");
const githubToken = process.env.GITHUB_TOKEN;
const { Octokit } = require("@octokit/core");

// timestamp format is YYYY-MM-DDTHH:MM:SSZ
const hackathonStartDate = new Date("2022-12-01T00:00:00Z");
const hackathonEndDate = new Date("2023-01-10T00:00:00Z");

const octokit = new Octokit({
  auth: githubToken,
});

// get the commits for the repository links listed in repos.json

const repositoryLinks = JSON.parse(fs.readFileSync("repos.json", "utf8"));

// make a list of owners and repos from the links
const repos = repositoryLinks.map((link) => {
  const [owner, repo] = link.split("/").slice(-2);
  return { owner, repo };
});

// get all the commits for a repo
const getCommits = async (owner, repo) => {
  const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner,
    repo,
  });

  return commits.data;
};

const getFirstCommit = async (owner, repo) => {
  const commits = await getCommits(owner, repo);
  return commits[commits.length - 1];
};

// get the first commit for each repo and convert the timestamp to a date
const getFirstCommitDates = async () => {
  const validRepos = [];
  const firstCommitDates = await Promise.all(
    repos.map(async ({ owner, repo }) => {
      const firstCommit = await getFirstCommit(owner, repo);
      return new Date(firstCommit.commit.author.date);
    })
  );
  // check if the first commit is within the hackathon dates and if so, return the repo link and write it to a file
  firstCommitDates.forEach((date, index) => {
    if (date > hackathonStartDate && date < hackathonEndDate) {
      console.log("in hackathon dates");
      const link = repositoryLinks[index];
      validRepos.push(link);
    } else {
      console.log("not in hackathon dates");
    }
  });
  fs.writeFileSync("validRepos.json", JSON.stringify(validRepos));
};

getFirstCommitDates();
