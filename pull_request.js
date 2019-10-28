// Run a build based on a PR comment
function runBuildFromPRComment (context) {
  // if (comment.includes("workflow")) {
  // API call to workflow
  // } else if (comment.includes("pipeline")) {
  // API call to trigger pipeline
  // }
  const params = context.issue({ body: 'Hello World!' })
  return context.github.issues.createComment(params)
}

module.exports.runBuildFromPRComment = runBuildFromPRComment
