# ScytailProject
NodeJS script that, when given a url to a repository:

1. Fetches the last 10 merged PRs.
2. Checks that for each PR, all checks have passed for the last commit before merging.
3. Saves a report with the findings to a file (you can use any file format - JSON/CSV/etc...).

The report includes the following fields for each PR:

- PR number (sometimes also called id).
- PR title.
- The author of the PR.
- When it was merged 
- A list with the names of the checks that passed.
- A list with the names of the checks that failed.
- A boolean indicating whether all checks passed.

Console requests user-generated auth tokens. Make them here: https://github.com/settings/tokens?type=beta.
