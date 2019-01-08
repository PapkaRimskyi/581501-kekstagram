'use strict';

(function () {
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

  var COUNT_DEFAULT_COMMENTS = 5;

  var runGenerationCommentsBigPhoto = function (comments) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < comments.length; i++) {
      var userComment = getCommentForBigPhoto(comments[i]);
      fragment.appendChild(userComment);
    }
    return fragment;
  };

  window.generationUserPictureAndComments = function (photoData) {
    runGenerationBigPhoto(photoData);
    socialComments.innerHTML = '';

    var INDEX_START = 0;

    window.moreComments = function () {
      var INDEX_END = INDEX_START + COUNT_DEFAULT_COMMENTS;
      if (INDEX_END > photoData.comments.length) {
        INDEX_END = photoData.comments.length;
        if (INDEX_END === photoData.comments.length) {
          commentsLoader.classList.add('hidden');
        }
      }
      var commentsData = photoData.comments.slice(INDEX_START, INDEX_END);
      socialComments.appendChild(runGenerationCommentsBigPhoto(commentsData));
      INDEX_START = INDEX_END;
      socialCommentCount.firstChild.textContent = INDEX_END + ' из ';
    };
    commentsLoader.addEventListener('click', window.moreComments);
  };
})();
