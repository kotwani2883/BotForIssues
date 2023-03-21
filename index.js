const express = require('express');
const bodyParser = require('body-parser');
const { Octokit } = require('@octokit/rest');
const axios = require('axios');

const app = express();

// Github API authentication
const octokit = new Octokit({
  auth: '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'
});

app.use(bodyParser.json());
app.get('/hello',(req,res)=>{
  res.send("hello World");
})
// Webhook endpoint to receive events from Github
app.post('/webhook', async (req, res) => {
  const payload = req.body;
  console.log('Received payload:', payload);
  // Handle the payload as needed
  const { action, issue } = req.body;
   console.log(action);
  if (action === 'closed' && payload.pull_request.merged) {
    // If an issue is opened, create a comment on it
    const comment = {
      body: 'Thanks for opening this issue!',
    };
console.log(payload.repository.owner.login)
console.log(payload.repository.name)
console.log(payload.number)
console.log( comment.body)
// 1.comment on a specific Issue
    await octokit.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.number,
      body: comment.body,
    });

// 2. Comment on a specific commit
octokit.rest.repos.createCommitComment({
  owner,
  repo,
  commit_sha: payload.pull_request. merge_commit_sha,
  body: comment,
})
.then(response => {
  console.log('Comment created successfully:', response.data.html_url);
})
.catch(error => {
  console.error('Error creating comment:', error);
});

//3. Write/Add a new file to the repo 
const owner = 'OWNER_USERNAME';
const repo = 'REPO_NAME';
const path = 'PATH_TO_NEW_FILE'; // Include file name and extension
const content = 'FILE_CONTENTS_HERE';
const messagetoadd = 'COMMIT_MESSAGE_HERE';
const branch = 'BRANCH_NAME'; // Optional - defaults to repository's default branch

octokit.rest.repos.createOrUpdateFileContents({
  owner,
  repo,
  path,
  messagetoadd,
  content: Buffer.from(content).toString('base64'),
  branch,
})
.then(response => {
  console.log('File created successfully:', response.data.content.html_url);
})
.catch(error => {
  console.error('Error creating file:', error);
});

// 4.Alter an existing file in the repo 
const ownerInfo = "OWNER_USERNAME";
const repoName = "REPO_NAME";
const pathofFile = "FILE_PATH";

const result = await octokit.repos.getContents({
  ownerInfo,
  repoName,
  pathofFile
});

const file = Buffer.from(result.data.content, "base64").toString();
const sha = result.data.sha;
const newFile = file.replace("OLD_STRING", "NEW_STRING");
const messageOfCommit = "Commit message";
const contentOfFile = Buffer.from(newFile).toString("base64");

await octokit.repos.createOrUpdateFileContents({
  ownerInfo,
  repoName,
  pathofFile,
  messageOfCommit,
  contentOfFile,
  sha
});





// 5 .
// const owner = "OWNER_USERNAME";
// const repo = "REPO_NAME";
// const baseBranch = "BASE_BRANCH_NAME";

// const refResult = await octokit.git.getRef({
//   owner,
//   repo,
//   ref: `heads/${baseBranch}`
// });

// const baseSha = refResult.data.object.sha;
// const newBranch = "NEW_BRANCH_NAME";

// await octokit.git.createRef({
//   owner,
//   repo,
//   ref: `refs/heads/${newBranch}`,
//   sha: baseSha
// });


    // Push data to external app
    const data = {
      pull_request_number: payload.pull_request.number,
      issueTitle: payload.pull_request.title,
    };

    const response = await axios.post('www.google.com', data);

    // Update Github repository with external app response
    const externalAppResponse = response.data;
    const message = `External app responded with: ${externalAppResponse}`;

    await octokit.issues.createComment({
      owner:payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.number,
      body: message,
    });
  }

  res.sendStatus(200);
});
// Start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


