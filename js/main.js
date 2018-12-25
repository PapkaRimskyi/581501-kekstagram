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
var textHashtags = document.querySelector('.text__hashtags');
var textDescription = document.querySelector('.text__description');
var imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
var effectLevelLine = document.querySelector('.effect-level__line');
var effectLevelPin = effectLevelLine.querySelector('.effect-level__pin');
var effectLevelDepth = effectLevelLine.querySelector('.effect-level__depth');
var effectLevelValue = document.querySelector('.effect-level__value');

socialCommentCount.classList.add('visually-hidden');
commentsLoader.classList.add('visually-hidden');


var commentDataArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var nameDataArray = ['Александр', 'Петр', 'Василиса', 'Диана', 'Владимир', 'Константин'];

var effectsClass = 'effects__preview';

var effectsModifier = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];

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

var dataArray = getPhotosData();

picturesSection.appendChild(runGenerationUsersPhoto(dataArray));

var addDelegationHandler = function (photoData) {
  picturesSection.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.className === 'picture__img') {
      var targetId = target.getAttribute('data-id');
      generationUserPictureAndComments(photoData[targetId]);
      openUserPhoto();
    }
  });
};

var generationUserPictureAndComments = function (photoDataId) {
  runGenerationBigPhoto(photoDataId);
  socialComments.innerHTML = '';
  socialComments.appendChild(runGenerationCommentsBigPhoto(photoDataId));
};

var openUserPhoto = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onEscPressUserPhoto);
};

addDelegationHandler(dataArray);

var ESC_KEYNUMBER = 27;
var ENTER_KEYNUMBER = 13;

var imgUploadPreviewString = 'img-upload__preview';

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

var openPhotoSettings = function () {
  imgUploadOverlay.classList.remove('hidden');
  imgUploadPreview.classList.add(effectsClass + '--' + effectsModifier[0]);
  imgUploadEffectLevel.classList.add('hidden');
  document.addEventListener('keydown', onEscPressSettings);
};

uploadFile.addEventListener('change', function () {
  openPhotoSettings();
});

var closePhotoSettings = function () {
  imgUploadOverlay.classList.add('hidden');
  resetPhotoSettgins();
  document.removeEventListener('keydown', onEscPressSettings);
};

var resetPhotoSettgins = function () {
  uploadFile.value = '';
  imgUploadImage.style.removeProperty('transform');
  imgUploadPreview.className = imgUploadPreviewString;
  imgUploadPreview.style = '';
  imgUploadForm.reset();
};

var onEscPressSettings = function (evt) {
  var activeElement = document.activeElement;
  if (evt.keyCode === ESC_KEYNUMBER && activeElement !== textHashtags && activeElement !== textDescription) {
    closePhotoSettings();
  }
};

uploadCancel.addEventListener('click', function () {
  closePhotoSettings();
});

var MAX_INPUT_VALUE = 100;
var MIN_INPUT_VALUE = 25;
var VALUE_STEP = 25;

scaleControlBigger.addEventListener('click', function () {
  var foundScaleValue = findScaleValue('plus');
  addTransformScale(foundScaleValue);
  scaleControlValue.value = foundScaleValue + '%';
});

scaleControlSmaller.addEventListener('click', function () {
  var foundScaleValue = findScaleValue('minus');
  addTransformScale(foundScaleValue);
  scaleControlValue.value = foundScaleValue + '%';
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

var addTransformScale = function (valueScale) {
  var scaleValue = valueScale / 100;
  imgUploadImage.style.transform = 'scale(' + scaleValue + ')';
};

var classEffect;
var documentClassEffectForStyleFilter;
var MAX_PX_LEVEL_LINE = 453;

var addEffectsCollectionClickHandler = function (radioButton, effect) {
  radioButton.addEventListener('click', function () {
    imgUploadPreview.className = imgUploadPreviewString;
    imgUploadPreview.classList.add(effectsClass + '--' + effect);
    removeOptionsToDefault(effect);
    if (imgUploadPreview.classList.contains('effects__preview--phobos')) {
      var classPhobosEffect = document.querySelector('.effects__preview--phobos');
      classPhobosEffect.style.filter = 'blur(3px)';
    }
  });
};

var removeOptionsToDefault = function (effect) {
  classEffect = '.' + effectsClass + '--' + effect;
  documentClassEffectForStyleFilter = document.querySelector(classEffect);
  documentClassEffectForStyleFilter.style.filter = '';
  if (imgUploadPreview.classList.contains('effects__preview--none')) {
    imgUploadEffectLevel.classList.add('hidden');
  } else {
    effectLevelPin.style.left = MAX_PX_LEVEL_LINE + 'px';
    effectLevelDepth.style.width = MAX_INPUT_VALUE + '%';
    effectLevelValue.value = MAX_INPUT_VALUE;
    imgUploadEffectLevel.classList.remove('hidden');
  }
};

var showEffect = function () {
  for (var i = 0; i < radioCollection.length; i++) {
    addEffectsCollectionClickHandler(radioCollection[i], effectsModifier[i]);
  }
};

showEffect();

textHashtags.addEventListener('change', function () {
  hashTagsChecks();
});

var getHashTagsList = function () {
  var inputValue = textHashtags.value.toUpperCase();
  var hashTags = inputValue.split(' ');
  return hashTags;
};

var hasRepeatedWords = function (words) {
  for (var i = 0; i < words.length; i++) {
    for (var j = i + 1; j < words.length; j++) {
      if (words[i] === words[j]) {
        return true;
      }
    }
  }
  return false;
};

var MAX_HASHTAG_SYMBOLS = 20;
var COUNT_OF_MAX_HASHTAGS = 5;

var hashTagsChecks = function () {
  var hashTagsArray = getHashTagsList();
  for (var i = 0; i < hashTagsArray.length; i++) {
    var indexSymbol = hashTagsArray[i].indexOf('#');
    if (indexSymbol !== 0) {
      textHashtags.setCustomValidity('Хэштег должен начинаться с символа #');
      break;
    } else if (hashTagsArray[i].lastIndexOf('#') !== 0) {
      textHashtags.setCustomValidity('Хэштеги не разделены пробелами или присутствует два символа # подряд');
      break;
    } else if (hashTagsArray[i].length === 1) {
      textHashtags.setCustomValidity('Хэштег не может состоять только из одной #');
      break;
    } else if (hashTagsArray[i].length > MAX_HASHTAG_SYMBOLS) {
      textHashtags.setCustomValidity('Хэштег должен содержать не более 20 символов (включая #)');
      break;
    } else if (hashTagsArray.length > COUNT_OF_MAX_HASHTAGS) {
      textHashtags.setCustomValidity('Количество ХэшТегов не должно превышать 5');
      break;
    } else if (hasRepeatedWords(hashTagsArray)) {
      textHashtags.setCustomValidity('Нельзя писать повторные хэштеги');
      break;
    } else {
      textHashtags.setCustomValidity('');
    }
  }
};

(function () {
  var defaultCoords;
  var defaultWidthDepth;
  var MIN_PX_LEVEL_LINE = 0;
  var PIX_IN_ONE_STEP = MAX_PX_LEVEL_LINE / 100;

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    defaultCoords = {x: evt.clientX};
    defaultWidthDepth = effectLevelDepth.offsetWidth;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  });

  var mouseMove = function (evtMove) {
    evtMove.preventDefault();
    findPinLocationAndEffectLine(evtMove);
  };

  var mouseUp = function (evtUp) {
    evtUp.preventDefault();
    findPinLocationAndEffectLine(evtUp);
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
  };

  var findPinLocationAndEffectLine = function (evtMove) {
    var shift = {x: defaultCoords.x - evtMove.clientX};
    defaultCoords = {x: evtMove.clientX};
    var effectLevelPinLeft = (effectLevelPin.offsetLeft - shift.x);
    if (MIN_PX_LEVEL_LINE <= effectLevelPinLeft && effectLevelPinLeft <= MAX_PX_LEVEL_LINE) {
      effectLevelPin.style.left = effectLevelPinLeft + 'px';
      defaultWidthDepth = effectLevelPinLeft;
      effectLevelDepth.style.width = ((defaultWidthDepth * 100) / MAX_PX_LEVEL_LINE) + '%';
      effectLevelValue.value = Math.round(effectLevelPinLeft / PIX_IN_ONE_STEP);
      checkImgUploadPreviewContains();
    }
  };

  var effectValueArray = [
    {name: 'effects__preview--chrome', valueMin: 0, valueMax: 1},
    {name: 'effects__preview--sepia', valueMin: 0, valueMax: 1},
    {name: 'effects__preview--marvin', valueMin: 0, valueMax: 1},
    {name: 'effects__preview--phobos', valueMin: 0, valueMax: 3},
    {name: 'effects__preview--heat', valueMin: 1, valueMax: 3},
  ];

  var getFilterValue = function (actualFilterValue, minPinValue, maxPinValue) {
    var filterValue;
    actualFilterValue = actualFilterValue / MAX_INPUT_VALUE;
    if (minPinValue === 0) {
      filterValue = (actualFilterValue * maxPinValue);
    } else {
      filterValue = (maxPinValue - minPinValue) * actualFilterValue + minPinValue;
    }
    return filterValue;
  };

  var checkImgUploadPreviewContains = function () {
    if (imgUploadPreview.classList.contains(effectValueArray[0].name)) {
      documentClassEffectForStyleFilter.style.filter = 'grayscale(' + getFilterValue(effectLevelValue.value, effectValueArray[0].valueMin, effectValueArray[0].valueMax) + ')';
    } else if (imgUploadPreview.classList.contains(effectValueArray[1].name)) {
      documentClassEffectForStyleFilter.style.filter = 'sepia(' + getFilterValue(effectLevelValue.value, effectValueArray[1].valueMin, effectValueArray[1].valueMax) + ')';
    } else if (imgUploadPreview.classList.contains(effectValueArray[2].name)) {
      documentClassEffectForStyleFilter.style.filter = 'invert(' + (getFilterValue(effectLevelValue.value, effectValueArray[2].valueMin, effectValueArray[2].valueMax) * MAX_INPUT_VALUE) + '%)';
    } else if (imgUploadPreview.classList.contains(effectValueArray[3].name)) {
      documentClassEffectForStyleFilter.style.filter = 'blur(' + getFilterValue(effectLevelValue.value, effectValueArray[3].valueMin, effectValueArray[3].valueMax) + 'px)';
    } else if (imgUploadPreview.classList.contains(effectValueArray[4].name)) {
      documentClassEffectForStyleFilter.style.filter = 'brightness(' + getFilterValue(effectLevelValue.value, effectValueArray[4].valueMin, effectValueArray[4].valueMax) + ')';
    }
  };
})();
