(function(window, document) {

'use strict';

var defaultOptions = {
	node: null,
	dropEffect: "none",
	ondrop: null,
	ondragover: null,
	ondragenter: null,
	ondragleave: null,
};

function noop() {};

function getAllEntries(reader, callback) {
	var allEntries = [];

	reader.readEntries(function(entries) {
		if (entries.length === 0) {
			return callback(allEntries);
		}

		allEntries = allEntries.concat(entries);

		getAllEntries(reader, function(_entries) {
			allEntries = allEntries.concat(_entries);
			callback(allEntries);
		});
	});
}

function getDirectoryFiles(entry, callback) {
	var files = [];
	var directoryReader = entry.createReader(); // create a directory reader

	// returns an array of items in the directory (files AND folders)
	getAllEntries(directoryReader, function(entries) {
		// to keep track of progress
		var entriesCount = entries.length;
		var parsedEntriesCount = 0;

		if (entries.length == 0) return callback([]);

		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];

			// if entry is a file
			if (entry.isFile) {
				// transform it into a usable File object (for uploading, or reading)

				// use bind to pass the entry, since this is a loop and way before the callack is 
				// called, the entry variable will be the last entry (left by last iteration)
				entry.file(function(file) {
					files.push({
						file: file,
						path: this.fullPath.slice(1),
					});

					parsedEntriesCount++;
					if (parsedEntriesCount == entriesCount) {
						callback(files);
					}
				}.bind(entry));
			} else if (entry.isDirectory) {
				getDirectoryFiles(entry, function(_files) {
					files = files.concat(_files);

					parsedEntriesCount++;
					if (parsedEntriesCount == entriesCount) {
						callback(files);
					}
				}.bind(entry));
			}
		}
	});
}

function getFiles(files, callback) {
	var dropData = {
		files: [],
		items: {},
	};

	if (!files.length) return callback(dropData);
	if (files[0].webkitGetAsEntry === undefined) {
		// if this browser isn't chrome, there isn't anything more we can do about those files
		// so just pass them on
		for (var i = 0; i < files.length; i++) {
			var file = files[i];

			// if the browser is chrome, it supports directories so path property
			// is really handy since it provdies info about relative path of the file
			// but in this case just use the name
			dropData.files.push({
				file: file,
				path: file.name,
			});
		}
		return callback(dropData);
	}

	var filesCount = files.length;
	var parsedItemsCount = 0;

	var items = files; // since those are actually DataTransferItem s

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var entry = item.webkitGetAsEntry();

		if (entry.isFile) {
			var file = item.getAsFile();
			dropData.files.push({
				file: file,
				path: file.name,
			});
			parsedItemsCount++;

			if (parsedItemsCount == filesCount) return callback(dropData);
			continue;
		}

		getDirectoryFiles(entry, function(files) {
			for (var k = 0; k < files.length; k++) {
				dropData.files.push(files[k]);
			}

			// all thos efiles can be counted as one, since it was one directory
			parsedItemsCount++;
			if (parsedItemsCount == filesCount) callback(dropData);
		});
	}
}

// since firefox doesn't have the .items property
function getMostData(dataTransfer, callback) {
	var dropData = {
		files: [],
	};

	var dt = dataTransfer;

	var plain = dt.getData("text/plain");
	var html = dt.getData("text/html");
	var url  = dt.getData("URL");

	dropData.strings = {
		plain: {
			type: "text/plain",
			value: plain,
		},
		html: {
			type: "text/html",
			value: html,
		},
		// since in chrome it would be uri_list, we don't want the same code to look for different keys for URL
		uri_list: {
			type: "text/uri-list",
			value: url,
		}
	};

	callback(dropData);
}

/* Generates drop data object from event object, and calls dropObjects ondrop methods if they are present */
function generateDropData(e, callback) {
	callback = typeof callback === "function" ? callback : noop;

	// instead of passing event parameter to all the functions for them to include it in the callback,
	// just write a callbackwrapper which only needs dropData but passes event argument too
	var callbackWrapper = function(dropData) {
		console.timeEnd("Drop");
		callback(dropData, e);
	}

	var items = e.dataTransfer.items;
	var files = e.dataTransfer.files;

	if (files.length > 0 && !items) {
		return getFiles(files, callbackWrapper);
	}

	items = items || [];

	/* DataTransfer.items is more modern property, whereas files is older. Chrome still supports both
	but most browsers haven't implemented items yet. So, items contains files property as well,
	but has more methods (like webkitGetAsEntry), so instead of using files, we should use items
	*/
	if (items.length > 0 || typeof e.dataTransfer.getData === "function") {
		/*
		At this point, if files are being dropped, firefox wont reach here,
		but if link or text is dropped, firefox and safari will reach this point but will break since
		the .items key is undefined, and every data part has to be extracted specificly with
		.getData method
		*/
		if (items.length === 0) return getMostData(e.dataTransfer, callbackWrapper);

		// if first one is a file, others are too
		if (items[0].kind == "file") {
			return getFiles(items, callbackWrapper);
		}

		var parsedItemsCount = 0;
		var itemsCount = items.length;

		var dropData = {
			files: [],
			strings: {}
		};

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var itemInfo = {
				type: item.type,
			};

			// until the callback is called, item gets deleted from memory
			// or gets overwritten next loop, so the item will refer to the last item in loop
			// so lets make the "this" keyword current item in the callback function
			item.getAsString(function(string) {
				var type = this.type || "";
				type = type.split("/");

				if (type.length == 2) {
					type = type[1];
					// replace every uri-list with uri_list
					type = type.replace(/-/g, "_");
				} else {
					// if type is some weird string that isn't a mime type, use it as the type
					type = this.type;
				}

				dropData.strings[type] = {
					type: this.type, // store the mime type too
					value: string,
				};
				parsedItemsCount++;

				if (parsedItemsCount == itemsCount) {
					callbackWrapper(dropData);
				}
			}.bind(itemInfo));
		}
	} else {
		// otherwise, just pretend nothing was dropped
		callbackWrapper({
			files: [],
			strings: {},
		});
	}
}

function addEvent(element, eventName, callback) {
	if (element.addEventListener) {
		element.addEventListener(eventName, callback);
	} else if (element.attachEvent) {
		element.attachEvent("on" + eventName, callback);
	}
}

function Drop(opts) {
	var options = defaultOptions;

	for (var opt in opts) {
		if (options.hasOwnProperty(opt)) {
			options[opt] = opts[opt];
		}
	}

	this.setNode(options.node);
	this.dropEffect = options.dropEffect;

	this.ondrop      = options.ondrop;
	this.ondragenter = options.ondragenter;
	this.ondragover  = options.ondragover;
	this.ondragleave = options.ondragleave;

	this.init();
}

Drop.prototype.ondrop      = null;
Drop.prototype.ondragenter = null;
Drop.prototype.ondragover  = null;
Drop.prototype.ondragleave = null;
Drop.prototype.node        = null;

/* This function gets called and asked which drop effect should be shown based on dragged items' types
	(in case the user want's to check the dragging types before allowing any effects)
*/
Drop.prototype.generateDropEffect = function(types) {
	return this.dropEffect;
}

Drop.prototype.setNode = function(node) {
	if (!node) return;

	if (node.nodeName) {
		this.node = node;
	} else if (typeof node == "string") {
		var el = document.querySelector(node);
		if (el) this.node = el;
	} else if (node && node[0]) {
		node = node[0];
		return this.setNode(node);
	}
}

Drop.prototype.init = function() {
	var node = this.node;

	if (!node) return;
	if (!node.nodeName) return;

	var self = this;

	addEvent(node, "dragover", function(e) {
		e.preventDefault();

		// since .types is DOMStringList, it doesn't have array methods (in firefox at least)
		var types = Array.prototype.slice.call(e.dataTransfer.types);
		var effect = self.generateDropEffect(types, e);
		e.dataTransfer.dropEffect = effect;
		e.dataTransfer.effectAllowed = effect;

		if (typeof self.ondragover === "function") self.ondragover(e);
	});

	addEvent(node, "dragenter", function(e) {
		e.preventDefault();

		var types = Array.prototype.slice.call(e.dataTransfer.types);
		var effect = self.generateDropEffect(types, e);
		e.dataTransfer.dropEffect = effect;
		e.dataTransfer.effectAllowed = effect;

		if (typeof self.ondragenter === "function") self.ondragenter(e);
	});

	addEvent(node, "dragleave", function(e) {
		if (typeof self.ondragleave === "function") self.ondragleave(e);
	});

	addEvent(node, "drop", function(e) {
		e.preventDefault();

		console.time("Drop");
		var callback = typeof self.ondrop === "function" ? self.ondrop : noop;
		generateDropData(e, callback);
	});
}

window.Drop = Drop;

})(window, document);