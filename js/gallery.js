'use strict';

(function () {
  var picturesSection = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
  var imgFilters = document.querySelector('.img-filters');
  var commentsLoader = document.querySelector('.comments-loader');
  var filterNew = document.getElementById('filter-new');
  var filterDiscussed = document.getElementById('filter-discussed');
  var filterPopular = document.getElementById('filter-popular');

  var ESC_KEYNUMBER = 27;
  var ENTER_KEYNUMBER = 13;

  var requestPhotoData = [];
  var filteredPhoto = [];

  var successHandler = function (data) {
    requestPhotoData = data;
    window.runGenerationUsersPhoto(data);
    imgFilters.classList.remove('img-filters--inactive');
    window.addDelegationHandler(data);
  };

  window.load(successHandler, window.errorLoadHandler);

  window.addDelegationHandler = function (photoData) {
    picturesSection.addEventListener('click', function (evt) {
      var target = evt.target;
      if (target.className === 'picture__img') {
        var targetId = target.getAttribute('data-id');
        if (filteredPhoto.length) {
          window.generationUserPictureAndComments(filteredPhoto[targetId]);
        } else {
          window.generationUserPictureAndComments(photoData[targetId]);
        }
        openUserPhoto();
      }
    });
  };

  var openUserPhoto = function () {
    bigPicture.classList.remove('hidden');
    window.moreComments();
    document.addEventListener('keydown', onEscPressUserPhoto);
  };

  var closeUserPhoto = function () {
    bigPicture.classList.add('hidden');
    socialComments.innerHTML = '';
    document.removeEventListener('keydown', onEscPressUserPhoto);
    commentsLoader.removeEventListener('click', window.moreComments);
    commentsLoader.classList.remove('hidden');
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

  var shuffle = function () {
    return Math.random() - 0.5;
  };

  var getTenRandomPhoto = function () {
    var requestPhotoDataCopy = requestPhotoData.slice();
    var tenRandomPhoto = requestPhotoDataCopy.sort(shuffle).slice(0, 10);
    filteredPhoto = tenRandomPhoto;
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
    var sortedPhotoByComments = requestPhotoData.slice().sort(function (left, right) {
      var commentsDiff = getCommentsCount(right) - getCommentsCount(left);
      if (commentsDiff === 0) {
        commentsDiff = getLikesCount(right) - getLikesCount(left);
      }
      return commentsDiff;
    });
    filteredPhoto = sortedPhotoByComments;
    window.runGenerationUsersPhoto(sortedPhotoByComments);
  };

  var removeClassActive = function (buttonId) {
    var buttonFilter = document.querySelectorAll('.img-filters__button');
    buttonFilter.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    buttonId.classList.add('img-filters__button--active');
  };

  var filterPopularDebounce = function () {
    window.runGenerationUsersPhoto(requestPhotoData);
  };

  var filterNewDebounce = function () {
    window.runGenerationUsersPhoto(getTenRandomPhoto());
  };

  var filterDiscussedDebounce = function () {
    getSortPhotoByComments();
  };

  var onClickPopularDebounce = window.debounce(filterPopularDebounce);

  var onClickDiscussedDebounce = window.debounce(filterDiscussedDebounce);

  var onClickNewDebounce = window.debounce(filterNewDebounce);

  filterPopular.addEventListener('click', function (evt) {
    filteredPhoto = [];
    evt.preventDefault();
    removeClassActive(filterPopular);
    onClickPopularDebounce();
  });

  filterNew.addEventListener('click', function (evt) {
    evt.preventDefault();
    removeClassActive(filterNew);
    onClickNewDebounce();
  });

  filterDiscussed.addEventListener('click', function (evt) {
    evt.preventDefault();
    removeClassActive(filterDiscussed);
    onClickDiscussedDebounce();
  });
})();
