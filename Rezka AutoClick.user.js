// ==UserScript==
// @name         HDRezka AutoClick
// @namespace    http://tampermonkey.net/
// @version      0.9.0
// @description  try to take over the world!
// @author       DenisGasilo
// @match        https://rezka.ag/*
// @icon         https://pbs.twimg.com/profile_images/1091807448355229697/Sgdo_u2j_400x400.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function () {

  if (getElement('video')) {
    setInterval(function () {
      skipOpening(GM_getValue('openingDuration', 0), GM_getValue('openingStart', 0));
    }

      , 100);

    setInterval(function () {
      skipTitles(GM_getValue('titleDuration', 0), GM_getValue('titleStart', 0));
    }

      , 1000);

    setInterval(function () {
      nextEpisode(GM_getValue('isRemoveDelayNextEpisode', true));
    }

      , 100);

    createAnimeSettingsDialog();
    createOpenDialogButton();
  }



  function getElement(selector) {
    return document.querySelector(selector);
  }

  function playVideo(videoElement) {
    if (videoElement) {
      videoElement.play();
    }
  }

  function nextEpisode(bool) {
    if (bool) {
      const nextEpisodeBtn = getElement('.c100.center.p10');

      if (nextEpisodeBtn) {
        nextEpisodeBtn.click();
      }
    }
  }

  function skipOpening(openingDuration = 0, openingTimeStart = 0) {
    openingDuration = Number(openingDuration);
    openingTimeStart = Number(openingTimeStart);
    const videoElement = getElement('video');

    if (videoElement) {
      if (videoElement.currentTime > openingTimeStart && (videoElement.currentTime < openingDuration + openingTimeStart)) {
        videoElement.currentTime = openingDuration + openingTimeStart;
      }
    }
  }

  function skipTitles(titlesDuration = 0, titlesTimeStart = 0) {
    titlesDuration = Number(titlesDuration);
    titlesTimeStart = Number(titlesTimeStart);
    const videoElement = getElement('video');

    if (videoElement) {
      if (titlesTimeStart > 1) {
        if (videoElement.currentTime > titlesTimeStart && videoElement.currentTime < (titlesTimeStart + titlesDuration - 1)) {
          videoElement.currentTime = titlesTimeStart + titlesDuration - 1;
        }
      }

      else {
        if (videoElement.currentTime > (videoElement.duration - titlesDuration) && videoElement.currentTime < (videoElement.duration - 5)) {
          videoElement.currentTime = videoElement.duration - 0.1;
        }
      }
    }
  }

  function createAnimeSettingsDialog() {
    const dialogHTML = ` <div id="animeSettingsDialog" class="modal-dialog" > <div class="modal-content" > <h1>Название аниме</h1> <input disabled type="text" id="animeTitleInput"
      value="name" > <div class="custom-checkbox" > <h2>Базовые настройки</h2> <label for="isRemoveDelayNextEpisode" >Убрать задержку начала следующей серии</label> <input type="checkbox" value="0" checked id="isRemoveDelayNextEpisode" > </div> <div> <h2>Пропуск опенинга</h2> <label for="openingDuration" >Продолжительность опенинга</label> <input type="number" min="0" id="openingDuration" value="0" > сек <br> <label for="openingStart" >Начало опенинга на</label> <input type="number" min="0" id="openingStart" value="0" > сек </div> <div> <h2>Пропуск титров</h2> <label for="titleDuration" >Продолжительность титров</label> <input type="number" min="0" id="titleDuration" value="0" > сек <br> <label for="titleStart" >Начало титров на</label> <input type="number" min="0" id="titleStart" value="0" > сек </div> <button id="saveSettings" >Сохранить</button> </div> <footer> <p style="margin-top:10px;font-size:14px;" >© Made by DenisGasilo <a target="_blank" href="https://github.com/DenisGas/HDRezka-AutoClick-UserScript" >Extension page</a></p> </footer> </div> <div id="modalOverlay" class="modal-overlay" ></div> `;

    const dialogContainer = document.createElement('div');
    dialogContainer.innerHTML = dialogHTML;
    document.body.appendChild(dialogContainer);

    const dialog = document.getElementById('animeSettingsDialog');
    const animeTitleInput = document.getElementById('animeTitleInput');
    const openingDurationInput = document.getElementById('openingDuration');
    const openingStartInput = document.getElementById('openingStart');
    const titleDurationInput = document.getElementById('titleDuration');
    const titleStartInput = document.getElementById('titleStart');
    const saveButton = document.getElementById('saveSettings');
    const modalOverlay = document.getElementById('modalOverlay');
    const removeDelayNextEpisodeCheckbox = document.getElementById('isRemoveDelayNextEpisode');


    modalOverlay.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      dialog.style.display = 'none';
    });

    // SET DEFAULT Value
    updateData();

    saveButton.addEventListener('click', () => {

      const newTitle = {
        "name": getElement('.b-post__origtitle').innerText,
        "openingDuration": openingDurationInput.value,
        "openingStart": openingStartInput.value,
        "titleDuration": titleDurationInput.value,
        "titleStart": titleStartInput.value
      }

        ;

      const globalSettings = {
        "lang": "ru",
        "scriptOFF": false,
        "removeDelayNextEpisode": removeDelayNextEpisodeCheckbox.checked
      }

        ;

      const titleSettingsArray = GM_getValue('titleSettings', []);

      const existingIndex = titleSettingsArray.findIndex(item => item.name === newTitle.name);

      if (existingIndex !== -1) {
        titleSettingsArray[existingIndex] = newTitle;
      }

      else {
        titleSettingsArray.push(newTitle);
      }

      GM_setValue('globalSettings', globalSettings);

      GM_setValue('titleSettings', titleSettingsArray);

      updateData();
      dialog.style.display = 'none';
      modalOverlay.style.display = 'none';
    });
  }

  function createOpenDialogButton() {
    const buttonHTML = ` <div id="openDialogButton" class="custom-button" > &#x2699;
      </div> `;


    const buttonContainer = document.createElement('div');
    buttonContainer.innerHTML = buttonHTML;
    document.body.appendChild(buttonContainer);

    const openButton = document.getElementById('openDialogButton');

    openButton.addEventListener('click', () => {
      const modalOverlay = document.getElementById('modalOverlay');
      const dialog = document.getElementById('animeSettingsDialog');
      updateData();

      if (modalOverlay.style.display === 'block') {

        modalOverlay.style.display = 'none';
        dialog.style.display = 'none';
        return
      }

      modalOverlay.style.display = 'block';
      dialog.style.display = 'block';
    });
  }

  function updateData() {
    const removeDelayNextEpisodeCheckbox = document.getElementById('isRemoveDelayNextEpisode');
    const openingDurationInput = document.getElementById('openingDuration');
    const openingStartInput = document.getElementById('openingStart');
    const titleDurationInput = document.getElementById('titleDuration');
    const titleStartInput = document.getElementById('titleStart');
    const animeTitleInput = document.getElementById('animeTitleInput');

    const globalSettingsD = {
      "lang": "ru",
      "scriptOFF": false,
      "removeDelayNextEpisode": true
    }

    let titleSettings = {
      "name": "name",
      "openingDuration": "0",
      "openingStart": "0",
      "titleDuration": "0",
      "titleStart": "0"
    }

      ;

    const titleSettingsArray = GM_getValue('titleSettings', []);
    const globalSettings = GM_getValue('globalSettings', globalSettingsD);

    const existingIndex = titleSettingsArray.findIndex(item => item.name === getElement('.b-post__origtitle').innerText);


    if (existingIndex !== -1) {
      titleSettings = titleSettingsArray[existingIndex];
    }

    animeTitleInput.value = getElement('.b-post__origtitle').innerText;
    openingDurationInput.value = titleSettings.openingDuration;
    openingStartInput.value = titleSettings.openingStart;
    titleDurationInput.value = titleSettings.titleDuration;
    titleStartInput.value = titleSettings.titleStart;

    removeDelayNextEpisodeCheckbox.value = globalSettings.removeDelayNextEpisode;
    removeDelayNextEpisodeCheckbox.checked = globalSettings.removeDelayNextEpisode;
  }

  GM_addStyle(` #animeSettingsDialog {
        font-family: 'Courier New', Courier, monospace;
        color: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(31, 30, 79, 9);
        box-sizing: border-box;
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.8);
        padding: 20px;
        z-index: 9999;
      }

      #animeSettingsDialog input[type="number"] {
        width: 50px;
      }

      #animeSettingsDialog input, label {
        font-size:16px;
      }

      #animeSettingsDialog h1 {
        font-size:24px;
      }

      #animeSettingsDialog h2 {
        margin-top:10px;
        font-size:20px;
      }

      #saveSettings {
        cursor: pointer;
        transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
        background: #fff;
        margin: 10px auto;
        padding: 5px;
        font-size: 15px;
        border-radius: 5px;
        box-shadow: 0px 0 0px 4px rgba(0, 0, 0, 0.6);
        border: rgba(0, 0, 0, 0);
      }

      #saveSettings:hover {
        color: #fff;
        background: #888;
        box-shadow: 0px 0 0px 4px rgba(255, 255, 255, 0.6);
      }

      #saveSettings:active {
        color: #fff;
        background: #0b70c2;
        box-shadow: 0px 0 0px 4px rgba(8, 8, 8, 0.6);
      }

      .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 1000;
      }

      .modal-dialog {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        z-index: 1001;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      .custom-button {
        z-index: 1001;
        position: fixed;
        top: 10px;
        right: 10px;
        cursor: pointer;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        line-height: 50px;
        background-color: #888;
        transition: background-color 0.2s;
      }

      .custom-button:hover {
        background-color: #555;
      }




      `);
})();
