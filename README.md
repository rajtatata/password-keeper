This project is a serverless app for storing passwords or any other sensitive data.<br/>
Demo: [pass.flaviorajta.com](https://pass.flaviorajta.com/)<br />
Login: demo:demo<br />
Master Password: demo

## How it works

The backend uses Google Firestore as the database and Google Cloud Functions. The frontend is a React app which can also be hosted on Firebase Hosting. [TweetNacl](https://tweetnacl.js.org/) is used for encrypting and decrypting data.
- The backend always stores encrypted data
- The data is decrypted only on the frontend

`Master Password` is the key used to encrypt/decrypt data. When this key is correct, the data will be correctly decrypted and the user will have the option to view or copy.<br/>
While logged in with <strong>demo</strong> account, go ahead and write `demo` as the Master Password and you will notice the data change.

## How to deploy
- Create a Firebase Project, or use an existing one
- Navigate into `backend-firebase-functions` folder
    - run `firebase init ` to initialize the firebase project
    - check using the space bar only <strong>Functions</strong>
    - choose the Project you want to use
    - you can safely press Enter until everything finishes
    - Navigate inside `backend-firebase-functions/functions`
        - rename `.env.example` to `.env`
        - be sure to change the TOKEN_SECRET inside `.env` to whatever you want
    - run `firebase deploy` to deploy your function to the cloud
    - once it completes it will display your function url, which will be needed below
- Navigate into `frontend-reactjs`
    - rename `.env.example` to `.env`
    - be sure to changre REACT_APP_SERVER_URL to your function url
    - run `npm install` to install the npm packages
    - run `npm run build` to build the project
        - this will create a build folder inside
    - move this build folder to `frontend-firebase-hosting`
        - or you can run `npm run postbuild:windows` or `npm run postbuild:linux` depending on your os
- Navigate inside `frontend-firebase-hosting`
    - run `firebase init` to initialize the firebase project
    - check using the space bar only <strong>Hosting</strong>
    - choose the Project you want to use
    - you can safely press Enter until everything finishes
    - run `firebase deploy` to deploy your static app to the cloud
    - once it finishes it will show the Hosting URL