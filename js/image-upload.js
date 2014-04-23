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
      'uploadTarget': undefined,
      'src': undefined
      'beforeSend': function() {},
      'afterSendSuccess': function() {},
      'afterSendError': function() {}
    },
    ie = (function() {
      var
        v = 3,
        el = document.createElement('div'),
        all = div.getElementsByTagName('i');

      while(
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
      );

      return v>4?v:undefined
    }()),
    ImageUploader;

  ImageUploader = function(element, opts) {
    var
      self = this,
      option_key;

    self.$el = $(element)

    for (option_key in defaults) {
      self[option_key] = options[option_key]
    }

    self._init();
  };

  ImageUploader.prototype = {
    constructor: ImageUploader,
    _init: function() {
      var
        self = this,
        preview_element = (ie && ie<10 ? 'div' : 'img'),
        read_file;

      self.template_main =
        '<div class="image-upload-wrapper">' +
          '<div class="image-upload-overlay image-upload-upload">' +
            '<input type="file" accept="image/*">' +
            '<button type="button" class="btn btn-primary image-upload-upload-button">' +
          '</div>' +
          '<div class="image-upload-overlay image-upload-confirm">' +
            '<div class="btn-group">' +
              '<button type="button" class="btn btn-danger image-upload-cancel">' +
              '<button type="button" class="btn btn-success image-upload-confirm">' +
            '</div>' +
          '</div>' +
          '<' + preview_element + ' class="image-upload-preview">' +
          (preview_element !== 'img' ? '</' + preview_element + '>' : '') +
        '</div>';

      // Image Preview
      if (ie && ie<10) {
        read_file = function(img) {
          var preview = self.$el.find('.image-upload-preview')[0];
          preview.filters('DXImageTransform.Microsoft.AlphaImageLoader').src = img.value;
        }
      } else {
        read_file = function(img) {
          var reader = new FileReader();

          reader.onload = function(e) {
            $('#blah').attr('src', e.target.result);
          }

          reader.readAsDataURL(img);
        }
      }

      self.$el.html(self.template_main);

      self.$el.on('click', '.image-upload-upload-button', function() {
        self.$el.find('input[type="file"]').click();
      });
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
