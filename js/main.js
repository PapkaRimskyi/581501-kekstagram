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

var commentData = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var nameData = ['Александр', 'Петр', 'Василиса', 'Диана', 'Владимир', 'Константин'];

var randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getPhotoData = function () {
  var dataMassive = [];
  for (var i = 1; i <= 25; i++) {
    var comments = getCommentData();
    var dataObj = {};
    dataObj.url = 'photos/' + i + '.jpg';

    var likes = randomNumber(15, 200);
    dataObj.likes = likes;
    dataObj.comments = comments;
    dataMassive.push(dataObj);
  }
  return dataMassive;
};

var getCommentData = function () {
  var comments = [];
  var randomMessageCount = randomNumber(1, 2);
  for (var i = 0; i < randomMessageCount; i++) {
    var commentObj = {};
    var randomMessage = randomNumber(0, commentData.length - 1);
    commentObj.message = commentData[randomMessage];

    var nameIndex = randomNumber(0, nameData.length - 1);
    commentObj.name = nameData[nameIndex];

    var avatarIndex = randomNumber(1, 6);
    commentObj.avatar = 'img/avatar-' + avatarIndex + '.svg';
    comments.push(commentObj);
  }
  return comments;
};

var getRandomAndBigPhoto = function (dataMassive, comments) {
  if (comments) {
    var userComment = socialComment.cloneNode(true);
    userComment.querySelector('.social__picture').src = comments.avatar;
    userComment.querySelector('.social__text').textContent = comments.message;
    return userComment;
  } else {
    var userPhoto = pictureTemplate.cloneNode(true);
    userPhoto.querySelector('.picture__img').src = dataMassive.url;
    userPhoto.querySelector('.picture__likes').textContent = dataMassive.likes;
    userPhoto.querySelector('.picture__comments').textContent = dataMassive.comments.length;
    return userPhoto;
  }
};

var generationPhoto = function (dataMassive) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataMassive.length; i++) {
    var userPhoto = getRandomAndBigPhoto(dataMassive[i]);
    fragment.appendChild(userPhoto);
  }
  return fragment;
};

var generationBigPhoto = function (dataMassive) {
  var bigPhoto = bigPicture;
  bigPhoto.querySelector('.big-picture__img').querySelector('img').src = dataMassive[0].url;
  bigPhoto.querySelector('.social__caption').textContent = 'description';
  bigPhoto.querySelector('.likes-count').textContent = dataMassive[0].likes;
  bigPhoto.querySelector('.comments-count').textContent = dataMassive[0].comments.length;
};

var generationCommentBigPhoto = function (dataMassive) {
  var comments = dataMassive[0].comments;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataMassive[0].comments.length; i++) {
    var userComment = getRandomAndBigPhoto(dataMassive[0], comments[i]);
    fragment.appendChild(userComment);
  }
  return fragment;
};

var dataMassive = getPhotoData();
picturesSection.appendChild(generationPhoto(dataMassive));
generationBigPhoto(dataMassive);
socialComments.appendChild(generationCommentBigPhoto(dataMassive));
