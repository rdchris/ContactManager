/* 
*
*
*/


ContactManagerEventManager = function () {

    this.deleteBTNCallback = function (BTN) {
        if (BTN == 'yes') {
            // delete the record
            ContactManagerObj.getLoader().deleteContact(parseInt(selectionModelRow.getSelected().data.IndexID));
        }
    };



}