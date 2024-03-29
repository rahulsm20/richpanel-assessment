# Richpanel Assignment

[Video demo link](https://jetsetgo-images.s3.ap-south-1.amazonaws.com/Screencast+from+23-02-24+08%3A00%3A02+PM+IST.webm)

### Tech stack

- React + Typescript + Vite
- TailwindCSS
- Passport.js
- Redux Toolkit
- Node.js + Express
- MongoDB

### System architecture

![system-architecture](https://github.com/rahulsm20/richpanel-assessment/assets/77540672/6ff58ee7-bdb3-41d9-9d66-d9c1196a007b)

### Steps to run

* Setup environment variables:
    - [Client](https://github.com/rahulsm20/richpanel-assessment/blob/main/client/.env.example)
    - [Server](https://github.com/rahulsm20/richpanel-assessment/blob/main/server/.env.example)  
    Note: The .env files should be at the root of the corresponding directories i.e ./client and ./server
* Run client
    ```
    cd client && npm i && npm run dev
    ```

* Run server
    ```
    cd server && npm i && npm run dev
    ```

* Run server using docker 
    ```
    docker build -t helpdesk-api . && docker run -d -p 5000:5000 richpanel-api
    ```

### Setbacks and Scope for improvement
- Setbacks:
    * Although the project has been hosted, Facebook doesn't seem to auhorize app domains other than localhost without having gone through the verification process.
    * Facebook also seems to have disabled the test users feature.

- Scope for improvement:
    * Robust auth service like Auth0 would help secure the app.
    * Using in-memory database like Redis for caching large conversation requests would decrease query response time.
