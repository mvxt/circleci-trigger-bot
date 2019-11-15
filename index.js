const pr = require('./pull_request')

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Opened issue, react to it
  app.on('issues.opened', async context => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue! We will check this and get back to you ASAP.' })
    return context.github.issues.createComment(issueComment)
  })

  // PR comment, react to it
  app.on('issue_comment.created', async context => {
    // PRs treated like Issues, check for 'pull_request' key in payload
    // See https://developer.github.com/v3/guides/working-with-comments/#pull-request-comments
    const data = context.payload
    if (data.issue.hasOwnProperty('pull_request')) {
      const comment = data.comment.body
      return pr.parsePRComment(context)
    }
  })
}
