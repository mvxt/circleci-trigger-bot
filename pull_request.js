const axios = require('axios')

// Parse the PR Comment
function parsePRComment(context) {
  const command = context.payload.comment.body

  // Check command
  if (command.match(/^circleci run pipeline.*/)) {
    triggerPipeline(context)
  }
}

// Execute pipeline w/ params
async function triggerPipeline(context) {
  const payload = context.payload
  const command = payload.comment.body
  const fullRepo = payload.repository.full_name
  const url = `https://circleci.com/api/v2/project/gh/${fullRepo}/pipeline`

  const tokens = command.split(' ')
  var sendBody = {}
  var params = {}
  var numArgs = 0

  // Take PARAM=VALUE and turn into JS object {key: value} to pass to Axios
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].match(/.*=.*/)){
      const args = tokens[i].split('=')
      params[args[0]] = args[1]
      numArgs++
    }
  }

  // If there aren't any params, don't pass in "params" body
  if (numArgs > 0) {
    sendBody["parameters"] = params
  }

  // Get PR number
  const prUrlArray = payload.issue.pull_request.url.split('/')
  const prNum = prUrlArray[prUrlArray.length - 1]

  // Split fullRepo into owner + repository
  const repoArray = fullRepo.split('/')

  // Use context.github.pulls.get({ owner, repo, pull number })
  const octokit = context.github
  const prInfo = await octokit.pullRequests.get({
    owner: repoArray[0],
    repo: repoArray[1],
    number: prNum
  })

  // Parse that PR for head.ref to get the branch name of this PR
  const currentBranch = prInfo.data.head.ref
  sendBody["branch"] = currentBranch

  console.log(url)
  axios({
    auth: {
      username: 'REPLACE_TOKEN_HERE'
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    url: url,
    data: sendBody
  })
  .then(function (response) {
    // Post comment indicating either success or failure to execute action
    const code = response.status
    var outputBody = response.data
    outputBody["status_code"] = code
    const info = "```\n" + JSON.stringify(outputBody, null, 2) + "\n```"
    output = context.issue({ body: info })
    context.github.issues.createComment(output)
  })
  .catch(function (error) {
    if (error.response) {
      const code = error.response.status
      const message = `error triggering a build on circleci:\n  code: ${code}\n  message: ${error.response.data}`
      const output = context.issue({ body: message })
      context.github.issues.createComment(output)
    }
  });
}

module.exports.parsePRComment = parsePRComment
