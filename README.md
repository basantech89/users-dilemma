## Take Home Project - 2: Users-Dilemma ##

`Problem Statement`

There are 4 users in a system with different roles. One user can only be assigned one role. The login IDs and passwords of the users who have been assigned these roles have been stored locally. We need to authenticate when any user tries to login and accordingly grant/deny access.The task would be to build the following APIs (in Node.js) which are required to achieve this objective: 
1. Signup - Passwords should be randomly generated at the time of signup. 
2. Login 
3. One sample API for each user rolePlease note that the system should be horizontally scalable.


`Solution`

Tech-Stack: React, Express Server, MongoDB, Mongoose, Passport, Jsonwebtoken

Users can have 4 type of roles: unauthorized, basic, creator, admin

unauthorized users have get access to all the movies

basic users have get access to all content and post/put/delete on movie comments

creators can get/post/put/delete all the movies

admins have access to everything except basic users's private data

only basic users can be created with UI, to create other users with other roles, mongo repl has to be used
