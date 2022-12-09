# Setup
All you need to do to create a tip API of your own is to set the ```REPLIT_TOKEN``` environment variable to your ```connect.sid``` in the secrets tab. To use the API, use the URL extensions provided in the comments at the top of [index.js](index.js). You can request the following information with only usernames and repl ID's:
(To find a Repl ID, just use ```echo $REPL_ID``` in the shell.)

- Total amount of cycles tipped on a specific repl
- Whether a user has tipped on a specific repl
- How much a user has tipped on a specific repl
- The user that tipped the most on a specific repl

Or just modify the code and use the functions or make a different .js file, I don't care!

#### NOTE: The repl will have to run pretty constantly to ensure no tips are missed.

Here's some important legal jargon formatted by @RayhanADev
> :warning: Replit's GraphQL API is a private API. You may use it, however
> do not expect any documentation or assistance in using it.

> This Repl does not contain a copy of Replit's GraphQL Schema. Open-sourcing
> parts of the schema may be available in the future, but for the time being
> contact a Replit Site Mod on the [Discord Server](https://replit.com/discord)
> to potentially get help with the GraphQL.

> **Section 5 (Prohibited Actions), Item 10**
>
> Interfere with or disrupt the Services or create an undue burden on Replit's Service
> or the networks or services connected to Replit's Service;

> **Section 5 (Prohibited Actions), Item 11**
>
> Use the Service to attack or tamper with other websites, services, and individuals;

> **Section 5 (Prohibited Actions), Item 13**
>
> Launch any automated system, including without limitation, “robots”, “spiders”, or
> “offline readers” that access the Service in a manner that sends more request
> messages to the Replit servers in a given period of time than a human can reasonably
> produce in the same period by using a conventional online web browser.
>
> ...
>
> You agree not to collect or harvest any personally identifiable information,
> including account names, from the Service, nor to use the communication systems
> provided by the Services for any commercial solicitation purposes. You agree not to
> solicit, for commercial purposes, any users of the Service with respect to their
> content.

> **Section 5 (Prohibited Actions), Item 22**
>
> Repeatedly fork or clone projects to run or host the same code creating undue load
> on the Service.