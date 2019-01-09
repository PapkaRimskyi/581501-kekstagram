'use strict';

(function () {
  var fileChooser = document.querySelector('.img-upload__input');
  var preview = document.querySelector('.img-upload__image');

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
