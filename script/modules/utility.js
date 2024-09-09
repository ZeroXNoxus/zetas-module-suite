const body = $('body.vtt');

function changeMode(val, name){
    (val == true && !body.hasClass(name)) ? body.addClass(name) : body.removeClass(name);
}

function i18n(key){
    return game.i18n.localize(key);
}