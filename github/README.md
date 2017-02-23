# WebFair

WebFair is a web application, responsible for admin data from Ifair that is a IOS app that collect products info from fairs.
With this app, admin area can edit, create, update or delete fairs, suppliers, email templates; fill samples info, as also, favorite their best samples; send a email to a supplier asking for a Quotation or thanking them.

## Getting Started

* First, you need to have Node.JS and NPM installed.
* Enter in the folder
* Install dependencies
```
npm install
``` 

* Run grunt in the main path to call a dev task that watch app for jsdoc and less compilation .
```
grunt
``` 

## Deployment

This project has a specific server to its deploy (if you don't know, talk about it with one responsible for the project.
The deploy it run a specifique task that will prepare the project and past a project to deployment in a folder called "*dist*", then just copy all files and replace in the deployment server.
The task is:
```
grunt build
```

## Built With

* [Less](http://lesscss.org/) - CSS pre-processor.
* [Jquery](https://jquery.com/) - Js Library used.
* [JsDoc-](http://usejsdoc.org/) - an API documentation generator for JavaScript.
* [Grunt](http://gruntjs.com/) - JavaScript Task Runner.
* [SpineJs](http://spine.github.io/) - Js MVC Framework for building JavaScript web applications.

