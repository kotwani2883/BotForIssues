// const exec = require('child_process').exec;
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 * 
 */// Octokit.js
// https://github.com/octokit/core.js#readme
// const { Octokit, App } = require("octokit");
// const octokit = new Octokit({
//   auth: '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'
// })

const axios = require('axios');
const request = require('request');


//for updating or adding file from the orchestrator
// axios.put('https://api.github.com/repos/:owner/:repo/pulls/:pull_number/files/:file_name', {
//   owner: 'kotwani2883',
//   repo: 'Calmant-Backend',
//   pull_number: 24,
//   file_name:'',
//   content: 'This is the new content of the file.',
//   message: 'Updated the file via the API.',
//   sha: '123456789abcdef0123456789abcdef01234567'
// }, {
//   headers: {
//     Authorization: `Bearer ${oauthToken}`
//   }
// })
// .then(response => {
//   console.log('File created/updated:', response.data);
// })
// .catch(error => {
//   console.error('Error creating/updating file:', error);
// });

//for commenting on a specific commit provided details of the API are provided over there!!
// axios.post('https://api.github.com/repos/:owner/:repo/commits/:commit_sha/comments', {
//   body: 'This is a test comment.'
// }, {
//   headers: {
//     Authorization: `Bearer ${oauthToken}`
//   }
// })
// .then(response => {
//   console.log('Comment created:', response.data);
// })
// .catch(error => {
//   console.error('Error creating comment:', error);
// });



// //for creating new branch 
// axios.post('https://api.github.com/repos/:owner/:repo/git/refs', {
//   ref: 'refs/heads/:branch_name',
//   sha: ':commit_sha'
// }, {
//   headers: {
//     Authorization: `Bearer ${oauthToken}`
//   }
// })
// .then(response => {
//   console.log('Branch created:', response.data);
// })
// .catch(error => {
//   console.error('Error creating branch:', error);
// });



//For commenting over PR
// octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
//   owner: 'kotwani2883',
//   repo: 'Calmant-Backend',
//   pull_number: 24,
//   body: 'Great stuff!',
//   commit_id: '2c1482478ac94aef9a545cb7e70a42fb24c026e1',
//   path: 'README.md',
//   line: 1
// })
// //For commenting over issues
//  octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
//   owner: 'kotwani2883',
//   repo: 'Calmant-Backend',
//   issue_number: 16,
//   body: 'Me too'
// })


module.exports = async(app) => {
//   // Your code here
//   app.log.info("Yay, the app was loaded!");
//   app.on(['issues.closed','pull_request.closed'], async (context) => {
//     const pr = context.payload.pull_request;
//     const payload = context.payload
//     const number = payload.pull_request.number
//     const myRepo= context.repo({number: context.payload.repository}) //name of the repo
//     const issueComment = context.issue({
//       body: "Thanks for closing this issue!",
//     });
//     const commit_id = context.payload.pull_request.commit_id
//     const message = context.payload.pull_request.body
//     if(pr.merged)  
//     console.log(myRepo,commit_id,message);
//     //whenever the issue is closed or the PR is closed we send the data to the spaship server that some kind of event is being trigered
   
//     return context.octokit.issues.createComment(issueComment);
   
// });
// app.on('pull_request.closed', async (context) => {
//   const pr = context.payload.pull_request;
//   if (pr.merged) {
//     const repo = context.repo();
//     const cloneUrl = `https://github.com/${repo.owner}/${repo.repo}.git`;
//     const workDir = `/tmp/${repo.owner}/${repo.repo}`;
//     const branch = pr.base.ref;
//     const issueComment = context.issue({
//       body: "Yayy...Your changes are deployed into Prod",
//     });
//     const issueCommentNegative = context.issue({
//       body: "Some Error Occurred",
//     });
//     exec(`git clone ${cloneUrl} ${workDir}`, (err, stdout, stderr) => {
//       if (err) {
//         console.error(`Error cloning repository: ${err}`);
//       } else {
//         console.log(`Repository cloned: ${stdout}`);
//         //Deployment logic to be written here
//         exec(`cd ${workDir} && git checkout ${branch} && npm run deploy`, (err, stdout, stderr) => {
//           if (err) {
//             console.error(`Error deploying repository: ${err}`);
//           } else {
//             console.log(`Repository deployed: ${stdout}`);
//             return context.octokit.issues.createComment(issueComment);
//           }
//         });
        
//       }
//     });
//     return context.octokit.issues.createComment(issueCommentNegative);
//   }
// });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
   // Check if the PR was merged
   app.on('pull_request.closed', async (context) => {
    // Check if the PR was merged
    if (context.payload.pull_request.merged) {
      const prNumber = context.payload.number;
      const repoName = context.payload.repository.name;
      const repoOwner = context.payload.repository.owner.login;
  
      // Get the merged PR details
      // const prDetails = await context.github.pulls.get({
      //   owner: repoOwner,
      //   repo: repoName,
      //   pull_number: prNumber
      // });
  
      // // Extract the data you want to send to the webhook URL
      // const dataToSend = {
      //   title: prDetails.data.title,
      //   merged_by: prDetails.data.merged_by.login,
      //   merged_at: prDetails.data.merged_at,
      //   merged_commit_sha: prDetails.data.merge_commit_sha
      // };
  
      // Send the data to the webhook URL
      const options = {
        url: 'https://smee.io/xx29tLpNPSOFmrlx',
        method: 'POST',
        json: {
          commitid:context.payload.pull_request.commit_id,
          repoName:context.payload.repository.name,
          source:'github'
        }
      };
  
      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log(response);
          console.log('Data sent successfully to webhook URL');
        } else {
          console.log('Error sending data to webhook URL:', error);
        }
      });
    }
  });
}

