const pr = require('./pull_request')

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    return context.github.issues.createComment(issueComment)
  })

  // PR comment, react to it
  app.on('issue_comment.created', async context => {
    // PRs treated like Issues, check for 'pull_request' key in payload
    // See https://developer.github.com/v3/guides/working-with-comments/#pull-request-comments
    const data = context.payload
    if (data.hasOwnProperty('pull_request')) {
      // If comment contains "circleci run", parse the comment
      if (prComment.match(/^circleci run.*/)) {
        return pr.parsePRComment(context)
      }
    }
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
