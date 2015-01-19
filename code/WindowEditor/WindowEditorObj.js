
WindowEditorObj = function () {

    // child objects
    this.extjsGenerator = new WindowEditorExtjsGenerator();
    this.eventManager = new WindowEditorEventManger();
    this.parentFormObj; // override this with ContactManagerObj or another ManagerObj
    this.validation = new WindowEditorValidation();

    // getters for child objects 
    this.getExtjsGenerator = function () { return this.extjsGenerator };
    this.getEventManager = function () { return this.eventManager };
    this.getParentFormObj = function () { return this.parentFormObj };
    this.getValidation = function () { return this.validation };
         
}
