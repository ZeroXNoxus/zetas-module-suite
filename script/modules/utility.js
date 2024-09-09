const body = $('body.vtt');

export function changeMode(val, name){
    (val == true && !body.hasClass(name)) ? body.addClass(name) : body.removeClass(name);
}

export function i18n(key){
    return game.i18n.localize(key);
}