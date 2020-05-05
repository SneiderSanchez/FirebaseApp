// Firebase Database Reference and the child
const musicRef = firebase.database().ref().child("music");

const cleanAll = () => {
  document.getElementById("music__list").innerHTML = `
  <tr>
    <th>Artist</th>
    <th>Song Name</th>
    <th>Year</th>
    <th>Delete</th>
    <th>Edit</th>
  </tr>`;
  cleanForm();
  hideForm();
};

const cleanForm = () => {
  document.getElementById("newMusicForm").reset();
  document.getElementById("songName").setAttribute("value", "");
  document.getElementById("artist").setAttribute("value", "");
  document.getElementById("year").setAttribute("value", "");
  document.querySelector("#formActionText").innerHTML =
    "Add Music <small>Inputs</small>";
  document.querySelector("#buttonActionForm").innerHTML = "Add New Music";
};

const getData = () => {
  musicRef.on("value", (allItems) => {
    cleanAll();
    allItems.forEach((item) => {
      const key = item.key;
      const value = item.val();

      document.getElementById("music__list").innerHTML += `  
      <tr>
        <td>${value.artist}</td>
        <td>${value.songName}</td>
        <td>${value.year}</td>
        <td class='action-row'>
          <img 
          onClick="deleteMusic('${key}');" 
          src="https://image.flaticon.com/icons/svg/1828/1828843.svg" 
          alt="delete icon" 
          class='action__image'>
        </td>
        <td class='action-row'>
          <img 
          onClick="editMusic('${key}');" 
          src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-3/3/49-512.png" 
          alt="edit icon" 
          class='action__image'>
        </td>
      </tr>`;
    });
  });
};

getData();

const deleteMusic = (id) => {
  const itemToDelete = musicRef.child(`${id}`);
  itemToDelete.remove();
};

const showForm = () => {
  document.getElementById("formActionContainer").classList.remove("hidden");
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
};
const hideForm = () => {
  cleanForm();
  setTimeout(() => {
    document.getElementById("formActionContainer").classList.add("hidden");
  }, 400);
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

const editMusic = (id) => {
  const itemToEdit = musicRef.child(`${id}`);
  itemToEdit.on("value", (item) => {
    document.querySelector("#formActionText").innerHTML =
      "Edit Music <small>Inputs</small>";
    document.querySelector("#buttonActionForm").innerHTML =
      "Edit Current Music";
    const values = item.val();
    document.getElementById("songName").setAttribute("value", values.songName);
    document.getElementById("artist").setAttribute("value", values.artist);
    document.getElementById("year").setAttribute("value", values.year);
    // Create a hide edit input
    const action = document.createElement("input");
    action.setAttribute("type", "edit");
    action.setAttribute("name", "edit");
    action.setAttribute("value", item.key);
    action.style.display = "none";
    document.querySelector("#newMusicForm").appendChild(action);
    showForm();
  });
};

document.querySelector("#newMusicForm").addEventListener("submit", (e) => {
  const form = document.querySelector("#newMusicForm");
  const data = Object.fromEntries(new FormData(form).entries());
  if (form.edit) {
    const itemToEdit = musicRef.child(`${data.edit}`);
    itemToEdit.update({
      artist: data.artist,
      songName: data.songName,
      year: data.year,
    });
  } else {
    musicRef.push(data);
  }
  e.preventDefault();
});
