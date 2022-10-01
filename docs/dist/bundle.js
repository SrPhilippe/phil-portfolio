(()=>{"use strict";var e,t=localStorage.formToken?localStorage.formToken:localStorage.formToken=3,n=null!==(e=localStorage.lastTimestamp)&&void 0!==e&&e,o=window.innerWidth,i=document.querySelector("header"),a=document.querySelector(".contact-form"),r=document.querySelector(".sc.slider"),c=document.querySelectorAll(".sc"),l=document.querySelector(".scroll-top"),s=document.querySelector("nav.menu");window.addEventListener("load",(function(e){g();var t=function(e){var t=e.firstElementChild.cloneNode(!0),n=document.querySelector(".header.clone");return n.appendChild(t),n}(i),n=document.querySelectorAll("ul>li[data-nav]"),a=new IntersectionObserver((function(e){e.forEach((function(e){e.isIntersecting?(t.classList.remove("active"),y(l,null)):(t.classList.add("active"),S(l))}))}),{rootMargin:"-".concat(r.offsetHeight,"px 0px 0px 0px")}),u=new IntersectionObserver((function(e){e.forEach((function(e){e.isIntersecting&&n.forEach((function(t){t.classList.remove("active"),e.target.classList.contains(t.dataset.nav)&&t.classList.add("active")}))}))}),{threshold:.5});if(a.observe(r),c.forEach((function(e){u.observe(e)})),u.observe(i),o<768){!function(){var e=document.createElement("div");e.classList.add("menu-mobile");for(var t=0;t<3;t++){var n=document.createElement("span");e.append(n)}s.after(e)}(),console.log(t);var m=document.querySelectorAll(".menu-mobile").item(0),d=document.querySelectorAll("nav.menu").item(0),v=document.querySelectorAll("nav.menu>ul>li");d.remove(),m.addEventListener("click",(function(e){s.classList.toggle("active"),e.currentTarget.classList.toggle("active")})),v.forEach((function(e){e.addEventListener("click",(function(e){s.classList.remove("active"),m.classList.remove("active")}))}))}})),emailjs.init("9CEj6LfIzI9NzUiv_");var u={name:a.querySelector('input[name="username"]'),email:a.querySelector('input[type="email"]'),message:a.querySelector("textarea"),submit:a.querySelector('input[type="submit"]')},m=!1,d=!1,v=!1;for(var f in u)u[f].addEventListener("input",(function(e){var t=e.currentTarget;t.value.length>0?(t.classList.add("active"),t.previousElementSibling.classList.add("active"),p(t)):(t.nextSibling.remove(),t.classList.remove("active","invalid"),t.previousElementSibling.classList.remove("active"))}));function p(e){var t=function(e){var t={min:3,max:23},n={min:5,max:1e3};if(e.isSameNode(u.name))return e.value.length<t.min?(m=!1,"Nome muito pequeno. Precisa conter pelo menos ".concat(t.min," caracteres.")):e.value.length>t.max?(m=!1,"Nome muito grande. Pode conter até ".concat(t.max," caracteres.")):(m=!0,!0);if(e.isSameNode(u.email)){return e.value.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)?(d=!0,!0):(d=!1,"O padrão de e-mail não é válido.")}return e.isSameNode(u.message)?e.value.length<n.min||e.value.length>n.max?(v=!1,"A mensagem precisa estar entre ".concat(n.min," e ").concat(n.max," caracteres.")):(v=!0,!0):e.isSameNode(u.submit)?!m&&!d&&!0===v||"Você precisa preencher todos os campos antes de validar!":void 0}(e);if(!e.nextElementSibling){var n=document.createElement("p");n.classList.add("log"),e.after(n)}!0===t?(e.classList.remove("invalid"),e.nextSibling.remove()):(e.classList.add("invalid"),e.nextElementSibling.textContent=t,e.nextSibling.style.top="-".concat(e.nextSibling.offsetHeight+10,"px"))}function g(){var e=document.querySelector(".sc.intro .mask");e.style.borderRightWidth="".concat(e.parentNode.offsetWidth,"px"),e.style.borderTopWidth="".concat(e.parentNode.offsetHeight,"px")}function S(e){e.style.visibility="visible",window.setTimeout((function(){return e.style.opacity=1}),30)}function y(e,t){null===t&&(t=300),e.style.opacity=0,window.setTimeout((function(){return e.style.visibility="hidden"}),t)}a.addEventListener("submit",(function(e){if(e.preventDefault(),m&&d&&v){var o=document.querySelector(".sc.contact .popup"),i=o.querySelector(".info"),r=o.querySelector(".lds-ring");if((t=localStorage.formToken)>0)t--,localStorage.formToken=t,r.style.display="inline-block",i.textContent="Enviando",S(o),e.target.id_number.value=1e5*Math.random()|0,e.target.to_name.value="Philippe",emailjs.sendForm("service_5isf3yr","template_3fubw4l",e.target).then((function(){for(var e in a.reset(),u)u[e].classList.remove("active");v=!1,r.style.display="none",i.textContent="Sua mensagem foi enviada!",window.setTimeout((function(){y(o)}),2e3)}));else{var c=Date.now()/1e3|0,l=c-Number(n),s=function(e){return e/60/60};s(l)>24?(localStorage.formToken=3,localStorage.lastTimestamp=c):console.log("Você só poderá enviar depois de ".concat(24-s(l)," horas."))}}else p(e.target.querySelector('input[type="submit"]'))})),window.addEventListener("resize",(function(e){g(),window.innerWidth})),l.addEventListener("click",(function(e){window.scrollTo({top:0,behavior:"smooth"})}))})();