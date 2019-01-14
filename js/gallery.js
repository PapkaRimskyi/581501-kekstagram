'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
  var imgFilters = document.querySelector('.img-filters');
  var commentsLoader = document.querySelector('.comments-loader');
  var filterNew = document.getElementById('filter-new');
  var filterDiscussed = document.getElementById('filter-discussed');
  var filterPopular = document.getElementById('filter-popular');

  var requestPhotoData = [];
  var filteredPhoto = [];

  var dataLoadSuccessHandler = function (data) {
    requestPhotoData = data;
    window.picture.generateUserPhoto(data);
    imgFilters.classList.remove('img-filters--inactive');
    userPictureClickHandler(data);
  };

  var dataLoadErrorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'width: 250px; margin: 0 auto; text-align: center; background-color: darkblue; z-index: 100; line-height: 30px; position: absolute; left: 0; right: 0; font-size: 30px;';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(dataLoadSuccessHandler, dataLoadErrorHandler);

  var startGenerationPhotoArray = function (photData, targtId) {
    if (filteredPhoto.length) {
      window.preview.generationUserPictureAndComments(filteredPhoto[targtId]);
    } else {
      window.preview.generationUserPictureAndComments(photData[targtId]);
    }
    openUserPhoto();
  };

  var userPictureClickHandler = function (photoData) {
    window.picture.picturesSection.addEventListener('click', function (evt) {
      var target = evt.target;
      if (target.className === 'picture__img') {
        var targetId = target.getAttribute('data-id');
        startGenerationPhotoArray(photoData, targetId);
      }
    });

    window.picture.picturesSection.addEventListener('keydown', function (evt) {
      var target = evt.target;
      if (evt.keyCode === window.constants.keyCode.ENTER && target.className === 'picture') {
        var targetId = target.querySelector('.picture__img').getAttribute('data-id');
        startGenerationPhotoArray(photoData, targetId);
      }
    });
  };

  var openUserPhoto = function () {
    bigPicture.classList.remove('hidden');
    window.preview.showMoreComments();
    document.addEventListener('keydown', onEscPressUserPhoto);
  };

  var closeUserPhoto = function () {
    bigPicture.classList.add('hidden');
    socialComments.innerHTML = '';
    document.removeEventListener('keydown', onEscPressUserPhoto);
    commentsLoader.removeEventListener('click', window.preview.showMoreComments);
    commentsLoader.classList.remove('hidden');
  };

  var onEscPressUserPhoto = function (evt) {
    if (evt.keyCode === window.constants.keyCode.ESC) {
      closeUserPhoto();
    }
  };

  bigPictureCancel.addEventListener('click', function () {
    closeUserPhoto();
  });

  bigPictureCancel.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.constants.keyCode.ENTER) {
      closeUserPhoto();
    }
  });

  var getTenRandomPhoto = function () {
    var requestPhotoDataCopy = requestPhotoData.slice();
    var tenRandomPhoto = requestPhotoDataCopy.sort(window.utils.shuffle).slice(0, 10);
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
    window.picture.generateUserPhoto(sortedPhotoByComments);
  };

  var removeClassActive = function (buttonId) {
    var buttonFilter = document.querySelectorAll('.img-filters__button');
    buttonFilter.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    buttonId.classList.add('img-filters__button--active');
  };

  var filterPopularDebounce = function () {
    window.picture.generateUserPhoto(requestPhotoData);
  };

  var filterNewDebounce = function () {
    window.picture.generateUserPhoto(getTenRandomPhoto());
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
