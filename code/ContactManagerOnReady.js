var ContactManagerObj;
Ext.onReady(function () {

    // Order is important 
    ContactManagerObj = new ContactManagerObj();
    ContactManagerObj.getExtjsGenerator().initializeTopPanel();
    ContactManagerObj.getExtjsGenerator().initializeGrid();

    // sets the ContactManagerObj as the Edit Windows Parent Object
    // The WindowEditor will make called to an interface implemented by the WindowEditor
    WindowEditorObj.parentFormObj = ContactManagerObj;
})
