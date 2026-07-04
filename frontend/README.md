# Photato website
This is a website meant to be put to https://photato.eu

Technology used:
- React
- To be deployed with Netlify
- Handles auth via Auth0
- Call an AWS Lambda backend, deployed by Serverless.
- Babel

## Installation

The front end is to be deployed with Netlify.
TODO: This is missing

#### Testing locally

The only setting needed is to forward all requests to nonexistent files to `index.html`.

E.g. with nginx:

```nginx
location / {
    try_files $uri /index.html;
    root   {your-root-folder};
    index  index.html;
}
```

Can use a simple Node.js server too, or just deploy it to GitHub Pages.

## Development

David's own computer:
 - Go to `c:\Users\David\Dropbox\Apps\Nginx\nginx-1.17.5\`
 - Run `start nginx`
   - List nginx instances: `tasklist /fi "imagename eq nginx.exe"`
   - To kill them: `taskkill /F /IM nginx.exe`
   - Fast shutdown: `nginx -s stop`
   - Graceful shutdown: `nginx -s quit`
   - Restart: `nginx -s reload`
   - Reopen log files: `nginx -s reopen`
 - Go to http://localhost:3080
 - Error log is here: `c:\Users\David\Dropbox\Apps\Nginx\nginx-1.17.5\logs\error.log`
 
## Usage

Just deploy it and visit the website at https://photato.eu.

## Features

 - Uses React and Redux (from CDN)
 - No Babel, Webpack etc. needed

## Links

 - GitHub: https://github.com/vdavid/photato-website-v3/
 - Docs for [babel-plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)