/*! Bootstrap FileUpload - v0.1.0 - 2016-02-24
* https://github.com/lleblanc42/bootstrap-FileUpload
* Copyright (c) 2016 Luke LeBlanc; Licensed GPL-3.0 */
;(function ($, document, window) {
	'use strict';

	$.fn.bootstrapFileUpload = function(opts) {

		var defaults = {
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
			createThumb: true,
			thumbWidth: 80,
			thumbHeight: 80,
			fileTypes: null,
			onInit: function() {},
			onFileAdded: function() {},
			onFileRemoved: function() {},
			onFileCancel: function() {},
			onFileProcessing: function() {},
			onUploadProgress: function() {},
			onUploadError: function() {},
			onUploadSuccess: function() {},
			onUploadComplete: function() {},
			onUploadReset: function() {}
		};

		var options = $.extend(defaults, opts || {});

		var wrapper, form, btnBar, btnWrapper, btnAdd, btnStart, btnCancel, btnReset, overallProgressBar, overallStatus, filePreviewTable, formData, arrayFiles = {}, arrayLength = 0;

		var init = function(el) {
			wrapper = $('#' + el);

			if (testBrowser && options.forceFallback === false) {
				formData = new FormData();

				form = $('<form action="' + (options.fallbackUrl ? options.fallbackUrl : options.url) + '" method="' + options.formMethod + '" enctype="multipart/form-data"></form>');
				btnBar = $('<div class="row fileupload-buttonbar"></div>');
				btnWrapper = $('<div class="col-lg-7"></div>');

				btnAdd = $('<div class="btn btn-success fileupload-add"><input type="file" ' + (options.multiFile === true ? 'multiple="multiple"' : void 0) + 'multiple /><i class="glyphicon glyphicon-plus"></i>&nbsp;Add Files&hellip;</div>');
				btnReset = $('<button type="reset" class="btn btn-primary fileupload-reset"><i class="glyphicon glyphicon-repeat"></i>&nbsp;Add More Files&hellip;</button>');
				btnStart = $('<button class="btn btn-warning fileupload-start"><i class="glyphicon glyphicon-upload"></i>&nbsp;<span>Start upload</span></button>');
				btnCancel = $('<button type="reset" class="btn btn-danger fileupload-cancel"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Cancel upload</span></button>');
				overallProgressBar = $('<div class="col-lg-5 fileupload-overall-progress"><div class="progress"><div class="progress-bar progress-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-extended">&nbsp;</div></div></div>');
				overallStatus = $('<div class="row fileupload-overall-status"><div class="col-lg-12"><div class="alert alert-success"><strong>Uploaded Successfully!</strong></div><div class="alert alert-danger"></div></div></div>');
				filePreviewTable = $('<table role="presentation" class="table table-striped fileupload-preview"><tbody class="files"></tbody></table>');

				btnWrapper.append(btnAdd, btnReset, btnStart, btnCancel);
				btnBar.append(btnWrapper, overallProgressBar);
				form.append(btnBar, overallStatus);
				wrapper.append(form, filePreviewTable);

				btnAdd.on('change', 'input', function(e) { addFile(e); });

				btnReset.on('click', function(e) {
					e.preventDefault();
					resetUpload();
				});

				btnStart.on('click', function(e) {
					e.preventDefault();
					uploadStart();
				});

				btnCancel.on('click', function() { resetUpload(); });

				filePreviewTable.on('click', '.fileupload-remove', function() { removeFile($(this).val()); });
			} else {
				form = $('<form action="' + (options.fallbackUrl ? options.fallbackUrl : options.url) + '" method="' + options.formMethod + '" enctype="multipart/form-data"></form>');
				btnAdd = $('<div class="input-group"><span class="input-group-btn"><span class="btn btn-success fileupload-fallback-add"><i class="glyphicon glyphicon-plus"></i>&nbsp;Add Files&hellip; <input type="file" name="' + options.inputName + '" ' + (options.multiFile === true ? 'multiple="multiple"' : void 0) + '></span></span><input type="text" class="form-control" readonly></div>');
				btnStart = $('<div class="form-group"><button type="submit" class="btn btn-warning fileupload-fallback-start"><i class="glyphicon glyphicon-upload"></i>&nbsp;<span>Start upload</span></button><button type="reset" class="btn btn-primary fileupload-fallback-reset"><i class="glyphicon glyphicon-repeat"></i>&nbsp;Reset</button></div>');

				form.append(btnAdd, btnStart);

				if (options.hiddenInput) {
					$.each(options.hiddenInput, function(key, value) {
						form.append('<input type="hidden" name="' + key + '" value="' + value + '" />');
					});
				}

				wrapper.append(form);
				
				btnAdd.on('change', '.fileupload-fallback-add input[type=file]', function() {
					var input, numFiles, label;

					input = $(this);
					numFiles = input.get(0).files ? input.get(0).files.length : 1;
					label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

					input.trigger('fileselect', [numFiles, label]);
				});

				btnAdd.find(".fileupload-fallback-add input[type=file]").on('fileselect', function(e, numFiles, label) {
					var input, log;

					input = $(this).parents('.input-group').find('input[type=text]');
					log = numFiles > 1 ? numFiles + ' files selected' : label;

					if(input.length) {
						input.val(log);
					}
                });
			}

			if (typeof options.onInit === 'function') {
				options.onInit.call();
			}
		};

		var addFile = function(event) {
			btnStart.fadeIn("slow", "linear");
			btnCancel.fadeIn("slow", "linear");

			var curfiles = event.target.files;
			var length = curfiles.length;

			if (options.multiFile === true && options.maxFiles && length > options.maxFiles) {
				window.alert('You\'re trying to upload ' + length + ' files and only ' + options.maxFiles + ' files is currently supported! The system will only upload what is supported and you will have to upload again.');
				length = options.maxFiles;
			}

			filePreviewTable.detach();

			for (var i = 0; i < length; i++) {
				var fileName, file, size, row;

				fileName = "file-" + i;
				file = curfiles[i];
				size = (file.size / 1024) / 1024;

				if (options.fileTypes) {
					if (!file.type.match(options.fileTypes)){
						window.alert('The file "' + file.name + '" is not a supported filetype!');
						continue;
					}
				}

				if (size.toFixed(2) > options.maxSize) {
					window.alert('The file size for "' + file.name + '" is too large! Maximum supported file size is ' + options.maxSize + 'MB and the size of the file is ' + size + 'MB');
					continue;
				}
					
				if (arrayFiles && checkFile(file) >= 0) {
					window.alert('The file "' + file.name + '" is already in queue!');
					continue;
				}

				arrayFiles[fileName] = file;
				arrayLength = ++arrayLength;

				var thumb = '<img src="' + URL.createObjectURL(file) + '" alt="' + file.name + '" width="' + options.thumbWidth + 'px" height="' + options.thumbHeight + 'px" class="fileupload-previewimg" />';
				var progressBar = '<div class="progress fileupload-progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div><div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div></div><div class="alert alert-success"><strong>Uploaded Successfully!</strong></div><div class="alert alert-danger"></div>';
					
				if (options.createThumb === true) {
					if (options.multiUpload === false) {
						row = '<tr class="fileupload-previewrow thumb row" id="' + fileName + '"><td class="col-lg-1">' + thumb + '</td><td class="col-lg-4">' + file.name + '</td><td class="col-lg-6">' + progressBar + '</td><td class="col-lg-1"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					} else {
						row = '<tr class="fileupload-previewrow thumb row" id="' + fileName + '"><td class="col-lg-1">' + thumb + '</td><td class="col-lg-9">' + file.name + '</td><td class="col-lg-2"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					}
				} else {
					if (options.multiUpload === false) {
						row = '<tr class="fileupload-previewrow no-thumb row" id="' + fileName + '"><td class="col-lg-5">' + file.name + '</td><td class="col-lg-6">' + progressBar + '</td><td class="col-lg-1"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					} else {
						row = '<tr class="fileupload-previewrow no-thumb row" id="' + fileName + '"><td class="col-lg-10">' + file.name + '</td><td class="col-lg-2"><button class="btn btn-danger fileupload-remove" value="' + fileName + '"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove File</span></button></td></tr>';
					}
				}

				filePreviewTable.append(row);
			}
				
			wrapper.append(filePreviewTable);

			filePreviewTable.fadeIn("slow", "linear");

			if (typeof options.onFileAdded === 'function') {
				options.onFileAdded.call();
			}
		};

		var uploadStart = function() {
			$(".fileupload-add").attr("disabled", "disabled");
			$(".fileupload-start").attr("disabled", "disabled");
			$(".fileupload-cancel").attr("disabled", "disabled");
			$(".fileupload-remove").attr("disabled", "disabled");

			if (options.hiddenInput) {
				$.each(options.hiddenInput, function(key, value) {
					formData.append(key, value);
				});
			}

			if (options.multiUpload === false) {
				$.each(arrayFiles, function(key, value) {
					formData.append(options.inputName, value);

					$("#" + key + " .fileupload-progress .progress-bar-striped").fadeIn("slow", "linear");

					$.ajax({
						url: options.url,
						type: options.formMethod,
						data: formData,
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

							if (typeof options.onUploadSuccess === 'function') {
								options.onUploadSuccess.call();
							}
						},
						error: function(xhr, status, err) {
							$("#" + key + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
							$("#" + key + " .fileupload-progress .progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%");

							$("#" + key + " .alert-danger").fadeIn("slow", "linear").html(status + ": " + err.message);

							if (typeof options.onUploadError === 'function') {
								options.onUploadError.call();
							}
						},
						xhr: function() {
							var myXhr = $.ajaxSettings.xhr();

							if(myXhr.upload){
								myXhr.upload.addEventListener('progress', function(e) {
									if(e.lengthComputable){
										var percentComplete = e.loaded / e.total;
										$("#" + key + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", Math.round(percentComplete * 100)).css("width", Math.round(percentComplete * 100) + "%");
									}
								});
							}

				            return myXhr;
				        }
					});

					if (typeof options.onUploadProgress === 'function') {
						options.onUploadProgress.call();
					}
				});
			} else {
				overallProgressBar.fadeIn("slow", "linear");

				$.each(arrayFiles, function(key, value) { formData.append(options.inputName + "[]", value); });

				$.ajax({
					url: options.url,
					type: options.formMethod,
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
					accepts: "json",
					success: function(data, status, xhr) {
						var response = JSON.parse(data);

						if (response.error) {
							overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
							overallProgressBar.find(".progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%");
							overallStatus.fadeIn("slow", "linear");
							overallStatus.find(".alert-danger").fadeIn("slow", "linear").html("<strong>Error:</strong><br />" + response.error);
						} else {
							overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
							overallProgressBar.find(".progress-bar-success").attr("aria-valuenow", 100).css("width", "100%");
							overallStatus.fadeIn("slow", "linear");
							overallStatus.find(".alert-success").fadeIn("slow", "linear");
						}

						if (typeof options.onUploadSuccess === 'function') {
							options.onUploadSuccess.call();
						}
					},
					error: function(xhr, status, err) {
						overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%");
						overallProgressBar.find(".progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%");
						overallStatus.fadeIn("slow", "linear");
						overallStatus.find(".alert-danger").fadeIn("slow", "linear").html(status + ": " + err.message);

						if (typeof options.onUploadError === 'function') {
							options.onUploadError.call();
						}
					},
					xhr: function() {
						var myXhr = $.ajaxSettings.xhr();

						if(myXhr.upload){
							myXhr.upload.addEventListener('progress', function(e) {
								if(e.lengthComputable){
									var percentComplete = e.loaded / e.total;
									overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", Math.round(percentComplete * 100)).css("width", Math.round(percentComplete * 100) + "%");
									if (typeof options.onUploadProgress === 'function') {
										options.onUploadProgress.call();
									}
								}
							});
						}

				        return myXhr;
				    }
				});
			}

			btnAdd.fadeOut("slow", "linear");
			btnStart.fadeOut("slow", "linear");
			btnCancel.fadeOut("slow", "linear");
			btnReset.delay(600).fadeIn("slow", "linear");

            if (typeof options.onUploadComplete === 'function') {
            	options.onUploadComplete.call();
            }
		};

		var resetForm = function() {
			filePreviewTable.find("tbody").empty();
			form[0].reset();
			arrayFiles = {};
			arrayLength = 0;
		};

		var removeFile = function(id) {
			if (arrayLength <= 1) {
				resetUpload();
			} else {
				$("#" + id).fadeOut("slow", "linear");
				$("#" + id + " .alert").fadeOut("slow", "linear");

				$("#" + id).remove();
				delete arrayFiles[id];

				arrayLength = --arrayLength;
			}

			if (typeof options.onFileRemoved === 'function') {
				options.onFileRemoved.call();
			}
		};

		var resetUpload = function() {
			resetForm();

			filePreviewTable.fadeOut("slow", "linear");
			btnStart.fadeOut("slow", "linear");
			btnCancel.fadeOut("slow", "linear");
			$(".fileupload-previewrow .alert").fadeOut("slow", "linear");

			$(".fileupload-add").removeAttr("disabled");
			$(".fileupload-start").removeAttr("disabled");
			$(".fileupload-cancel").removeAttr("disabled");
			$(".fileupload-add").delay(800).fadeIn("slow", "linear");

			overallProgressBar.find(".progress-bar-success").attr("aria-valuenow", 0).css("width", "0%");

			overallProgressBar.fadeOut("slow", "linear");
			btnReset.fadeOut("slow", "linear");

			if (typeof options.onUploadReset === 'function') {
				options.onUploadReset.call();
			}
		};

		var checkFile = function(file) {
			var test = [];

			$.each(arrayFiles, function(key, value) {
				test.push(value.name);
			});

			return $.inArray(file.name, test);
		};

		var testBrowser = function() {
			var xhr = new XMLHttpRequest();

			return !! (window.FormData && xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
		};

		return this.each(function() {
			init(this.id);
		});
	};

}(jQuery, document, window));