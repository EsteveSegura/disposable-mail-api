<div align="center">
 <h1>Disposable Mail Api</h1>
    <span><strong>Disposable Mail Api</strong> It is a library to generate disposable mails completly functional and usable on internet.</span><br />
    <img src="https://img.shields.io/badge/NodeJS-14.13.0-green"> 
    <img src="https://img.shields.io/badge/License-MIT-blue">
    <img src="https://img.shields.io/badge/Version-0.0.1-blue">
</div>

## Installation
```bash
npm i disposable-mail-api
```

## Examples
### Basic Usage
The library is very easy to use, we can create a fully functional mail on the internet with the code shown below and we will be able to receive and consult the entire inbox.
```js
const {DisposableMail} = require('disposable-mail-api');
const mail = new DisposableMail();

(async () => {
  const createMail = await mail.generate({mail: 'MySuperFakeEmail'}); // => {addres: 'mysuperfakeemail@kerenkey.com'}
  const getInboxMail = await mail.inbox(); // => mailInbox: [{from: [{address: 'SomeEmail@SomeDomain.com', name: 'John Doe'}], intro: 'Mail content!', subject: 'important mail'}]
})();
```
