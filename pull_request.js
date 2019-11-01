import axios from 'axios'

// Run a build based on a PR comment
function parsePRComment(context) {
  const payload = context.payload
  const command = payload.comment.body

  // Execute Pipeline
  if (command.includes("pipeline")) {
    const fullRepo = payload.repository.full_name
    const url = `https://circleci.com/api/v2/project/github/${fullRepo}/pipeline`

    const tokens = command.split(' ')
    var params = {}

    // Take PARAM=VALUE and turn into JS object {key: value} to pass to Axios
    for (var i = 0; i < tokens.length - 1; i++) {
      if (tokens[i].match(/.*=.*/)){
        const args = tokens[i].split('=')
        params[args[0]] = args[1]
      }
    }

    axios({
      auth: {
        username: 'REPLACE_TOKEN_HERE'
      },
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.parse(params)
    })
    .then(function (response) {

      const code = response.status

      // Post comment indicating either success or failure to execute action
      if (code) {
        const output = context.issue({
          body: response.data
        })
      } else {
        const output = context.issue({
          body: `Could not trigger a build on CircleCI:\n  Code: ${code}\n  Message: ${response.data}`
        })
      }

      context.github.issues.createComment(output)
    })
    .catch(function (error) {
      if (error.response) {
        const output = context.issue({
          body: `Error triggering a build on CircleCI:\n  Code: ${code}\n  Message: ${error.response.data}`
        })
        context.github.issues.createComment(output)
      }
    })
  }
}

module.exports.parsePRComment = parsePRComment
