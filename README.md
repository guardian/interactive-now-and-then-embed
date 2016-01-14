Now and then image embeds
=================================

Embeddable now and then images. Use this tool to easily generate them: https://interactive.guim.co.uk/2016/01/now-and-then-generator/

Usage
=====

Setup
-----
`npm install`

Development
-----------
`grunt`

Production / deployment
-----------------------
1. Update `cfg/s3.json` and create `aws-keys.json` (copy from `aws-keys.example.json`)
1. `grunt deploy`

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
