const moduleName = 'zetas-module-suite';
const body = $('body.vtt');

/********************************** Function Declaration: START **********************************/
function betterItemEvents(sheet){
    if(game.settings.get(moduleName, 'custom-description-button-toggle')){
        sheet.find('a[data-toggle-description]').hide();
        sheet.find('.item-row .item-name.item-action').on('auxclick', (ev) => {
            ev.stopPropagation();
            $(ev.originalEvent.currentTarget).siblings().find('a[data-toggle-description]').click();
        });
    }
}
/*********************************** Function Declaration: END ***********************************/

/************************************* Hook Declaration: STAR ************************************/
Hooks.once('init', () => {    
    initialization();
});

function initialization(){
    initDragoverFilepicker();
    initRolltypeButtons();
    initSettings();
    initMobileSheet();

    Hooks.on('renderActorSheet5eCharacter2', (app, html, data) => {
        betterItemEvents(html); 
    });
    Hooks.on('renderActorSheet5eNPC2', (app, html, data) => {
        betterItemEvents(html); 
    });
}
/************************************* Hook Declaration: END *************************************/