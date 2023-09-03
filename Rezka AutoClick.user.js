// ==UserScript==
// @name         Rezka AutoClick
// @namespace    http://tampermonkey.net/
// @version      0.2
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
    const videoElement = getElement('video');
    if (videoElement.currentTime > openingTimeStart && (videoElement.currentTime < openingDuration + openingTimeStart)) {
      videoElement.currentTime = openingDuration + openingTimeStart;
    }
  }
  function skipTitles(titlesDuration = 0, titlesTimeStart = 0) {
    titlesDuration = Number(titlesDuration);
    titlesTimeStart = Number(titlesTimeStart);
    const videoElement = getElement('video');
    if(titlesTimeStart > 1){
        if (videoElement.currentTime > titlesTimeStart && videoElement.currentTime < (titlesTimeStart + titlesDuration-1)) {
            videoElement.currentTime = titlesTimeStart + titlesDuration-1;
        }
    }else{
        if (videoElement.currentTime > (videoElement.duration - titlesDuration) && videoElement.currentTime < (videoElement.duration - 5)) {
            videoElement.currentTime = videoElement.duration-0.1;
        }
    }
  }

    function openModal() {
    const modal = document.getElementById("animeSettingsDialog");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("animeSettingsDialog");
    modal.style.display = "none";
}


  // Функция для создания и отображения диалогового окна
function createAnimeSettingsDialog() {
    const dialogHTML = `
        <div id="animeSettingsDialog" class="modal-dialog">
            <div class="modal-content">
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
        </div>
        <div id="modalOverlay" class="modal-overlay"></div>
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
    const modalOverlay = document.getElementById('modalOverlay');

    modalOverlay.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
      dialog.style.display = 'none';
    });

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
      modalOverlay.style.display = 'none';
    });
  }

  // Функция для создания и отображения кнопки для вызова диалогового окна
  function createOpenDialogButton() {
const buttonHTML = `
    <div id="openDialogButton" class="custom-button">
        &#x2699;
    </div>
`;


    const buttonContainer = document.createElement('div');
    buttonContainer.innerHTML = buttonHTML;
    document.body.appendChild(buttonContainer);

    const openButton = document.getElementById('openDialogButton');

    // Обработчик для открытия диалогового окна по клику на кнопку
    openButton.addEventListener('click', () => {
      const modalOverlay = document.getElementById('modalOverlay');
      const dialog = document.getElementById('animeSettingsDialog');
      updateData();
      if(modalOverlay.style.display === 'block'){

      modalOverlay.style.display = 'none';
      dialog.style.display = 'none';
          return
        }

      modalOverlay.style.display = 'block';
      dialog.style.display = 'block';
    });
  }

  function updateData() {
    const openingDurationInput = document.getElementById('openingDuration');
    const openingStartInput = document.getElementById('openingStart');
    const titleDurationInput = document.getElementById('titleDuration');
    const titleStartInput = document.getElementById('titleStart');
    const animeTitleInput = document.getElementById('animeTitleInput');
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


            .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
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

    /* Дополнительный стиль для кнопки закрытия */
    .modal-dialog button.close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #333;
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


  // Создаем и отображаем диалоговое окно и кнопку
  createAnimeSettingsDialog();
  createOpenDialogButton();
})();
