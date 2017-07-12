# overlap-twitter-bot
This Twitter bot is used to provide simple automated responses for common questions about the exhibition.

## Currently supported features:

| Command | Response |
| ------- | -------- |
| Tell me about \[artist] (Where artist is either first name, first + last name, or where provided their twitter handle). | A snippet of their website bio, a link to the full bio, and their official headshot. |

## Planned features:

* Break up "tell me about" for great control of responses:

    | Tell me [x] | Response |
    | ----------- | -------- |
    | about       | Contextual info about an artist or the show. |
    | where       | Where the show is. |
    | when        | Dates the show takes place. |
    | how         | Contextual info on how much or how to get to the show. |
 
## Installing
* Download or clone this repository.
* Run `npm install` to install dependencies.
* Rename `.env.example` to `.env` and add the following information:
	* `YOUR_TWITTER_USERNAME`
	* `YOUR_CONSUMER_KEY`
	* `YOUR_CONSUMER_SECRET`
	* `YOUR_ACCESS_TOKEN`
	* `YOUR_ACCESS_TOKEN_SECRET`
* Run `npm start`