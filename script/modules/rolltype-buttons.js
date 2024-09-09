let rollMode;
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

function bindRollTypeEvent() {
    $('#rolltype-buttons .rolltype-button').on('click', function(e){
        switchRollType(this.name);
    });
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

function initRolltypeButtons(){
    if(body.hasClass('zetas-rolltype-buttons')){
        Hooks.on('renderSidebarTab', () => {
                hideSelect();
                addButtons();
                bindRollTypeEvent();
                switchRollType(rollMode);
        });
    }
}