# DevTinder API's

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password //forgot password API

## connectionRequestRouter
- POST /request/send/:status/:userId //status can be ignored or interested
- Post /request/send/ignored/:userID

- Post /request/review/accepted/:requestId
- Post /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests/recieved
- GET /user/feed - get you the profiles of other user on platform


Status: ignored, interested, accpeted, rejected



