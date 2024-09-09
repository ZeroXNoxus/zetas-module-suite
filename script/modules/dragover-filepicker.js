function initDragoverFilepicker(){
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
}