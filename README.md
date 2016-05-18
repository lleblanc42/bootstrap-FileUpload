# Bootstrap FileUpload [![Build Status](https://travis-ci.org/lleblanc42/bootstrap-FileUpload.svg?branch=master)](https://travis-ci.org/lleblanc42/bootstrap-FileUpload) [![GitHub version](https://badge.fury.io/gh/lleblanc42%2Fbootstrap-FileUpload.svg)](https://badge.fury.io/gh/lleblanc42%2Fbootstrap-FileUpload)
#### Issues Overview
[![In the works](https://badge.waffle.io/lleblanc42/bootstrap-FileUpload.svg?label=ready&title=Ready)](http://waffle.io/lleblanc42/bootstrap-FileUpload) [![Currently in Progress](https://badge.waffle.io/lleblanc42/bootstrap-FileUpload.svg?label=in%20progress&title=In%20Progress)](http://waffle.io/lleblanc42/bootstrap-FileUpload) [![On Hold](https://badge.waffle.io/lleblanc42/bootstrap-FileUpload.svg?label=on%20hold&title=On%20Hold)](http://waffle.io/lleblanc42/bootstrap-FileUpload) [![Done](https://badge.waffle.io/lleblanc42/bootstrap-FileUpload.svg?label=done&title=Done)](http://waffle.io/lleblanc42/bootstrap-FileUpload)
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

### The HTML/CSS

Point to the plugin in the HTML in either the head or just before the ending body tag (the preferred method when using HTML5 Bootstrap) in your web page will the following line of code:

```html
<script src="js/bootstrap-FileUpload.min.js"></script>
```

Make sure to include the CSS for the plugin and include the Font Awesome CSS for file icons! Make sure to copy the fonts folder to the root of your website in order to use Font Awesome.

```html
<link rel="stylesheet" type="text/css" href="css/bootstrap-FileUpload.min.css" />
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
```

Before you initialize the plugin, you must include the wrapper in your document with the class of fileupload-wrapper. Just create another div that you can name this whatever you'd like inside of the wrapper, and make sure the contents of the div is empty.

```html
<div class="fileupload-wrapper"><div id="myUpload"></div></div>
```

The plugin allows for multiple file uploads on one page. You can either add multiple div inside the fileupload-wrapper div, or create multiple fileupload-wrapper that wrap around your upload "shell".

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

### File Type Configuration

To determine which file types/extensions are to be accepted by the plugin, you must declare it as an array. The plugin organizes it into 5 different groups. You can declare just the group with an empty array, which will include all of the extensions within that group. Or, you can include an array with all of the desired extensions for that group. Below is the current list of accepted groups with their extensions and how to declare it in the configuration. You can also declare extensions that aren't in the list below or even create custom groups.

1. archives: ["zip", "7z", "gz", "gzip", "rar", "tar"]
2. audio: ["mp3", "wav", "wma", "wpl", "aac", "flac", "m4a", "m4b", "m4p", "midi", "ogg"]
3. files: ["doc", "docx", "docm", "ods", "odt", "ott", "ods", "pdf", "ppt", "pptm", "pptx", "pub", "rtf", "csv", "log", "txt", "xls", "xlsm", "xlsx"]
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

| Option Name | Default Value | Acceptable Input | Description |
| ------------- | ------------- | ------------- | ------------- |
| url | null | a URL | The URL the plugin will send the AJAX request too |
| fallbackUrl | null | a URL | A seperate URL the script can use if you require a seperate processor to handle the different response (optional) |
| formMethod | 'post' | 'post' or 'get' | The method of which the form will be submitted to the processor |
| multiFile | true | true or false | Allows multiple file uploads when true |
| multiUpload | false | true or false | Uploads all the files at once when true, otherwise uploads the files one at a time to the processor |
| inputName | 'files' | string | Name of the file input intended for use of the processor |
| hiddenInput | null | null or string | Options to include additional hidden fields to pass to the processor in JSON format |
| forceFallback | false | true or false | Forces the fallback option of the plugin if set to true which won't allow multiple file uploads or thumbnail previews |
| maxSize | 5 | number | Limits the max filesize of each file to the number set in megabytes |
| maxFiles | null | null or number | Limits the number of files the user is able to select for uploading |
| showThumb | true | true or false | Creates a thumbnail of the image selected or displays the file icon if set to true |
| thumbWidth | 80 | number | Changes the width of the thumbnail to the set number in pixels |
| thumbHeight | 80 | number | Changes the height of the thumbnail to the set number in pixels |
| fileTypes | please see the list of file types above | array | Limits the types of files that can be uploaded as well as accepted extensions |
| debug | true | true or false | In the case of misconfiguration, this switch can either display a message to the user if true was set, or display a message in the console log. |

## Callbacks

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

_Callbacks have not been tested as of yet, please note feature release plans_

## Examples
_(Coming soon)_

## Feature Release Plans
- [x] ~~Check if site utilizes Twitter Bootstrap - v0.2.0 Release~~
- [x] ~~Add debug mode - v0.2.0 Release~~
- [x] ~~Add URL verification support - v0.2.0 Release~~
- [x] ~~Add support for multiple file upload fields - v0.3.0 Release~~
- [x] ~~Limit what's accepted for file types - v0.4.0 Release~~
- [x] ~~Include a set of file type icons - v0.5.0 Release~~
- [x] ~~Check if the file uploaded is a file or graphic to regulate whether or not it gets a thumbnail or an icon - v0.5.0 Release~~
- [ ] Add support for methods - v0.6.0 Release
- [ ] Further test and add additional support for callbacks - v0.6.0 Release
- [ ] Add support for multiple acceptable returns from processor (not just JSON) - v0.7.0 Release
- [ ] Add support for custom templates - v0.8.0 Release
- [ ] Add drag and drop support - v0.9.0 Release
- [ ] Detailed comments in the source code (apologize for lack therof) - v1.0.0 Release
- [ ] Cleanup and fully stabalize the code - v1.0.0 Release
- [ ] Comprehensive testing of jQuery library compatibility - v1.0.0 Release
- [ ] Include proper QUnit testing - v1.0.0 Release
- [ ] Add support for additional libraries - v1.1.0 Release

## Release History
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