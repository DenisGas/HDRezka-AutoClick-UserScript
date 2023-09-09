// ==UserScript==
// @name         HDRezka AutoClick
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  try to take over the world!
// @author       DenisGasilo
// @match        https://rezka.ag/*
// @icon         https://pbs.twimg.com/profile_images/1091807448355229697/Sgdo_u2j_400x400.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function () {

  const intervalArray = [];
  const keyCupEventArray = [];

  if (getElement('video')) {
    createAnimeSettingsDialog();
    createOpenDialogButton();
  }

  function addEventListener(target, type, callback, options) {
    const listener = { target, type, callback, options };
    target.addEventListener(type, callback, options);
    keyCupEventArray.push(listener);
  }

  function removeAllEventListeners() {
    for (const listener of keyCupEventArray) {
      listener.target.removeEventListener(listener.type, listener.callback, listener.options);
    }
    keyCupEventArray.length = 0;
  }


  function customSetInterval(callback, delay, ...args) {
    const intervalId = setInterval(callback, delay, ...args);
    intervalArray.push(intervalId);
    return intervalId;
  }

  function clearAllIntervals() {
    for (const intervalId of intervalArray) {
      clearInterval(intervalId);
    }
    intervalArray.length = 0;
  }

  function scriptOn(isRemoveDelayNextEpisode, isAutoSkipOpening, isAutoSkipTitles) {

    removeAllEventListeners();
    clearAllIntervals();

    const titleSettings = getTitleSettings();

    if (isRemoveDelayNextEpisode) {
      customSetInterval(function () {
        removeDelayNextEpisode(isRemoveDelayNextEpisode);
      }, 100);
    }

    if (isAutoSkipOpening) {
      customSetInterval(function () {
        skipOpening(titleSettings.openingDuration, titleSettings.openingStart);
      }, 100);
    } else {
      addEventListener(document, 'keydown', function (event) {
        if (event.altKey && event.key === "o") {
          const titleSettings = getTitleSettings();
          skipOpening(titleSettings.openingDuration, getElement('video').currentTime);
        }
      });
    }

    if (isAutoSkipTitles) {
      customSetInterval(function () {
        skipTitles(titleSettings.titleDuration, titleSettings.titleStart);
      }, 1000);
    } else {
      addEventListener(document, 'keydown', function (event) {
        if (event.altKey && event.key === "t") {
          const titleSettings = getTitleSettings();
          skipOpening(titleSettings.titleDuration, getElement('video').currentTime);
        }
      });
    }

    addEventListener(document, 'keydown', function (event) {
      if (event.altKey && event.key === "n") {
        nextSeries(getElement('video'));
      }
    });

    addEventListener(document, 'keydown', function (event) {
      if (event.altKey && event.key === "0") {
        goToVideoStartTime(getElement('video'));
      }
    });

    addEventListener(document, 'keydown', function (event) {
      if (event.altKey && event.key === "p") {
        playVideo(getElement('video'));
      }
    });
  }

  function getTitleSettings() {
    let titleSettings = {
      "name": "name",
      "openingDuration": "0",
      "openingStart": "0",
      "titleDuration": "0",
      "titleStart": "0"
    }

    const titleSettingsArray = GM_getValue('titleSettings', []);
    const existingIndex = titleSettingsArray.findIndex(item => item.name === getElement('.b-post__origtitle').innerText);


    if (existingIndex !== -1) {
      titleSettings = titleSettingsArray[existingIndex];
    }

    return titleSettings;

  }

  function getGlobalSettings() {
    const globalSettings = {
      "lang": "ru",
      "scriptOFF": false,
      "removeDelayNextEpisode": true,
      "autoSkipOpening": false,
      "autoSkipTitles": false

    }

    return GM_getValue('globalSettings', globalSettings);

  }

  function getElement(selector) {
    return document.querySelector(selector);
  }

  function playVideo(videoElement) {
    if (videoElement) {
      videoElement.play();
      videoElement.focus();
    }
  }

  function removeDelayNextEpisode(bool) {
    if (bool) {
      const nextEpisodeBtn = getElement('.c100.center.p10');

      if (nextEpisodeBtn) {
        nextEpisodeBtn.click();
      }
    }
  }

  function nextSeries(videoElement) {
    videoElement.currentTime = videoElement.duration - 0.1;
  }
  function goToVideoStartTime(videoElement) {
    videoElement.currentTime = 0;
  }

  function skipOpening(openingDuration = 0, openingTimeStart = 0) {
    openingDuration = Number(openingDuration);
    openingTimeStart = Number(openingTimeStart);
    const videoElement = getElement('video');

    if (videoElement) {
      if (videoElement.currentTime >= openingTimeStart && (videoElement.currentTime < openingDuration + openingTimeStart)) {
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
    const dialogHTML = `  <div id="animeSettingsDialog" class="modal-dialog">
    <div class="modal-content">
    <h1>Название аниме</h1>
    <input disabled type="text" id="animeTitleInput">
    <div id="basicSettings">
      <h2>Базовые настройки</h2>
      <input type="checkbox" id="scriptOFF">
      <label for="scriptOFF">Выключить скрипт</label>
      <br>
      <input type="checkbox" checked id="isRemoveDelayNextEpisode">
      <label for="isRemoveDelayNextEpisode">Убрать задержку начала следующей серии</label>
      <br>
      <input type="checkbox" id="autoSkipOpening">
      <label for="autoSkipOpening">Пропускать опенинг автоматически</label>
      <br>
      <input type="checkbox" id="autoSkipTitles">
      <label for="autoSkipTitles">Пропускать титры автоматически</label>
    </div>
    <div>
      <h2>Пропуск опенинга</h2> <label for="openingDuration">Продолжительность опенинга</label> <input type="number"
        min="0" id="openingDuration" value="0"> сек <br> <label for="openingStart">Начало опенинга на</label> <input
        type="number" min="0" id="openingStart" value="0"> сек
    </div>
    <div>
      <h2>Пропуск титров</h2> <label for="titleDuration">Продолжительность титров</label> <input type="number" min="0"
        id="titleDuration" value="0"> сек <br> <label for="titleStart">Начало титров на</label> <input type="number"
        min="0" id="titleStart" value="0"> сек
    </div> <button id="saveSettings">Сохранить</button>
  </div>
  <footer>
    <p style="margin-top:10px;font-size:14px;">© Made by DenisGasilo <a target="_blank"
        href="https://github.com/DenisGas/HDRezka-AutoClick-UserScript">Extension page</a></p>
  </footer>
  </div>
  <div id="modalOverlay" class="modal-overlay"></div>`;

    const dialogContainer = document.createElement('div');
    dialogContainer.innerHTML = dialogHTML;
    document.body.appendChild(dialogContainer);
    const basicSettingsBlock = document.getElementById("basicSettings");

    const checkboxes = basicSettingsBlock.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", saveData);
      checkbox.addEventListener("change", updateData);

    });


    const dialog = document.getElementById('animeSettingsDialog');
    const saveButton = document.getElementById('saveSettings');
    const modalOverlay = document.getElementById('modalOverlay');

    modalOverlay.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      dialog.style.display = 'none';
    });

    // SET DEFAULT Value
    updateData();

    saveButton.addEventListener('click', () => {
      saveData();
      updateData();
      closeModal(modalOverlay, dialog);
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
      if (modalOverlay.style.display === 'block') {
        closeModal(modalOverlay, dialog);
        return
      }
      openModal(modalOverlay, dialog);
    });
  }

  function openModal(...arrs) {
    updateData();
    for (const elem of arrs) {
      elem.style.display = 'block';
    }

  }

  function closeModal(...arrs) {
    for (const elem of arrs) {
      elem.style.display = 'none';
    }

  }

  function saveData() {
    const openingDurationInput = document.getElementById('openingDuration');
    const openingStartInput = document.getElementById('openingStart');
    const titleDurationInput = document.getElementById('titleDuration');
    const titleStartInput = document.getElementById('titleStart');
    const autoSkipOpening = document.getElementById('autoSkipOpening');
    const autoSkipTitles = document.getElementById('autoSkipTitles');
    const scriptOffCheckbox = document.getElementById('scriptOFF');
    const removeDelayNextEpisodeCheckbox = document.getElementById('isRemoveDelayNextEpisode');

    const newTitle = {
      "name": getElement('.b-post__origtitle').innerText,
      "openingDuration": openingDurationInput.value,
      "openingStart": openingStartInput.value,
      "titleDuration": titleDurationInput.value,
      "titleStart": titleStartInput.value
    }

    const globalSettings = {
      "lang": "ru",
      "scriptOFF": scriptOffCheckbox.checked,
      "removeDelayNextEpisode": removeDelayNextEpisodeCheckbox.checked,
      "autoSkipOpening": autoSkipOpening.checked,
      "autoSkipTitles": autoSkipTitles.checked
    }

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

  }

  function updateData() {
    const removeDelayNextEpisodeCheckbox = document.getElementById('isRemoveDelayNextEpisode');
    const openingDurationInput = document.getElementById('openingDuration');
    const openingStartInput = document.getElementById('openingStart');
    const titleDurationInput = document.getElementById('titleDuration');
    const titleStartInput = document.getElementById('titleStart');
    const animeTitleInput = document.getElementById('animeTitleInput');
    const autoSkipOpening = document.getElementById('autoSkipOpening');
    const autoSkipTitles = document.getElementById('autoSkipTitles');
    const scriptOffCheckbox = document.getElementById('scriptOFF');


    const titleSettings = getTitleSettings();
    const globalSettings = getGlobalSettings();

    animeTitleInput.value = getElement('.b-post__origtitle').innerText;


    openingDurationInput.value = titleSettings.openingDuration;
    openingStartInput.value = titleSettings.openingStart;
    titleDurationInput.value = titleSettings.titleDuration;
    titleStartInput.value = titleSettings.titleStart;

    removeDelayNextEpisodeCheckbox.checked = globalSettings.removeDelayNextEpisode;
    autoSkipOpening.checked = globalSettings.autoSkipOpening;
    autoSkipTitles.checked = globalSettings.autoSkipTitles;
    scriptOffCheckbox.checked = globalSettings.scriptOFF;

    if (scriptOffCheckbox.checked) {
      autoSkipOpening.disabled = true;
      autoSkipTitles.disabled = true;
      openingDurationInput.disabled = true;
      titleDurationInput.disabled = true;
      removeDelayNextEpisodeCheckbox.disabled = true;
    } else {
      autoSkipOpening.disabled = false;
      autoSkipTitles.disabled = false;
      openingDurationInput.disabled = false;
      titleDurationInput.disabled = false;
      removeDelayNextEpisodeCheckbox.disabled = false;
    }

    if (autoSkipOpening.checked && !(autoSkipOpening.disabled)) {
      openingStartInput.disabled = false;
    } else {
      openingStartInput.disabled = true;
    }


    if (autoSkipTitles.checked && !(autoSkipTitles.disabled)) {
      titleStartInput.disabled = false;
    } else {
      titleStartInput.disabled = true;
    }

    if (scriptOffCheckbox.checked) {
      removeAllEventListeners();
      clearAllIntervals();
      return
    }

    scriptOn(removeDelayNextEpisodeCheckbox.checked, autoSkipOpening.checked, autoSkipTitles.checked);
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
