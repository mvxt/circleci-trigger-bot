# circleci-trigger-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that implements various interactions between GitHub and CircleCI

## Current Functionality
### Trigger Builds via PR Comments

You can trigger builds by commenting on a pull request with the following messages:

#### Specific Workflow
`circleci run workflow WORKFLOW_NAME`

#### Specific Pipeline
`circleci run pipeline PIPELINE_NAME`

## Setup

```sh
# Install dependencies
yarn

# Run the bot
yarn start
```

## Contributing

If you have suggestions for how circleci-trigger-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 Michael V Thanh <mthanh@circleci.com> (https://circleci.com)
