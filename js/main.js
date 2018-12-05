'use strict';
var pictureTemplate = document.querySelector('#picture').content;
var picturesSection = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var socialComments = document.querySelector('.social__comments');
var socialComment = document.querySelector('.social__comment');
var socialCommentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');

socialCommentCount.classList.add('visually-hidden');
commentsLoader.classList.add('visually-hidden');
bigPicture.classList.remove('hidden');

var commentDataArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var nameDataArray = ['Александр', 'Петр', 'Василиса', 'Диана', 'Владимир', 'Константин'];

var randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getPhotosData = function () {
  var dataArray = [];
  for (var i = 1; i <= 25; i++) {
    var comments = getCommentsData();
    var dataObj = {};
    dataObj.url = 'photos/' + i + '.jpg';

    var likes = randomNumber(15, 200);
    dataObj.likes = likes;
    dataObj.comments = comments;
    dataArray.push(dataObj);
  }
  return dataArray;
};

var getCommentsData = function () {
  var commentsArray = [];
  var randomMessageCount = randomNumber(1, 2);
  for (var i = 0; i < randomMessageCount; i++) {
    var commentObj = {};
    var randomMessage = randomNumber(0, commentDataArray.length - 1);
    commentObj.message = commentDataArray[randomMessage];

    var nameIndex = randomNumber(0, nameDataArray.length - 1);
    commentObj.name = nameDataArray[nameIndex];

    var avatarIndex = randomNumber(1, 6);
    commentObj.avatar = 'img/avatar-' + avatarIndex + '.svg';
    commentsArray.push(commentObj);
  }
  return commentsArray;
};

var getUserPhotoSlots = function (dataArray) {
  var userPhoto = pictureTemplate.cloneNode(true);
  userPhoto.querySelector('.picture__img').src = dataArray.url;
  userPhoto.querySelector('.picture__likes').textContent = dataArray.likes;
  userPhoto.querySelector('.picture__comments').textContent = dataArray.comments.length;
  return userPhoto;
};

var runGenerationUsersPhoto = function (dataArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray.length; i++) {
    var userPhoto = getUserPhotoSlots(dataArray[i]);
    fragment.appendChild(userPhoto);
  }
  return fragment;
};

var runGenerationBigPhoto = function (objNumberFromDataArray) {
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = objNumberFromDataArray.url;
  bigPicture.querySelector('.social__caption').textContent = 'description';
  bigPicture.querySelector('.likes-count').textContent = objNumberFromDataArray.likes;
  bigPicture.querySelector('.comments-count').textContent = objNumberFromDataArray.comments.length;
};

var getCommentUnderBigPhoto = function (objNumberFromCommentsArray) {
  var userComment = socialComment.cloneNode(true);
  userComment.querySelector('.social__picture').src = objNumberFromCommentsArray.avatar;
  userComment.querySelector('.social__text').textContent = objNumberFromCommentsArray.message;
  return userComment;
};

var runGenerationCommentBigPhoto = function () {
  var commentsArray = dataArray[0].comments;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray[0].comments.length; i++) {
    var userComment = getCommentUnderBigPhoto(commentsArray[i]);
    fragment.appendChild(userComment);
  }
  return fragment;
};

var dataArray = getPhotosData();
picturesSection.appendChild(runGenerationUsersPhoto(dataArray));
runGenerationBigPhoto(dataArray[0]);
socialComments.appendChild(runGenerationCommentBigPhoto());
