# api-base
The purpose of this project is to use it as a base of REST APIs.

## Getting started
Create a `.env` file:
```
PORT=3001
MONGO_DB_URI_TEST=mongodb://localhost/api-base-test
MONGO_DB_URI=mongodb://localhost/api-base
```

```
npm run dev
```

Inside folder `requests` you can find some of the available methods so you can test the API.
* create_note.rest
* create_user.rest
* delete_note
* get_all_notes
* get_all_users
* get_note
* login_user
* put_not