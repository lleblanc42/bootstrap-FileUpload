/*! Bootstrap FileUpload - v0.6.0 - 2016-05-19
* https://github.com/lleblanc42/bootstrap-FileUpload
* Copyright (c) 2016 Luke LeBlanc; Licensed GPL-3.0 */
;(function ($, document, window, undefined) {
	'use strict';

	var instance = {}, availableFileTypes = {};

	var methods = {
		init: function (opts) {
			instance[$(this).attr('id')] = {
				options: $.extend({}, $.fn.bootstrapFileUpload.defaults, opts || {}),
				wrapper: null,
				form: null,
				btnBar: null,
				btnWrapper: null,
				btnAdd: null,
				btnStart: null,
				btnCancel: null,
				btnReset: null,
				overallProgressBar: null,
				overallStatus: null,
				filePreviewTable: null,
				formData: null,
				arrayFiles: {},
				arrayLength: 0
			};

			return this.each(function () {
				startup($(this).attr('id'));
			});
		},
		addFile: function (el, event) {
			var curfiles = event.target.files;
			var length = curfiles.length;

			if (instance[el].options.multiFile === true && instance[el].options.maxFiles && length > instance[el].options.maxFiles) {
				window.alert('You\'re trying to upload ' + length + ' files and only ' + instance[el].options.maxFiles + ' files is currently supported! The system will only upload what is supported and you will have to upload again.');
				length = instance[el].options.maxFiles;
			}

			instance[el].filePreviewTable.detach();

			for (var i = 0; i < length; i++) {
				var fileName, fileExt, fileType, file, size, row;

				fileName = "file-" + i;
				file = curfiles[i];
				size = (file.size / 1024) / 1024;
				fileExt = file.name.split('.').pop().toLowerCase();

				if (isValidFileType(el, fileExt) === false) {
					window.alert('The file "' + file.name + '" is not a supported filetype!');

					continue;
				}

				fileType = getFileType(el, fileExt);

				if (size.toFixed(2) > instance[el].options.maxSize) {
					window.alert('The file size for "' + file.name + '" is too large! Maximum supported file size is ' + instance[el].options.maxSize + 'MB and the size of the file is ' + size + 'MB');
					
					continue;
				}
					
				if (instance[el].arrayFiles && checkFile(el, file) >= 0) {
					window.alert('The file "' + file.name + '" is already in queue!');
					
					continue;
				}

				instance[el].arrayFiles[fileName] = file;
				instance[el].arrayLength = ++instance[el].arrayLength;

				instance[el].btnStart.fadeIn("slow", "linear");
				instance[el].btnCancel.fadeIn("slow", "linear");

				var progressBar = '<div class="progress fileupload-progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div></div><div class="alert alert-success"><strong>Uploaded Successfully!</strong></div><div class="alert alert-danger"></div>';
					
				if (instance[el].options.showThumb === true) {
					var thumb = genThumb(el, file, fileType, fileExt);

					if (instance[el].options.multiUpload === false) {
						row = '<tr class="fileupload-previewrow thumb row" id="' + fileName + '"><td class="col-lg-1">' + thumb + '</td><td class="col-lg-4">' + file.name + '</td><td class="col-lg-6">' + progressBar + '</td><td class="col-lg-1"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					} else {
						row = '<tr class="fileupload-previewrow thumb row" id="' + fileName + '"><td class="col-lg-1">' + thumb + '</td><td class="col-lg-9">' + file.name + '</td><td class="col-lg-2"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					}
				} else {
					if (instance[el].options.multiUpload === false) {
						row = '<tr class="fileupload-previewrow no-thumb row" id="' + fileName + '"><td class="col-lg-5">' + file.name + '</td><td class="col-lg-6">' + progressBar + '</td><td class="col-lg-1"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					} else {
						row = '<tr class="fileupload-previewrow no-thumb row" id="' + fileName + '"><td class="col-lg-10">' + file.name + '</td><td class="col-lg-2"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					}
				}

				instance[el].filePreviewTable.append(row);
			}
				
			instance[el].wrapper.append(instance[el].filePreviewTable);

			instance[el].filePreviewTable.fadeIn("slow", "linear");

			if (typeof instance[el].options.onFileAdded === 'function') {
				instance[el].options.onFileAdded.call(this);
			}
		},
		uploadStart: function (el) {
			$(".fileupload-add, .fileupload-start, .fileupload-cancel, .fileupload-remove").attr("disabled", "disabled");

			if (instance[el].options.hiddenInput) {
				$.each(instance[el].options.hiddenInput, function (key, value) {
					instance[el].formData.append(key, value);
				});
			}

			if (instance[el].options.multiUpload === false) {
				$.each(instance[el].arrayFiles, function (key, value) {
					instance[el].formData.append(instance[el].options.inputName, value);

					$("#" + key + " .fileupload-progress .progress-bar-striped").fadeIn("slow", "linear");

					$.ajax({
						url: instance[el].options.url,
						type: instance[el].options.formMethod,
						data: instance[el].formData,
						cache: false,
						contentType: false,
						processData: false,
						accepts: "json",
						success: function(data, status, xhr) {
							var response = JSON.parse(data);

							if (response.error) {
								$("#" + key + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
								$("#" + key + " .fileupload-progress .progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%");
								$("#" + key + " .alert-danger").fadeIn("slow", "linear").html("<strong>Error:</strong><br />" + response.error);
							} else {
								$("#" + key + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
								$("#" + key + " .fileupload-progress .progress-bar-success").attr("aria-valuenow", 100).css("width", "100%");
								$("#" + key + " .alert-success").fadeIn("slow", "linear");
							}

							if (typeof instance[el].options.onUploadSuccess === 'function') {
								instance[el].options.onUploadSuccess.call(this);
							}
						},
						error: function (xhr, status, err) {
							$("#" + key + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
							$("#" + key + " .fileupload-progress .progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%");

							$("#" + key + " .alert-danger").fadeIn("slow", "linear").html(status + ": " + err.message);

							if (typeof instance[el].options.onUploadError === 'function') {
								instance[el].options.onUploadError.call(this);
							}
						},
						xhr: function () {
							var myXhr = $.ajaxSettings.xhr();

							if(myXhr.upload){
								myXhr.upload.addEventListener('progress', function (e) {
									if(e.lengthComputable){
										var percentComplete = e.loaded / e.total;
										
										$("#" + key + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", Math.round(percentComplete * 100)).css("width", Math.round(percentComplete * 100) + "%");
									}
								});
							}

							return myXhr;
						}
					});

					if (typeof instance[el].options.onUploadProgress === 'function') {
						instance[el].options.onUploadProgress.call(this);
					}
				});
			} else {
				instance[el].overallProgressBar.fadeIn("slow", "linear");

				$.each(instance[el].arrayFiles, function (key, value) {
					instance[el].formData.append(instance[el].options.inputName + "[]", value);
				});

				$.ajax({
					url: instance[el].options.url,
					type: instance[el].options.formMethod,
					data: instance[el].formData,
					cache: false,
					contentType: false,
					processData: false,
					accepts: "json",
					success: function (data, status, xhr) {
						var response = JSON.parse(data);

						if (response.error) {
							instance[el].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
							instance[el].overallProgressBar.find(".progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%");
							instance[el].overallStatus.fadeIn("slow", "linear");
							instance[el].overallStatus.find(".alert-danger").fadeIn("slow", "linear").html("<strong>Error:</strong><br />" + response.error);
						} else {
							instance[el].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
							instance[el].overallProgressBar.find(".progress-bar-success").attr("aria-valuenow", 100).css("width", "100%");
							instance[el].overallStatus.fadeIn("slow", "linear");
							instance[el].overallStatus.find(".alert-success").fadeIn("slow", "linear");
						}

						if (typeof instance[el].options.onUploadSuccess === 'function') {
							instance[el].options.onUploadSuccess.call(this);
						}
					},
					error: function (xhr, status, err) {
						instance[el].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
						instance[el].overallProgressBar.find(".progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%");
						instance[el].overallStatus.fadeIn("slow", "linear");
						instance[el].overallStatus.find(".alert-danger").fadeIn("slow", "linear").html(status + ": " + err.message);

						if (typeof instance[el].options.onUploadError === 'function') {
							instance[el].options.onUploadError.call(this);
						}
					},
					xhr: function () {
						var myXhr = $.ajaxSettings.xhr();

						if(myXhr.upload){
							myXhr.upload.addEventListener('progress', function (e) {
								if(e.lengthComputable){
									var percentComplete = e.loaded / e.total;
									
									instance[el].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", Math.round(percentComplete * 100)).css("width", Math.round(percentComplete * 100) + "%");
									
									if (typeof instance[el].options.onUploadProgress === 'function') {
										instance[el].options.onUploadProgress.call(this);
									}
								}
							});
						}

						return myXhr;
					}
				});
			}

			instance[el].btnAdd.fadeOut("slow", "linear");
			instance[el].btnStart.fadeOut("slow", "linear");
			instance[el].btnCancel.fadeOut("slow", "linear");
			instance[el].btnReset.delay(600).fadeIn("slow", "linear");

            if (typeof instance[el].options.onUploadComplete === 'function') {
				instance[el].options.onUploadComplete.call(this);
            }
		},
		removeFile: function (el, id) {
			if (instance[el].arrayLength <= 1) {
				methods.resetUpload(el);
			} else {
				$("#" + id).fadeOut("slow", "linear");
				$("#" + id + " .alert").fadeOut("slow", "linear");

				$("#" + id).remove();
				delete instance[el].arrayFiles[id];

				instance[el].arrayLength = --instance[el].arrayLength;
			}

			if (typeof instance[el].options.onFileRemoved === 'function') {
				instance[el].options.onFileRemoved.call(this);
			}
		},
		resetUpload: function (el) {
			instance[el].filePreviewTable.find("tbody").empty();
			instance[el].form[0].reset();
			instance[el].arrayFiles = {};
			instance[el].arrayLength = 0;

			instance[el].filePreviewTable.fadeOut("slow", "linear");
			instance[el].btnStart.fadeOut("slow", "linear");
			instance[el].btnCancel.fadeOut("slow", "linear");
			$(".fileupload-previewrow .alert").fadeOut("slow", "linear");

			$(".fileupload-add, .fileupload-start, .fileupload-cancel").removeAttr("disabled");
			$(".fileupload-add").delay(800).fadeIn("slow", "linear");

			instance[el].overallProgressBar.find(".progress-bar-success").attr("aria-valuenow", 0).css("width", "0%");

			instance[el].overallProgressBar.fadeOut("slow", "linear");
			instance[el].btnReset.fadeOut("slow", "linear");

			if (typeof instance[el].options.onUploadReset === 'function') {
				instance[el].options.onUploadReset.call(this);
			}
		}
	};

	function startup (el) {
		instance[el].wrapper = $('#' + el);

		availableFileTypes["archives"] = ["zip", "7z", "gz", "gzip", "rar", "tar"];
		availableFileTypes["audio"] = ["mp3", "wav", "wma", "wpl", "aac", "flac", "m4a", "m4b", "m4p", "midi", "ogg"];
		availableFileTypes["files"] = ["doc", "docx", "dotx", "docm", "ods", "odt", "ott", "ods", "pdf", "ppt", "pptm", "pptx", "pub", "rtf", "csv", "log", "txt", "xls", "xlsm", "xlsx"];
		availableFileTypes["images"] = ["bmp", "tif", "tiff", "gif", "jpeg", "jpg", "png", "svg", "ico", "raw"];
		availableFileTypes["video"] = ["avi", "flv", "swf", "m4v", "mkv", "mov", "mp4", "ogv", "wmv"];

		buildFileTypes(el);

		if (instance[el].options.debug !== true && instance[el].options.debug !== false) {
			instance[el].options.debug = true;
		}

		if (typeof $().emulateTransitionEnd !== 'function') {
			debug(el, "bootstrap");

			return;
		}

		if (!$("link[href$='font-awesome.css']").length && !$("link[href$='font-awesome.min.css']").length && instance[el].options.showThumb === true) {
			debug(el, "fontAwesome");

			return;
		}

		if (instance[el].options.url === null || !isUrlValid(instance[el].options.url)) {
			debug(el, "url");

			return;
		}

		if (instance[el].options.formMethod !== 'post' && instance[el].options.formMethod !== 'get') {
			debug(el, "formMethod");

			return;
		}

		if (instance[el].options.fallbackUrl !== null && !isUrlValid(instance[el].options.fallbackUrl)) {
			debug(el, "fallbackUrl");

			return;
		}
			
		if (testBrowser && instance[el].options.forceFallback === false) {
			formStructure(el);
		} else {
			fallbackFormStructure(el);
		}

		if (typeof instance[el].options.onInit === 'function') {
			instance[el].options.onInit.call(this);
		}
	}

	function formStructure (el) {
		instance[el].formData = new FormData();

		instance[el].form = $('<form action="' + instance[el].options.url + '" method="' + instance[el].options.formMethod + '" enctype="multipart/form-data"></form>');
		instance[el].btnBar = $('<div class="row fileupload-buttonbar"></div>');
		instance[el].btnWrapper = $('<div class="col-lg-7"></div>');

		instance[el].btnAdd = $('<div class="btn btn-success fileupload-add"><input type="file" ' + (instance[el].options.multiFile === true ? 'multiple="multiple"' : void 0) + 'multiple /><i class="glyphicon glyphicon-plus"></i>&nbsp;Add Files&hellip;</div>');
		instance[el].btnReset = $('<button type="reset" class="btn btn-primary fileupload-reset"><i class="glyphicon glyphicon-repeat"></i>&nbsp;Add More Files&hellip;</button>');
		instance[el].btnStart = $('<button class="btn btn-warning fileupload-start"><i class="glyphicon glyphicon-upload"></i>&nbsp;<span>Start upload</span></button>');
		instance[el].btnCancel = $('<button type="reset" class="btn btn-danger fileupload-cancel"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Cancel upload</span></button>');
		instance[el].overallProgressBar = $('<div class="col-lg-5 fileupload-overall-progress"><div class="progress"><div class="progress-bar progress-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-extended">&nbsp;</div></div></div>');
		instance[el].overallStatus = $('<div class="row fileupload-overall-status"><div class="col-lg-12"><div class="alert alert-success"><strong>Uploaded Successfully!</strong></div><div class="alert alert-danger"></div></div></div>');
		instance[el].filePreviewTable = $('<table role="presentation" class="table table-striped fileupload-preview"><tbody class="files"></tbody></table>');

		instance[el].btnWrapper.append(instance[el].btnAdd, instance[el].btnReset, instance[el].btnStart, instance[el].btnCancel);
		instance[el].btnBar.append(instance[el].btnWrapper, instance[el].overallProgressBar);
		instance[el].form.append(instance[el].btnBar, instance[el].overallStatus);
		instance[el].wrapper.append(instance[el].form, instance[el].filePreviewTable);

		instance[el].btnAdd.on('change', 'input', function (e) {
			methods.addFile(el, e);
		});

		instance[el].btnReset.on('click', function (e) {
			e.preventDefault();
			methods.resetUpload(el);
		});

		instance[el].btnStart.on('click', function (e) {
			e.preventDefault();
			methods.uploadStart(el);
		});

		instance[el].btnCancel.on('click', function () {
			methods.resetUpload(el);
		});

		instance[el].filePreviewTable.on('click', '.fileupload-remove', function () {
			methods.removeFile(el, $(this).val());
		});
	}

	function fallbackFormStructure (el) {
		instance[el].form = $('<form action="' + (instance[el].options.fallbackUrl ? instance[el].options.fallbackUrl : instance[el].options.url) + '" method="' + instance[el].options.formMethod + '" enctype="multipart/form-data"></form>');
		instance[el].btnAdd = $('<div class="input-group"><span class="input-group-btn"><span class="btn btn-success fileupload-fallback-add"><i class="glyphicon glyphicon-plus"></i>&nbsp;Add Files&hellip; <input type="file" name="' + instance[el].options.inputName + '" ' + (instance[el].options.multiFile === true ? 'multiple="multiple"' : void 0) + '></span></span><input type="text" class="form-control" readonly></div>');
		instance[el].btnStart = $('<div class="form-group"><button type="submit" class="btn btn-warning fileupload-fallback-start"><i class="glyphicon glyphicon-upload"></i>&nbsp;<span>Start upload</span></button><button type="reset" class="btn btn-primary fileupload-fallback-reset"><i class="glyphicon glyphicon-repeat"></i>&nbsp;Reset</button></div>');

		instance[el].form.append(instance[el].btnAdd, instance[el].btnStart);

		if (instance[el].options.hiddenInput) {
			$.each(instance[el].options.hiddenInput, function (key, value) {
				instance[el].form.append('<input type="hidden" name="' + key + '" value="' + value + '" />');
			});
		}

		instance[el].wrapper.append(instance[el].form);
				
		instance[el].btnAdd.on('change', '.fileupload-fallback-add input[type=file]', function () {
			var input, numFiles, label;

			input = $(this);
			numFiles = input.get(0).files ? input.get(0).files.length : 1;
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

			input.trigger('fileselect', [numFiles, label]);
		});

		instance[el].btnAdd.find(".fileupload-fallback-add input[type=file]").on('fileselect', function (e, numFiles, label) {
			var input, log;

			input = $(this).parents('.input-group').find('input[type=text]');
			log = numFiles > 1 ? numFiles + ' files selected' : label;

			if(input.length) {
				input.val(log);
			}
        });
	}

	function genThumb (el, file, fileType, fileExt) {
		var thumb;

		switch (fileType) {
			case 'archives':
				thumb = '<i class="fa fa-file-archive-o fa-5x"></i>';

				break;
			case 'audio':
				thumb = '<i class="fa fa-file-audio-o fa-5x"></i>';

				break;
			case 'files':
				switch (fileExt) {
					case 'doc':
						thumb = '<i class="fa fa-file-word-o fa-5x"></i>';

						break;
					case 'docx':
						thumb = '<i class="fa fa-file-word-o fa-5x"></i>';

						break;
					case 'dotx':
						thumb = '<i class="fa fa-file-word-o fa-5x"></i>';

						break;
					case 'docm':
						thumb = '<i class="fa fa-file-word-o fa-5x"></i>';

						break;
					case 'ppt':
						thumb = '<i class="fa fa-file-powerpoint-o fa-5x"></i>';

						break;
					case 'pptm':
						thumb = '<i class="fa fa-file-powerpoint-o fa-5x"></i>';

						break;
					case 'pptx':
						thumb = '<i class="fa fa-file-powerpoint-o fa-5x"></i>';

						break;
					case 'pdf':
						thumb = '<i class="fa fa-file-pdf-o fa-5x"></i>';

						break;
					case 'xls':
						thumb = '<i class="fa fa-file-excel-o fa-5x"></i>';

						break;
					case 'csv':
						thumb = '<i class="fa fa-file-excel-o fa-5x"></i>';

						break;
					case 'xlsm':
						thumb = '<i class="fa fa-file-excel-o fa-5x"></i>';

						break;
					case 'xlsx':
						thumb = '<i class="fa fa-file-excel-o fa-5x"></i>';

						break;
					default:
						thumb = '<i class="fa fa-file-o fa-5x"></i>';

						break;
				}

				break;
			case 'images':
				thumb = '<img src="' + URL.createObjectURL(file) + '" alt="' + file.name + '" width="' + instance[el].options.thumbWidth + 'px" height="' + instance[el].options.thumbHeight + 'px" class="fileupload-previewimg" />';

				break;
			case 'video':
				thumb = '<i class="fa fa-file-movie-o fa-5x"></i>';

				break;
		}

		return thumb;
	}

	function checkFile (el, file) {
		var test = [];

		$.each(instance[el].arrayFiles, function (key, value) {
			test.push(value.name);
		});

		return $.inArray(file.name, test);
	}

	function buildFileTypes (el) {
		$.each(instance[el].options.fileTypes, function (key, value) {
			if ($.isNumeric(key)) {
				instance[el].options.fileTypes[value] = availableFileTypes[value];
			} else if (!$.isNumeric(key) && $.isEmptyObject(value)) {
				instance[el].options.fileTypes[key] = availableFileTypes[key];
			}
		});

		return;
	}

	function getFileType (el, fileExt) {
		var fileType;

		$.each(instance[el].options.fileTypes, function (type, extensions) {
			if ($.inArray(fileExt, extensions) >= 0) {
				fileType = type;

				return false;
			}
		});

		return fileType;
	}

	function isValidFileType (el, fileExt) {
		var result = false;

		$.each(instance[el].options.fileTypes, function (type, extensions) {
			if ($.inArray(fileExt, extensions) >= 0) {
				result = true;

				return false;
			}
		});

		return result;
	}

	function testBrowser () {
		var xhr = new XMLHttpRequest();

		return !! (window.FormData && xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
	}

	function isUrlValid (url) {
		return /((http(s)?|ftp(s)?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(url);
	}

	function debug (el, type) {
		var alertMsg, alertWrapper = $('<div class="alert alert-danger" role="alert"></div>');

		switch (type) {
			case 'method':
				alertMsg = "The passed method " + name + " is not a valid method. Please check the configuration.";

				break;
			case 'fontAwesome':
				alertMsg = "The Font Awesome CSS is not available within the head of the website and is a required unless the option showThumb is set to false.";

				break;
			case 'url':
				alertMsg = "The URL provided in the configuration is not a valid URL.";
					
				break;
			case 'fallbackUrl':
				alertMsg = "The Fallback URL provided in the configuration is not a valid URL.";
					
				break;
			case 'formMethod':
				alertMsg = "The Form Method provided in the configuration is not a valid, please choose either get or post in the configuration.";
					
				break;
			case 'bootstrap':
				alertMsg = "The Twitter Bootstrap API is not available on the current page. Please check to make sure all the dependencies are in place.";
					
				break;
			default:
				alertMsg = "An unknown error occured.";
					
				break;
		}

		if (instance[el].options.debug === false && (window.console && window.console.error)) {
			window.console.error(alertMsg);
		} else if (instance[el].options.debug === true) {
			alertWrapper.append(alertMsg);
			wrapper.append(alertWrapper);
		}
	}

	$.bootstrapFileUpload = $.fn.bootstrapFileUpload = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			methods.init.apply(this, arguments);
		} else {
			window.console.error("The passed method " + method + " is not a valid method. Please check the configuration.");
		}
	};

	$.fn.bootstrapFileUpload.defaults = {
		url: null,
		fallbackUrl: null,
		formMethod: 'post',
		multiFile: true,
		multiUpload: false,
		inputName: 'files',
		hiddenInput: null,
		forceFallback: false,
		maxSize: 5,
		maxFiles: null,
		showThumb: true,
		thumbWidth: 80,
		thumbHeight: 80,
		fileTypes: {
			archives: [],
			audio: [],
			files: [],
			images: [],
			video: []
		},
		debug: true,
		onInit: function () {},
		onFileAdded: function () {},
		onFileRemoved: function () {},
		onFileCancel: function () {},
		onFileProcessing: function () {},
		onUploadProgress: function () {},
		onUploadError: function () {},
		onUploadSuccess: function () {},
		onUploadComplete: function () {},
		onUploadReset: function () {}
	};
}(jQuery, document, window));
