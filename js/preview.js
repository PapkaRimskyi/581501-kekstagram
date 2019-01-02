'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var socialComment = document.querySelector('.social__comment');
  var socialCommentCount = document.querySelector('.social__comment-count');
  var commentsLoader = document.querySelector('.comments-loader');

  socialCommentCount.classList.add('visually-hidden');
  commentsLoader.classList.add('visually-hidden');

  var runGenerationBigPhoto = function (photoData) {
    bigPicture.querySelector('.big-picture__img').querySelector('img').src = photoData.url;
    bigPicture.querySelector('.social__caption').textContent = photoData.description;
    bigPicture.querySelector('.likes-count').textContent = photoData.likes;
    bigPicture.querySelector('.comments-count').textContent = photoData.comments.length;
  };

  var getCommentForBigPhoto = function (commentData) {
    var userComment = socialComment.cloneNode(true);
    userComment.querySelector('.social__picture').src = commentData.avatar;
    userComment.querySelector('.social__text').textContent = commentData.message;
    return userComment;
  };

  var runGenerationCommentsBigPhoto = function (commentsBigPhoto) {
    var commentsArray = commentsBigPhoto.comments;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < commentsArray.length; i++) {
      var userComment = getCommentForBigPhoto(commentsArray[i]);
      fragment.appendChild(userComment);
    }
    return fragment;
  };

  window.generationUserPictureAndComments = function (photoDataId) {
    runGenerationBigPhoto(photoDataId);
    socialComments.innerHTML = '';
    socialComments.appendChild(runGenerationCommentsBigPhoto(photoDataId));
  };
})();
