const settings = [];
const mainSettings = [
    'zetas-dark-mode',
    'zetas-smaller-chat',
    'zetas-dir-changes',
    'zetas-rolltype-buttons',
    'zetas-mobile-sheets'
];

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
        id: 'custom-description-button-toggle',
        scope: 'client',
        requiresReload: false
    }));

    settings.push(createSetting({
        id: 'zetas-mobile-sheets',
        scope: 'world',
        requiresReload: true
    }));

    settings.push(createSetting({
        id: 'zetas-mobile-sheets-user',
        scope: 'world',
        default: false,
        requiresReload: false
    }));

/*    settings.push(createSetting({
        id: 'custom-description-button',
        scope: 'client',
        type: Number,
        default: 1,
        requiresReload: true,
        choices: {
            1: i18n(moduleName + ".custom-description-button.wheeldown"),
            2: i18n(moduleName + ".custom-description-button.ikey"),
            3: i18n(moduleName + ".custom-description-button.assist"),
            4: i18n(moduleName + ".custom-description-button.dm")
        },
    }));*/
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
        if(setting.id === "zetas-mobile-sheets-user"){
            if(game.settings.get(moduleName, 'zetas-mobile-sheets')){
                let users = game.users;
                users.forEach((user) => {
                    if(user.role < 3){
                        setting.id = setting.id + '.' + user._id;
                        game.settings.register(moduleName, setting.id, {
                            name: user.name,
                            scope: setting.scope,
                            config: true,
                            type: setting.type,
                            default: setting.default,
                            onChange: setting.onChange,
                            requiresReload: setting.requiresReload
                        });
                    } 
                });
            }
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
    }
};

export function initSettings(){
    buildSettings();

    for(let i = 0; i < settings.length; i++){
        registerSetting(settings[i]);
        changeMode(game.settings.get(moduleName, settings[i].id), settings[i].id);
    }
    rollMode = localStorage.getItem('core.rollMode');

    Hooks.on("renderSettingsConfig", () => {
        for(let i = 0; i < settings.length; i++){
            let found = false;
            for(let x = 0; x < mainSettings.length; x++){
                if(mainSettings[x] === settings[i].id){
                    found = true;
                    x = mainSettings.length;
                }
            }
            if(found){
                $('<div>').addClass('form-group group-header').html(i18n("zetas-module-suite." + settings[i].id + ".title")).insertBefore($('[data-settings-key="zetas-module-suite.' + settings[i].id + '"]'));
            }
        };
    });
}