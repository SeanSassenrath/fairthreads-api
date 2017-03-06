# Fairthreads API

## Getting Started

### Install [Yarn](https://yarnpkg.com/en/docs/install#mac-tab)
```
  brew update
  brew install yarn
```
### Install packages
Run `yarn`

### Linting
Run `yarn run linter-setup`

### Setup local env
Run `yarn run env-setup`

This will create a local .env file with a skeleton of the necessary API keys / secrets. Ask Sean for keys / secrets to plug in to local .env file.

## Development
To begin local development, run `npm start`. This will run the server locally on `localhost:9000`.

## Deploy
Log in to Heroku via CLI `heroku login`.
Use `git push heroku master` to deploy to Heroku.
