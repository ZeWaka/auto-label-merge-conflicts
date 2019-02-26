"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_toolkit_1 = require("actions-toolkit");
const tools = new actions_toolkit_1.Toolkit({
    event: ['pull_request.opened', 'pull_request.synchronize']
});
exports.getPullRequests = (tools, { owner, repo }) => {
    const query = `{
    repository(owner: "${owner}", name: "${repo}") {
      pullRequests(last: 50, states:OPEN) {
        edges {
          node {
            id
            number
            mergeable
          }
        }
      }
      labels(first: 100) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }`;
    return tools.github.graphql(query, {
        headers: { Accept: 'application/vnd.github.ocelot-preview+json' }
    });
};
(async () => {
    // check configuration
    if (!process.env['CONFLICT_LABEL']) {
        tools.exit.failure('Please set environment variable CONFLICT_LABEL');
    }
    let result;
    try {
        result = await exports.getPullRequests(tools, tools.context.repo());
    }
    catch (error) {
        console.error('Request failed: ', error.request, error.message);
        tools.exit.failure('getPullRequests has failed.');
    }
    console.log('Result: ', result);
    console.log(result.repository.pullRequests.edges);
    console.log(result.repository.labels.edges);
    let conflictLabel = result.repository.labels.edges.find((label) => {
        return (label.name === process.env['CONFLICT_LABEL']);
    });
    console.log(conflictLabel);
    if (!conflictLabel) {
        tools.exit.failure(`${process.env['CONFLICT_LABEL']} not found in your repository`);
    }
})();
