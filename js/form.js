'use strict';

(function () {
  var MAX_INPUT_VALUE = 100;
  var MIN_INPUT_VALUE = 25;
  var VALUE_STEP = 25;
  var MIN_PX_LEVEL_LINE = 0;
  var MAX_PX_LEVEL_LINE = 453;
  var PIX_IN_ONE_STEP = MAX_PX_LEVEL_LINE / 100;
  var MAX_HASHTAG_SYMBOLS = 20;
  var COUNT_OF_MAX_HASHTAGS = 5;
  var DEFAULT_SCALE = 100;

  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var imgUploadEffectLevel = document.querySelector('.img-upload__effect-level');
  var uploadFile = document.querySelector('.img-upload__input');
  var imgUploadImage = imgUploadPreview.querySelector('.img-upload__image');
  var imgUploadForm = document.querySelector('.img-upload__form');
  var textHashtags = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');
  var uploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelPin = effectLevelLine.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevelLine.querySelector('.effect-level__depth');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var radioCollection = document.querySelectorAll('.effects__radio');
  var imgUploadWrapper = document.querySelector('.img-upload__wrapper');
  var form = imgUploadWrapper.querySelector('.img-upload__form');
  var main = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content;
  var successTemplate = document.querySelector('#success').content;

  var imgUploadPreviewString = 'img-upload__preview';
  var effectsModifier = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
  var effectClass = 'effects__preview';

  var effectsValue = [
    {name: 'effects__preview--chrome', effect: 'grayscale', unit: '', valueMin: 0, valueMax: 1},
    {name: 'effects__preview--sepia', effect: 'sepia', unit: '', valueMin: 0, valueMax: 1},
    {name: 'effects__preview--marvin', effect: 'invert', unit: '%', valueMin: 0, valueMax: 100},
    {name: 'effects__preview--phobos', effect: 'blur', unit: 'px', valueMin: 0, valueMax: 3},
    {name: 'effects__preview--heat', effect: 'brightness', unit: '', valueMin: 1, valueMax: 3},
  ];

  var defaultCoords;
  var defaultWidthDepth;

  var classEffect;
  var documentClassEffectForStyleFilter;

  var openPhotoSettings = function () {
    imgUploadOverlay.classList.remove('hidden');
    imgUploadPreview.classList.add(effectClass + '--' + effectsModifier[0]);
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
    if (evt.keyCode === window.keyNumber.escButton && activeElement !== textHashtags && activeElement !== textDescription) {
      closePhotoSettings();
    }
  };

  uploadCancel.addEventListener('click', function () {
    closePhotoSettings();
  });

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
    } else if (inputScaleValue !== MIN_INPUT_VALUE && symbol === 'minus') {
      inputScaleValue -= VALUE_STEP;
    }
    return inputScaleValue;
  };

  var addTransformScale = function (valueScale) {
    var scaleValue = valueScale / DEFAULT_SCALE;
    imgUploadImage.style.transform = 'scale(' + scaleValue + ')';
  };

  var addEffectsCollectionClickHandler = function (radioButton, effect) {
    radioButton.addEventListener('click', function () {
      imgUploadPreview.className = imgUploadPreviewString;
      imgUploadPreview.classList.add(effectClass + '--' + effect);
      removeOptionsToDefault(effect);
      if (imgUploadPreview.classList.contains('effects__preview--phobos')) {
        imgUploadPreview.style.filter = 'blur(3px)';
      }
    });
  };

  var removeOptionsToDefault = function (effect) {
    classEffect = '.' + effectClass + '--' + effect;
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

  textHashtags.addEventListener('input', function () {
    hashTagsChecks();
  });

  var getHashTagsList = function () {
    var inputValue = textHashtags.value.toUpperCase();
    var hashTags = inputValue.trim().split(' ');
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

  var changeInputBorder = function () {
    textHashtags.style.borderColor = 'red';
  };

  var hashTagsChecks = function () {
    var hashTagsArray = getHashTagsList();
    for (var i = 0; i < hashTagsArray.length; i++) {
      var indexSymbol = hashTagsArray[i].indexOf('#');
      if (textHashtags.value === '' || hashTagsArray[i] === '') {
        textHashtags.setCustomValidity('');
        textHashtags.style = '';
        break;
      } else if (indexSymbol !== 0) {
        textHashtags.setCustomValidity('Хэштег должен начинаться с символа #');
        changeInputBorder();
        break;
      } else if (hashTagsArray[i].lastIndexOf('#') !== 0) {
        textHashtags.setCustomValidity('Хэштеги не разделены пробелами или присутствует два символа # подряд');
        changeInputBorder();
        break;
      } else if (hashTagsArray[i].length === 1) {
        textHashtags.setCustomValidity('Хэштег не может состоять только из одной #');
        changeInputBorder();
        break;
      } else if (hashTagsArray[i].length > MAX_HASHTAG_SYMBOLS) {
        textHashtags.setCustomValidity('Хэштег должен содержать не более 20 символов (включая #)');
        changeInputBorder();
        break;
      } else if (hashTagsArray.length > COUNT_OF_MAX_HASHTAGS) {
        textHashtags.setCustomValidity('Количество ХэшТегов не должно превышать 5');
        changeInputBorder();
        break;
      } else if (hasRepeatedWords(hashTagsArray)) {
        textHashtags.setCustomValidity('Нельзя писать повторные хэштеги');
        changeInputBorder();
        break;
      } else {
        textHashtags.setCustomValidity('');
        textHashtags.style = '';
      }
    }
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    defaultCoords = {x: evt.clientX};
    defaultWidthDepth = effectLevelDepth.offsetWidth;

    document.addEventListener('mousemove', effectLevelPinMoveHandler);
    document.addEventListener('mouseup', effectLevelPinUpHandler);
  });

  var effectLevelPinMoveHandler = function (evtMove) {
    evtMove.preventDefault();
    findPinLocationAndEffectLine(evtMove);
  };

  var effectLevelPinUpHandler = function (evtUp) {
    evtUp.preventDefault();
    findPinLocationAndEffectLine(evtUp);
    document.removeEventListener('mousemove', effectLevelPinMoveHandler);
    document.removeEventListener('mouseup', effectLevelPinUpHandler);
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

  var getFilterValue = function (actualFilterValue, minPinValue, maxPinValue) {
    actualFilterValue = actualFilterValue / MAX_INPUT_VALUE;
    if (minPinValue === 0) {
      return actualFilterValue * maxPinValue;
    } else {
      return (maxPinValue - minPinValue) * actualFilterValue + minPinValue;
    }
  };

  var checkImgUploadPreviewContains = function () {
    for (var i = 0; i < effectsValue.length; i++) {
      if (imgUploadPreview.classList.contains(effectsValue[i].name)) {
        var actualValue = getFilterValue(effectLevelValue.value, effectsValue[i].valueMin, effectsValue[i].valueMax);
        documentClassEffectForStyleFilter.style.filter = effectsValue[i].effect + '(' + actualValue + effectsValue[i].unit + ')';
        break;
      }
    }
  };

  form.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(form), successSaveFormHandler, errorSaveFormHandler);
    evt.preventDefault();
    main.addEventListener('click', innerButtonClickHandler);
    document.addEventListener('keydown', onModalEscPress);
  });

  var errorSaveFormHandler = function () {
    closePhotoSettings();
    var errorMarkup = errorTemplate.cloneNode(true);
    main.appendChild(errorMarkup);
  };

  var successSaveFormHandler = function () {
    closePhotoSettings();
    var successMarkup = successTemplate.cloneNode(true);
    main.appendChild(successMarkup);
  };

  var innerButtonClickHandler = function (evt) {
    var target = evt.target;
    if (target.className === 'success__button' || target.className === 'success' || target.className === 'error__button' || target.className === 'error') {
      closeModalWindow();
    }
  };

  var closeModalWindow = function () {
    var successSection = document.querySelector('.success');
    var errorSection = document.querySelector('.error');
    if (main.contains(successSection)) {
      main.removeChild(successSection);
      main.removeEventListener('click', innerButtonClickHandler);
      document.removeEventListener('keydown', onModalEscPress);
    } else if (main.contains(errorSection)) {
      main.removeChild(errorSection);
      main.removeEventListener('click', innerButtonClickHandler);
      document.removeEventListener('keydown', onModalEscPress);
    }
  };

  var onModalEscPress = function (evt) {
    if (evt.keyCode === window.keyNumber.escButton) {
      closeModalWindow();
    }
  };
})();
