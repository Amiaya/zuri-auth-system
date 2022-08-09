# zuri-auth-system
An authentication system, with the following features; Register, Login, Logout (using bcrypt to hash password), users, staff, manager, and admin roles, protected role based routes with JSON web token, password recovery

## how to run
- Clone the repo and use any IDE of your choice.
- Run npm install in your terminal to install packages in package.json
- Create a .env file and fill in values for the following variables: MONGO_URI, NODE_ENV, PORT, JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN, EMAIL_USERNAME, EMAIL_PASSWORD -Finally run npm start in your terminal

## Endpoints
The following endpoints are available on this server:

- `/auth/signup` signup a new user
- `/auth/login` login a user 
-  `/auth/forgetPassword` to get reset password url.
-  `/auth/resetPassword/:token` to rest password
-  `/auth/logout` logouts a user
-  `/auth/updateRole/:id` only admin can update a user role
-  `/auth/AllUser` only admin can get all user
-  `/auth/staff` only staff have access to this route 
-  `/auth/manager` only managers have access to this route 
-  `/auth/users` only users have access to this route

## Endpoints on postman
`/auth/signup`
![Screenshot (19)](https://user-images.githubusercontent.com/81121343/183772469-7f4ef343-c624-454b-a97f-d14329de1bf6.png)

`/auth/login`
![Screenshot (20)](https://user-images.githubusercontent.com/81121343/183772599-518393d0-5729-47f7-9acd-005adc55921a.png)

`/auth/forgetPassword`
![Screenshot (21)](https://user-images.githubusercontent.com/81121343/183772680-7b9234c2-f37a-475a-864e-b9de6112e1a3.png)

`/auth/resetPassword/:token`

`/auth/logout`
![Screenshot (28)](https://user-images.githubusercontent.com/81121343/183773040-b47517de-61de-4df9-802a-2c1a2fc04071.png)

`/auth/updateRole/:id` 
![Screenshot (22)](https://user-images.githubusercontent.com/81121343/183773213-a7c1b096-2c01-4b2c-8d20-db2eae56e5a7.png)

`/auth/AllUser`
![Screenshot (24)](https://user-images.githubusercontent.com/81121343/183773393-94937c40-167d-4a8e-aaa8-1e06b14a8026.png)

`/auth/staff`
![Screenshot (25)](https://user-images.githubusercontent.com/81121343/183773451-0a829c90-090c-4082-8226-99cf9481ebe1.png)

`/auth/manager`
![Screenshot (26)](https://user-images.githubusercontent.com/81121343/183773583-66521bdf-1d56-45cb-9512-3f5d82dfec6f.png)

`/auth/users`
![Screenshot (27)](https://user-images.githubusercontent.com/81121343/183773558-5f975d33-9b58-48fe-b38e-86093418b15f.png)

`/auth/manager`- After you have loggout
![Screenshot (29)](https://user-images.githubusercontent.com/81121343/183773646-4e980a89-d7f2-4d80-9c62-6c10ee3b2bfd.png)
