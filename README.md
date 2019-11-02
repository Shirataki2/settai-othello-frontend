# 接待オセロ(Othello, with lots of Hospitality)

Play: https://yagami19.1e9plus7.com

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

## set up othello backend ##
# see: https://github.com/Shirataki2/settai-othello-backend
$ cd ..
$ git clone https://github.com/Shirataki2/settai-othello-backend
$ cd settai-othello-backend
# create python environment (recommended: python >= 3.7)
$ python -m venv env
$ ./env/bin/activate
$ pip install requirements.txt
$ python main.py
# opptional: deploy to google app engine
# create google cloud platform account and setup gcloud command line tools
$ ... (omitted)
# and deploy
$ gcloud app deploy app.yaml

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
