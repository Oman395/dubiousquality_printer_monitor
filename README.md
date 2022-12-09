# Printer monitor scripts
These scripts allow you to interface with my site, and set it up to monitor your 3d print. It's pretty simple, so here are the docs:

## index.js
This script will update the server every minute with a new image for your account.

Arguments:
1. Auth
 - The value for the http basic authentication; in the form of user:pass
2. Id
 - The ID assigned to you by the server when you created your account
3. Dev mode
 - Leave this blank; if there is any text, it will attempt to connect to https://localhost:8080.

Usage example:
`node index user:pass 0`

## register.js
This script will register you with the server. It will also give you your ID-- MAKE SURE TO NOTE IT DOWN!
One other thing to note, there is no way to change your credentials once they are set without me manually editing the database! Make sure you type correctly!

Arguments:
1. Username
 - The username you want.
2. Password
 - The password you want.
3. Dev mode
 - See above

Usage example:
`node index user pass`
