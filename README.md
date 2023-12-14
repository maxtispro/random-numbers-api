# Random Numbers Api
An API for delivering truly random numbers

## What It's About
This is a simple API meant to deliver truly random numbers securely. The main setup is a camera pointed at a lava lamp (similar to [Lavarand](https://en.wikipedia.org/wiki/Lavarand)). The point of this codebase is to run a server which automatically process images as they are taken and sending the random numbers to end users. Below are more specific details on how to contribute.

## Cloning
This project uses node-js and is written in typescript (all you need is node-js and a package maanger like npm).

### Installing and Running
To install the project, simply run
    `npm i`
or
    `npm install`
To run the server locally, run
    `npm start`
This will start listening to URL queries on local port 80 (port 443 will be used officially for obvious security reasons but requires an SSL certificate which isn't necessary for testing).

### Extra Scripts
For more available scripts that run tests and format code, check out the package.json file.

## Data Management
All images, once hashed, will be deleted permanently off the system. After the random numbers are sent off over port 443 using a valid SSL certificate, they will also be permanently deleted off the system. Random numbers will only be stored when the system is offline and an obvious flag is attached to the data specifying that it is being used for testing purposes and should not be used for security purposes. The reason for storing such data will be to test for hash collisions. The code is free to look at and should be revised if any security issues are found.
