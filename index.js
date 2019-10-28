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

  // Trigger a build based on a PR comment
  // PRs are treated like Issues
  // See https://developer.github.com/v3/guides/working-with-comments/#pull-request-comments
  app.on('issue_comment.created', async context => {
    // PRs considered issues, check for 'pull_request' key in payload
    if (context.payload.hasOwnProperty('pull_request')) {
      const prComment = context.payload.comment.body
      if (prComment.match(/^circleci run.*/)) {
        return pr.runBuildFromPRComment(context)
      }
    }
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
