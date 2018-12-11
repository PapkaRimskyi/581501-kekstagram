'use strict';

var pictureTemplate = document.querySelector('#picture').content;
var picturesSection = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
var socialComments = document.querySelector('.social__comments');
var socialComment = document.querySelector('.social__comment');
var socialCommentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');
var uploadFile = document.getElementById('upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');
var imgUploadPreview = document.querySelector('.img-upload__preview');
var imgUploadImage = imgUploadPreview.querySelector('.img-upload__image');
var imgUploadForm = document.querySelector('.img-upload__form');
var radioCollection = document.querySelectorAll('.effects__radio');

socialCommentCount.classList.add('visually-hidden');
commentsLoader.classList.add('visually-hidden');

// Массив с комментариями.
var commentDataArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
//

// Массив с именами.
var nameDataArray = ['Александр', 'Петр', 'Василиса', 'Диана', 'Владимир', 'Константин'];
//

// Переменная используется для создания модификатора к фото (во время прокликивания по эффектам в меню настроек фотографии). Происходи конкатенация этой переменной и массива, из которого достается нужный модификатор.
var effectsClass = 'effects__preview--';
//

// Массив с эффектами на фото.
var effectsModifier = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
//

// Функция рандома чисел
var randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
//

// Генерация массива данных  фото, а так же массива объектов с инфой о комментах.
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
//

// Ячейка под фотографию пользователя.
var getUserPhotoSlot = function (photoData, idNumber) {
  var userPhoto = pictureTemplate.cloneNode(true);
  userPhoto.querySelector('.picture__img').src = photoData.url;
  userPhoto.querySelector('.picture__img').setAttribute('data-id', idNumber);
  userPhoto.querySelector('.picture__likes').textContent = photoData.likes;
  userPhoto.querySelector('.picture__comments').textContent = photoData.comments.length;
  return userPhoto;
};

var runGenerationUsersPhoto = function (dataArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray.length; i++) {
    var userPhoto = getUserPhotoSlot(dataArray[i], i);
    fragment.appendChild(userPhoto);
  }
  return fragment;
};
//

// Функции по генерации большой фотографии и комментов к ней.
var runGenerationBigPhoto = function (photoData) {
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = photoData.url;
  bigPicture.querySelector('.social__caption').textContent = 'description';
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
//

// Получаем массив с данными.
var dataArray = getPhotosData();
//

// Добавление на страницу фото пользователей.
picturesSection.appendChild(runGenerationUsersPhoto(dataArray));
//

// Отслеживание кликов через родительский элемент (делегирование)
var addDelegationHandler = function (photoData) {
  picturesSection.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.className === 'picture__img') {
      var targetId = target.getAttribute('data-id');
      generationUserPictureAndComments(photoData[targetId]);
      showBigPicture();
    }
  });
};

var generationUserPictureAndComments = function (photoDataID) {
  runGenerationBigPhoto(photoDataID);
  socialComments.innerHTML = '';
  socialComments.appendChild(runGenerationCommentsBigPhoto(photoDataID));
};

var showBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onEscPressUserPhoto);
};

addDelegationHandler(dataArray);
//

// Константы для номера(keyCode) клавиши ESC и ENTER.
var ESC_KEYNUMBER = 27;
var ENTER_KEYNUMBER = 13;
//

// Переменная для сброса классов у фото в меню настроек.
var imgUploadPreviewString = 'img-upload__preview';
//

// Закрытие фото пользователя.
var closeUserPhoto = function () {
  bigPicture.classList.add('hidden');
  socialComments.innerHTML = '';
  document.removeEventListener('keydown', onEscPressUserPhoto);
};

var onEscPressUserPhoto = function (evt) {
  if (evt.keyCode === ESC_KEYNUMBER) {
    closeUserPhoto();
  }
};

bigPictureCancel.addEventListener('click', function () {
  closeUserPhoto();
});

bigPictureCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYNUMBER) {
    closeUserPhoto();
  }
});
//

// Функция открытия настроек загруженной фотографии.
var openPhotoSettings = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onEscPressSettings);
};

uploadFile.addEventListener('change', function () {
  openPhotoSettings();
});
//

// Функция закрытия настроек фотографии.
var closePhotoSettings = function () {
  imgUploadOverlay.classList.add('hidden');
  resetPhotoSettgins();
};

var resetPhotoSettgins = function () {
  uploadFile.value = '';
  addTransformScale(scaleControlValue.value);
  imgUploadImage.style.removeProperty('transform');
  imgUploadPreview.className = imgUploadPreviewString;
  document.removeEventListener('keydown', onEscPressSettings);
  imgUploadForm.reset();
};

var onEscPressSettings = function (evt) {
  if (evt.keyCode === ESC_KEYNUMBER) {
    closePhotoSettings();
  }
};

uploadCancel.addEventListener('click', function () {
  closePhotoSettings();
});
//

// Константы для значений в input (максимальное и минимальное значение) и шаг, на который будет увеличиваться значение, если нажимать кнопки + и -
var MAX_INPUT_VALUE = 100;
var MIN_INPUT_VALUE = 25;
var VALUE_STEP = 25;
//

// Добавляется обработчик событий на кнопку +  и -.
scaleControlBigger.addEventListener('click', function () {
  addTransformScale(findScaleValue('plus'));
  scaleControlValue.value = findScaleValue('plus') + '%';
});

scaleControlSmaller.addEventListener('click', function () {
  addTransformScale(findScaleValue('minus'));
  scaleControlValue.value = findScaleValue('minus') + '%';
});

var findScaleValue = function (symbol) {
  var inputScaleValue = parseInt(scaleControlValue.value, 10);
  if (inputScaleValue !== MAX_INPUT_VALUE && symbol === 'plus') {
    inputScaleValue += VALUE_STEP;
  }
  if (inputScaleValue !== MIN_INPUT_VALUE && symbol === 'minus') {
    inputScaleValue -= VALUE_STEP;
  }
  return inputScaleValue;
};
//

// Добавление CSS свойства transform: scale картинке пользователя. Зависит от настоящего значения scaleControlValue.value.
// Если значение scaleControlValue.value = 50%, то transform: scale(0.5);
var addTransformScale = function (valueScale) {
  var scaleValue = valueScale / 100;
  imgUploadImage.style.transform = 'scale(' + scaleValue + ')';
};
//

// Добавление обработчика событий на эффекты в окне настройки фотографии.
var addEffectsCollectionClickHandler = function (radioButton, effect) {
  radioButton.addEventListener('click', function () {
    imgUploadPreview.className = imgUploadPreviewString;
    imgUploadPreview.classList.add(effectsClass + effect);
  });
};

var showEffect = function () {
  for (var i = 0; i < radioCollection.length; i++) {
    addEffectsCollectionClickHandler(radioCollection[i], effectsModifier[i]);
  }
};

showEffect();
//
