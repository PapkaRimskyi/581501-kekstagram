'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content;

  var getUserPhotoSlot = function (photoData, idNumber) {
    var userPhoto = pictureTemplate.cloneNode(true);
    userPhoto.querySelector('.picture__img').src = photoData.url;
    userPhoto.querySelector('.picture__img').setAttribute('data-id', idNumber);
    userPhoto.querySelector('.picture__likes').textContent = photoData.likes;
    userPhoto.querySelector('.picture__comments').textContent = photoData.comments.length;
    return userPhoto;
  };

  var picturesSection = document.querySelector('.pictures');

  window.runGenerationUsersPhoto = function (dataArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < dataArray.length; i++) {
      var userPhoto = getUserPhotoSlot(dataArray[i], i);
      fragment.appendChild(userPhoto);
    }
    picturesSection.appendChild(fragment);
    window.addDelegationHandler(dataArray);
  };
})();
