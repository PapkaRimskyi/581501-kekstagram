'use strict';

(function () {
  var picturesSection = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
  var imgFilters = document.querySelector('.img-filters');

  var ESC_KEYNUMBER = 27;
  var ENTER_KEYNUMBER = 13;

  var requestPhotoData = [];

  var successHandler = function (data) {
    requestPhotoData = data;
    window.runGenerationUsersPhoto(data);
    imgFilters.classList.remove('img-filters--inactive');
  };

  window.load(successHandler, window.errorLoadHandler);

  window.addDelegationHandler = function (photoData) {
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

  var filterNew = document.getElementById('filter-new');
  var filterDiscussed = document.getElementById('filter-discussed');
  var filterPopular = document.getElementById('filter-popular');

  var shuffle = function () {
    return Math.random() - 0.5;
  };

  var getTenRandomPhoto = function () {
    var requestPhotoDataCopy = requestPhotoData.slice();
    var tenRandomPhoto = requestPhotoDataCopy.sort(shuffle).slice(0, 10);
    return tenRandomPhoto;
  };

  var getCommentsCount = function (photo) {
    var commentsCount = photo.comments.length;
    return commentsCount;
  };

  var getLikesCount = function (photo) {
    var likesCount = photo.likes;
    return likesCount;
  };

  var getSortPhotoByComments = function () {
    window.runGenerationUsersPhoto(requestPhotoData.slice().sort(function (left, right) {
      var commentsDiff = getCommentsCount(right) - getCommentsCount(left);
      if (commentsDiff === 0) {
        commentsDiff = getLikesCount(right) - getLikesCount(left);
      }
      return commentsDiff;
    }));
  };

  var removeClassActive = function (buttonId) {
    var buttonFilter = document.querySelectorAll('.img-filters__button');
    buttonFilter.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    buttonId.classList.add('img-filters__button--active');
  };

  filterPopular.addEventListener('click', function (evt) {
    evt.preventDefault();
    removeClassActive(filterPopular);
    window.setTimeout(function () {
      window.runGenerationUsersPhoto(requestPhotoData);
    }, 500);
  });

  filterNew.addEventListener('click', function (evt) {
    evt.preventDefault();
    removeClassActive(filterNew);
    window.setTimeout(function () {
      window.runGenerationUsersPhoto(getTenRandomPhoto());
    }, 500);
  });

  filterDiscussed.addEventListener('click', function (evt) {
    evt.preventDefault();
    removeClassActive(filterDiscussed);
    window.setTimeout(function () {
      getSortPhotoByComments();
    }, 500);
  });
})();
