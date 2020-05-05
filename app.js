const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerFacebook = new firebase.auth.FacebookAuthProvider();
const providerTwitter = new firebase.auth.TwitterAuthProvider();

document.getElementById("loginGoogle").onclick = () => {
  loginFlow("loginGoogle", providerGoogle);
};

document.getElementById("loginFacebook").onclick = () => {
  loginFlow("loginFacebook", providerFacebook);
};

document.getElementById("loginTwitter").onclick = () => {
  loginFlow("loginTwitter", providerTwitter);
};

const loginFlow = (element, provider) => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result.user);
      document.getElementById(element).style.display = "none";
      guardarDatos(result.user);
      const name = document.createElement("p");
      name.append(result.user.displayName);
      document.getElementById("root").appendChild(name);
      document
        .getElementById("avatar")
        .setAttribute("src", result.user.photoURL);
    });
};

const guardarDatos = (user) => {
  const usuario = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
  };

  firebase.database().ref(`taller05/Usuarios/${user.uid}`).set(usuario);
};
