'use strict';

(function () {
  var commentDataArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var nameDataArray = ['Александр', 'Петр', 'Василиса', 'Диана', 'Владимир', 'Константин'];

  window.getPhotosData = function () {
    var dataArray = [];
    for (var i = 1; i <= 25; i++) {
      var comments = getCommentsData();
      var dataObj = {};
      dataObj.url = 'photos/' + i + '.jpg';

      var likes = window.randomNumber(15, 200);
      dataObj.likes = likes;
      dataObj.comments = comments;
      dataArray.push(dataObj);
    }
    return dataArray;
  };

  var getCommentsData = function () {
    var commentsArray = [];
    var randomMessageCount = window.randomNumber(1, 2);
    for (var i = 0; i < randomMessageCount; i++) {
      var commentObj = {};
      var randomMessage = window.randomNumber(0, commentDataArray.length - 1);
      commentObj.message = commentDataArray[randomMessage];

      var nameIndex = window.randomNumber(0, nameDataArray.length - 1);
      commentObj.name = nameDataArray[nameIndex];

      var avatarIndex = window.randomNumber(1, 6);
      commentObj.avatar = 'img/avatar-' + avatarIndex + '.svg';
      commentsArray.push(commentObj);
    }
    return commentsArray;
  };
})();
