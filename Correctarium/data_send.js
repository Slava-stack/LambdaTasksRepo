const axios = require('axios');

const obj = {
    "language": "ru",       // "ua|ru|en"
    "mimetype": "docx",     // "none|doc|docx|rtf|other"
    "count": 10_000
};

const urlLink = 'http://localhost:5000/';

axios.post(urlLink, obj)
    .then((response) => {
        console.log(response.data);
    }, (error) => {
        console.log(error);
    });