'use strict';
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

var dataMassive = getPhotoData();
console.log(dataMassive);
