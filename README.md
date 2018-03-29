# Webpack 4 Configuration

This is my personal `webpack v4` configuration, that I am using for small static projects.

> Here's the list of dependencies:

- Bootstrap with Popper.js
- jQuery Slim
- FontAwesome Pro _(which you cannot install, unless you have a Pro account, as you will require a Token for installation)_


> Here's the list of what webpack configuration does:

- Takes two base entry points. One for `app` itself and the other for `vendor` _(project dependencies)_.
- Compiles `sass/scss` with all required browser prefixes and minification. Prefixing and minification works in `production` mode only.
- Compiles `js` files using `babel`, so you can write `es6` freely and separate your logic accross multiple files.
- Minifies many types of image formats _(gif, png, jpeg, jpg, svg)_.
- Handles all `fonts` that you might have in the project.
- Has a server for `development` mode.
- Minifies all `.json` files that you may store within `data` directory.
- Uses `Bootstrap v4` CSS framework, but this configuration allows you to import only specific `scss` and `js` modules. Which is highly recommended, since your web app probably won't use **70%** of Bootstrap's stuff.

* Has a `BrowserSync` _(which is commented out)_ which you may use if your project is `dynamic`, but I think that breaks image minification which are contained within `.html` files using `<img src="" />`. I did not test this out, but this is my assumption. 

_** Solution to this would be to create a single class in your css that require those images using `ulr()` (comma separated) and then images will be compiled anyways and you can use them in html without that class. Important thing is just to get those images compiled._
