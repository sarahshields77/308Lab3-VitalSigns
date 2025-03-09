## COMP 308 Emerging Technologies
## Lab Assignment 3 – Micro-Frontends and Microservices with GraphQL

## Getting Started

Follow these steps to set up and run the project:

1. Clone the repository to your local machine using the following command:
```bash
git clone https://github.com/sarahshields77/308Lab3-VitalSigns.git
```

2. After cloning the repository, create a terminal navigating the to the `server` directory.
   
3. In the `server` directory, run the following command to install the required dependencies:
```bash
npm install
```

4. In the `server` directory, run the following command to start the auth microservice:
```bash
node auth-microservice
```

5. In the `server` directory, run the following command to start the vitalsigns microservice:
```bash
node vitalsigns-microservice
```

6. In the `client/user-app` directory, run the following command to install the required dependencies:
```bash
npm install
```

7. In the `client/user-app` directory, run the following command to start the user-app micro-frontend:
```bash
npm run deploy
```

8. In the `client/vitalsigns-app` directory, run the following command to install the required dependencies:
```bash
npm install
```

9. In the `client/vitalsigns-app` directory, run the following command to start the vitalsigns micro-frontend:
```bash
npm run deploy
```

10. In the `client/shell-app` directory, run the following command to install the required dependencies:
```bash
npm install
```

11. In the `client/shell-app` directory, run the following command to start the shell-app container frontend:
```bash
npm run dev
```