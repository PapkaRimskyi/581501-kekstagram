'use strict';

(function () {
  var picturesSection = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  var ESC_KEYNUMBER = 27;
  var ENTER_KEYNUMBER = 13;

  picturesSection.appendChild(window.runGenerationUsersPhoto(window.getPhotosData()));

  var addDelegationHandler = function (photoData) {
    picturesSection.addEventListener('click', function (evt) {
      var target = evt.target;
      if (target.className === 'picture__img') {
        var targetId = target.getAttribute('data-id');
        window.generationUserPictureAndComments(photoData[targetId]);
        openUserPhoto();
      }
    });
  };

  var openUserPhoto = function () {
    bigPicture.classList.remove('hidden');
    document.addEventListener('keydown', onEscPressUserPhoto);
  };

  var closeUserPhoto = function () {
    bigPicture.classList.add('hidden');
    socialComments.innerHTML = '';
    document.removeEventListener('keydown', onEscPressUserPhoto);
  };

  var onEscPressUserPhoto = function (evt) {
    if (evt.keyCode === ESC_KEYNUMBER) {
      closeUserPhoto();
    }
  };

  bigPictureCancel.addEventListener('click', function () {
    closeUserPhoto();
  });

  bigPictureCancel.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYNUMBER) {
      closeUserPhoto();
    }
  });

  addDelegationHandler(window.getPhotosData());


})();
