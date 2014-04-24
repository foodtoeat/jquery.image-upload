/*!
 * Image Uploader Plugin for Twitter Bootstrap
 *
 * Copyright 2014 FoodToEat, Phil Condreay (phil@foodtoeat.com)
 *
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

(function($, window, document, undefined) {
  'use strict';

  var
    defaults = {
      'src': undefined,
    },
    ImageUploader = function(element, opts) {
      var
        self = this,
        option_key;

      self.$el = $(element)

      for (option_key in defaults) {
        self[option_key] = opts[option_key]
      }

      self._init();
    };

  ImageUploader.prototype = {
    constructor: ImageUploader,
    _init: function() {
      var
        self = this,
        preview_element = (!self.file_reader ? 'div' : 'img'),
        read_file;

      self.template_main =
        '<div class="image-upload-wrapper">' +
          '<div class="image-upload-overlay image-upload-upload">' +
            '<div class="image-upload-centered-div">' +
              '<input type="file" accept="image/*">' +
              '<button type="button" class="btn btn-primary image-upload-upload-button">' +
                '<span class="glyphicon glyphicon-cloud-upload"></span> ' +
                'Upload New Image' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="image-upload-overlay image-upload-confirm">' +
            '<div class="image-upload-centered-div">' +
              '<div class="btn-group">' +
                '<button type="button" class="btn btn-danger image-upload-cancel">' +
                  '<span class="glyphicon glyphicon-remove"></span>' +
                '</button>' +
                '<button type="button" class="btn btn-success image-upload-confirm">' +
                  '<span class="glyphicon glyphicon-ok"></span>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<' + preview_element + ' class="image-upload-preview">' +
          (preview_element !== 'img' ? '</' + preview_element + '>' : '') +
        '</div>';

      self.$el.html(self.template_main);

      self.$el.on('click', '.image-upload-upload-button', function() {
        self.$el.find('input[type="file"]').click();
        self.$el.find('.image-upload-wrapper').addClass('image-upload-dialoging');
      });

      self.$el.on('change', '.image-upload-upload input[type="file"]', function() {
        var wrapper = self.$el.find('.image-upload-wrapper');
        if (this.files && this.files[0]) {
          $.proxy(self.read_file,self)(this.files[0]);
          self.$el.trigger('imageUploader.change');
          wrapper.addClass('image-upload-pending');
        }
        wrapper.removeClass('image-upload-dialoging');
      });

      self.$el.on('click', '.image-upload-cancel', function() {
        self.$el.find('.image-upload-wrapper').removeClass('image-upload-pending');
        $.proxy(self.read_file,self)(self.old_file);
        self.$el.trigger('imageUploader.cancel');
      });

      self.$el.on('click', '.image-upload-confirm', function() {
        self.$el.find('.image-upload-wrapper').removeClass('image-upload-pending');
        self.$el.trigger('imageUploader.confirm');
      });

      $.proxy(self.set_file,self)({
        success: function() {
          $.proxy(self.read_file,self)(self.file);
        }
      });
    },
    file_reader: (window.FileReader ? new FileReader() : undefined),
    set_file: function(opts) {
      var self = this;

      if (!self.src) throw 'ImageUploader requires a src attribute.';

      var xhr = new XMLHttpRequest();
      xhr.open('GET', self.src, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        if (this.status == 200) {
          self.file = this.response;
          if (opts && 'success' in opts) opts.success();
        } else {
          throw 'Couldn\'t find ulr (' + url + ').';
        }
      };

      xhr.send();
    },
    read_file: function(img) {
      var
        self = this,
        preview;

      self.old_file = self.file;

      if (!self.file_reader) {
        // IE < 10
        preview = self.$el.find('.image-upload-preview')[0];
        preview.filters('DXImageTransform.Microsoft.AlphaImageLoader').src = img.value;
      } else {
        self.file_reader.onload = function(e) {
          self.$el.find('.image-upload-preview').attr('src', e.target.result);
        }

        self.file_reader.readAsDataURL(img);
      }
    }
  };

  // jQuery plugin
  $.fn.imageUploader = function(option) {
    var args = Array.apply(null, arguments);
    args.shift();

    return this.each(function() {
      var
        $this = $(this),
        data = $this.data('imageUploader'),
        options = typeof option === 'object' && option;

      if (!data) {
        $this.data('imageUploader', (data = new ImageUploader(this, $.extend({}, defaults, options, $this.data()))));
      }

      if (typeof option === 'string') {
        data[option].apply(data, args);
      }
    });
  };
})(jQuery, window, document);
