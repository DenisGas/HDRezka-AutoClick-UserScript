// ==UserScript==
// @name         Rezka AutoClick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       DenisGasilo
// @match        https://rezka.ag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rezka.ag
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function () {

  playVideo(getElement('video'))

  const openingDuration = GM_getValue('openingDuration', 0);
  const openingStart = GM_getValue('openingStart', 0);
  const titleDuration = GM_getValue('titleDuration', 0);
  const titleStart = GM_getValue('titleStart', 0);


  setInterval(function () {
    skipOpening(openingDuration, openingStart);
  }, 100);

  setInterval(function () {
    skipTitles(titleDuration, titleStart)
  }, 1000);

  setInterval(function () {
    nextEpisode()
  }, 100);

  function getElement(selector) {
    return document.querySelector(selector);
  }

  function playVideo(videoElement) {
    if (videoElement) {
      videoElement.play();
    }
  }

  function nextEpisode() {
    const nextEpisodeBtn = getElement('.c100.center.p10');
    if (nextEpisodeBtn) {
      nextEpisodeBtn.click();
    }
  }

  function skipOpening(openingDuration = 0, openingTimeStart = 0) {
    openingDuration = Number(openingDuration);
    openingTimeStart = Number(openingTimeStart);
    const videoElement = getElement('video')
    console.log(openingDuration + openingTimeStart);
    if (videoElement.currentTime < openingDuration + openingTimeStart) {
      videoElement.currentTime = openingDuration + openingTimeStart;
    }
  }
  function skipTitles(titlesDuration = 0, titlesTimeStart = 0) {
    titlesDuration = Number(titlesDuration);
    titlesTimeStart = Number(titlesTimeStart);
    const videoElement = getElement('video')
    if (videoElement.currentTime > (videoElement.duration - titlesDuration + titlesTimeStart) && videoElement.currentTime < (videoElement.duration - 5)) {
      videoElement.currentTime = videoElement.duration - 0.1;
    }
  }

  // Функция для создания и отображения диалогового окна
  function createAnimeSettingsDialog() {
    const dialogHTML = `
            <div id="animeSettingsDialog" style="display: none;">
                <h1>Название аниме</h1>
                <input disabled type="text" id="animeTitleInput" value="${GM_getValue('animeTitle', (getElement('.b-post__origtitle').innerText))}">
                <div>
                    <h2>Пропуск опенинга</h2>
                    <label for="openingDuration">Продолжительность опенинга</label>
                    <input type="number" id="openingDuration" value="${GM_getValue('openingDuration', 0)}"> сек
                    <br>
                    <label for="openingStart">Начало опенинга на</label>
                    <input type="number" id="openingStart" value="${GM_getValue('openingStart', 0)}"> сек
                </div>
                <div>
                    <h2>Пропуск титров</h2>
                    <label for="titleDuration">Продолжительность титров</label>
                    <input type="number" id="titleDuration" value="${GM_getValue('titleDuration', 0)}"> сек
                    <br>
                    <label for="titleStart">Начало титров на</label>
                    <input type="number" id="titleStart" value="${GM_getValue('titleStart', 0)}"> сек
                </div>
                <button id="saveSettings">Сохранить</button>
            </div>
        `;

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

    // Установка начальных значений из локального хранилища
    updateData();

    // Обработчик для кнопки "Сохранить"
    saveButton.addEventListener('click', () => {
      GM_setValue('animeTitle', (getElement('.b-post__origtitle').innerText));
      GM_setValue('openingDuration', openingDurationInput.value);
      GM_setValue('openingStart', openingStartInput.value);
      GM_setValue('titleDuration', titleDurationInput.value);
      GM_setValue('titleStart', titleStartInput.value);
      // Закрываем диалоговое окно
      dialog.style.display = 'none';
    });
  }

  // Функция для создания и отображения кнопки для вызова диалогового окна
  function createOpenDialogButton() {
    const buttonHTML = `
            <div id="openDialogButton" style="position: fixed; top: 10px; right: 10px; cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 17h-2v-2h2v2zm0-4h-2v-6h2v6z"/></svg>
            </div>
        `;

    const buttonContainer = document.createElement('div');
    buttonContainer.innerHTML = buttonHTML;
    document.body.appendChild(buttonContainer);

    const openButton = document.getElementById('openDialogButton');

    // Обработчик для открытия диалогового окна по клику на кнопку
    openButton.addEventListener('click', () => {
      const dialog = document.getElementById('animeSettingsDialog');
      updateData();
      dialog.style.display = 'block';
    });
  }

  function updateData() {
    const openingDurationInput = document.getElementById('openingDuration');
    const openingStartInput = document.getElementById('openingStart');
    const titleDurationInput = document.getElementById('titleDuration');
    const titleStartInput = document.getElementById('titleStart');
    animeTitleInput.value = GM_getValue('animeTitle', (getElement('.b-post__origtitle').innerText));
    openingDurationInput.value = GM_getValue('openingDuration', 0);
    openingStartInput.value = GM_getValue('openingStart', 0);
    titleDurationInput.value = GM_getValue('titleDuration', 0);
    titleStartInput.value = GM_getValue('titleStart', 0);
  }

  // Создаем стили для диалогового окна
  GM_addStyle(`
        #animeSettingsDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }

        #animeSettingsDialog input[type="number"] {
            width: 50px;
        }
    `);

  // Создаем и отображаем диалоговое окно и кнопку
  createAnimeSettingsDialog();
  createOpenDialogButton();
})();