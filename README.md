# bitcoin-exchange-seed
The starting point for the bitcoin-exchange project, containing individual client and server applications.
Each application has their own package.json, to prevent cross-pollination of dependencies between client and server-side.

##### Client
Contains a sample Redux / React application based on the create-react-app seed framework.

###### Setup Instructions
* Open your CLI
* Change to the ```client``` directory within this project
* Run ```npm install``` to install the client-side dependencies
* Run ```npm start``` to host the application on http://localhost:8080

##### Server
Contains empty matcher and unit test file.

###### Setup Instructions
* Open your CLI
* Change to the ```server``` directory within this project
* Run ```npm install``` to install the server-side dependencies
* Run ```npm test``` to run the unit tests
* Run ```npm test:watch``` to re-run unit tests each time files are changed 

##### Directory Structure
```
├── bitcoin-exchange-seed/
│   ├── client - client-side application
│   │   ├── node_modules - application's dependencies (e.g. React, Redux, socket.io-client)
│   │   ├── public
│   │   │   ├── favicon.ico - default React favicon
│   │   │   ├── index.html - page template
│   │   ├── src
│   │   │   ├── app
|   │   │   │   ├── hooks.ts - Store related hooks used throughout components
|   │   │   │   ├── store.ts - Root-level application store
│   │   │   ├── features
|   │   │   │   ├── counter
|   │   │   │   │   ├── Counter.module.css - Counter styles (css modules)
|   │   │   │   │   ├── Counter.tsx - Counter component
|   │   │   │   │   ├── counterAPI.ts - Mock example of counter component calling API endpoint
|   │   │   │   │   ├── counterSlice.spec.ts - Counter store tests
|   │   │   │   │   ├── counterSlice.ts - Slice of redux store dedicated to counter
│   │   │   ├── **App**.css - CSS specific to the App component
│   │   │   ├── App.tsx - main component for the app
│   │   │   ├── App.test.tsx - tests specific to the App component
│   │   │   ├── index.css - application-wide styles
│   │   │   ├── index.tsx - JavaScript entry point
│   │   │   ├── logo.svg - default React logo
│   |   ├── .gitignore - specifies intentionally untracked files that Git should ignore
│   │   ├── package.json - metadata relevant to the client application, used by npm to manage application dependencies
|   │   ├── README.md - create-react-app README file
│   ├── server - server-side application
│   │   ├── app
│   │   │   ├── matcher.js - placeholder file for the matcher implementation
│   │   ├── node_modules -  server-side dependencies  (e.g. socket.io, jest)
│   │   ├── test
│   │   │   ├── matcher.test.js - placeholder file for the matcher unit tests
│   │   ├── package.json - metadata relevant to the server application, used by npm to manage application dependencies
│   ├── .gitignore - specifies intentionally untracked files that Git should ignore
│   ├── LICENSE - MIT software license file
│   ├── README.md - what you're reading right now
```
