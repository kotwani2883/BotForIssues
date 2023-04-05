const express = require('express');
const bodyParser = require('body-parser');
const { Octokit } = require('@octokit/rest');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const app = express();
const mock = new MockAdapter(axios);

// Github API authentication
const octokit = new Octokit({
  auth: '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'
});

app.use(bodyParser.json());

// Webhook endpoint to receive events from Github
app.post('/webhook', async (req, res) => {
  const payload = req.body;
  // Handle the payload as needed
  const { action, issue } = req.body;
  if (action === 'closed' && payload.pull_request.merged) {
    // If an issue is opened, create a comment on it
    const comment = {
      body: 'Thanks for opening this issue!',
    };
// 1.comment on a specific Issue
const url = 'https://smee.io/aWMY6G3acItkWaAq';
const data = {
  title: payload.pull_request.title,
  body: payload.pull_request.body
};
const headers = {
  'Content-Type': 'application/json',
};


// Mock the HTTP POST request
mock.onPost('https://smee.io/aWMY6G3acItkWaAq').reply(200, {
  message: 'Mock response from Smee.io',
});
try {
  const response = await axios.post(url, data, { headers });
  console.log(response.data);
  const commentBody = `The third-party API responded with: ${JSON.stringify(response.data)}`; 

  //1.comment on specific PR
  await octokit.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.pull_request.number,
    body: commentBody,
  });


  // 2. Comment on a specific commit
await octokit.rest.repos.createCommitComment({
  owner:payload.repository.owner.login,
  repo: payload.repository.name,
  commit_sha: payload.pull_request. merge_commit_sha,
  body: commentBody,
})
.then(response => {
  console.log('Comment created successfully:', JSON.stringify(response.data));
})
.catch(error => {
  console.error('Error creating comment:', error);
});


//3. Write/Add a new file to the repo 
await octokit.rest.repos.createOrUpdateFileContents({
  owner: payload.repository.owner.login,
  repo: payload.repository.name,
  path: 'path/to/file.txt',
  message: 'Add comment',
  content: Buffer.from(commentBody).toString('base64'),
  branch: payload.repository.default_branch,
})
.then(response => {
  console.log('File created successfully:', response.data.content.html_url);
})
.catch(error => {
  console.error('Error creating file:', error);
});


// // 4.Alter an existing file in the repo 
const currentContent = await octokit.repos.getContent({
  owner:payload.repository.owner.login,
  repo:payload.repository.name,
  path: 'path/to/file.txt',
});

// update the content of the file
const newContent = "This is the new content of the file.";
const updateResult = await octokit.repos.createOrUpdateFileContents({
  owner:payload.repository.owner.login,
  repo:payload.repository.name,
  path: 'path/to/file.txt',
  message: "Update file",
  content: Buffer.from(newContent).toString("base64"),
  sha: currentContent.data.sha,
});

console.log(`File updated. New commit: ${updateResult.data.commit.sha}`);


// 5 .Create a new Branch.

// Define the branch name
const branchName = "new-branch";

// Get the SHA of the master branch
const { data: masterBranch } = await octokit.request(`GET /repos/${payload.repository.owner.login}/${payload.repository.name}/git/ref/heads/master`);
const masterSha = masterBranch.object.sha;

// Create a new reference with the SHA of the master branch
await octokit.request(`POST /repos/${payload.repository.owner.login}/${payload.repository.name}/git/refs`, {
  ref: `refs/heads/${branchName}`,
  sha: masterSha
})
.then((response)=>{
  console.log("Successfully created new branch",response.data)
})
.catch((error)=>{
  console.log("Something went Wrong",error)
})
} catch (error) {
  console.error('Error sending request to third-party API:', error.message);
}
  }

  res.sendStatus(200);
});
// Start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

