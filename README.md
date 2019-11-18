# circleci-trigger-bot [![CircleCI](https://circleci.com/gh/mvxt/circleci-trigger-bot/tree/master.svg?style=svg&circle-token=5f63bec7e00e0dede15dffd1c84fc12bff6cdb86)](https://circleci.com/gh/mvxt/circleci-trigger-bot/tree/master)

> A GitHub App built with [Probot](https://github.com/probot/probot) that implements various interactions between GitHub and CircleCI

This Probot app has been written and tested using:

- Probot v7.2.0
- Node 12.13.0
- Yarn v1.17.3

## Installing the Bot
Since Github Apps cannot currently store secrets, you'll have to hardcode your CircleCI API token into the code.

This seems insecure, but the configuration of this app in `app.yml` is set to "Internal-only" by default, meaning other users on Github cannot install the app or see its source code.

1. Clone or download this repository.
2. Search the code base for REPLACE_TOKEN_HERE and replace it with your [CircleCI API Token](https://circleci.com/docs/2.0/managing-api-tokens/). Note that this token must be a personal token and **not** a project-based token.
3. Install dependencies with `yarn` or `npm i`
4. Start the app with `yarn dev` or `npm run dev`, which will start your app and start a web server on http://localhost:3000
5. Go to that page in your browser and click the button to register GitHub App
6. Make a unique name for your Github App and install the application in your org for whichever repositories you'd like to run this on.

## Current Functionality
### Trigger Pipeline via PR Comment
Triggers a pipeline with the specified parameters. Leave a comment in the following format on a PR:

`circleci run pipeline [PARAM_1=VALUE_1 PARAM_2=VALUE_2...]`

**Note:** Triggering a pipeline will trigger **all workflows** by default. To limit which workflows run and when, you'll want to configure default parameters. See example below.

#### Example
Let's say I have two workflows: `build-test` and `deploy`. I want my `build-test` workflow to always run on changes to code by default, but my `deploy` should only run on a manual trigger. I would set that up as follows:

```yaml
version: 2.1

parameters:
  run_tests:
    type: boolean
    default: true
  run_deploy:
    type: boolean
    default: false

workflows:
  version: 2
  build-test:
    when: << pipeline.parameters.run_tests >>
    jobs:
      - build-job
      - test-job:
          requires: build-job
  deploy:
    when: << pipeline.parameters.run_deploy >>
    jobs:
      - deploy-job
```

To trigger the `deploy` workflow, I would comment on the Pull Request: `circleci run pipeline run_tests=false run_deploy=true`. This prevents the tests from triggering again, and toggles the condition for `deploy` to true to trigger that workflow only.

For more information and examples, see [the docs](https://github.com/CircleCI-Public/api-preview-docs/blob/master/docs/conditional-workflows.md).

## Testing
1. Run `yarn test` after you've installed dependencies.

## Known Issues
See issues tab.

## Contributing
If you have suggestions for additional features or optimizations for CircleCI Trigger Bot, or want to report a bug, open an issue! We'd love all and any contributions.

If you'd like to add some features yourself, make sure you fork this repository and **remember to remove your CircleCI token and replace with 'REPLACE_TOKEN_HERE' before opening a PR.**

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License
[ISC](LICENSE) © 2019 Michael V Thanh <mthanh@circleci.com> (https://circleci.com)
