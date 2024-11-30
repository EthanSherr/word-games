# word-games

This is a project for may and ethan. it will contain maybe multiple word games? but for starts it'll just contain one word game.

## dev?

To run all just run pnpm start (may need to be run in `/packages/backend` `/packages/s`)

```sh
pnpm start
```

## build:

You will need to read the `packages/backend/readme.md` before you do this - at least you need to know that you need `packages/backend/secrets/.env` which is not checked into source code.

```sh
# to pack the apps, runs builds in packages/backend and packages/frontend
pnpm build
# to build docker containers
docker-compose build
# to run it
docker-compose up -d
```

# Recommended plugins

[vscode.sql-lit](https://marketplace.visualstudio.com/items?itemName=thebearingedge.vscode-sql-lit)

I use a sql`` tag to template queries in the backend. That's cool because you can use this plugin to get sql syntax highlighting. Nifty

# Brainstorming

1. Word pyramid;

- shows you a word at the top, maybe at the bottom
- everyline it removes a letter
- you have to enter words, using all same letters except one, to connect top to bottom

## 11/17/2024 update:

We have a basic setup. We're going to work on email notifications for dailies & move onto other puzzles.

Currently we are hardcoding the pyramid problem to 5 layers from length 5 to 1. We are using a dictionary in /storage/words.txt. Length 5 word is revealed, as it he length 1 word. And one letter of the second word is revealed. That's all subject to change.

2. word snake

- hexagon grids, 4 letter words,
- you must connect the hexagon by changing one letter at a time, game ends when you connect all

3. word connect

- a grid of letters is provided,
- a hint is provided
- you must spell the word
