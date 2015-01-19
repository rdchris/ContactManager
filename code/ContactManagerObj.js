
ContactManagerObj = function () {

    // child objects
    this.Loader = new ContactManagerLoader();
    this.EventManager = new ContactManagerEventManager();
    this.ExtjsGenerator = new ContactManagerGrid();

    // getters for child objects 
    this.getLoader = function () { return this.Loader };
    this.getEventManager = function () { return this.EventManager };
    this.getExtjsGenerator = function () { return this.ExtjsGenerator };
}
