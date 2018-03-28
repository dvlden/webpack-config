// Core requirements
window.Util = require('exports-loader?Util!bootstrap/js/dist/util.js');
window.Popper = require('popper.js').default;
window.Tooltip = require('exports-loader?Tooltip!bootstrap/js/dist/tooltip.js'); // required for popover

// Components
require('exports-loader?Alert!bootstrap/js/dist/alert');
require('exports-loader?Button!bootstrap/js/dist/button');
require('exports-loader?Carousel!bootstrap/js/dist/carousel');
require('exports-loader?Carousel!bootstrap/js/dist/carousel');
require('exports-loader?Collapse!bootstrap/js/dist/collapse.js');
require('exports-loader?Dropdown!bootstrap/js/dist/dropdown.js');
require('exports-loader?Modal!bootstrap/js/dist/modal.js');
require('exports-loader?Popover!bootstrap/js/dist/popover.js');
require('exports-loader?ScrollSpy!bootstrap/js/dist/scrollspy.js');
require('exports-loader?Tab!bootstrap/js/dist/tab.js');
// require('exports-loader?Tooltip!bootstrap/js/dist/tooltip.js'); // moved to core requirements
