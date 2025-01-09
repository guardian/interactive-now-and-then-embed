Local example server url:

`http://localhost:8000/embed.html?mobile_before=//media.guim.co.uk/67222cbde87dc147dd34041c2e8692b81f24f546/0_0_1204_1181/500.jpg&desktop_before=//media.guim.co.uk/67222cbde87dc147dd34041c2e8692b81f24f546/0_0_1204_1181/1000.jpg&label_before=Then&mobile_after=//media.guim.co.uk/fdd3278393233ee0ad8ba55e32cabcbdee8b7a23/0_0_1204_1181/500.jpg&desktop_after=//media.guim.co.uk/fdd3278393233ee0ad8ba55e32cabcbdee8b7a23/0_0_1204_1181/1000.jpg&label_after=Now&analytics_label=dfsd&type=slider&override=true`


Guardian interactive ES6 template
=================================

An interactive template & test harness, set up with commonly used components and example code

Usage
=====

Setup
-----
`npm install`

Development
-----------
`npm start`

Production / deployment
-----------------------

1. Update `cfg/s3.json`
2. `grunt deploy`

NOTE: Ensure you have AWS credentials setup by either adding them to your `~/.bashrc` or
creating a `~/.aws/credentials` file with the following content:

```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```


Using third party js
--------------------
1. Install package using JSPM e.g.

	`jspm install reqwest` or

	`jspm install github:guardian/iframe-messenger`

2. Import package. e.g.

	`import reqwest from 'reqwest'` or

	`import reqwest from 'guardian/iframe-messenger'`

Text/JSON in javascript
-----------------------
```
import someHTML from './text/template.html!text'
import someJSON from './data/data.json!json'
```

Test Harness
============

`index.html` - Stripped down test harness. Includes frontend fonts and curl for loading boot.js.
`immersive.html` - Immersive-style interactive page pulled from theguardian.com
