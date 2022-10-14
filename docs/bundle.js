/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {

;// CONCATENATED MODULE: ./js/utils.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function addGlobalEventListener(type, selector, callback, options) {
  var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document;
  parent.addEventListener(type, function (e) {
    if (e.target.matches(selector)) callback(e);
  }, options);
}
function qs(selector) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return parent.querySelector(selector);
}
function qsa(selector) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return _toConsumableArray(parent.querySelectorAll(selector));
}
function createElement(type) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var element = document.createElement(type);
  Object.entries(options).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    if (key === "class") {
      element.classList.add(value);
      return;
    }

    if (key === "dataset") {
      Object.entries(value).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            dataKey = _ref4[0],
            dataValue = _ref4[1];

        element.dataset[dataKey] = dataValue;
      });
      return;
    }

    if (key === "text") {
      element.textContent = value;
      return;
    }

    element.setAttribute(key, value);
  });
  return element;
}
var currentTimestampSec = function currentTimestampSec() {
  return Date.now() / 1000 | 0;
};
;// CONCATENATED MODULE: ./js/config.js

var apiKeys = {
  "public": {
    emailjs: "9CEj6LfIzI9NzUiv_"
  }
};
var mailPrefs = {
  templateId: "template_3fubw4l",
  contactService: "service_5isf3yr"
};
;// CONCATENATED MODULE: ./js/carousel.js
function Carousel(carouselTarget) {
  var $slider = document.querySelector(carouselTarget);
  var $items = $slider.querySelector('.items');
  $items.addEventListener('wheel', function (ev) {
    if (ev.deltaY > 0) {
      ev.target.scrollBy(50, 0);
    } else {
      ev.target.scrollBy(-50, 0);
    }
  });
}
;// CONCATENATED MODULE: ./js/formValidator.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var FormValidator = /*#__PURE__*/function () {
  function FormValidator(form) {
    var _this = this;

    _classCallCheck(this, FormValidator);

    this._form = document.querySelector(form);
    this._inputWithErrors = new Set();

    this._form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!_this.hasErrors) {
        // Submit
        console.log('the form was submitted');
      }
    });
  }

  _createClass(FormValidator, [{
    key: "registerInput",
    value: function registerInput(selector, rules) {
      var _rules$pattern,
          _this2 = this;

      // Register
      var inputField = this._form.querySelector("[data-input=\"".concat(selector, "\"]"));

      this._inputWithErrors.add(inputField);

      rules.pattern = (_rules$pattern = rules.pattern) !== null && _rules$pattern !== void 0 ? _rules$pattern : /[^]*/; // ? If the pattern is null it will match any string

      rules.message = '';
      inputField.addEventListener('input', function (ev) {
        return _this2.checkErrors(ev, inputField, rules);
      });
      this.createElementError(inputField);
    }
  }, {
    key: "checkErrors",
    value: function checkErrors(event, input, rules) {
      if (!input.value.match(rules.pattern)) {
        this._inputWithErrors.add(input);

        rules.message = "O padr\xE3o de ".concat('email', " digitado n\xE3o \xE9 v\xE1lido.");
      } else {
        if (input.value.length < rules.min || input.value.length > rules.max) {
          this._inputWithErrors.add(input);

          rules.message = "Pode conter entre ".concat(rules.min, " e ").concat(rules.max, " caracteres.");
        } else {
          this._inputWithErrors["delete"](input);

          rules.message = '';
        }
      }

      if (input.value.length > 0) {
        input.previousElementSibling.classList.add('active');
        input.classList.add('active');
      } else {
        input.previousElementSibling.classList.remove('active');
        input.classList.remove('active');
        rules.message = '';
      }

      this.updateElementError(event.currentTarget, rules.message);
    }
  }, {
    key: "hasErrors",
    get: function get() {
      return this._inputWithErrors.size > 0;
    }
  }, {
    key: "createElementError",
    value: function createElementError(input) {
      var _input$closest$queryS;

      // This function verifies whether the log element exists or not
      var logElement = (_input$closest$queryS = input.closest('li').querySelector('.log')) !== null && _input$closest$queryS !== void 0 ? _input$closest$queryS : false; // select the closest <li> ancestor

      if (!logElement) {
        var log = document.createElement('p');
        log.classList.add('log');
        input.after(log);
      }
    }
  }, {
    key: "updateElementError",
    value: function updateElementError(input, message) {
      var logElement = input.closest('li').querySelector('.log');

      if (message !== '') {
        logElement.textContent = message;
        logElement.classList.add('active');
        input.classList.add('invalid');
      } else {
        logElement.classList.remove('active');
        input.classList.remove('invalid');
      }
    }
  }]);

  return FormValidator;
}();


;// CONCATENATED MODULE: ./js/main.js
var _Number, _Number2;





var cf = new FormValidator('.contact-form'); // Contact form instances

cf.registerInput('username', {
  min: 3,
  max: 23,
  pattern: null
});
cf.registerInput('message', {
  min: 6,
  max: 1000,
  pattern: null
});
cf.registerInput('mail', {
  min: 8,
  max: 30,
  pattern: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
}); // EmailJS instance

emailjs.init(apiKeys["public"].emailjs);
Carousel('.items-wrapper.carousel'); // Local storage variables to control submit rate in the contact form

var token = (_Number = Number(localStorage.token)) !== null && _Number !== void 0 ? _Number : false,
    lastTimestamp = (_Number2 = Number(localStorage.lastTimestamp)) !== null && _Number2 !== void 0 ? _Number2 : false,
    deviceWidth = window.innerWidth;
var $header = qs('header');
var $form = qs('.contact-form');
var $firstSection = qs('.sc.slider');
var $sections = document.querySelectorAll('.sc');
var $scrollTop = qs('.scroll-top');
var $navbar = qs('nav.menu');
$form.addEventListener('submit', function (ev) {
  ev.preventDefault(); // preventing fromssss submit method

  if (nameValid && emailValid && messageValid) {
    var $loading = qs('.sc.contact .popup');
    var $info = $loading.querySelector('.info');
    var $ring = $loading.querySelector('lds-ring');
    token = localStorage.token; // It's important to check the token whenever the form is submitted

    if (!token || !lastTimestamp) {
      // newly user, or an user that never submitted the form
      token = localStorage.token = 3;
      lastTimestamp = localStorage.lastTimestamp = currStampSeconds();
    }

    if (token > 0) {
      token--;
      localStorage.token = token;
      $ring.style.display = 'inline-block';
      $info.textContent = "Enviando";
      show($loading); // Generate five digits number to be used as message ID

      ev.target.id_number.value = Math.random() * 100000 | 0;
      ev.target.to_name.value = 'Philippe';
      console.log('Enviado');
      window.setTimeout(function () {
        hide($loading);
      }, 2000);
      emailjs.sendForm(mailPrefs.contactService, mailPrefs.templateId, ev.target).then(function () {
        $form.reset();

        for (var el in inputs) {
          inputs[el].classList.remove('active');
          inputs[el].previousElementSibling.classList.remove('active');
        }

        nameValid, emailValid, messageValid = false;
        $ring.style.display = 'none';
        $info.textContent = "Sua mensagem foi enviada!";
        window.setTimeout(function () {
          hide($loading);
        }, 2000);
      }), function (error) {
        $ring.style.display = 'none';
        $info.textContent = "Houve um erro ao enviar a mensagem.";
        console.log('Failed...', error);
      };
    } else {
      var limit = 24,
          timeSpent = currStampSeconds() - lastTimestamp,
          convertHours = function convertHours(number) {
        return number / 60 / 60; // Converting seconds to hours
      };

      convertHours(timeSpent) > limit ? (token = localStorage.token = 3, lastTimestamp = localStorage.lastTimestamp = currStampSeconds()) : console.log("Voc\xEA s\xF3 poder\xE1 enviar outra mensagem ap\xF3s ".concat(limit, " horas."));
    }
  } else {
    showInputLog(ev.target.querySelector('input[type="submit"]'));
  }
});
window.addEventListener('load', function (ev) {
  correctElDetails();
  var $clonedHeader = cloneHeader($header); // Clones the header of the page

  var $menuItems = document.querySelectorAll('ul>li[data-nav]');
  var observerIntro = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        $clonedHeader.classList.add('active');
        $scrollTop.classList.add('active');
      } else {
        $clonedHeader.classList.remove('active');
        $scrollTop.classList.remove('active');
      }
    });
  }, {
    rootMargin: "-".concat($firstSection.offsetHeight, "px 0px 0px 0px")
  });
  var observerSections = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        $menuItems.forEach(function (link) {
          link.classList.remove('active');

          if (entry.target.classList.contains(link.dataset.nav)) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.5
  });
  observerIntro.observe($firstSection); // Observes the first section of the page

  $sections.forEach(function (section) {
    observerSections.observe(section);
  });
  observerSections.observe($header);

  if (deviceWidth < 768) {
    showNavigation();
    var $menuButton = document.querySelectorAll('.menu-mobile').item(0);
    var $newNav = document.querySelectorAll('nav.menu').item(0);
    var $links = document.querySelectorAll('nav.menu>ul>li');
    $newNav.remove();
    $menuButton.addEventListener('click', function (ev) {
      $navbar.classList.toggle('active');
      ev.currentTarget.classList.toggle('active');
    });
    $links.forEach(function (link) {
      link.addEventListener('click', function (ev) {
        $navbar.classList.remove('active');
        $menuButton.classList.remove('active');
      });
    });
  }
});

var showNavigation = function showNavigation() {
  var $div = document.createElement('div');
  $div.classList.add('menu-mobile');

  for (var i = 0; i < 3; i++) {
    var el = document.createElement('span');
    $div.append(el);
  }

  $navbar.after($div);
};

var cloneHeader = function cloneHeader(header) {
  var node = header.firstElementChild.cloneNode(true);
  var $clonedHeader = qs('.header.clone');
  $clonedHeader.appendChild(node);
  return $clonedHeader;
};

var correctElDetails = function correctElDetails() {
  var $el = qs('.sc.intro .mask');
  $el.style.borderRightWidth = "".concat($el.parentNode.offsetWidth, "px");
  $el.style.borderTopWidth = "".concat($el.parentNode.offsetHeight, "px");
};

var currStampSeconds = function currStampSeconds() {
  return Date.now() / 1000 | 0;
};

window.addEventListener('resize', function (ev) {
  correctElDetails();

  if (window.innerWidth < 768) {}
});
$scrollTop.addEventListener('click', function (ev) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
// extracted by mini-css-extract-plugin

})();

/******/ })()
;