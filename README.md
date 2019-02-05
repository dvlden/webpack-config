# Webpack 4 Configuration

This is my personal `webpack v4` configuration, that I am using for small static projects.
Feel free to contribute, improve or use it for your projects.


### Contains some neat stuff out of the box!

- jQuery
- Bootstrap with Popper.js
- FontAwesome Pro _(which you cannot install, unless you have a Pro account, as you will require a Token for installation)_


### What does this configuration handles?


> Common for development & production environment

- it accepts two entry points; one for the `app` and one for the `vendor`
- it compiles everything with relative paths, rather than absolute
- it compiles `sass/scss` to the `css` file
- it compiles `es6` to the syntax that every browser can understand
- it contains latest **Boostrap**, but with entirely modular setup; you may include only the parts that you need, as you probably won't use **70%** of the framework
- it has alias as `~` for importing your `js` files, no more mess with directory back-levels


> Development environment

- it runs webpack-dev-server with browser-sync support
- it builds source-maps


> Production environment

- it minifies `js`
- it minifies multiple image types _(gif, png, jpg, jpeg, svg)_
- it copies all `web fonts`
- it minifies all `json` files from `data` directory
- it has subresource-integrity
- it does not build source-maps, but you may specify it on line `216` if you want them


### Commands?

It's pretty easy... You do not have a bunch of commands, just two of them:

- `npm run serve` – to start with development
- `npm run build` - to make it ready for production use
