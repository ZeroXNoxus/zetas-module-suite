const moduleName = 'zetas-module-suite';
const settings = [];
const mainSettings = [
    'zetas-dark-mode',
    'zetas-smaller-chat',
    'zetas-dir-changes',
    'zetas-rolltype-buttons',
    'zetas-mobile-sheets'
];

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

function hideSelect() {
    $('#chat-controls select').hide();
    $('#chat-controls .control-buttons').hide();
    $('#rolltype-buttons').remove();
    if(game.user.role < 3){
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
                            '<p class="v-seperator"></p>' +
                            '<button class="function-button export-log" name="export-log" data-tooltip="'+i18n('zetas-module-suite.zetas-rolltype-buttons.export')+'"><i class="fa-solid fa-floppy-disk fa-lg"></i></button>' +
                            '<button class="function-button chat-flush" name="chat-flush" data-tooltip="'+i18n('zetas-module-suite.zetas-rolltype-buttons.flush')+'"><i class="fa-solid fa-trash fa-lg"></i></button>' +
                        '</div>';
    let type = $('#chat-controls select option:selected')[0]?.value;

    $('#chat-controls').append(button_bank);
    if(type){
        $('#rolltype-buttons .rolltype-button.'+ type).addClass('active');
    };
    
};

function switchRollType(type) {
    $('#chat-controls select option:selected').removeAttr('selected');
    $('#chat-controls select option[value="' + type + '"]').attr('selected');
    $('#rolltype-buttons .rolltype-button').removeClass('active');
    $('#rolltype-buttons .rolltype-button.'+ type).addClass('active');
    localStorage.setItem('core.rollMode', type);
    rollMode = localStorage.getItem('core.rollMode');
};

function betterItemEvents(sheet){
    if(game.settings.get(moduleName, 'custom-description-button-toggle')){
        sheet.find('a[data-toggle-description]').hide();
        sheet.find('.item-row .item-name.item-action').on('auxclick', (ev) => {
            ev.stopPropagation();
            $(ev.originalEvent.currentTarget).siblings().find('a[data-toggle-description]').click();
        });
    }
}

function bindRollTypeEvent() {
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
    
    if(game.settings.get(moduleName, 'zetas-mobile-sheets')){
        handleMobileSheetDialog(game.user._id);
    }
});

async function handleMobileSheetDialog(uid){
    if(game.settings.get(moduleName + '.zetas-mobile-sheets-user.' + uid) &&
       localStorage.getItem('zetas-mobile-sheets.dont-ask-again') === false){
        const result = await showConfirmDialog();
        if(result.confirmed){
            localStorage.setItem('zetas-mobile-sheets.choice', resolve.mobileChoice);
            localStorage.setItem('zetas-mobile-sheets.dont-ask-again', resolve.dontAskAgain);
            if(resolve.mobileChoice){
                game.settings.set('core', 'noCanvas', true);
                location.reload();
            }
        }
    }
    if(localStorage.getItem('zetas-mobile-sheets.choice') === true){
        handleMobileSheets();
    }
}

function showConfirmDialog() {
    return new Promise((resolve) => {
        const dialog = '<div id="zetasConfirmDialog" class="dialog-overlay" style="display: none;">'+
                            '<div class="dialog">'+
                                '<h3>' + i18n(moduleName + ".zetas-mobile-sheets.dialog-title") + '</h3>'+
                                '<div><label><input type="checkbox" id="mobile-choice"> ' + i18n(moduleName + ".zetas-mobile-sheets.choice") + '</label></div>'+
                                '<div><label><input type="checkbox" id="dont-ask-again"> ' + i18n(moduleName + ".zetas-mobile-sheets.dont-ask-again") + '</label></div>'+
                                '<div>'+
                                    '<button id="confirmBtn"><i class="fa-solid fa-check"></i> ' + i18n(moduleName + ".zetas-mobile-sheets.confirm") + '</button>'+
                                    '<button id="closeBtn"><i class="fa-solid fa-xmark"></i> ' + i18n(moduleName + ".zetas-mobile-sheets.close") + '</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
        $(body).append(dialog);
        const confirmDialog = document.getElementById('zetasConfirmDialog');
        const confirmBtn = document.getElementById('confirmBtn');
        const closeBtn = document.getElementById('closeBtn');
        
        confirmDialog.style.display = 'flex';

        confirmBtn.onclick = () => {
            const mobileChoice = document.getElementById('mobile-choice').checked;
            const dontAskAgain = document.getElementById('dont-ask-again').checked;
            confirmDialog.style.display = 'none';
            resolve({ confirmed: true, mobileChoice, dontAskAgain });
        };
        closeBtn.onclick = () => {
            confirmDialog.style.display = 'none';
            resolve({ confirmed: false });
        };
    });
}

function handleMobileSheets(){
    //Open Assigned Character Sheet as Mobile Sheet
    Hooks.on('renderZetasMobileSheet', () => {
        const actor = game.user.character;
        renderZetasMobileSheet(actor);
    });
    Hooks.call('renderZetasMobileSheet');
}

function renderZetasMobileSheet(actor){
    const sheet = "<div></div>";

    $(body).append(sheet);
}

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

Hooks.on('renderSidebarTab', () => {
    if(body.hasClass('zetas-rolltype-buttons')){
        hideSelect();
        addButtons();
        bindRollTypeEvent();
        switchRollType(rollMode);
    }
});

Hooks.on('renderFilePicker', (app, html, data) => {
    const supportedFileTypes = [ "apng", "avif", "bmp", "jpg", "gif", "jpeg", "png", "svg", "tiff", "webp" ];
    let supported = false;
    let dragCounter = 0;

    html.append("<div class='dragover-modal'><div class='dragover-content'>" +
                    "<h4>" + i18n("zetas-module-suite.drag-over-filepicker.title") + "</h4>" +
                    "<i class='fa-solid fa-file-import'></i>" +
                    "<p class='primary'>" + i18n("zetas-module-suite.drag-over-filepicker.hint") + "</p>" +
                    "<p class='secondary'>" + i18n("zetas-module-suite.drag-over-filepicker.addition") + "</p>" +
                    "<p class='error'>" + i18n("zetas-module-suite.drag-over-filepicker.error") + "</p>" +
                "</div></div>");

    html.on('dragover', (ev) => {
        ev.preventDefault();
    });
    
    html.on('dragenter', (ev) => {
        // Ensure this event is only handled for the .filepicker div itself
        if (ev.target[0] == html.children('window-content')[0]) {
            const items = ev.originalEvent.dataTransfer.items;

            dragCounter++;
            $('.filepicker .dragover-modal').addClass('active');
            $('.filepicker .dragover-modal .error').removeClass('active');
            $('.filepicker .dragover-modal i').addClass('fa-file-import');
            $('.filepicker .dragover-modal i').removeClass('fa-triangle-exclamation');
            
            for(let i = 0; i < items.length; i++){
                let type = items[i].type;
                type = type.split("/")[1];
                for(let x = 0; x < supportedFileTypes.length; x++){
                    if(type == supportedFileTypes[x]){
                        supported = true;
                        i = items.length;
                        x = supportedFileTypes.length;
                    }
                }
            }
            if(!supported){
                $('.filepicker .dragover-modal .error').addClass('active');
                $('.filepicker .dragover-modal i').removeClass('fa-file-import');
                $('.filepicker .dragover-modal i').addClass('fa-triangle-exclamation');
            }
            supported = false;
        }
        
    });
    
    html.on('dragleave', (ev) => {
        // Ensure this event is only handled for the .filepicker div itself
        if (ev.target[0] == html.children('window-content')[0]) {
            dragCounter--;
            if (dragCounter === 0) {
                $('.filepicker .dragover-modal').removeClass('active');
                $('.filepicker .dragover-modal .error').removeClass('active');
                $('.filepicker .dragover-modal i').addClass('fa-file-import');
                $('.filepicker .dragover-modal i').removeClass('fa-triangle-exclamation');
            }
        }
    });
    
    html.on('drop', (ev) => {
        ev.preventDefault();
        dragCounter = 0; // Reset the counter
        $('.filepicker .dragover-modal').removeClass('active');
        $('.filepicker .dragover-modal .error').removeClass('active');
        $('.filepicker .dragover-modal i').addClass('fa-file-import');
        $('.filepicker .dragover-modal i').removeClass('fa-triangle-exclamation');
    });
});

Hooks.on('renderActorSheet5eCharacter2', (app, html, data) => {
    betterItemEvents(html); 
});
Hooks.on('renderActorSheet5eNPC2', (app, html, data) => {
    betterItemEvents(html); 
});
/************************************* Hook Declaration: END *************************************/