(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IndexedDbApi = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SourceService = require('./SourceService');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbName = 'SourceTvDb';
var dbVersion = 2023;
var tableWeek = 'ListTvOnWeek';

var IndexedDbApi = function () {
    function IndexedDbApi() {
        _classCallCheck(this, IndexedDbApi);

        this.initDB();
    }

    _createClass(IndexedDbApi, [{
        key: 'initDB',
        value: function initDB() {
            var _this = this;

            if (!window.indexedDB) {
                window.alert('Ваш браузер не поддерживат стабильную версию IndexedDB. Такие-то функции будут недоступны');
            }
            var request = indexedDB.open(dbName, dbVersion);

            request.onerror = function (event) {
                console.log('onerror,', event);
            };
            // если меняем версию, обновляем все данные 
            request.onupgradeneeded = function (event) {
                var db = event.target.result;
                var sourceService = new _SourceService.SourceService();
                if (db.objectStoreNames.contains(tableWeek)) {
                    db.deleteObjectStore(tableWeek);
                }
                _this._createListTvOnWeek(db, sourceService.getListTvOnWeek());
            };
        }
    }, {
        key: '_createListTvOnWeek',
        value: function _createListTvOnWeek(db, list) {
            var objectStore = db.createObjectStore(tableWeek, { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('id', 'id', { unique: true });
            list.forEach(function (item) {
                objectStore.add(item);
            });
        }
    }, {
        key: 'connectDB',
        value: function connectDB() {
            return new Promise(function (resolve, reject) {
                var request = indexedDB.open(dbName, dbVersion);
                request.onsuccess = function () {
                    resolve(request.result);
                };
                request.onerror = function (e) {
                    reject(e);
                };
            });
        }
    }, {
        key: 'getListTvOnWeek',
        value: function getListTvOnWeek() {
            return this.connectDB().then(function (db) {
                return new Promise(function (resolve, reject) {
                    var trans = db.transaction(tableWeek, "readonly");
                    var request = trans.objectStore(tableWeek);
                    var cursorRequest = request.openCursor();
                    var items = [];
                    trans.oncomplete = function () {
                        resolve(items);
                    };
                    cursorRequest.onerror = function (error) {
                        reject(error);
                    };
                    cursorRequest.onsuccess = function (evt) {
                        var cursor = evt.target.result;
                        if (cursor) {
                            items.push(cursor.value);
                            cursor.continue();
                        }
                    };
                });
            });
        }
    }, {
        key: 'deleteDb',
        value: function deleteDb() {
            var req = indexedDB.deleteDatabase(dbName);
            req.onsuccess = function () {
                console.log('Deleted database successfully');
            };
            req.onerror = function () {
                console.log('Could not delete database');
            };
            req.onblocked = function () {
                console.log('Couldn not delete database due to the operation being blocked');
            };
        }
    }]);

    return IndexedDbApi;
}();

exports.IndexedDbApi = IndexedDbApi;

},{"./SourceService":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SourceService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TypeChannel = require('./TypeChannel');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var description = 'Олег Марков, гениальный хирург, собирается покончить с жизнью. От отчаянного поступка его спасает звонок с работы. На кону жизнь 10-летнего мальчишки. Олег спасает ребенка. Мальчишка напоминает ему о молодости, упущенных возможностях. Когда-то мир был наполнен смыслом. Он играл на гитаре, любил. В студенческие годы в него была влюблена смешная девчонка Марта. Спустя 10 лет Марта перевернет его мир. И уже он - Олег будет готов бросить к ее ногам весь мир. Откажется от семьи. Только вот роковая авария навсегда разлучит их, и Марта исчезнет из его жизни, но не из сердца. И вот сейчас возле кровати спасенного мальчишки сидит она - Марта...';

var rus24Items = [{
    time: '01:05',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Бедная Liz'
}, {
    time: '03:20',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Космический камикадзе. Угол атаки Георгия Берегового'
}, {
    time: '04:40',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Двое в пути'
}, {
    time: '05:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.music],
    title: 'Утро России'
}, {
    time: '09:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.music],
    title: 'Вести'
}, {
    time: '09:15',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.music],
    title: 'Утро России'
}, {
    time: '09:55',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.music],
    title: 'О самом главном'
}, {
    time: '11:55',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.music],
    title: 'Местное время. Вести-Москва'
}, {
    time: '11:55',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.music],
    title: 'Тайны следствия-10. Кровь за кровь'
}, {
    time: '14:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.series],
    title: 'Вести'
}, {
    time: '14:30',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.series],
    title: 'Местное время. Вести-Москва'
}, {
    time: '14:50',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.series],
    title: 'Вести. Дежурная часть'
}, {
    time: '15:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.series],
    title: 'Без следа. 17-я серия'
}, {
    time: '16:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.series],
    title: 'Без следа. 18-я серия'
}, {
    time: '17:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Вести'
}, {
    time: '17:30',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Местное время. Вести-Москва'
}, {
    time: '17:50',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Вести'
}, {
    time: '18:15',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Прямой эфир'
}, {
    time: '19:35',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Местное время. Вести-Москва'
}, {
    time: '20:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Вести'
}, {
    time: '21:00',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: 'Юморина'
}, {
    time: '22:30',
    category: '8+',
    img: 'http://avatars.mds.yandex.net/get-tv-shows/69404/2a0000015264f2dd900068865ca3afe0837d/large',
    description: description,
    types: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    title: '"Сны о любви". Юбилейный концерт Аллы Пугачевой'
}].map(function (item, i) {
    item.id = i;
    return item;
});
var listTVOneDay = [{
    id: 1,
    img: './images/russia24.png',
    name: 'Россия 24',
    urlOnline: 'http://player.vgtrk.com/iframe/live/id/21/start_zoom/true/showZoomBtn/true/isPlay/false/',
    programs: rus24Items
}, {
    id: 3,
    img: './images/ch-logo-1.png',
    name: '1 Первый',
    type: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.documental],
    urlOnline: 'http://player.vgtrk.com/iframe/live/id/2961/showZoomBtn/false/isPlay/false/',
    programs: rus24Items
}, {
    id: 4,
    img: './images/planetaRTR.png',
    name: 'РТР-Планета',
    type: [_TypeChannel.TYPE_CHANNEL.documental],
    urlOnline: 'http://player.vgtrk.com/iframe/live/id/4941/showZoomBtn/false/isPlay/false/',
    programs: rus24Items
}, {
    id: 5,
    img: './images/moscow24.png',
    name: 'Москва 24',
    type: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.HD],
    urlOnline: 'http://player.vgtrk.com/iframe/live/id/1661/showZoomBtn/false/isPlay/false/',
    programs: rus24Items
}, {
    id: 6,
    img: './images/russiaK.png',
    name: 'Россия К',
    type: [_TypeChannel.TYPE_CHANNEL.documental, _TypeChannel.TYPE_CHANNEL.HD],
    urlOnline: 'http://player.vgtrk.com/iframe/live/id/19201/showZoomBtn/false/isPlay/false/',
    programs: rus24Items
}, {
    id: 7,
    img: './images/match-tv.png',
    name: 'МАТЧ ТВ',
    type: [_TypeChannel.TYPE_CHANNEL.sport, _TypeChannel.TYPE_CHANNEL.HD],
    urlOnline: 'http://rutube.ru/play/embed/8461207',
    programs: rus24Items
}];
var listTVWeek = [{ id: 1, channels: listTVOneDay }, { id: 2, channels: listTVOneDay }, { id: 3, channels: listTVOneDay }, { id: 4, channels: listTVOneDay }, { id: 5, channels: listTVOneDay }, { id: 6, channels: listTVOneDay }, { id: 7, channels: listTVOneDay }];

var SourceService = function () {
    function SourceService() {
        _classCallCheck(this, SourceService);
    }

    _createClass(SourceService, [{
        key: 'getTypeChannel',
        value: function getTypeChannel() {
            return _TypeChannel.TYPE_CHANNEL;
        }
    }, {
        key: 'getListTvOnWeek',
        value: function getListTvOnWeek() {
            return listTVWeek;
        }
    }]);

    return SourceService;
}();

exports.SourceService = SourceService;

},{"./TypeChannel":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var TYPE_CHANNEL = exports.TYPE_CHANNEL = {
    'default': 0,
    sport: 1,
    mult: 2,
    music: 3,
    HD: 4,
    series: 5,
    documental: 6
};

},{}],4:[function(require,module,exports){
'use strict';

var _IndexedDbApi = require('./IndexedDbApi');

var _TypeChannel = require('./TypeChannel');

/// update/init grid
function updateGridItems(data, type) {
    var gridTv = document.getElementById('tv-grid');
    var docFragment = document.createDocumentFragment();
    var newElement = document.createElement('div');
    newElement.className = 'all-day';

    docFragment.appendChild(newElement);
    var gridElement = updateRenderElement(data, 0, docFragment, 'div', renderDay);
    data.forEach(function (day, kDay) {
        var dayElement = updateRenderElement(day.channels, kDay, gridElement, '.tv-channel__items', renderChannel);
        day.channels.forEach(function (channel, kChannel) {
            var filterCb = type === 0 ? getSortByTimeProgram : getSortByTypeProgram;
            updateRenderElement(filterCb(channel.programs, type), kChannel, dayElement, '.channel-program__items', renderProgram);
        });
    });
    gridTv.appendChild(docFragment);
}

/// create popup

var popupElement;
function mouseEnter(e) {
    if (popupElement) {
        if (!e.target.closest('.tv-popup')) {
            popupElement.remove();
        } else {
            return;
        }
    }
    var dayId = parseInt(this.closest('.tv-day').dataset.dayid);
    var channelId = parseInt(this.closest('.tv-channel__item').dataset.channelid);
    var programId = parseInt(this.closest('.tv-program__item').dataset.programid);
    var day = listTVWeek.find(function (item) {
        return item.id === dayId;
    });
    var channel = day.channels.find(function (item) {
        return item.id === channelId;
    });
    var program = channel.programs.find(function (item) {
        return item.id === programId;
    });

    popupElement = document.createElement('div');
    popupElement.id = 'popup';
    popupElement.className = 'popup';
    popupElement.innerHTML = renderPopup(channel);
    var programElement = popupElement.querySelector('.tv-popup-program');
    programElement.innerHTML = renderPopupProgram(program);
    this.appendChild(popupElement);
}
// sort start

function getSortByTimeProgram(programs) {
    var date = new Date(),
        nowHours = date.getHours(),
        countProgram = 4,
        resultProgram = [],
        oldProgram = programs[0];

    programs.every(function (program) {
        var programHours = parseInt(program.time.slice(0, 2));
        if (nowHours < programHours) {
            if (resultProgram.length === 0) {
                program.isNow = true;
            }
            resultProgram.push(program);
            return resultProgram.length === countProgram ? false : true;
        } else {
            oldProgram = program;
            return true;
        }
    });
    //докидываем программы с начала дня
    var remainderCount = countProgram - resultProgram.length;
    for (var i = 0; i < remainderCount; i++) {
        resultProgram.push(programs[i]);
    }
    return resultProgram;
}

function getSortByTypeProgram(programms, type) {
    var newProgramms = [];
    programms.forEach(function (program) {
        var isFind = program.types.find(function (t) {
            return t === type;
        });
        if (isFind) {
            newProgramms.push(program);
        }
    });
    return newProgramms;
}
// sort end
/// events start

function dayChange(e) {
    e.preventDefault();
    var dayContainer = this.closest('.filter-day__change-btn');
    addClassActive.bind(this, '.filter-day__change-btn')();
    var id = parseInt(dayContainer.dataset.id);
    var day = listTVWeek.find(function (item) {
        return item.id === id;
    });
    var gridTv = document.getElementById('tv-grid');
    var allElem = gridTv.querySelector('.all-day');
    gridTv.removeChild(allElem);
    var selectElm = document.querySelector('.filter-type__select');
    updateGridItems([day], _TypeChannel.TYPE_CHANNEL[selectElm.value]);
    addPopup();
}

function addPopup() {
    delegate(document.querySelectorAll('.channel-program__items'), '.tv-program__item', 'mouseover', mouseEnter);
}

function filterType(type) {
    var gridTv = document.getElementById('tv-grid');
    var allElementProgramm = gridTv.querySelectorAll('.tv-day');
    var programItems = gridTv.querySelectorAll('.channel-program__items');
    [].forEach.call(programItems, function (p) {
        while (p.firstChild) {
            p.removeChild(p.firstChild);
        }
    });
    [].forEach.call(allElementProgramm, function (dayItem) {
        var dayId = parseInt(dayItem.dataset.dayid);
        var filterCb = type === 0 ? getSortByTimeProgram : getSortByTypeProgram;
        var day = listTVWeek.find(function (item) {
            return item.id === dayId;
        });
        day.channels.forEach(function (channel, kChannel) {
            updateRenderElement(filterCb(channel.programs, type), kChannel, dayItem, '.channel-program__items', renderProgram);
        });
    });
}

function mouseEnterGlobal(e) {
    if (popupElement) {
        if (!e.target.closest('.tv-popup') && !e.target.closest('.tv-program__item')) {
            popupElement.remove();
        } else {
            return;
        }
    }
}
function typeChange(e) {
    var type = _TypeChannel.TYPE_CHANNEL[e.target.value];
    if (type !== null) {
        filterType(type);
    }
}
/// events end

/// init filters

function initFilter() {
    var itemsHtml = '';
    for (var key in _TypeChannel.TYPE_CHANNEL) {
        if (_TypeChannel.TYPE_CHANNEL.hasOwnProperty(key)) {
            itemsHtml += renderOptionFilter(key, getTypeName(_TypeChannel.TYPE_CHANNEL[key]));
        }
    }
    [].forEach.call(document.querySelectorAll('.filter-type__select'), function (container) {
        container.innerHTML = itemsHtml;
    });
}
function initFilterDay() {
    var itemsHtml = '';
    listTVWeek.forEach(function (day) {
        itemsHtml += renderButtonFilter(day.id);
    });

    [].forEach.call(document.querySelectorAll('.filter-day'), function (container) {
        container.innerHTML = itemsHtml;
    });
}
/// function helper start 

function addClassActive(selector) {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
    }this.classList.add('active');
}

function updateRenderElement(data, keySelector, element, className, renderCb) {
    var itemsHtml = data.map(renderCb).join('');
    var eml = element.querySelectorAll(className)[keySelector];
    eml.innerHTML = itemsHtml;
    return eml;
}

function delegate(containers, selector, event, handler) {
    [].forEach.call(containers, function (container) {
        container.addEventListener(event, function (e) {
            if (e.target.closest(selector)) {
                handler.apply(e.target, arguments);
            }
        });
    });
}

/// function helper end

/// view help start
function getTypeName(type) {
    var name = '';
    switch (type) {
        case _TypeChannel.TYPE_CHANNEL.default:
            name = 'Не выбрано';
            break;
        case _TypeChannel.TYPE_CHANNEL.HD:
            name = 'HD';
            break;
        case _TypeChannel.TYPE_CHANNEL.documental:
            name = 'Документальный';
            break;
        case _TypeChannel.TYPE_CHANNEL.mult:
            name = 'Мультфильм';
            break;
        case _TypeChannel.TYPE_CHANNEL.music:
            name = 'Музыка';
            break;
        case _TypeChannel.TYPE_CHANNEL.series:
            name = 'Сериал';
            break;
        case _TypeChannel.TYPE_CHANNEL.sport:
            name = 'Спорт';
            break;
    }
    return name;
}
function getDayWeekName(type) {
    var result = {
        name: '',
        fullName: ''
    };
    switch (type) {
        case 1:
            result.name = 'Пн';
            result.fullName = 'Понедельник';
            break;
        case 2:
            result.name = 'Вт';
            result.fullName = 'Вторник';
            break;
        case 3:
            result.name = 'Ср';
            result.fullName = 'Среда';
            break;
        case 4:
            result.name = 'Чт';
            result.fullName = 'Четверг';
            break;
        case 5:
            result.name = 'Пт';
            result.fullName = 'Пятница';
            break;
        case 6:
            result.name = 'Сб';
            result.fullName = 'Суббота';
            break;
        case 7:
            result.name = 'Вс';
            result.fullName = 'Воскресенье';
            break;
    }
    return result;
}

function getTypeProgram(types) {
    var itemsHtml = types.map(function (type) {
        var resultHtml = '';
        resultHtml = renderType(getTypeName(type));
        return resultHtml;
    }).join('');
    return itemsHtml;
}
/// view help end

/// render html start
function renderType(name) {
    return '<span class="tag-type">' + name + '</span>';
}

function renderDay(item, key) {
    return '\n        <div class="tv-day"\n            data-dayid=\'' + JSON.stringify(item.id) + '\'>\n            <h2 class ="tv-channel__header">' + getDayWeekName(item.id).fullName + '</h2>\n            <div class="tv-channel__items"></div>\n        </div>\n    ';
}
function renderChannel(item) {
    return '\n        <div class="tv-channel__item"\n            data-channelid=\'' + JSON.stringify(item.id) + '\'>\n            <div class="tv-channel-item">\n                <div class="tv-channel-item__header">\n                    <div class="tv-channel__left tv-channel-item__logo">\n                        <img src="' + item.img + '">\n                    </div>\n                    <div class="tv-channel__right tv-channel-item__name">\n                        <span>' + item.name + '</span>\n                    </div>\n                </div>\n                <div class ="tv-channel-item__body channel-program__items"></div>\n            </div>\n        </div>\n    ';
}
function renderProgram(item) {
    return '\n        <div class="tv-program__item"\n            data-programid=\'' + JSON.stringify(item.id) + '\'>\n            <span class="tv-channel__left tv-program__time">' + item.time + '</span>\n            <span class="tv-channel__right tv-program__title">' + item.title + '</span>\n            ' + (item.isNow ? '<span class ="tv-program__now">(транслируется)</span>' : '') + '\n        </div>\n    ';
}
function renderPopup(item) {
    return '\n        <div class ="tv-popup">\n            <div class ="tv-popup-channel-item">\n                <div class ="tv-popup-channel-item__header">\n                    <iframe src="' + item.urlOnline + '"\n                                    scrolling="No"\n                                    border="0"\n                                    frameborder="0"\n                                    mozallowfullscreen=""\n                                    webkitallowfullscreen=""\n                                    allowfullscreen=""></iframe>\n                </div>\n                <div class ="tv-popup-program"></div>\n            </div>\n        </div>\n    ';
}
function renderPopupProgram(item) {
    return '\n         <div class ="tv-popup-program__item">\n            <div class ="tv-popup-program__header-img">\n            </div>\n            <div class ="tv-popup-program__header-text">\n                <span class ="tv-popup-program__time">' + item.time + '</span>\n                <span class ="tv-popup-program-body__category">' + item.category + '</span>\n\n                <span class ="tv-popup-program__now">' + (item.isNow ? '<span class ="tv-program__now">(транслируется)</span>' : '') + '</span>\n                <h4 class ="tv-popup-program__title">' + item.title + '</h4>\n            </div>\n            <div class ="tv-popup-program__body">\n                <div class ="tv-popup-program-body__description">' + item.description + '</div>\n            </div>\n            <div class ="tv-popup-program__footer">\n                <span>' + getTypeProgram(item.types) + '</span>\n            </div>\n        </div>\n    ';
}

function renderOptionFilter(item, name) {
    return '<option class="filter-type__option" value=\'' + item + '\'>' + name + '</option>';
}
function renderButtonFilter(key) {
    return '<button class=\'filter-day__change-btn btn\' title=\'' + getDayWeekName(key).fullName + '\'  data-id=' + key + '>' + getDayWeekName(key).name + '</button>';
}
/// render html end

/// init app
var listTVWeek = [];
var indexedDb = void 0;
document.addEventListener('DOMContentLoaded', function () {
    indexedDb = new _IndexedDbApi.IndexedDbApi();
    indexedDb.getListTvOnWeek().then(function (items) {
        listTVWeek = items;
        initApp();
    });
});

function initApp() {
    updateGridItems(listTVWeek, 0);
    addPopup();
    initFilter();
    initFilterDay();
    delegate(document.querySelectorAll('#tv-grid'), '.tv-day', 'mouseover', mouseEnterGlobal);
    delegate(document.querySelectorAll('.filter-day'), '.filter-day__change-btn', 'click', dayChange);

    delegate(document.querySelectorAll('.filter-type'), '.filter-category', 'change', typeChange);
    delegate(document.querySelectorAll('.nav'), '.btn-remove-db', 'click', indexedDb.deleteDb);
}
(function (e) {
    e.closest = e.closest || function (css) {
        var node = this;

        while (node) {
            if (node.matches(css)) return node;else node = node.parentElement;
        }
        return null;
    };
})(Element.prototype);
(function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        var element = this;

        while (element) {
            if (element.matches(selector)) {
                break;
            }

            element = element.parentElement;
        }

        return element;
    };
})(Element.prototype);
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

},{"./IndexedDbApi":1,"./TypeChannel":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQtc3JjXFxqc1xcSW5kZXhlZERiQXBpLmpzIiwiY2xpZW50LXNyY1xcanNcXFNvdXJjZVNlcnZpY2UuanMiLCJjbGllbnQtc3JjXFxqc1xcVHlwZUNoYW5uZWwuanMiLCJjbGllbnQtc3JjXFxqc1xcdGFibGUtdHYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNBQzs7OztBQUNELElBQU0sU0FBUyxZQUFmO0FBQ0EsSUFBTSxZQUFZLElBQWxCO0FBQ0EsSUFBTSxZQUFZLGNBQWxCOztJQUNNLFk7QUFDRiw0QkFBYztBQUFBOztBQUNWLGFBQUssTUFBTDtBQUNIOzs7O2lDQUNRO0FBQUE7O0FBQ0wsZ0JBQUksQ0FBQyxPQUFPLFNBQVosRUFBdUI7QUFDbkIsdUJBQU8sS0FBUCxDQUFhLDJGQUFiO0FBQ0g7QUFDRCxnQkFBTSxVQUFVLFVBQVUsSUFBVixDQUFlLE1BQWYsRUFBdUIsU0FBdkIsQ0FBaEI7O0FBRUEsb0JBQVEsT0FBUixHQUFrQixVQUFVLEtBQVYsRUFBaUI7QUFDL0Isd0JBQVEsR0FBUixDQUFZLFVBQVosRUFBd0IsS0FBeEI7QUFDSCxhQUZEO0FBR0E7QUFDQSxvQkFBUSxlQUFSLEdBQTBCLFVBQUMsS0FBRCxFQUFXO0FBQ2pDLG9CQUFJLEtBQUssTUFBTSxNQUFOLENBQWEsTUFBdEI7QUFDQSxvQkFBTSxnQkFBZ0Isa0NBQXRCO0FBQ0Esb0JBQUksR0FBRyxnQkFBSCxDQUFvQixRQUFwQixDQUE2QixTQUE3QixDQUFKLEVBQTZDO0FBQ3pDLHVCQUFHLGlCQUFILENBQXFCLFNBQXJCO0FBQ0g7QUFDRCxzQkFBSyxtQkFBTCxDQUF5QixFQUF6QixFQUE2QixjQUFjLGVBQWQsRUFBN0I7QUFDSCxhQVBEO0FBUUg7Ozs0Q0FDbUIsRSxFQUFJLEksRUFBTTtBQUMxQixnQkFBTSxjQUFjLEdB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S0FKRDtBQUtIO0FBQ0QsSUFBSSxDQUFDLE1BQU0sU0FBTixDQUFnQixJQUFyQixFQUEyQjtBQUN2QixVQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsR0FBdUIsVUFBVSxTQUFWLEVBQXFCO0FBQ3hDLFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2Qsa0JBQU0sSUFBSSxTQUFKLENBQWMsa0RBQWQsQ0FBTjtBQUNIO0FBQ0QsWUFBSSxPQUFPLFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDakMsa0JBQU0sSUFBSSxTQUFKLENBQWMsOEJBQWQsQ0FBTjtBQUNIO0FBQ0QsWUFBSSxPQUFPLE9BQU8sSUFBUCxDQUFYO0FBQ0EsWUFBSSxTQUFTLEtBQUssTUFBTCxLQUFnQixDQUE3QjtBQUNBLFlBQUksVUFBVSxVQUFVLENBQVYsQ0FBZDtBQUNBLFlBQUksS0FBSjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDN0Isb0JBQVEsS0FBSyxDQUFMLENBQVI7QUFDQSxnQkFBSSxVQUFVLElBQVYsQ0FBZSxPQUFmLEVBQXdCLEtBQXhCLEVBQStCLENBQS9CLEVBQWtDLElBQWxDLENBQUosRUFBNkM7QUFDekMsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7QUFDRCxlQUFPLFNBQVA7QUFDSCxLQW5CRDtBQW9CSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79pbXBvcnQge1NvdXJjZVNlcnZpY2V9IGZyb20gJy4vU291cmNlU2VydmljZSc7XHJcbmNvbnN0IGRiTmFtZSA9ICdTb3VyY2VUdkRiJztcclxuY29uc3QgZGJWZXJzaW9uID0gMjAyMztcclxuY29uc3QgdGFibGVXZWVrID0gJ0xpc3RUdk9uV2Vlayc7XHJcbmNsYXNzIEluZGV4ZWREYkFwaSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXREQigpO1xyXG4gICAgfVxyXG4gICAgaW5pdERCKCkge1xyXG4gICAgICAgIGlmICghd2luZG93LmluZGV4ZWREQikge1xyXG4gICAgICAgICAgICB3aW5kb3cuYWxlcnQoJ9CS0LDRiCDQsdGA0LDRg9C30LXRgCDQvdC1INC/0L7QtNC00LXRgNC20LjQstCw0YIg0YHRgtCw0LHQuNC70YzQvdGD0Y4g0LLQtdGA0YHQuNGOIEluZGV4ZWREQi4g0KLQsNC60LjQtS3RgtC+INGE0YPQvdC60YbQuNC4INCx0YPQtNGD0YIg0L3QtdC00L7RgdGC0YPQv9C90YsnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgZGJWZXJzaW9uKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvbmVycm9yLCcsIGV2ZW50KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vINC10YHQu9C4INC80LXQvdGP0LXQvCDQstC10YDRgdC40Y4sINC+0LHQvdC+0LLQu9GP0LXQvCDQstGB0LUg0LTQsNC90L3Ri9C1IFxyXG4gICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBkYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVNlcnZpY2UgPSBuZXcgU291cmNlU2VydmljZSgpO1xyXG4gICAgICAgICAgICBpZiAoZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyh0YWJsZVdlZWspKSB7XHJcbiAgICAgICAgICAgICAgICBkYi5kZWxldGVPYmplY3RTdG9yZSh0YWJsZVdlZWspO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUxpc3RUdk9uV2VlayhkYiwgc291cmNlU2VydmljZS5nZXRMaXN0VHZPbldlZWsoKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIF9jcmVhdGVMaXN0VHZPbldlZWsoZGIsIGxpc3QpIHtcclxuICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKHRhYmxlV2VlaywgeyBrZXlQYXRoOiAnaWQnLCBhdXRvSW5jcmVtZW50OiB0cnVlICB9KTtcclxuICAgICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleCgnaWQnLCAnaWQnLCB7IHVuaXF1ZTogdHJ1ZSB9KTtcclxuICAgICAgICBsaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgb2JqZWN0U3RvcmUuYWRkKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3REQigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgZGJWZXJzaW9uKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldExpc3RUdk9uV2VlaygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0REIoKS50aGVuKChkYikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnMgPSBkYi50cmFuc2FjdGlvbih0YWJsZVdlZWssIFwicmVhZG9ubHlcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gdHJhbnMub2JqZWN0U3RvcmUodGFibGVXZWVrKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnNvclJlcXVlc3QgPSByZXF1ZXN0Lm9wZW5DdXJzb3IoKTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdHJhbnMub25jb21wbGV0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGl0ZW1zKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjdXJzb3JSZXF1ZXN0Lm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGN1cnNvclJlcXVlc3Qub25zdWNjZXNzID0gKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJzb3IgPSBldnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3Vyc29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goY3Vyc29yLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9ICAgXHJcbiAgICBkZWxldGVEYigpIHtcclxuICAgICAgICBjb25zdCByZXEgPSBpbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoZGJOYW1lKTtcclxuICAgICAgICByZXEub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRGVsZXRlZCBkYXRhYmFzZSBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGRlbGV0ZSBkYXRhYmFzZScpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVxLm9uYmxvY2tlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkbiBub3QgZGVsZXRlIGRhdGFiYXNlIGR1ZSB0byB0aGUgb3BlcmF0aW9uIGJlaW5nIGJsb2NrZWQnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQge0luZGV4ZWREYkFwaX0iLCLvu79pbXBvcnQge1RZUEVfQ0hBTk5FTCB9IGZyb20gJy4vVHlwZUNoYW5uZWwnO1xyXG5cclxuY29uc3QgZGVzY3JpcHRpb24gPSAn0J7Qu9C10LMg0JzQsNGA0LrQvtCyLCDQs9C10L3QuNCw0LvRjNC90YvQuSDRhdC40YDRg9GA0LMsINGB0L7QsdC40YDQsNC10YLRgdGPINC/0L7QutC+0L3Rh9C40YLRjCDRgSDQttC40LfQvdGM0Y4uINCe0YIg0L7RgtGH0LDRj9C90L3QvtCz0L4g0L/QvtGB0YLRg9C/0LrQsCDQtdCz0L4g0YHQv9Cw0YHQsNC10YIg0LfQstC+0L3QvtC6INGBINGA0LDQsdC+0YLRiy4g0J3QsCDQutC+0L3RgyDQttC40LfQvdGMIDEwLdC70LXRgtC90LXQs9C+INC80LDQu9GM0YfQuNGI0LrQuC4g0J7Qu9C10LMg0YHQv9Cw0YHQsNC10YIg0YDQtdCx0LXQvdC60LAuINCc0LDQu9GM0YfQuNGI0LrQsCDQvdCw0L/QvtC80LjQvdCw0LXRgiDQtdC80YMg0L4g0LzQvtC70L7QtNC+0YHRgtC4LCDRg9C/0YPRidC10L3QvdGL0YUg0LLQvtC30LzQvtC20L3QvtGB0YLRj9GFLiDQmtC+0LPQtNCwLdGC0L4g0LzQuNGAINCx0YvQuyDQvdCw0L/QvtC70L3QtdC9INGB0LzRi9GB0LvQvtC8LiDQntC9INC40LPRgNCw0Lsg0L3QsCDQs9C40YLQsNGA0LUsINC70Y7QsdC40LsuINCSINGB0YLRg9C00LXQvdGH0LXRgdC60LjQtSDQs9C+0LTRiyDQsiDQvdC10LPQviDQsdGL0LvQsCDQstC70Y7QsdC70LXQvdCwINGB0LzQtdGI0L3QsNGPINC00LXQstGH0L7QvdC60LAg0JzQsNGA0YLQsC4g0KHQv9GD0YHRgtGPIDEwINC70LXRgiDQnNCw0YDRgtCwINC/0LXRgNC10LLQtdGA0L3QtdGCINC10LPQviDQvNC40YAuINCYINGD0LbQtSDQvtC9IC0g0J7Qu9C10LMg0LHRg9C00LXRgiDQs9C+0YLQvtCyINCx0YDQvtGB0LjRgtGMINC6INC10LUg0L3QvtCz0LDQvCDQstC10YHRjCDQvNC40YAuINCe0YLQutCw0LbQtdGC0YHRjyDQvtGCINGB0LXQvNGM0LguINCi0L7Qu9GM0LrQviDQstC+0YIg0YDQvtC60L7QstCw0Y8g0LDQstCw0YDQuNGPINC90LDQstGB0LXQs9C00LAg0YDQsNC30LvRg9GH0LjRgiDQuNGFLCDQuCDQnNCw0YDRgtCwINC40YHRh9C10LfQvdC10YIg0LjQtyDQtdCz0L4g0LbQuNC30L3QuCwg0L3QviDQvdC1INC40Lcg0YHQtdGA0LTRhtCwLiDQmCDQstC+0YIg0YHQtdC50YfQsNGBINCy0L7Qt9C70LUg0LrRgNC+0LLQsNGC0Lgg0YHQv9Cw0YHQtdC90L3QvtCz0L4g0LzQsNC70YzRh9C40YjQutC4INGB0LjQtNC40YIg0L7QvdCwIC0g0JzQsNGA0YLQsC4uLic7XHJcblxyXG5jb25zdCBydXMyNEl0ZW1zID0gW1xyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcwMTowNScsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbCwgVFlQRV9DSEFOTkVMLkhEXSxcclxuICAgICAgICB0aXRsZTogJ9CR0LXQtNC90LDRjyBMaXonXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcwMzoyMCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbCwgVFlQRV9DSEFOTkVMLkhEXSxcclxuICAgICAgICB0aXRsZTogJ9Ca0L7RgdC80LjRh9C10YHQutC40Lkg0LrQsNC80LjQutCw0LTQt9C1LiDQo9Cz0L7QuyDQsNGC0LDQutC4INCT0LXQvtGA0LPQuNGPINCR0LXRgNC10LPQvtCy0L7Qs9C+J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aW1lOiAnMDQ6NDAnLFxyXG4gICAgICAgIGNhdGVnb3J5OiAnOCsnLFxyXG4gICAgICAgIGltZzogJ2h0dHA6Ly9hdmF0YXJzLm1kcy55YW5kZXgubmV0L2dldC10di1zaG93cy82OTQwNC8yYTAwMDAwMTUyNjRmMmRkOTAwMDY4ODY1Y2EzYWZlMDgzN2QvbGFyZ2UnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcclxuICAgICAgICB0eXBlczogW1RZUEVfQ0hBTk5FTC5zcG9ydCwgVFlQRV9DSEFOTkVMLmRvY3VtZW50YWwsIFRZUEVfQ0hBTk5FTC5IRF0sXHJcbiAgICAgICAgdGl0bGU6ICfQlNCy0L7QtSDQsiDQv9GD0YLQuCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGltZTogJzA1OjAwJyxcclxuICAgICAgICBjYXRlZ29yeTogJzgrJyxcclxuICAgICAgICBpbWc6ICdodHRwOi8vYXZhdGFycy5tZHMueWFuZGV4Lm5ldC9nZXQtdHYtc2hvd3MvNjk0MDQvMmEwMDAwMDE1MjY0ZjJkZDkwMDA2ODg2NWNhM2FmZTA4MzdkL2xhcmdlJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdHlwZXM6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5tdXNpY10sXHJcbiAgICAgICAgdGl0bGU6ICfQo9GC0YDQviDQoNC+0YHRgdC40LgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcwOTowMCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwubXVzaWNdLFxyXG4gICAgICAgIHRpdGxlOiAn0JLQtdGB0YLQuCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGltZTogJzA5OjE1JyxcclxuICAgICAgICBjYXRlZ29yeTogJzgrJyxcclxuICAgICAgICBpbWc6ICdodHRwOi8vYXZhdGFycy5tZHMueWFuZGV4Lm5ldC9nZXQtdHYtc2hvd3MvNjk0MDQvMmEwMDAwMDE1MjY0ZjJkZDkwMDA2ODg2NWNhM2FmZTA4MzdkL2xhcmdlJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdHlwZXM6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5tdXNpY10sXHJcbiAgICAgICAgdGl0bGU6ICfQo9GC0YDQviDQoNC+0YHRgdC40LgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcwOTo1NScsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwubXVzaWNdLFxyXG4gICAgICAgIHRpdGxlOiAn0J4g0YHQsNC80L7QvCDQs9C70LDQstC90L7QvCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGltZTogJzExOjU1JyxcclxuICAgICAgICBjYXRlZ29yeTogJzgrJyxcclxuICAgICAgICBpbWc6ICdodHRwOi8vYXZhdGFycy5tZHMueWFuZGV4Lm5ldC9nZXQtdHYtc2hvd3MvNjk0MDQvMmEwMDAwMDE1MjY0ZjJkZDkwMDA2ODg2NWNhM2FmZTA4MzdkL2xhcmdlJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdHlwZXM6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5tdXNpY10sXHJcbiAgICAgICAgdGl0bGU6ICfQnNC10YHRgtC90L7QtSDQstGA0LXQvNGPLiDQktC10YHRgtC4LdCc0L7RgdC60LLQsCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGltZTogJzExOjU1JyxcclxuICAgICAgICBjYXRlZ29yeTogJzgrJyxcclxuICAgICAgICBpbWc6ICdodHRwOi8vYXZhdGFycy5tZHMueWFuZGV4Lm5ldC9nZXQtdHYtc2hvd3MvNjk0MDQvMmEwMDAwMDE1MjY0ZjJkZDkwMDA2ODg2NWNhM2FmZTA4MzdkL2xhcmdlJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdHlwZXM6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5tdXNpY10sXHJcbiAgICAgICAgdGl0bGU6ICfQotCw0LnQvdGLINGB0LvQtdC00YHRgtCy0LjRjy0xMC4g0JrRgNC+0LLRjCDQt9CwINC60YDQvtCy0YwnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcxNDowMCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuc2VyaWVzXSxcclxuICAgICAgICB0aXRsZTogJ9CS0LXRgdGC0LgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcxNDozMCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuc2VyaWVzXSxcclxuICAgICAgICB0aXRsZTogJ9Cc0LXRgdGC0L3QvtC1INCy0YDQtdC80Y8uINCS0LXRgdGC0Lgt0JzQvtGB0LrQstCwJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aW1lOiAnMTQ6NTAnLFxyXG4gICAgICAgIGNhdGVnb3J5OiAnOCsnLFxyXG4gICAgICAgIGltZzogJ2h0dHA6Ly9hdmF0YXJzLm1kcy55YW5kZXgubmV0L2dldC10di1zaG93cy82OTQwNC8yYTAwMDAwMTUyNjRmMmRkOTAwMDY4ODY1Y2EzYWZlMDgzN2QvbGFyZ2UnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcclxuICAgICAgICB0eXBlczogW1RZUEVfQ0hBTk5FTC5zcG9ydCwgVFlQRV9DSEFOTkVMLnNlcmllc10sXHJcbiAgICAgICAgdGl0bGU6ICfQktC10YHRgtC4LiDQlNC10LbRg9GA0L3QsNGPINGH0LDRgdGC0YwnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcxNTowMCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuc2VyaWVzXSxcclxuICAgICAgICB0aXRsZTogJ9CR0LXQtyDRgdC70LXQtNCwLiAxNy3RjyDRgdC10YDQuNGPJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aW1lOiAnMTY6MDAnLFxyXG4gICAgICAgIGNhdGVnb3J5OiAnOCsnLFxyXG4gICAgICAgIGltZzogJ2h0dHA6Ly9hdmF0YXJzLm1kcy55YW5kZXgubmV0L2dldC10di1zaG93cy82OTQwNC8yYTAwMDAwMTUyNjRmMmRkOTAwMDY4ODY1Y2EzYWZlMDgzN2QvbGFyZ2UnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcclxuICAgICAgICB0eXBlczogW1RZUEVfQ0hBTk5FTC5zcG9ydCwgVFlQRV9DSEFOTkVMLnNlcmllc10sXHJcbiAgICAgICAgdGl0bGU6ICfQkdC10Lcg0YHQu9C10LTQsC4gMTgt0Y8g0YHQtdGA0LjRjydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGltZTogJzE3OjAwJyxcclxuICAgICAgICBjYXRlZ29yeTogJzgrJyxcclxuICAgICAgICBpbWc6ICdodHRwOi8vYXZhdGFycy5tZHMueWFuZGV4Lm5ldC9nZXQtdHYtc2hvd3MvNjk0MDQvMmEwMDAwMDE1MjY0ZjJkZDkwMDA2ODg2NWNhM2FmZTA4MzdkL2xhcmdlJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdHlwZXM6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5kb2N1bWVudGFsLCBUWVBFX0NIQU5ORUwuSERdLFxyXG4gICAgICAgIHRpdGxlOiAn0JLQtdGB0YLQuCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGltZTogJzE3OjMwJyxcclxuICAgICAgICBjYXRlZ29yeTogJzgrJyxcclxuICAgICAgICBpbWc6ICdodHRwOi8vYXZhdGFycy5tZHMueWFuZGV4Lm5ldC9nZXQtdHYtc2hvd3MvNjk0MDQvMmEwMDAwMDE1MjY0ZjJkZDkwMDA2ODg2NWNhM2FmZTA4MzdkL2xhcmdlJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdHlwZXM6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5kb2N1bWVudGFsLCBUWVBFX0NIQU5ORUwuSERdLFxyXG4gICAgICAgIHRpdGxlOiAn0JzQtdGB0YLQvdC+0LUg0LLRgNC10LzRjy4g0JLQtdGB0YLQuC3QnNC+0YHQutCy0LAnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcxNzo1MCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbCwgVFlQRV9DSEFOTkVMLkhEXSxcclxuICAgICAgICB0aXRsZTogJ9CS0LXRgdGC0LgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcxODoxNScsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbCwgVFlQRV9DSEFOTkVMLkhEXSxcclxuICAgICAgICB0aXRsZTogJ9Cf0YDRj9C80L7QuSDRjdGE0LjRgCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGltZTogJzE5OjM1JyxcclxuICAgICAgICBjYXRlZ29yeTogJzgrJyxcclxuICAgICAgICBpbWc6ICdodHRwOi8vYXZhdGFycy5tZHMueWFuZGV4Lm5ldC9nZXQtdHYtc2hvd3MvNjk0MDQvMmEwMDAwMDE1MjY0ZjJkZDkwMDA2ODg2NWNhM2FmZTA4MzdkL2xhcmdlJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgdHlwZXM6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5kb2N1bWVudGFsLCBUWVBFX0NIQU5ORUwuSERdLFxyXG4gICAgICAgIHRpdGxlOiAn0JzQtdGB0YLQvdC+0LUg0LLRgNC10LzRjy4g0JLQtdGB0YLQuC3QnNC+0YHQutCy0LAnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcyMDowMCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbCwgVFlQRV9DSEFOTkVMLkhEXSxcclxuICAgICAgICB0aXRsZTogJ9CS0LXRgdGC0LgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpbWU6ICcyMTowMCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICc4KycsXHJcbiAgICAgICAgaW1nOiAnaHR0cDovL2F2YXRhcnMubWRzLnlhbmRleC5uZXQvZ2V0LXR2LXNob3dzLzY5NDA0LzJhMDAwMDAxNTI2NGYyZGQ5MDAwNjg4NjVjYTNhZmUwODM3ZC9sYXJnZScsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIHR5cGVzOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbCwgVFlQRV9DSEFOTkVMLkhEXSxcclxuICAgICAgICB0aXRsZTogJ9Cu0LzQvtGA0LjQvdCwJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aW1lOiAnMjI6MzAnLFxyXG4gICAgICAgIGNhdGVnb3J5OiAnOCsnLFxyXG4gICAgICAgIGltZzogJ2h0dHA6Ly9hdmF0YXJzLm1kcy55YW5kZXgubmV0L2dldC10di1zaG93cy82OTQwNC8yYTAwMDAwMTUyNjRmMmRkOTAwMDY4ODY1Y2EzYWZlMDgzN2QvbGFyZ2UnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcclxuICAgICAgICB0eXBlczogW1RZUEVfQ0hBTk5FTC5zcG9ydCwgVFlQRV9DSEFOTkVMLmRvY3VtZW50YWwsIFRZUEVfQ0hBTk5FTC5IRF0sXHJcbiAgICAgICAgdGl0bGU6ICdcItCh0L3RiyDQviDQu9GO0LHQstC4XCIuINCu0LHQuNC70LXQudC90YvQuSDQutC+0L3RhtC10YDRgiDQkNC70LvRiyDQn9GD0LPQsNGH0LXQstC+0LknXHJcbiAgICB9XHJcbl0ubWFwKChpdGVtLCBpKSA9PiB7XHJcbiAgICBpdGVtLmlkID0gaTtcclxuICAgIHJldHVybiBpdGVtO1xyXG59KTtcclxuY29uc3QgbGlzdFRWT25lRGF5ID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgICAgIGltZzogJy4vaW1hZ2VzL3J1c3NpYTI0LnBuZycsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KDQvtGB0YHQuNGPIDI0JyxcclxuICAgICAgICAgICAgICAgIHVybE9ubGluZTogJ2h0dHA6Ly9wbGF5ZXIudmd0cmsuY29tL2lmcmFtZS9saXZlL2lkLzIxL3N0YXJ0X3pvb20vdHJ1ZS9zaG93Wm9vbUJ0bi90cnVlL2lzUGxheS9mYWxzZS8nLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3JhbXM6IHJ1czI0SXRlbXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDMsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuL2ltYWdlcy9jaC1sb2dvLTEucG5nJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICcxINCf0LXRgNCy0YvQuScsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbF0sXHJcbiAgICAgICAgICAgICAgICB1cmxPbmxpbmU6ICdodHRwOi8vcGxheWVyLnZndHJrLmNvbS9pZnJhbWUvbGl2ZS9pZC8yOTYxL3Nob3dab29tQnRuL2ZhbHNlL2lzUGxheS9mYWxzZS8nLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3JhbXM6IHJ1czI0SXRlbXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDQsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuL2ltYWdlcy9wbGFuZXRhUlRSLnBuZycsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KDQotCgLdCf0LvQsNC90LXRgtCwJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFtUWVBFX0NIQU5ORUwuZG9jdW1lbnRhbF0sXHJcbiAgICAgICAgICAgICAgICB1cmxPbmxpbmU6ICdodHRwOi8vcGxheWVyLnZndHJrLmNvbS9pZnJhbWUvbGl2ZS9pZC80OTQxL3Nob3dab29tQnRuL2ZhbHNlL2lzUGxheS9mYWxzZS8nLFxyXG4gICAgICAgICAgICAgICAgcHJvZ3JhbXM6IHJ1czI0SXRlbXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDUsXHJcbiAgICAgICAgICAgICAgICBpbWc6ICcuL2ltYWdlcy9tb3Njb3cyNC5wbmcnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9Cc0L7RgdC60LLQsCAyNCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBbVFlQRV9DSEFOTkVMLnNwb3J0LCBUWVBFX0NIQU5ORUwuSERdLFxyXG4gICAgICAgICAgICAgICAgdXJsT25saW5lOiAnaHR0cDovL3BsYXllci52Z3Ryay5jb20vaWZyYW1lL2xpdmUvaWQvMTY2MS9zaG93Wm9vbUJ0bi9mYWxzZS9pc1BsYXkvZmFsc2UvJyxcclxuICAgICAgICAgICAgICAgIHByb2dyYW1zOiBydXMyNEl0ZW1zXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiA2LFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi9pbWFnZXMvcnVzc2lhSy5wbmcnLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9Cg0L7RgdGB0LjRjyDQmicsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBbVFlQRV9DSEFOTkVMLmRvY3VtZW50YWwsIFRZUEVfQ0hBTk5FTC5IRF0sXHJcbiAgICAgICAgICAgICAgICB1cmxPbmxpbmU6ICdodHRwOi8vcGxheWVyLnZndHJrLmNvbS9pZnJhbWUvbGl2ZS9pZC8xOTIwMS9zaG93Wm9vbUJ0bi9mYWxzZS9pc1BsYXkvZmFsc2UvJyxcclxuICAgICAgICAgICAgICAgIHByb2dyYW1zOiBydXMyNEl0ZW1zXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlkOiA3LFxyXG4gICAgICAgICAgICAgICAgaW1nOiAnLi9pbWFnZXMvbWF0Y2gtdHYucG5nJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQnNCQ0KLQpyDQotCSJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFtUWVBFX0NIQU5ORUwuc3BvcnQsIFRZUEVfQ0hBTk5FTC5IRF0sXHJcbiAgICAgICAgICAgICAgICB1cmxPbmxpbmU6ICdodHRwOi8vcnV0dWJlLnJ1L3BsYXkvZW1iZWQvODQ2MTIwNycsXHJcbiAgICAgICAgICAgICAgICBwcm9ncmFtczogcnVzMjRJdGVtc1xyXG4gICAgICAgICAgICB9XHJcbl07XHJcbmNvbnN0IGxpc3RUVldlZWsgPSBbXHJcbiAgICB7IGlkOiAxLCBjaGFubmVsczogbGlzdFRWT25lRGF5IH0sXHJcbiAgICB7IGlkOiAyLCBjaGFubmVsczogbGlzdFRWT25lRGF5IH0sXHJcbiAgICB7IGlkOiAzLCBjaGFubmVsczogbGlzdFRWT25lRGF5IH0sXHJcbiAgICB7IGlkOiA0LCBjaGFubmVsczogbGlzdFRWT25lRGF5IH0sXHJcbiAgICB7IGlkOiA1LCBjaGFubmVsczogbGlzdFRWT25lRGF5IH0sXHJcbiAgICB7IGlkOiA2LCBjaGFubmVsczogbGlzdFRWT25lRGF5IH0sXHJcbiAgICB7IGlkOiA3LCBjaGFubmVsczogbGlzdFRWT25lRGF5IH1cclxuXTtcclxuXHJcbmNsYXNzIFNvdXJjZVNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcbiAgICBnZXRUeXBlQ2hhbm5lbCgpIHtcclxuICAgICAgICByZXR1cm4gVFlQRV9DSEFOTkVMO1xyXG4gICAgfVxyXG4gICAgZ2V0TGlzdFR2T25XZWVrKCkge1xyXG4gICAgICAgIHJldHVybiBsaXN0VFZXZWVrO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBTb3VyY2VTZXJ2aWNlIH07Iiwi77u/ZXhwb3J0IGNvbnN0IFRZUEVfQ0hBTk5FTCA9IHtcclxuICAgICdkZWZhdWx0JzogMCxcclxuICAgIHNwb3J0OiAxLFxyXG4gICAgbXVsdDogMixcclxuICAgIG11c2ljOiAzLFxyXG4gICAgSEQ6IDQsXHJcbiAgICBzZXJpZXM6IDUsXHJcbiAgICBkb2N1bWVudGFsOiA2XHJcbn07Iiwi77u/aW1wb3J0IHtJbmRleGVkRGJBcGl9IGZyb20gJy4vSW5kZXhlZERiQXBpJztcclxuaW1wb3J0IHtUWVBFX0NIQU5ORUwgfSBmcm9tICcuL1R5cGVDaGFubmVsJztcclxuXHJcbi8vLyB1cGRhdGUvaW5pdCBncmlkXHJcbmZ1bmN0aW9uIHVwZGF0ZUdyaWRJdGVtcyhkYXRhLCB0eXBlKSB7XHJcbiAgICB2YXIgZ3JpZFR2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R2LWdyaWQnKTtcclxuICAgIHZhciBkb2NGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgIHZhciBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBuZXdFbGVtZW50LmNsYXNzTmFtZSA9ICdhbGwtZGF5JztcclxuXHJcbiAgICBkb2NGcmFnbWVudC5hcHBlbmRDaGlsZChuZXdFbGVtZW50KTtcclxuICAgIHZhciBncmlkRWxlbWVudCA9IHVwZGF0ZVJlbmRlckVsZW1lbnQoZGF0YSwgMCwgZG9jRnJhZ21lbnQsICdkaXYnLCByZW5kZXJEYXkpO1xyXG4gICAgZGF0YS5mb3JFYWNoKChkYXksIGtEYXkpID0+IHtcclxuICAgICAgICB2YXIgZGF5RWxlbWVudCA9IHVwZGF0ZVJlbmRlckVsZW1lbnQoZGF5LmNoYW5uZWxzLCBrRGF5LCBncmlkRWxlbWVudCwgJy50di1jaGFubmVsX19pdGVtcycsIHJlbmRlckNoYW5uZWwpO1xyXG4gICAgICAgIGRheS5jaGFubmVscy5mb3JFYWNoKChjaGFubmVsLCBrQ2hhbm5lbCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyQ2IgPSB0eXBlID09PSAwID8gZ2V0U29ydEJ5VGltZVByb2dyYW0gOiBnZXRTb3J0QnlUeXBlUHJvZ3JhbTtcclxuICAgICAgICAgICAgdXBkYXRlUmVuZGVyRWxlbWVudChmaWx0ZXJDYihjaGFubmVsLnByb2dyYW1zLCB0eXBlKSwga0NoYW5uZWwsIGRheUVsZW1lbnQsICcuY2hhbm5lbC1wcm9ncmFtX19pdGVtcycsIHJlbmRlclByb2dyYW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBncmlkVHYuYXBwZW5kQ2hpbGQoZG9jRnJhZ21lbnQpO1xyXG59XHJcblxyXG4vLy8gY3JlYXRlIHBvcHVwXHJcblxyXG52YXIgcG9wdXBFbGVtZW50O1xyXG5mdW5jdGlvbiBtb3VzZUVudGVyKGUpIHtcclxuICAgIGlmIChwb3B1cEVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy50di1wb3B1cCcpKSB7XHJcbiAgICAgICAgICAgIHBvcHVwRWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIGRheUlkID0gcGFyc2VJbnQodGhpcy5jbG9zZXN0KCcudHYtZGF5JykuZGF0YXNldC5kYXlpZCk7XHJcbiAgICB2YXIgY2hhbm5lbElkID0gcGFyc2VJbnQodGhpcy5jbG9zZXN0KCcudHYtY2hhbm5lbF9faXRlbScpLmRhdGFzZXQuY2hhbm5lbGlkKTtcclxuICAgIHZhciBwcm9ncmFtSWQgPSBwYXJzZUludCh0aGlzLmNsb3Nlc3QoJy50di1wcm9ncmFtX19pdGVtJykuZGF0YXNldC5wcm9ncmFtaWQpO1xyXG4gICAgdmFyIGRheSA9IGxpc3RUVldlZWsuZmluZCgoaXRlbSkgPT4geyByZXR1cm4gaXRlbS5pZCA9PT0gZGF5SWQgfSk7XHJcbiAgICB2YXIgY2hhbm5lbCA9IGRheS5jaGFubmVscy5maW5kKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLmlkID09PSBjaGFubmVsSWQgfSk7XHJcbiAgICB2YXIgcHJvZ3JhbSA9IGNoYW5uZWwucHJvZ3JhbXMuZmluZCgoaXRlbSkgPT4geyByZXR1cm4gaXRlbS5pZCA9PT0gcHJvZ3JhbUlkIH0pO1xyXG5cclxuICAgIHBvcHVwRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgcG9wdXBFbGVtZW50LmlkID0gJ3BvcHVwJztcclxuICAgIHBvcHVwRWxlbWVudC5jbGFzc05hbWUgPSAncG9wdXAnO1xyXG4gICAgcG9wdXBFbGVtZW50LmlubmVySFRNTCA9IHJlbmRlclBvcHVwKGNoYW5uZWwpO1xyXG4gICAgdmFyIHByb2dyYW1FbGVtZW50ID0gcG9wdXBFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50di1wb3B1cC1wcm9ncmFtJyk7XHJcbiAgICBwcm9ncmFtRWxlbWVudC5pbm5lckhUTUwgPSByZW5kZXJQb3B1cFByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICB0aGlzLmFwcGVuZENoaWxkKHBvcHVwRWxlbWVudCk7XHJcbn1cclxuLy8gc29ydCBzdGFydFxyXG5cclxuZnVuY3Rpb24gZ2V0U29ydEJ5VGltZVByb2dyYW0ocHJvZ3JhbXMpIHtcclxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKSxcclxuICAgICAgICBub3dIb3VycyA9IGRhdGUuZ2V0SG91cnMoKSxcclxuICAgICAgICBjb3VudFByb2dyYW0gPSA0LFxyXG4gICAgICAgIHJlc3VsdFByb2dyYW0gPSBbXSxcclxuICAgICAgICBvbGRQcm9ncmFtID0gcHJvZ3JhbXNbMF07XHJcblxyXG4gICAgcHJvZ3JhbXMuZXZlcnkoKHByb2dyYW0pID0+IHtcclxuICAgICAgICB2YXIgcHJvZ3JhbUhvdXJzID0gcGFyc2VJbnQocHJvZ3JhbS50aW1lLnNsaWNlKDAsIDIpKTtcclxuICAgICAgICBpZiAobm93SG91cnMgPCBwcm9ncmFtSG91cnMpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdFByb2dyYW0ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9ncmFtLmlzTm93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHRQcm9ncmFtLnB1c2gocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHJldHVybiAocmVzdWx0UHJvZ3JhbS5sZW5ndGggPT09IGNvdW50UHJvZ3JhbSkgPyBmYWxzZSA6IHRydWU7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9sZFByb2dyYW0gPSBwcm9ncmFtO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8v0LTQvtC60LjQtNGL0LLQsNC10Lwg0L/RgNC+0LPRgNCw0LzQvNGLINGBINC90LDRh9Cw0LvQsCDQtNC90Y9cclxuICAgIGNvbnN0IHJlbWFpbmRlckNvdW50ID0gY291bnRQcm9ncmFtIC0gcmVzdWx0UHJvZ3JhbS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbWFpbmRlckNvdW50OyBpKyspIHtcclxuICAgICAgICByZXN1bHRQcm9ncmFtLnB1c2gocHJvZ3JhbXNbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdFByb2dyYW07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNvcnRCeVR5cGVQcm9ncmFtKHByb2dyYW1tcywgdHlwZSkge1xyXG4gICAgdmFyIG5ld1Byb2dyYW1tcyA9IFtdO1xyXG4gICAgcHJvZ3JhbW1zLmZvckVhY2goKHByb2dyYW0pID0+IHtcclxuICAgICAgICB2YXIgaXNGaW5kID0gcHJvZ3JhbS50eXBlcy5maW5kKCh0KSA9PiB7IHJldHVybiB0ID09PSB0eXBlIH0pO1xyXG4gICAgICAgIGlmIChpc0ZpbmQpIHtcclxuICAgICAgICAgICAgbmV3UHJvZ3JhbW1zLnB1c2gocHJvZ3JhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmV3UHJvZ3JhbW1zO1xyXG59XHJcbi8vIHNvcnQgZW5kXHJcbi8vLyBldmVudHMgc3RhcnRcclxuXHJcbmZ1bmN0aW9uIGRheUNoYW5nZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCBkYXlDb250YWluZXIgPSB0aGlzLmNsb3Nlc3QoJy5maWx0ZXItZGF5X19jaGFuZ2UtYnRuJyk7XHJcbiAgICBhZGRDbGFzc0FjdGl2ZS5iaW5kKHRoaXMsICcuZmlsdGVyLWRheV9fY2hhbmdlLWJ0bicpKCk7XHJcbiAgICBjb25zdCBpZCA9IHBhcnNlSW50KGRheUNvbnRhaW5lci5kYXRhc2V0LmlkKTtcclxuICAgIHZhciBkYXkgPSBsaXN0VFZXZWVrLmZpbmQoKGl0ZW0pID0+IHsgcmV0dXJuIGl0ZW0uaWQgPT09IGlkIH0pO1xyXG4gICAgdmFyIGdyaWRUdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0di1ncmlkJyk7XHJcbiAgICB2YXIgYWxsRWxlbSA9IGdyaWRUdi5xdWVyeVNlbGVjdG9yKCcuYWxsLWRheScpO1xyXG4gICAgZ3JpZFR2LnJlbW92ZUNoaWxkKGFsbEVsZW0pO1xyXG4gICAgdmFyIHNlbGVjdEVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXItdHlwZV9fc2VsZWN0Jyk7XHJcbiAgICB1cGRhdGVHcmlkSXRlbXMoW2RheV0sIFRZUEVfQ0hBTk5FTFtzZWxlY3RFbG0udmFsdWVdKTtcclxuICAgIGFkZFBvcHVwKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFBvcHVwKCkge1xyXG4gICAgZGVsZWdhdGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNoYW5uZWwtcHJvZ3JhbV9faXRlbXMnKSxcclxuICAgICAgICAnLnR2LXByb2dyYW1fX2l0ZW0nLFxyXG4gICAgICAgICdtb3VzZW92ZXInLFxyXG4gICAgICAgIG1vdXNlRW50ZXIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWx0ZXJUeXBlKHR5cGUpIHtcclxuICAgIHZhciBncmlkVHYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHYtZ3JpZCcpO1xyXG4gICAgdmFyIGFsbEVsZW1lbnRQcm9ncmFtbSA9IGdyaWRUdi5xdWVyeVNlbGVjdG9yQWxsKCcudHYtZGF5Jyk7XHJcbiAgICB2YXIgcHJvZ3JhbUl0ZW1zID0gZ3JpZFR2LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGFubmVsLXByb2dyYW1fX2l0ZW1zJyk7XHJcbiAgICBbXS5mb3JFYWNoLmNhbGwocHJvZ3JhbUl0ZW1zLCAocCkgPT4ge1xyXG4gICAgICAgIHdoaWxlIChwLmZpcnN0Q2hpbGQpIHAucmVtb3ZlQ2hpbGQocC5maXJzdENoaWxkKTtcclxuICAgIH0pO1xyXG4gICAgW10uZm9yRWFjaC5jYWxsKGFsbEVsZW1lbnRQcm9ncmFtbSwgKGRheUl0ZW0pID0+IHtcclxuICAgICAgICB2YXIgZGF5SWQgPSBwYXJzZUludChkYXlJdGVtLmRhdGFzZXQuZGF5aWQpO1xyXG4gICAgICAgIHZhciBmaWx0ZXJDYiA9IHR5cGUgPT09IDAgPyBnZXRTb3J0QnlUaW1lUHJvZ3JhbSA6IGdldFNvcnRCeVR5cGVQcm9ncmFtO1xyXG4gICAgICAgIHZhciBkYXkgPSBsaXN0VFZXZWVrLmZpbmQoKGl0ZW0pID0+IHsgcmV0dXJuIGl0ZW0uaWQgPT09IGRheUlkIH0pO1xyXG4gICAgICAgIGRheS5jaGFubmVscy5mb3JFYWNoKChjaGFubmVsLCBrQ2hhbm5lbCkgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGVSZW5kZXJFbGVtZW50KGZpbHRlckNiKGNoYW5uZWwucHJvZ3JhbXMsIHR5cGUpLFxyXG4gICAgICAgICAgICAgICAga0NoYW5uZWwsXHJcbiAgICAgICAgICAgICAgICBkYXlJdGVtLFxyXG4gICAgICAgICAgICAgICAgJy5jaGFubmVsLXByb2dyYW1fX2l0ZW1zJyxcclxuICAgICAgICAgICAgICAgIHJlbmRlclByb2dyYW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1vdXNlRW50ZXJHbG9iYWwoZSkge1xyXG4gICAgaWYgKHBvcHVwRWxlbWVudCkge1xyXG4gICAgICAgIGlmICghZS50YXJnZXQuY2xvc2VzdCgnLnR2LXBvcHVwJykgJiYgIWUudGFyZ2V0LmNsb3Nlc3QoJy50di1wcm9ncmFtX19pdGVtJykpIHtcclxuICAgICAgICAgICAgcG9wdXBFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdHlwZUNoYW5nZShlKSB7XHJcbiAgICBjb25zdCB0eXBlID0gVFlQRV9DSEFOTkVMW2UudGFyZ2V0LnZhbHVlXTtcclxuICAgIGlmICh0eXBlICE9PSBudWxsKSB7XHJcbiAgICAgICAgZmlsdGVyVHlwZSh0eXBlKTtcclxuICAgIH1cclxufVxyXG4vLy8gZXZlbnRzIGVuZFxyXG5cclxuLy8vIGluaXQgZmlsdGVyc1xyXG5cclxuZnVuY3Rpb24gaW5pdEZpbHRlcigpIHtcclxuICAgIHZhciBpdGVtc0h0bWwgPSAnJztcclxuICAgIGZvciAodmFyIGtleSBpbiBUWVBFX0NIQU5ORUwpIHtcclxuICAgICAgICBpZiAoVFlQRV9DSEFOTkVMLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgaXRlbXNIdG1sICs9IHJlbmRlck9wdGlvbkZpbHRlcihrZXksIGdldFR5cGVOYW1lKFRZUEVfQ0hBTk5FTFtrZXldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXItdHlwZV9fc2VsZWN0JyksIChjb250YWluZXIpID0+IHtcclxuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gaXRlbXNIdG1sO1xyXG4gICAgfSk7XHJcblxyXG59XHJcbmZ1bmN0aW9uIGluaXRGaWx0ZXJEYXkoKSB7XHJcbiAgICB2YXIgaXRlbXNIdG1sID0gJyc7XHJcbiAgICBsaXN0VFZXZWVrLmZvckVhY2goKGRheSkgPT4ge1xyXG4gICAgICAgIGl0ZW1zSHRtbCArPSByZW5kZXJCdXR0b25GaWx0ZXIoZGF5LmlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyLWRheScpLCAoY29udGFpbmVyKSA9PiB7XHJcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGl0ZW1zSHRtbDtcclxuICAgIH0pO1xyXG59XHJcbi8vLyBmdW5jdGlvbiBoZWxwZXIgc3RhcnQgXHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzc0FjdGl2ZShzZWxlY3Rvcikge1xyXG4gICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVuZGVyRWxlbWVudChkYXRhLCBrZXlTZWxlY3RvciwgZWxlbWVudCwgY2xhc3NOYW1lLCByZW5kZXJDYikge1xyXG4gICAgdmFyIGl0ZW1zSHRtbCA9IGRhdGEubWFwKHJlbmRlckNiKS5qb2luKCcnKTtcclxuICAgIHZhciBlbWwgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2xhc3NOYW1lKVtrZXlTZWxlY3Rvcl07XHJcbiAgICBlbWwuaW5uZXJIVE1MID0gaXRlbXNIdG1sO1xyXG4gICAgcmV0dXJuIGVtbDtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVsZWdhdGUoY29udGFpbmVycywgc2VsZWN0b3IsIGV2ZW50LCBoYW5kbGVyKSB7XHJcbiAgICBbXS5mb3JFYWNoLmNhbGwoY29udGFpbmVycywgKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdChzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkoZS50YXJnZXQsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLy8gZnVuY3Rpb24gaGVscGVyIGVuZFxyXG5cclxuLy8vIHZpZXcgaGVscCBzdGFydFxyXG5mdW5jdGlvbiBnZXRUeXBlTmFtZSh0eXBlKSB7XHJcbiAgICB2YXIgbmFtZSA9ICcnO1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBUWVBFX0NIQU5ORUwuZGVmYXVsdDpcclxuICAgICAgICAgICAgbmFtZSA9ICfQndC1INCy0YvQsdGA0LDQvdC+JztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUWVBFX0NIQU5ORUwuSEQ6XHJcbiAgICAgICAgICAgIG5hbWUgPSAnSEQnO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRZUEVfQ0hBTk5FTC5kb2N1bWVudGFsOlxyXG4gICAgICAgICAgICBuYW1lID0gJ9CU0L7QutGD0LzQtdC90YLQsNC70YzQvdGL0LknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFRZUEVfQ0hBTk5FTC5tdWx0OlxyXG4gICAgICAgICAgICBuYW1lID0gJ9Cc0YPQu9GM0YLRhNC40LvRjNC8JztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUWVBFX0NIQU5ORUwubXVzaWM6XHJcbiAgICAgICAgICAgIG5hbWUgPSAn0JzRg9C30YvQutCwJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUWVBFX0NIQU5ORUwuc2VyaWVzOlxyXG4gICAgICAgICAgICBuYW1lID0gJ9Ch0LXRgNC40LDQuyc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVFlQRV9DSEFOTkVMLnNwb3J0OlxyXG4gICAgICAgICAgICBuYW1lID0gJ9Ch0L/QvtGA0YInO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiBuYW1lO1xyXG59XHJcbmZ1bmN0aW9uIGdldERheVdlZWtOYW1lKHR5cGUpIHtcclxuICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgZnVsbE5hbWU6ICcnXHJcbiAgICB9O1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICByZXN1bHQubmFtZSA9ICfQn9C9JztcclxuICAgICAgICAgICAgcmVzdWx0LmZ1bGxOYW1lID0gJ9Cf0L7QvdC10LTQtdC70YzQvdC40LonO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHJlc3VsdC5uYW1lID0gJ9CS0YInO1xyXG4gICAgICAgICAgICByZXN1bHQuZnVsbE5hbWUgPSAn0JLRgtC+0YDQvdC40LonO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIHJlc3VsdC5uYW1lID0gJ9Ch0YAnO1xyXG4gICAgICAgICAgICByZXN1bHQuZnVsbE5hbWUgPSAn0KHRgNC10LTQsCc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmVzdWx0Lm5hbWUgPSAn0KfRgic7XHJcbiAgICAgICAgICAgIHJlc3VsdC5mdWxsTmFtZSA9ICfQp9C10YLQstC10YDQsyc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgcmVzdWx0Lm5hbWUgPSAn0J/Rgic7XHJcbiAgICAgICAgICAgIHJlc3VsdC5mdWxsTmFtZSA9ICfQn9GP0YLQvdC40YbQsCc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgcmVzdWx0Lm5hbWUgPSAn0KHQsSc7XHJcbiAgICAgICAgICAgIHJlc3VsdC5mdWxsTmFtZSA9ICfQodGD0LHQsdC+0YLQsCc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgICAgcmVzdWx0Lm5hbWUgPSAn0JLRgSc7XHJcbiAgICAgICAgICAgIHJlc3VsdC5mdWxsTmFtZSA9ICfQktC+0YHQutGA0LXRgdC10L3RjNC1JztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUeXBlUHJvZ3JhbSh0eXBlcykge1xyXG4gICAgY29uc3QgaXRlbXNIdG1sID0gdHlwZXMubWFwKCh0eXBlKSA9PiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdEh0bWwgPSAnJztcclxuICAgICAgICByZXN1bHRIdG1sID0gcmVuZGVyVHlwZShnZXRUeXBlTmFtZSh0eXBlKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdEh0bWw7XHJcbiAgICB9KS5qb2luKCcnKTtcclxuICAgIHJldHVybiBpdGVtc0h0bWw7XHJcblxyXG59XHJcbi8vLyB2aWV3IGhlbHAgZW5kXHJcblxyXG4vLy8gcmVuZGVyIGh0bWwgc3RhcnRcclxuZnVuY3Rpb24gcmVuZGVyVHlwZShuYW1lKSB7XHJcbiAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidGFnLXR5cGVcIj4ke25hbWV9PC9zcGFuPmA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckRheShpdGVtLCBrZXkpIHtcclxuICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInR2LWRheVwiXHJcbiAgICAgICAgICAgIGRhdGEtZGF5aWQ9JyR7SlNPTi5zdHJpbmdpZnkoaXRlbS5pZCl9Jz5cclxuICAgICAgICAgICAgPGgyIGNsYXNzID1cInR2LWNoYW5uZWxfX2hlYWRlclwiPiR7Z2V0RGF5V2Vla05hbWUoaXRlbS5pZCkuZnVsbE5hbWV9PC9oMj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInR2LWNoYW5uZWxfX2l0ZW1zXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlckNoYW5uZWwoaXRlbSkge1xyXG4gICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwidHYtY2hhbm5lbF9faXRlbVwiXHJcbiAgICAgICAgICAgIGRhdGEtY2hhbm5lbGlkPScke0pTT04uc3RyaW5naWZ5KGl0ZW0uaWQpfSc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0di1jaGFubmVsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0di1jaGFubmVsLWl0ZW1fX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0di1jaGFubmVsX19sZWZ0IHR2LWNoYW5uZWwtaXRlbV9fbG9nb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aXRlbS5pbWd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInR2LWNoYW5uZWxfX3JpZ2h0IHR2LWNoYW5uZWwtaXRlbV9fbmFtZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke2l0ZW0ubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3MgPVwidHYtY2hhbm5lbC1pdGVtX19ib2R5IGNoYW5uZWwtcHJvZ3JhbV9faXRlbXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlclByb2dyYW0oaXRlbSkge1xyXG4gICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwidHYtcHJvZ3JhbV9faXRlbVwiXHJcbiAgICAgICAgICAgIGRhdGEtcHJvZ3JhbWlkPScke0pTT04uc3RyaW5naWZ5KGl0ZW0uaWQpfSc+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHYtY2hhbm5lbF9fbGVmdCB0di1wcm9ncmFtX190aW1lXCI+JHtpdGVtLnRpbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR2LWNoYW5uZWxfX3JpZ2h0IHR2LXByb2dyYW1fX3RpdGxlXCI+JHtpdGVtLnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgJHtpdGVtLmlzTm93ID8gJzxzcGFuIGNsYXNzID1cInR2LXByb2dyYW1fX25vd1wiPijRgtGA0LDQvdGB0LvQuNGA0YPQtdGC0YHRjyk8L3NwYW4+JyA6ICcnfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYDtcclxufVxyXG5mdW5jdGlvbiByZW5kZXJQb3B1cChpdGVtKSB7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgY2xhc3MgPVwidHYtcG9wdXBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcyA9XCJ0di1wb3B1cC1jaGFubmVsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3MgPVwidHYtcG9wdXAtY2hhbm5lbC1pdGVtX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIHNyYz1cIiR7aXRlbS51cmxPbmxpbmV9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsaW5nPVwiTm9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI9XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVib3JkZXI9XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW96YWxsb3dmdWxsc2NyZWVuPVwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2Via2l0YWxsb3dmdWxsc2NyZWVuPVwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dmdWxsc2NyZWVuPVwiXCI+PC9pZnJhbWU+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3MgPVwidHYtcG9wdXAtcHJvZ3JhbVwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIGA7XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyUG9wdXBQcm9ncmFtKGl0ZW0pIHtcclxuICAgIHJldHVybiBgXHJcbiAgICAgICAgIDxkaXYgY2xhc3MgPVwidHYtcG9wdXAtcHJvZ3JhbV9faXRlbVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzID1cInR2LXBvcHVwLXByb2dyYW1fX2hlYWRlci1pbWdcIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3MgPVwidHYtcG9wdXAtcHJvZ3JhbV9faGVhZGVyLXRleHRcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cInR2LXBvcHVwLXByb2dyYW1fX3RpbWVcIj4ke2l0ZW0udGltZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJ0di1wb3B1cC1wcm9ncmFtLWJvZHlfX2NhdGVnb3J5XCI+JHtpdGVtLmNhdGVnb3J5fTwvc3Bhbj5cclxuXHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJ0di1wb3B1cC1wcm9ncmFtX19ub3dcIj4ke2l0ZW0uaXNOb3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICc8c3BhbiBjbGFzcyA9XCJ0di1wcm9ncmFtX19ub3dcIj4o0YLRgNCw0L3RgdC70LjRgNGD0LXRgtGB0Y8pPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICcnfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxoNCBjbGFzcyA9XCJ0di1wb3B1cC1wcm9ncmFtX190aXRsZVwiPiR7aXRlbS50aXRsZX08L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcyA9XCJ0di1wb3B1cC1wcm9ncmFtX19ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzID1cInR2LXBvcHVwLXByb2dyYW0tYm9keV9fZGVzY3JpcHRpb25cIj4ke2l0ZW0uZGVzY3JpcHRpb259PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzID1cInR2LXBvcHVwLXByb2dyYW1fX2Zvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+JHtnZXRUeXBlUHJvZ3JhbShpdGVtLnR5cGVzKX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9uRmlsdGVyKGl0ZW0sIG5hbWUpIHtcclxuICAgIHJldHVybiBgPG9wdGlvbiBjbGFzcz1cImZpbHRlci10eXBlX19vcHRpb25cIiB2YWx1ZT0nJHtpdGVtfSc+JHtuYW1lfTwvb3B0aW9uPmA7XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyQnV0dG9uRmlsdGVyKGtleSkge1xyXG4gICAgcmV0dXJuIGA8YnV0dG9uIGNsYXNzPSdmaWx0ZXItZGF5X19jaGFuZ2UtYnRuIGJ0bicgdGl0bGU9JyR7Z2V0RGF5V2Vla05hbWUoa2V5KS5mdWxsTmFtZX0nICBkYXRhLWlkPSR7a2V5fT4ke2dldERheVdlZWtOYW1lKGtleSkubmFtZX08L2J1dHRvbj5gO1xyXG59XHJcbi8vLyByZW5kZXIgaHRtbCBlbmRcclxuXHJcbi8vLyBpbml0IGFwcFxyXG52YXIgbGlzdFRWV2VlayA9IFtdO1xyXG5sZXQgaW5kZXhlZERiO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gICAgaW5kZXhlZERiID0gbmV3IEluZGV4ZWREYkFwaSgpO1xyXG4gICAgaW5kZXhlZERiLmdldExpc3RUdk9uV2VlaygpLnRoZW4oKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgbGlzdFRWV2VlayA9IGl0ZW1zO1xyXG4gICAgICAgIGluaXRBcHAoKTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGluaXRBcHAoKSB7XHJcbiAgICB1cGRhdGVHcmlkSXRlbXMobGlzdFRWV2VlaywgMCk7XHJcbiAgICBhZGRQb3B1cCgpO1xyXG4gICAgaW5pdEZpbHRlcigpO1xyXG4gICAgaW5pdEZpbHRlckRheSgpO1xyXG4gICAgZGVsZWdhdGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI3R2LWdyaWQnKSxcclxuICAgICAgICAnLnR2LWRheScsXHJcbiAgICAgICAgJ21vdXNlb3ZlcicsXHJcbiAgICAgICAgbW91c2VFbnRlckdsb2JhbCk7XHJcbiAgICBkZWxlZ2F0ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyLWRheScpLFxyXG4gICAgICAgICcuZmlsdGVyLWRheV9fY2hhbmdlLWJ0bicsXHJcbiAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICBkYXlDaGFuZ2UpO1xyXG5cclxuICAgIGRlbGVnYXRlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXItdHlwZScpLFxyXG4gICAgICAgICcuZmlsdGVyLWNhdGVnb3J5JyxcclxuICAgICAgICAnY2hhbmdlJyxcclxuICAgICAgICB0eXBlQ2hhbmdlKTtcclxuICAgIGRlbGVnYXRlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYnKSxcclxuICAgICAgICAnLmJ0bi1yZW1vdmUtZGInLFxyXG4gICAgICAgICdjbGljaycsXHJcbiAgICAgICAgaW5kZXhlZERiLmRlbGV0ZURiKTtcclxufVxyXG4oZnVuY3Rpb24gKGUpIHtcclxuICAgIGUuY2xvc2VzdCA9IGUuY2xvc2VzdCB8fCBmdW5jdGlvbiAoY3NzKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG5cclxuICAgICAgICB3aGlsZSAobm9kZSkge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5tYXRjaGVzKGNzcykpIHJldHVybiBub2RlO1xyXG4gICAgICAgICAgICBlbHNlIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfTtcclxufSkoRWxlbWVudC5wcm90b3R5cGUpO1xyXG4oZnVuY3Rpb24gKEVMRU1FTlQpIHtcclxuICAgIEVMRU1FTlQubWF0Y2hlcyA9IEVMRU1FTlQubWF0Y2hlcyB8fCBFTEVNRU5ULm1vek1hdGNoZXNTZWxlY3RvciB8fCBFTEVNRU5ULm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVMRU1FTlQub01hdGNoZXNTZWxlY3RvciB8fCBFTEVNRU5ULndlYmtpdE1hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgICBFTEVNRU5ULmNsb3Nlc3QgPSBFTEVNRU5ULmNsb3Nlc3QgfHwgZnVuY3Rpb24gY2xvc2VzdChzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9O1xyXG59KEVsZW1lbnQucHJvdG90eXBlKSk7XHJcbmlmICghKCdyZW1vdmUnIGluIEVsZW1lbnQucHJvdG90eXBlKSkge1xyXG4gICAgRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZmluZCBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGlzdCA9IE9iamVjdCh0aGlzKTtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gbGlzdC5sZW5ndGggPj4+IDA7XHJcbiAgICAgICAgdmFyIHRoaXNBcmcgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgdmFyIHZhbHVlO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBsaXN0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==
