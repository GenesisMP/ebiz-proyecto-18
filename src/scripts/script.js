document
  .getElementById("switch-to-register")
  .addEventListener("click", function (event) {
    event.preventDefault();

    let loginForm = document.getElementById("login-form");
    let registerForm = document.getElementById("register-form");

    loginForm.classList.add("slide-out");

    if (!loginForm.classList.contains("hidden")) {
      // Solo si está visible
      loginForm.classList.add("slide-out");

      setTimeout(() => {
        loginForm.classList.remove("visible", "slide-out");
        loginForm.classList.add("hidden");

        registerForm.classList.remove("hidden");
        registerForm.classList.add("visible");
      }, 20);
    }
    document.getElementById("register-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
  });

document
  .getElementById("switch-to-login")
  .addEventListener("click", function (event) {
    event.preventDefault();
    let loginForm = document.getElementById("login-form");
    let registerForm = document.getElementById("register-form");

    registerForm.classList.add("slide-out");

    setTimeout(() => {
      registerForm.classList.remove("visible", "slide-out");
      registerForm.classList.add("hidden");

      loginForm.classList.remove("hidden");
      loginForm.classList.add("visible");
    }, 20);
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
  });
