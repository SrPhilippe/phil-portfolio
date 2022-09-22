"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mailPrefs = exports.apiKeys = void 0;
var apiKeys = {
  public: {
    emailjs: "9CEj6LfIzI9NzUiv_"
  }
};
exports.apiKeys = apiKeys;
var mailPrefs = {
  templateId: "template_3fubw4l",
  contactService: "service_5isf3yr"
};
exports.mailPrefs = mailPrefs;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var FormValidator = /*#__PURE__*/function () {
  function FormValidator(selector) {
    var _this = this;

    _classCallCheck(this, FormValidator);

    this.form = document.querySelector(selector);
    this.inputsErrors = new Set();
    this.form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      if (!_this.hasErrors) {
        _this.form.submit();
      }
    });
  }

  _createClass(FormValidator, [{
    key: "hasErrors",
    get: function get() {
      return this.inputsErrors.size > 0;
    }
  }, {
    key: "register",
    value: function register(selector, check) {
      var inputField = this.form.querySelector('input');
    }
  }]);

  return FormValidator;
}();

exports.default = FormValidator;
"use strict";

var _config = require("./config.js");

// import FormValidator from './formValidator.js'
var $navbar = document.querySelector('nav.menu');
var $header = document.querySelector('header');
var $form = document.querySelector('.contact-form');
var scrollvalue = window.scrollY,
    devicewidth = window.innerWidth,
    headerheight = $header.offsetHeight,
    sticky = null;

if (devicewidth < 768) {
  if (document.querySelector('.menu.mobile') === null) {
    showNavigation();
  }
}

window.addEventListener('load', function (ev) {
  $header.style.top = "-".concat(headerheight, "px"); // to have a slide down animation

  scrollvalue >= headerheight ? sticky = true : sticky = false;
  menuSticky();
  correctElDetails();
});
window.addEventListener('scroll', function (ev) {
  scrollvalue = window.scrollY;
  menuSticky();
  scrollvalue > headerheight ? show($scrollTop) : hide($scrollTop, null);
});
window.addEventListener('resize', function (ev) {
  correctElDetails();

  if (window.innerWidth < 768) {}
}); // Select all inputs inside the contact form excluding the input submit type

var inputsForm = $form.querySelectorAll('input:not([type="submit"], [type="hidden"]), textarea');
inputsForm.forEach(function (el) {
  el.addEventListener('input', function (ev) {
    ev.currentTarget.value.length > 0 ? (ev.currentTarget.classList.add('active'), ev.currentTarget.previousElementSibling.classList.add('active')) : (ev.currentTarget.classList.remove('active'), ev.currentTarget.previousElementSibling.classList.remove('active'));
  });
});

function menuSticky() {
  if (scrollvalue >= headerheight && sticky === true) {
    $header.classList.add('sticky');
    document.body.style.paddingTop = headerheight + $header.offsetHeight + 'px';
    sticky = false;
  } else if (scrollvalue < headerheight && sticky === false) {
    $header.classList.remove('sticky');
    headerheight = $header.offsetHeight;
    document.body.style.paddingTop = '0';
    sticky = true;
  }
}

function showNavigation() {
  var $mobNav = document.createElement('div');
  $mobNav.classList.add('menu', 'mobile');

  for (var i = 0; i < 3; i++) {
    var el = document.createElement('span');
    $mobNav.append(el);
  }

  $navbar.prepend($mobNav);
}

function correctElDetails() {
  var $el = document.querySelector('.sc.intro .mask');
  $el.style.borderRightWidth = "".concat($el.parentNode.offsetWidth, "px");
  $el.style.borderTopWidth = "".concat($el.parentNode.offsetHeight, "px");
}

var $scrollTop = document.querySelector('.scroll-top');
$scrollTop.addEventListener('click', function (ev) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
emailjs.init(_config.apiKeys.public.emailjs);
$form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  var $loading = document.querySelector('.sc.contact .popup');
  var $info = $loading.querySelector('.info');
  var $ring = $loading.querySelector('.lds-ring');
  $ring.style.display = 'inline-block';
  $info.textContent = "Enviando";
  show($loading); // Generate five digits number to be used as message ID

  ev.target.id_number.value = Math.random() * 100000 | 0;
  ev.target.to_name.value = 'Philippe';
  emailjs.sendForm(_config.mailPrefs.contactService, _config.mailPrefs.templateId, ev.target).then(function () {
    // clearForm()
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
});

function show(el) {
  el.style.visibility = 'visible';
  window.setTimeout(function () {
    return el.style.opacity = 1;
  }, 30);
}

function hide(el, animationTime) {
  if (animationTime === null) {
    animationTime = 300;
  }

  el.style.opacity = 0;
  window.setTimeout(function () {
    return el.style.visibility = 'hidden';
  }, animationTime);
}
