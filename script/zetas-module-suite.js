const moduleName = 'zetas-module-suite';
const settings = [];

const body = $('body.vtt');

let rollMode;

/********************************** Function Declaration: START **********************************/
function changeMode(val, name){
    (val == true && !body.hasClass(name)) ? body.addClass(name) : body.removeClass(name);
}

function i18n(key){
    return game.i18n.localize(key);
}

function buildSettings(){
    const createSetting = (overrides = {}) => ({
        id: '',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: '',
        requiresReload: false,
        choices: '',
        ...overrides  // Override any default values with those provided in the overrides object
    });

    settings.push(createSetting({
        id: 'zetas-dark-mode',
        onChange: val => changeMode(val, 'zetas-dark-mode')
    }));

    settings.push(createSetting({
        id: 'zetas-smaller-chat',
        onChange: val => changeMode(val, 'zetas-smaller-chat')
    }));

    settings.push(createSetting({
        id: 'zetas-dir-changes',
        onChange: val => changeMode(val, 'zetas-dir-changes')
    }));

    settings.push(createSetting({
        id: 'zetas-rolltype-buttons',
        onChange: val => changeMode(val, 'zetas-rolltype-buttons'),
        requiresReload: false
    }));

    settings.push(createSetting({
        id: 'archive-delete-permission',
        scope: 'world',
        type: Option,
        default: 3,
        requiresReload: true,
        choices: {
            1: i18n(moduleName + ".archive-delete-permission.player"),
            2: i18n(moduleName + ".archive-delete-permission.trusted"),
            3: i18n(moduleName + ".archive-delete-permission.assist"),
            4: i18n(moduleName + ".archive-delete-permission.dm")
        },
    }));
};

function registerSetting(setting){
    let prefix = moduleName + "." + setting.id;

    let name = i18n(prefix + ".name");
    let hint = i18n(prefix + ".hint");
        if(setting.choices !== ''){
            game.settings.register(moduleName, setting.id, {
                name: name,
                hint: hint,
                scope: setting.scope,
                config: true,
                type: setting.type,
                default: setting.default,
                onChange: setting.onChange,
                requiresReload: setting.requiresReload,
                choices: setting.choices
            });
        } else {
            game.settings.register(moduleName, setting.id, {
                name: name,
                hint: hint,
                scope: setting.scope,
                config: true,
                type: setting.type,
                default: setting.default,
                onChange: setting.onChange,
                requiresReload: setting.requiresReload
            });
        }
        
};

function hideSelect() {
    $('#chat-controls select').hide();
    $('#rolltype-buttons').remove();
    if(game.user.role < game.settings.get(moduleName, 'archive-delete-permission')){
        $('#rolltype-buttons .v-seperator').remove();
        $('#rolltype-buttons .function-button.export-log').remove();
        $('#rolltype-buttons .function-button.chat-flush').remove();
    }
};

function addButtons() {
    const button_bank = '<div id="rolltype-buttons" class="rolltype-container">' +
                            '<button class="rolltype-button publicroll" name="publicroll" data-tooltip="'+i18n('zetas-module-suite.zetas-rolltype-buttons.publicroll')+'"><i class="fa-solid fa-dice-d20 fa-lg"></i></button>' +
                            '<button class="rolltype-button gmroll" name="gmroll" data-tooltip="'+i18n('zetas-module-suite.zetas-rolltype-buttons.gmroll')+'"><i class="fa-solid fa-user-secret fa-lg"></i></button>' +
                            '<button class="rolltype-button blindroll" name="blindroll" data-tooltip="'+i18n('zetas-module-suite.zetas-rolltype-buttons.blindroll')+'"><i class="fa-solid fa-eye-low-vision fa-lg"></i></button>' +
                            '<button class="rolltype-button selfroll" name="selfroll" data-tooltip="'+i18n('zetas-module-suite.zetas-rolltype-buttons.selfroll')+'"><i class="fa-solid fa-ghost fa-lg"></i></button>' +
                        '</div>';
    let type = $('#chat-controls select option:selected')[0].value;

    $('#chat-controls').append(button_bank);
    $('#rolltype-buttons .rolltype-button.'+ type).addClass('active');
};

function switchRollType(type) {
    $('#chat-controls select option:selected').removeAttr('selected');
    $('#chat-controls select option[value="' + type + '"]').attr('selected');
    $('#rolltype-buttons .rolltype-button').removeClass('active');
    $('#rolltype-buttons .rolltype-button.'+ type).addClass('active');
    localStorage.setItem('core.rollMode', type);
    rollMode = localStorage.getItem('core.rollMode');
};

function bindEventListeners() {
    $('#rolltype-buttons .rolltype-button').on('click', function(e){
        switchRollType(this.name);
    });
};
/*********************************** Function Declaration: END ***********************************/

/************************************* Hook Declaration: STAR ************************************/
Hooks.once('init', () => {
    buildSettings();

    for(let i = 0; i < settings.length; i++){
        registerSetting(settings[i]);
        changeMode(game.settings.get(moduleName, settings[i].id), settings[i].id);
    }
    rollMode = localStorage.getItem('core.rollMode');
});

Hooks.on("renderSettingsConfig", () => {
    for(let i = 0; i < settings.length; i++){
        $('<div>').addClass('form-group group-header').html(i18n("zetas-module-suite." + settings[i] + ".title"))
                  .insertBefore($('[name="zetas-module-suite.' + settings[i] + '"]').parents('div.form-group:first'));
    };
});

Hooks.on('renderSidebarTab', () => {
    if(body.hasClass('zetas-rolltype-buttons')){
        hideSelect();
        addButtons();
        bindEventListeners();
        switchRollType(rollMode);
    }
});
/************************************* Hook Declaration: END *************************************/