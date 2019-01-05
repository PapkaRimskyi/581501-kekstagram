'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var socialComment = document.querySelector('.social__comment');
  var socialCommentCount = document.querySelector('.social__comment-count');
  var commentsLoader = document.querySelector('.comments-loader');

  // socialCommentCount.classList.add('visually-hidden');
  // commentsLoader.classList.add('visually-hidden');

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
  var INDEX_START = 0;
  var INDEX_END = INDEX_START + COUNT_DEFAULT_COMMENTS;

  var test = function (commentsArray) {
    INDEX_START = INDEX_END;
    INDEX_END = COUNT_DEFAULT_COMMENTS + INDEX_START;
    if (INDEX_END > commentsArray.length) {
      INDEX_END = commentsArray.length;
    }
  };

  var runGenerationCommentsBigPhoto = function (commentsBigPhoto) {
    var commentsArray = commentsBigPhoto.comments;
    var fiveComments = commentsArray.slice(INDEX_START, INDEX_END);
    console.log(fiveComments);
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < COUNT_DEFAULT_COMMENTS; i++) {
      var userComment = getCommentForBigPhoto(fiveComments[i]);
      fragment.appendChild(userComment);
    }
    test(commentsArray);
    console.log(INDEX_START, INDEX_END);
    return fragment;
  };

  window.generationUserPictureAndComments = function (photoDataId) {
    runGenerationBigPhoto(photoDataId);
    socialComments.innerHTML = '';
    socialComments.appendChild(runGenerationCommentsBigPhoto(photoDataId));
    commentsLoader.addEventListener('click', function () {
      socialComments.appendChild(runGenerationCommentsBigPhoto(photoDataId));
    });
  };
})();

// window.generationUserPictureAndComments = function (photoDataId) {
//   runGenerationBigPhoto(photoDataId);
//   socialComments.innerHTML = '';
//   socialComments.appendChild(runGenerationCommentsBigPhoto(photoDataId));
//   commentsLoader.addEventListener('click', function () {
//     socialComments.appendChild(runGenerationCommentsBigPhoto(photoDataId));
//   });
// };
//
// var runGenerationCommentsBigPhoto = function (commentsBigPhoto) {
//   var commentsArray = commentsBigPhoto.comments;
//   var fragment = document.createDocumentFragment();
//   for (var i = 0; i < commentsArray.length; i++) {
//     var userComment = getCommentForBigPhoto(commentsArray[i]);
//     fragment.appendChild(userComment);
//   }
//   return fragment;
// };

// socialCommentCount.textContent = commentsArray.length + ' из ' + commentsArray.length + ' комментариев';
