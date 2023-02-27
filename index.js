const exec = require('child_process').exec;
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 * 
 */// Octokit.js
https://github.com/octokit/core.js#readme
// const { Octokit, App } = require("octokit");
// const octokit = new Octokit({
//   auth: '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'
// })

// octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
//   owner: 'kotwani2883',
//   repo: 'Calmant-Backend',
//   pull_number: 24,
//   body: 'Great stuff!',
//   commit_id: '2c1482478ac94aef9a545cb7e70a42fb24c026e1',
//   path: 'README.md',
//   line: 1
// })

//  octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
//   owner: 'kotwani2883',
//   repo: 'Calmant-Backend',
//   issue_number: 16,
//   body: 'Me too'
// })


module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");
  app.on('issues.closed', async (context) => {
    const payload = context.payload
    const number = payload.pull_request.number
    const myRepo= context.repo({number: context.payload.repository}) //name of the repo
    const issueComment = context.issue({
      body: "Thanks for closing this issue!",
    });
    const commit_id = context.payload.pull_request.commit_id
    const message = context.payload.pull_request.body
    console.log(myRepo,commit_id,message);
    //whenever the issue is closed or the PR is closed we send the data to the spaship server that some kind of event is being trigered
   
    return context.octokit.issues.createComment(issueComment);
   
});
app.on('pull_request.closed', async (context) => {
  const pr = context.payload.pull_request;
  if (pr.merged) {
    const repo = context.repo();
    const cloneUrl = `https://github.com/${repo.owner}/${repo.repo}.git`;
    const workDir = `/tmp/${repo.owner}/${repo.repo}`;
    const branch = pr.base.ref;
    const issueComment = context.issue({
      body: "Yayy,,,Your changes are deployed into Prod",
    });
    const issueCommentNegative = context.issue({
      body: "Some Error Occurred",
    });
    exec(`git clone ${cloneUrl} ${workDir}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error cloning repository: ${err}`);
      } else {
        console.log(`Repository cloned: ${stdout}`);
        //Deployment logic to be written here
        exec(`cd ${workDir} && git checkout ${branch} && npm run deploy`, (err, stdout, stderr) => {
          if (err) {
            console.error(`Error deploying repository: ${err}`);
          } else {
            console.log(`Repository deployed: ${stdout}`);
            return context.octokit.issues.createComment(issueComment);
          }
        });
        
      }
    });
    return context.octokit.issues.createComment(issueCommentNegative);
  }
});

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
