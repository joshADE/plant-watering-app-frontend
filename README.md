# plant-watering-app-frontend
> The front end React Redux app for the ShipVista Plant Assessment. The backend code can be seen [here](https://github.com/joshADE/Plant-Watering-App-Backend).


# Technologies used
* [React JS](https://reactjs.org/) (Javascript Library)
* [Redux](https://redux.js.org/) (State Container)
* [Redux Toolkit](https://redux-toolkit.js.org/) (Package to help in Redux development)
* [TypeScript](https://www.typescriptlang.org/) (Static typed superset of JavaScript)

# Requirements

* NPM (version 7.x and above) (Download node.js to install npm [here](https://nodejs.org/en/))
* GIT (version 2.x and above) (Download [here](https://git-scm.com/))

# Getting Started

## Get the Server running

Follow the instructions in the README.md file of the backend source code which can be seen [here](https://github.com/joshADE/Plant-Watering-App-Backend).

## Clone Repository

Clone the repository to your computer.

```
git clone https://github.com/joshADE/plant-watering-app-frontend.git
```

## Installation

1. cd to the project directory.
2. run `npm install` to install dependencies.

```
npm install
```

## Setup the connection to the server
Inside the src folder, edit axios.ts and change the baseURL variable to the url of the running backend server. Make sure that '/api' is added at the end of the url.

```
const instance = axios.create({
    baseURL: 'https://localhost:44321/api/',
});
```

The link to the backend source can be seen above. You will need to get it running in your local environment.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


