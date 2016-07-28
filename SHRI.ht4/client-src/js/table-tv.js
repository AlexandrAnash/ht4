import {IndexedDbApi} from './IndexedDbApi';
import {TYPE_CHANNEL } from './TypeChannel';

/// update/init grid
function updateGridItems(data, type) {
    var gridTv = document.getElementById('tv-grid');
    var docFragment = document.createDocumentFragment();
    var newElement = document.createElement('div');
    newElement.className = 'all-day';

    docFragment.appendChild(newElement);
    var gridElement = updateRenderElement(data, 0, docFragment, 'div', renderDay);
    data.forEach((day, kDay) => {
        var dayElement = updateRenderElement(day.channels, kDay, gridElement, '.tv-channel__items', renderChannel);
        day.channels.forEach((channel, kChannel) => {
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
    var day = listTVWeek.find((item) => { return item.id === dayId });
    var channel = day.channels.find((item) => { return item.id === channelId });
    var program = channel.programs.find((item) => { return item.id === programId });

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

    programs.every((program) => {
        var programHours = parseInt(program.time.slice(0, 2));
        if (nowHours < programHours) {
            if (resultProgram.length === 0) {
                program.isNow = true;
            }
            resultProgram.push(program);
            return (resultProgram.length === countProgram) ? false : true;

        } else {
            oldProgram = program;
            return true;
        }
    });
    //докидываем программы с начала дня
    const remainderCount = countProgram - resultProgram.length;
    for (var i = 0; i < remainderCount; i++) {
        resultProgram.push(programs[i]);
    }
    return resultProgram;
}

function getSortByTypeProgram(programms, type) {
    var newProgramms = [];
    programms.forEach((program) => {
        var isFind = program.types.find((t) => { return t === type });
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
    const dayContainer = this.closest('.filter-day__change-btn');
    addClassActive.bind(this, '.filter-day__change-btn')();
    const id = parseInt(dayContainer.dataset.id);
    var day = listTVWeek.find((item) => { return item.id === id });
    var gridTv = document.getElementById('tv-grid');
    var allElem = gridTv.querySelector('.all-day');
    gridTv.removeChild(allElem);
    var selectElm = document.querySelector('.filter-type__select');
    updateGridItems([day], TYPE_CHANNEL[selectElm.value]);
    addPopup();
}

function addPopup() {
    delegate(document.querySelectorAll('.channel-program__items'),
        '.tv-program__item',
        'mouseover',
        mouseEnter);
}

function filterType(type) {
    var gridTv = document.getElementById('tv-grid');
    var allElementProgramm = gridTv.querySelectorAll('.tv-day');
    var programItems = gridTv.querySelectorAll('.channel-program__items');
    [].forEach.call(programItems, (p) => {
        while (p.firstChild) p.removeChild(p.firstChild);
    });
    [].forEach.call(allElementProgramm, (dayItem) => {
        var dayId = parseInt(dayItem.dataset.dayid);
        var filterCb = type === 0 ? getSortByTimeProgram : getSortByTypeProgram;
        var day = listTVWeek.find((item) => { return item.id === dayId });
        day.channels.forEach((channel, kChannel) => {
            updateRenderElement(filterCb(channel.programs, type),
                kChannel,
                dayItem,
                '.channel-program__items',
                renderProgram);
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
    const type = TYPE_CHANNEL[e.target.value];
    if (type !== null) {
        filterType(type);
    }
}
/// events end

/// init filters

function initFilter() {
    var itemsHtml = '';
    for (var key in TYPE_CHANNEL) {
        if (TYPE_CHANNEL.hasOwnProperty(key)) {
            itemsHtml += renderOptionFilter(key, getTypeName(TYPE_CHANNEL[key]));
        }
    }
    [].forEach.call(document.querySelectorAll('.filter-type__select'), (container) => {
        container.innerHTML = itemsHtml;
    });

}
function initFilterDay() {
    var itemsHtml = '';
    listTVWeek.forEach((day) => {
        itemsHtml += renderButtonFilter(day.id);
    });

    [].forEach.call(document.querySelectorAll('.filter-day'), (container) => {
        container.innerHTML = itemsHtml;
    });
}
/// function helper start 

function addClassActive(selector) {
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++)
        elements[i].classList.remove('active');
    this.classList.add('active');
}

function updateRenderElement(data, keySelector, element, className, renderCb) {
    var itemsHtml = data.map(renderCb).join('');
    var eml = element.querySelectorAll(className)[keySelector];
    eml.innerHTML = itemsHtml;
    return eml;
}

function delegate(containers, selector, event, handler) {
    [].forEach.call(containers, (container) => {
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
        case TYPE_CHANNEL.default:
            name = 'Не выбрано';
            break;
        case TYPE_CHANNEL.HD:
            name = 'HD';
            break;
        case TYPE_CHANNEL.documental:
            name = 'Документальный';
            break;
        case TYPE_CHANNEL.mult:
            name = 'Мультфильм';
            break;
        case TYPE_CHANNEL.music:
            name = 'Музыка';
            break;
        case TYPE_CHANNEL.series:
            name = 'Сериал';
            break;
        case TYPE_CHANNEL.sport:
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
    const itemsHtml = types.map((type) => {
        var resultHtml = '';
        resultHtml = renderType(getTypeName(type));
        return resultHtml;
    }).join('');
    return itemsHtml;

}
/// view help end

/// render html start
function renderType(name) {
    return `<span class="tag-type">${name}</span>`;
}

function renderDay(item, key) {
    return `
        <div class="tv-day"
            data-dayid='${JSON.stringify(item.id)}'>
            <h2 class ="tv-channel__header">${getDayWeekName(item.id).fullName}</h2>
            <div class="tv-channel__items"></div>
        </div>
    `;
}
function renderChannel(item) {
    return `
        <div class="tv-channel__item"
            data-channelid='${JSON.stringify(item.id)}'>
            <div class="tv-channel-item">
                <div class="tv-channel-item__header">
                    <div class="tv-channel__left tv-channel-item__logo">
                        <img src="${item.img}">
                    </div>
                    <div class="tv-channel__right tv-channel-item__name">
                        <span>${item.name}</span>
                    </div>
                </div>
                <div class ="tv-channel-item__body channel-program__items"></div>
            </div>
        </div>
    `;
}
function renderProgram(item) {
    return `
        <div class="tv-program__item"
            data-programid='${JSON.stringify(item.id)}'>
            <span class="tv-channel__left tv-program__time">${item.time}</span>
            <span class="tv-channel__right tv-program__title">${item.title}</span>
            ${item.isNow ? '<span class ="tv-program__now">(транслируется)</span>' : ''}
        </div>
    `;
}
function renderPopup(item) {
    return `
        <div class ="tv-popup">
            <div class ="tv-popup-channel-item">
                <div class ="tv-popup-channel-item__header">
                    <iframe src="${item.urlOnline}"
                                    scrolling="No"
                                    border="0"
                                    frameborder="0"
                                    mozallowfullscreen=""
                                    webkitallowfullscreen=""
                                    allowfullscreen=""></iframe>
                </div>
                <div class ="tv-popup-program"></div>
            </div>
        </div>
    `;
}
function renderPopupProgram(item) {
    return `
         <div class ="tv-popup-program__item">
            <div class ="tv-popup-program__header-img">
            </div>
            <div class ="tv-popup-program__header-text">
                <span class ="tv-popup-program__time">${item.time}</span>
                <span class ="tv-popup-program-body__category">${item.category}</span>

                <span class ="tv-popup-program__now">${item.isNow
                                ? '<span class ="tv-program__now">(транслируется)</span>'
                                : ''}</span>
                <h4 class ="tv-popup-program__title">${item.title}</h4>
            </div>
            <div class ="tv-popup-program__body">
                <div class ="tv-popup-program-body__description">${item.description}</div>
            </div>
            <div class ="tv-popup-program__footer">
                <span>${getTypeProgram(item.types)}</span>
            </div>
        </div>
    `;
}

function renderOptionFilter(item, name) {
    return `<option class="filter-type__option" value='${item}'>${name}</option>`;
}
function renderButtonFilter(key) {
    return `<button class='filter-day__change-btn btn' title='${getDayWeekName(key).fullName}'  data-id=${key}>${getDayWeekName(key).name}</button>`;
}
/// render html end

/// init app
var listTVWeek = [];
let indexedDb;
document.addEventListener('DOMContentLoaded', () => {
    indexedDb = new IndexedDbApi();
    indexedDb.getListTvOnWeek().then((items) => {
        listTVWeek = items;
        initApp();
    });
});

function initApp() {
    updateGridItems(listTVWeek, 0);
    addPopup();
    initFilter();
    initFilterDay();
    delegate(document.querySelectorAll('#tv-grid'),
        '.tv-day',
        'mouseover',
        mouseEnterGlobal);
    delegate(document.querySelectorAll('.filter-day'),
        '.filter-day__change-btn',
        'click',
        dayChange);

    delegate(document.querySelectorAll('.filter-type'),
        '.filter-category',
        'change',
        typeChange);
    delegate(document.querySelectorAll('.nav'),
        '.btn-remove-db',
        'click',
        indexedDb.deleteDb);
}
(function (e) {
    e.closest = e.closest || function (css) {
        var node = this;

        while (node) {
            if (node.matches(css)) return node;
            else node = node.parentElement;
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
}(Element.prototype));
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
