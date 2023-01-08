## Hackathon Projects Validator

This is a simple validator for Hackathon projects. It checks for the following:

- Check if the commits on the project are from the hackathon period

## Usage

- Clone the repo
- Run `npm install`
- Get a GitHub API token and set it as an environment variable
- Add the projects you want to validate to the `repos.json` file
- ADD the hackathon start and end dates to the index.js file
- Run `npm start`

- The results will be in the `valid-repos.json` file
