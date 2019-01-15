'use strict';

(function () {
  var COUNT_DEFAULT_COMMENTS = 5;

  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var socialComment = document.querySelector('.social__comment');
  var socialCommentCount = document.querySelector('.social__comment-count');
  var commentsLoader = document.querySelector('.comments-loader');

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

  var runGenerationCommentsBigPhoto = function (comments) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < comments.length; i++) {
      var userComment = getCommentForBigPhoto(comments[i]);
      fragment.appendChild(userComment);
    }
    return fragment;
  };

  var generationUserPictureAndComments = function (photoData) {
    var indexStart = 0;
    runGenerationBigPhoto(photoData);
    socialComments.innerHTML = '';

    window.preview.showMoreComments = function () {
      var indexEnd = indexStart + COUNT_DEFAULT_COMMENTS;
      if (indexEnd > photoData.comments.length) {
        indexEnd = photoData.comments.length;
        if (indexEnd === photoData.comments.length) {
          commentsLoader.classList.add('hidden');
        }
      }
      var commentsData = photoData.comments.slice(indexStart, indexEnd);
      socialComments.appendChild(runGenerationCommentsBigPhoto(commentsData));
      indexStart = indexEnd;
      socialCommentCount.firstChild.textContent = indexEnd + ' из ';
    };
    commentsLoader.addEventListener('click', window.preview.showMoreComments);
  };

  window.preview = {
    generationUserPictureAndComments: generationUserPictureAndComments
  };
})();
