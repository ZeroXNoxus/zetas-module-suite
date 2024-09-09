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

function initMobileSheet(){
    if(game.settings.get(moduleName, 'zetas-mobile-sheets')){
        handleMobileSheetDialog(game.user._id);
    }
}