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
var radioCollection = document.querySelectorAll('.effects__radio');

socialCommentCount.classList.add('visually-hidden');
commentsLoader.classList.add('visually-hidden');

// Массив с комментариями.
var commentDataArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

// Массив с именами.
var nameDataArray = ['Александр', 'Петр', 'Василиса', 'Диана', 'Владимир', 'Константин'];

// Массив с эффектами на фото.
var effectsClass = ['effects__preview--none', 'effects__preview--chrome', 'effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat'];

var randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Генерация массива данных о фото: лайки, комменты, путь к фото.
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

// Генерация массива объектов с данными о комментариях: количество комментариев под фото, аватар, имя написавшего, текст комментария.
// Потом эта функция запускается в функции getPhotosData. В итоге массив объектов(commentsArray) записывается в массив dataArray.
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

// Ячейка под фотографию пользователя. Клоинурется нужная разметка, так же пишется путь к фото, сколько лайков и сколько комментов.
var getUserPhotoSlot = function (photoData) {
  var userPhoto = pictureTemplate.cloneNode(true);
  userPhoto.querySelector('.picture__img').src = photoData.url;
  userPhoto.querySelector('.picture__likes').textContent = photoData.likes;
  userPhoto.querySelector('.picture__comments').textContent = photoData.comments.length;
  return userPhoto;
};

var runGenerationUsersPhoto = function (dataArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray.length; i++) {
    var userPhoto = getUserPhotoSlot(dataArray[i]);
    fragment.appendChild(userPhoto);
  }
  return fragment;
};

// Фотография в большом размере (открывается при клике на маленькую фотографию).
var runGenerationBigPhoto = function (photoData) {
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = photoData.url;
  bigPicture.querySelector('.social__caption').textContent = 'description';
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.comments-count').textContent = photoData.comments.length;
};

// Комментарии под фотографией.
var getCommentForBigPhoto = function (commentData) {
  var userComment = socialComment.cloneNode(true);
  userComment.querySelector('.social__picture').src = commentData.avatar;
  userComment.querySelector('.social__text').textContent = commentData.message;
  return userComment;
};

// Генерация комментариев под фото.
var runGenerationCommentsBigPhoto = function (commentsBigPhoto) {
  var commentsArray = commentsBigPhoto.comments;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < commentsBigPhoto.comments.length; i++) {
    var userComment = getCommentForBigPhoto(commentsArray[i]);
    fragment.appendChild(userComment);
  }
  return fragment;
};

// Запись результата работы функции getPhotosData в переменную dataArray;
var dataArray = getPhotosData();

// Добавление на страницу фото пользователей.
picturesSection.appendChild(runGenerationUsersPhoto(dataArray));

// Нахождение всех фото пользователей на странице. В итоге получается псевдомассив (NodeList).
var userPictureCollection = document.querySelectorAll('.picture__img');
// Переводим его в массив.
var userPictureCollectionArray = Array.prototype.slice.call(userPictureCollection);

// Добавляем обработчик событий на фото пользователей. Если по ним кликнут, то откроется большая версия фото, с комментариями пользователей.
var adduserPictureClickHandler = function (userPicture, photoData) {
  userPicture.addEventListener('click', function () {
    runGenerationBigPhoto(photoData);
    socialComments.appendChild(runGenerationCommentsBigPhoto(photoData));
    bigPicture.classList.remove('hidden');
    document.addEventListener('keydown', onEscPressUserPhoto);
  });
};

var userBigPhoto = function () {
  for (var i = 0; i < userPictureCollectionArray.length; i++) {
    adduserPictureClickHandler(userPictureCollectionArray[i], dataArray[i]);
  }
};

userBigPhoto();

// Константы для номера(keyCode) клавиши ESC и ENTER.
var ESC_KEYNUMBER = 27;
var ENTER_KEYNUMBER = 13;

// Закрытие фото пользователя. Добавление класса hidden для .big-picture. Удаление обработчика событий.
var closeUserPhoto = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onEscPressUserPhoto);
};

// Если фото открыто в полном размере и происходит нажатие на ESC, то срабатывает функция closeUserPhoto, что приводит к закрытию окна.
var onEscPressUserPhoto = function (evt) {
  if (evt.keyCode === ESC_KEYNUMBER) {
    closeUserPhoto();
  }
};

// Добавление обработчика на кнопку крестик в правом верхнем углу от фотографии. При клике выполняется функция closeUserPhoto.
bigPictureCancel.addEventListener('click', function () {
  closeUserPhoto();
});

// Добавление обработчика на кнопку крестик в правом верхнем углу от фотографии. Когда кнопка находится в фокусе и нажимается ENTER, то выполняется функция closeUserPhoto.
bigPictureCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYNUMBER) {
    closeUserPhoto();
  }
});

// Функция открытия настроек загруженной фотографии.
var openPhotoSettings = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onEscPressSettings);
};

// Функция закрытия настроек фотографии.
var closePhotoSettings = function () {
  imgUploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onEscPressSettings);
};

// Если нажимается кнопка ESC при открытом окне настроек фотографий, то выполняется функция closePhotoSettings.
var onEscPressSettings = function (evt) {
  if (evt.keyCode === ESC_KEYNUMBER) {
    closePhotoSettings();
  }
};

// Добавляется обработчик событий на скрытый input. Если меняется значение поля выбора файла, то выполняется функция openPhotoSettings.
uploadFile.addEventListener('change', function () {
  openPhotoSettings();
});

// Добавляется обработчик событий на крестик в правом верхнем углу настроек фото. Если происходит клик, то выполняется функция closePhotoSettingsю
uploadCancel.addEventListener('click', function () {
  closePhotoSettings();
  imgUploadPreview.className = 'img-upload__preview';
});

// Константы для значений в input (максимальное и минимальное значение) и шаг, на который будет увеличиваться значение, если нажимать кнопки + и -
var MAX_INPUT_VALUE = 100;
var MIN_INPUT_VALUE = 25;
var VALUE_STEP = 25;

// Добавляется обработчик событий на кнопку + . Если происходит нажатие, то в переменную scaleControlValue.value записывается значение функции findValue.
// Потом запускается функция addTransformScale, которая добавляет CSS стиль transform: scale к фотографии.
scaleControlBigger.addEventListener('click', function () {
  scaleControlValue.value = findValue('plus') + '%';
  addTransformScale();
});

scaleControlSmaller.addEventListener('click', function () {
  scaleControlValue.value = findValue('minus') + '%';
  addTransformScale();
});

// Нахождения значения для поля scaleControlValue.value. Если функция передается с аргументом 'plus', то происходит сложение значения переменной stepValue и inputValue.
// Если функция передается с аргументом 'minus', то происходит вычитание значения переменной stepValue и inputValue.
var findValue = function (sumbol) {
  var inputValue = parseInt(scaleControlValue.value, 10);
  var stepValue = VALUE_STEP;
  if (MAX_INPUT_VALUE !== inputValue) {
    if (sumbol === 'plus') {
      inputValue += stepValue;
    }
  }
  if (MIN_INPUT_VALUE !== inputValue) {
    if (sumbol === 'minus') {
      inputValue -= stepValue;
    }
  }
  return inputValue;
};

// Добавление CSS свойства transform: scale картинке пользователя. Зависит от настоящего значения scaleControlValue.value.
// Если значение scaleControlValue.value = 50%, то transform: scale(0.5);
var addTransformScale = function () {
  var scaleValue = parseInt(scaleControlValue.value, 10) / 100;
  imgUploadImage.style.transform = 'scale(' + scaleValue + ')';
};

// Добавление обработчика событий на эффекты в окне настройки фотографии. Если происходит клик на каком то эффекте, то все классы эффектов скидываются и применяется нужный.
var addEffectsCollectionClickHandler = function (radioButton, effect) {
  radioButton.addEventListener('click', function () {
    imgUploadPreview.className = 'img-upload__preview';
    imgUploadPreview.classList.add('' + effect);
  });
};

// Показ эффекта.
var showEffect = function () {
  for (var i = 0; i < radioCollection.length; i++) {
    addEffectsCollectionClickHandler(radioCollection[i], effectsClass[i]);
  }
};

showEffect();
