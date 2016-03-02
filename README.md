# Bootstrap FileUpload [![Build Status](https://travis-ci.org/lleblanc42/bootstrap-FileUpload.svg?branch=master)](https://travis-ci.org/lleblanc42/bootstrap-FileUpload) [![GitHub version](https://badge.fury.io/gh/lleblanc42%2Fbootstrap-FileUpload.svg)](https://badge.fury.io/gh/lleblanc42%2Fbootstrap-FileUpload)
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

Point to the plugin in the HTML in either the head or just before the ending body tag (the preferred method when using HTML5 Bootstrap) in your web page will the following line of code:

```html
<script src="js/bootstrap-FileUpload.min.js"></script>
```

Make sure to include the CSS for the plugin!

```html
<link rel="stylesheet" type="text/css" href="bootstrap-FileUpload.min.css" />
```

Before you initialize the plugin, you must include the wrapper in your document. You can name this whatever you'd like, just make sure it's a div and the contents of the div is empty.

```html
<div id="fileupload-wrapper"></div>
```

To initialize the plugin, you need to put the following code block (wrapped in the script tag) in the HTML of your web page in either the head or just before the ending body tag (the preferred method when using HTML5 Bootstrap) and reference the div you created previously:

```javascript
$("#fileupload-wrapper").bootstrapFileUpload({
	url: "processor.php"
});
```

Make sure to change the url option to point to the web page that will properly process the form information. Currently, this script only supports JSON as a return type from the processor. 

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
| createThumb | true | true or false | Creates a thumbnail of the file selected if set to true |
| thumbWidth | 80 | number | Changes the width of the thumbnail to the set number in pixels |
| thumbHeight | 80 | number | Changes the height of the thumbnail to the set number in pixels |
| fileTypes | null | string | Limits the types of files that can be uploaded |
| debug | verbose | false, 'console' or 'verbose' | In the case of misconfiguration, this switch can either display a message to the user if verbose was set, display a message in the console log is console is set, or do nothing if false is set. |

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
- [ ] Detailed comments in the source code (apologize for lack therof)
- [ ] Comprehensive testing of jQuery library compatibility
- [x] ~~Check if site utilizes Twitter Bootstrap~~
- [x] ~~Add debug mode~~
- [x] ~~Add URL verification support~~
- [ ] Add support for multiple file upload fields
- [ ] Add support for multiple acceptable returns from processor (not just JSON)
- [ ] Cleanup and further stabalize the code
- [ ] Further test and add additional support for callbacks
- [ ] Limit what's accepted for file types
- [ ] Check if the file uploaded is a file or graphic to regulate whether or not it gets a thumbnail or an icon
- [ ] Include a set of file type icons
- [ ] Include proper QUnit testing

## Release History
v0.2.0
* The plugin now checks to see if the Twitter Bootstrap API is available
* Added debugging capabilities
* Added more extensive error checking including URL verifying and input method verifications

First official release! v0.1.0