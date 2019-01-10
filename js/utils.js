'use strict';

(function () {
  var shuffle = function () {
    return Math.random() - 0.5;
  };

  window.utils = {
    shuffle: shuffle
  };
})();
