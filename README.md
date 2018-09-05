# Bootstrap FileUpload [![Build Status](https://travis-ci.org/lleblanc42/bootstrap-FileUpload.svg?branch=master)](https://travis-ci.org/lleblanc42/bootstrap-FileUpload) [![GitHub version](https://badge.fury.io/gh/lleblanc42%2Fbootstrap-FileUpload.svg)](https://badge.fury.io/gh/lleblanc42%2Fbootstrap-FileUpload)
##### Issues Overview
[![In the works](https://badge.waffle.io/lleblanc42/bootstrap-FileUpload.svg?label=ready&title=In%20the%20works)](http://waffle.io/lleblanc42/bootstrap-FileUpload) [![Currently in Progress](https://badge.waffle.io/lleblanc42/bootstrap-FileUpload.svg?label=in%20progress&title=Currently%20in%20Progress)](http://waffle.io/lleblanc42/bootstrap-FileUpload) [![On Hold](https://badge.waffle.io/lleblanc42/bootstrap-FileUpload.svg?label=on%20hold&title=On%20Hold)](http://waffle.io/lleblanc42/bootstrap-FileUpload)

This plugin is very lightweight, highly customizable, easy to use, extremely easy to integrate into any website with minimal dependancies and of course cross compatible. It includes support for mobile devices with fallback options to a regular customized form input field. It has the ability to upload multiple files at once and provide thumbnail previews. All it needs is Twitter Bootstrap V3 and the latest version of jQuery!

## Getting Started
Download the [production version][min] or the [development version][max] jQuery plugin files and the [production version][mincss] or [development version][maxcss] CSS files.

[min]: https://raw.github.com/lleblanc42/bootstrap-FileUpload/master/dist/bootstrap-FileUpload.min.js
[max]: https://raw.github.com/lleblanc42/bootstrap-FileUpload/master/dist/bootstrap-FileUpload.js
[mincss]: https://raw.github.com/lleblanc42/bootstrap-FileUpload/master/dist/bootstrap-FileUpload.min.css
[maxcss]: https://raw.github.com/lleblanc42/bootstrap-FileUpload/master/dist/bootstrap-FileUpload.css

Before using this plugin, you need to have the following two dependencies in your website:
* Twitter Bootstrap (v3)
* Latest 1.x version of jQuery

Optional dependency:
* FontAwesome - used for file icons

### The HTML/CSS

Include the jQuery file in either the head of the HTML document or near the bottom of the body:

```html
<script src="js/bootstrap-FileUpload.min.js"></script>
```

Make sure to include the CSS for the plugin:

```html
<link rel="stylesheet" type="text/css" href="css/bootstrap-FileUpload.min.css" />
```

Before you initialize the plugin, you must include the wrapper in your document with the class of fileupload-wrapper. Just create another div that you can name this whatever you'd like inside of the wrapper, and make sure the contents of the div is empty.

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
```

The plugin allows for multiple file uploads on one page. You can either add multiple divs inside the fileupload-wrapper div, or create multiple fileupload-wrapper's that wrap around your upload "shell".

```html
<div class="fileupload-wrapper"><div id="myUpload"></div><div id="myUpload2"></div></div>
```

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
<div class="fileupload-wrapper"><div id="myUpload2"></div></div>
```

### The Javascript

To initialize the plugin, you need to put the following code block (wrapped in the script tag) in the HTML of your web page in either the head or just before the ending body tag (the preferred method when using HTML5 Bootstrap) and reference the inner div you created previously. For multiple upload forms, just include two versions of the snippets, each pointing to the desired "shell".

```javascript
$("#myUpload").bootstrapFileUpload({
	url: "processor.php"
});

$("#myUpload2").bootstrapFileUpload({
	url: "processor.php"
});
```
Make sure to change the url option to point to the web page that will properly process the form information. Currently, this script only supports JSON as a return type from the processor.

For a better user experience with thumbnails, include Font Awesome in your HTML and enable the useFontAwesome option when initializing the plugin.

### File Type Configuration

To determine which file types/extensions are to be accepted by the plugin, you must declare it as an array. The plugin organizes it into 5 different groups. You can declare just the group with an empty array, which will include all of the extensions within that group. Or, you can include an array with all of the desired extensions for that group. Below is the current list of accepted groups with their extensions and how to declare it in the configuration. You can also declare extensions that aren't in the list below or even create custom groups.

1. archives: ["zip", "7z", "gz", "gzip", "rar", "tar"]
2. audio: ["mp3", "wav", "wma", "wpl", "aac", "flac", "m4a", "m4b", "m4p", "midi", "ogg"]
3. files: ["doc", "docx", "dotx", "docm", "ods", "odt", "ott", "ods", "pdf", "ppt", "pptm", "pptx", "pub", "rtf", "csv", "log", "txt", "xls", "xlsm", "xlsx"]
4. images: ["bmp", "tif", "tiff", "gif", "jpeg", "jpg", "png", "svg", "ico", "raw"]
5. video: ["avi", "flv", "swf", "m4v", "mkv", "mov", "mp4", "ogv", "wmv"]

```javascript
$("#myUpload").bootstrapFileUpload({
	url: "processor.php",
	fileTypes: {
		images: [],
		files: ["doc", "docx", "pdf"]
	}
});
```

## Options

Below is a detailed list of all of the available options to configure and customize the upload form as desired.

| Option Name | Default Value | Acceptable Input | Description |
| ------------- | ------------- | ------------- | ------------- |
| url | null | a URL | The URL the plugin will send the AJAX request too |
| fallbackUrl | null | a URL | A seperate URL the script can use if you require a seperate processor to handle the different response (optional) |
| formMethod | 'post' | 'post' or 'get' | The method of which the form will be submitted to the processor |
| multiFile | true | true or false | Allows multiple file uploads when true - potential for file upload limitations on server end |
| multiUpload | false | true or false | Uploads all the files at once when true, otherwise uploads the files one at a time to the processor |
| inputName | 'files' | string | Name of the file input field intended for use of the processor |
| hiddenInput | null | null or string | Options to include additional hidden fields to pass to the processor in JSON format |
| forceFallback | false | true or false | Forces the fallback option of the plugin if set to true which won't allow multiple file uploads or thumbnail previews |
| maxSize | 5 | number | Limits the max filesize of each file to the number set in megabytes |
| maxFiles | null | null or number | Limits the number of files the user is able to select for uploading |
| showThumb | true | true or false | Creates a thumbnail of the image selected or displays the file icon if set to true |
| useFontAwesome | false | true or false | Enables use of the font awesome library for file icons |
| fontAwesomeVer | false | false or version number | The script automatically assigns it if detected, used as an override |
| thumbWidth | 80 | number | Changes the width of the thumbnail to the set number in pixels |
| thumbHeight | 80 | number | Changes the height of the thumbnail to the set number in pixels |
| fileTypes | please see the list of file types above | array | Limits the types of files that can be uploaded as well as accepted extensions |
| debug | false | true or false | In the case of misconfiguration, this switch can either display a message to the user if true was set, or display a message in the console log. |

## Callbacks

Callbacks can be useful if you wish to perform an additional task after a default process has completed. There is a callback available after almost every action throughout the users experience.

Callbacks are declared with the options. You can declare as many callbacks as you wish and for multiple upload forms. An example is available under the table.

| Callback Name | Description |
| ------------- | ------------- |
| onInit | Calls when the plugin is initialized |
| onFileAdded | Calls when a file is added to the list |
| onFileRemoved | Calls when a file is removed from the list |
| onFileCancel | Calls when the upload is canceled |
| onFileProcessing | Calls when the plugin begins processing the files |
| onUploadProgress | Calls when the progress bar is updated |
| onUploadError | Calls when an error is called while processing |
| onUploadSuccess | Calls when the file was uploaded successfully |
| onUploadComplete | Calls when the plugin has completed processing of all of the files |
| onUploadReset | Calls when the file list is reset |

### Example

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
```

```javascript
$("#myUpload").bootstrapFileUpload({
	url: "processor.php",
	onInit: function () {
		window.alert("initialized!");
	},
    onFileAdded: function () {
    	window.alert("file added!");
    }
});
```

## Methods

Below is a list of the currently available public methods. All of these methods open up the ability to create custom buttons to preform basic tasks within the plugin. This makes way for the upcoming templating system that is planned for the 0.8.0 release. The public methods are still experimental and full support for them has yet to be established as testing has been limited. Full support and testing will be completed for the 1.0.0 release. [Please submit any issues here](https://github.com/lleblanc42/bootstrap-FileUpload/issues).

In order to use the methods, you must indicate which instance (id without the '#') you would like the plugin to work with in the first argument after declaring which method you would like use. You must also decalre the upload form before you call a method to ensure the instance is populated.

### addFile(event)

Gives the availability to create custom add file buttons. In order for it to function correctly, the button must be a file input and you must pass the event on when the input changes.

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
<input id="addBtn" type="file" multiple="multiple" />
```

```javascript
$("#myUpload").bootstrapFileUpload({
	url: "processor.php"
});

$("#addBtn").on('change', function (e) {
	$.bootstrapFileUpload('addFile', "myUpload", e);
});
```

### uploadStart()

Used to create a button to simply begin the upload process. To use, create a button with an ID and associate an on click event with the ID of the button and then pass the uploadStart method.

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
<button id="uploadStart">Upload the files!</button>
```

```javascript
$("#myUpload").bootstrapFileUpload({
	url: "processor.php"
});

$("#uploadStart").on('click', function (e) {
	e.preventDefault();
	$.bootstrapFileUpload('uploadStart', "myUpload");
});
```

### removeFile()

This public method is currently not of any use as it requires the ID of the file the user wants to remove. The ID is set when a user adds a file. It may be possibile, though tricky, to code up a way to get the ID from the appropriate field and have it be removed. Makes way for the up and coming templating system.

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
<button id="file" value="file-id">Remove this file</button>
```

```javascript
$("#myUpload").bootstrapFileUpload({
	url: "processor.php"
});

$("#file").on('click', function () {
	$.bootstrapFileUpload('removeFile', "myUpload", $(this).val());
});
```

### resetUpload()

When called, it completely resets the form and removes all of the files and clears the table.

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
<button type="reset" id="reset">Reset the form</button>
```

```javascript
$("#myUpload").bootstrapFileUpload({
	url: "processor.php"
});

$("#reset").on('click', function (e) {
	e.preventDefault();
	$.bootstrapFileUpload('resetUpload', "myUpload");
});
```

## Demo
_(Coming soon)_

## Feature Release Plans (12 out of 20)
- [x] ~~Check if site utilizes Twitter Bootstrap - v0.2.0 Release~~
- [x] ~~Add debug mode - v0.2.0 Release~~
- [x] ~~Add URL verification support - v0.2.0 Release~~
- [x] ~~Add support for multiple file upload fields - v0.3.0 Release~~
- [x] ~~Limit what's accepted for file types - v0.4.0 Release~~
- [x] ~~Include a set of file type icons - v0.5.0 Release~~
- [x] ~~Check if the file uploaded is a file or graphic to regulate whether or not it gets a thumbnail or an icon - v0.5.0 Release~~
- [x] ~~Add support for methods - v0.6.0 Release~~
- [x] ~~Further test and add additional support for callbacks - v0.6.0 Release~~
- [x] ~~Detailed comments in the source code (apologize for lack therof) - v0.7.0 Release~
- [x] ~~Full Font Awesome support - v0.7.0 Release~~
- [x] ~~Add better support for accurate file sizes - v0.7.0 Release~~
- [ ] Add support for custom templates - v0.8.0 Release
- [ ] Add support for language files - v0.8.0 Release
- [ ] Add drag and drop support - v0.9.0 Release
- [ ] Add a GH Pages repo - v1.0.0 Release
- [ ] Cleanup and fully stabalize the code - v1.0.0 Release
- [ ] Comprehensive testing of jQuery library compatibility - v1.0.0 Release
- [ ] Include proper QUnit testing - v1.0.0 Release
- [ ] Add support for additional libraries - v1.1.0 Release

## Release History
v0.7.0
* Major overhaul on structure and ordering of functions/elements
* Reworked how Font Awesome was used and increased support for both 4 and 5
* Made Font Awesome fully optional
* Made centralized private function to deal with ajax calls
* Added basic comments/documentation within source code
* Added better support for accurate file sizes
* General code cleanup
* Bug fixes

v0.6.0
* Complete overhall of the entire plugin
* Established a new structural design pattern
* Converted several public functions into private functions
* Public methods are now available!
* Moved several variables to the global scope so all functions can access them as needed
* Now handles the global variables via multidimensional arrays (instances) as reworking the plugin to use methods broke the ability to handle multiple forms on a page
* Completed basic testing of the callbacks, now fully supported and functional! Additional instructions added as well as an example in README

v0.5.1
* Updated README file
* Began use of Waffle.io to manage project progression and added badges

v0.5.0
* Now includes Font Awesome 4.6.3 for use of the application icons
* Checks which kind of file it is an either creates a thumnail or assigns an icon
* Bug fixes with

v0.4.0
* Cleaned up some of the code
* Changed the options for the debug from string to boolean (simplification)
* Changed the option createThumb to showThumb
* Added a default list of accepted file inputs
* Added functionality to control which file types to accept and their extensions

v0.3.0
* Added support for multiple file upload instances

v0.2.0
* The plugin now checks to see if the Twitter Bootstrap API is available
* Added debugging capabilities
* Added more extensive error checking including URL verifying and input method verifications

First official release! v0.1.0