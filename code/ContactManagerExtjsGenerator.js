/* *************************** */
/* Builds & Populates the Grid */
/* *************************** */

//var grid;
ContactManagerGrid = function (config) {
    this.minFormWidth = 1000;
    this.TOOLTIP_SEARCH = 'To display all contacts saved, leave the field blank and click on &quotSearch&quot. To display all contacts by a specific ' + strDepartmentLbl + ', leave the field blank but select a ' + strDepartmentLbl + ' from the drop down list found in &quotSearch by ' + strDepartmentLbl + '&quot and then click on Search. ';
    this.initializeTopPanel = function () {

        var allDepartmentsStore = ContactManagerObj.getLoader().buildDepartmentListStore();
        allDepartmentsStore.on('load', function (ds, records, o) {
            Ext.getCmp('searchByDepartmentDD').setValue('ALL');
        });

        var searchPanel = new Ext.FormPanel({
            renderTo: 'blotter-search-panel',
            id: 'contactManagerSearchPanel',
            layout: 'absolute',
            frame: false,
            border: true,
            bodyBorder: false,
            minWidth: this.minFormWidth,
            width: 1000,
            height: 80,
            items: [{ xtype: 'label', id: 'searchByNameLabel', text: 'Search By Name:', x: 0, y: 11 },
                    { xtype: 'textfield', id: 'searchByNameTXT', width: 400, x: 150, y: 10 },
                    { xtype: 'label', html: '<img ext:qtip="' + this.TOOLTIP_SEARCH + '" src="/Images/Icons/help-tmp.png"/>', x: 560, y: 11 },
                    { xtype: 'label', id: 'searchByDepartmentLabel', text: 'Search By ' + strDepartmentLbl + ':', x: 0, y: 51 },
                     new Ext.form.ComboBox({
                         id: 'searchByDepartmentDD',
                         store: allDepartmentsStore,
                         listeners: { render: function (e) { this.getStore().load(); } },
                         displayField: 'Value',
                         valueField: 'Key',
                         mode: 'local',
                         triggerAction: 'all',
                         typeAhead: true,
                         editable: true,
                         width: 400,
                         //value: '(All Trusts)',
                         x: 150,
                         y: 50
                     }),
                    { xtype: 'button', id: 'searchBTN', text: 'Search', icon: 'Images/Icons/find.png', x: 560, y: 50,
                        // if the Search button is pressed grab the name text box & the dropdown value & perform an AJAX call. 
                        handler: function () {
                            Ext.getCmp('contactManagerGrid').getStore().load();
                        }
                    },
                    { xtype: 'button', id: 'ClearAllBTN', text: 'Clear All', icon: 'Images/delete.png', x: 630, y: 50,
                        handler: function () {
                            Ext.getCmp('searchByDepartmentDD').setValue('ALL');
                            Ext.getCmp('searchByNameTXT').setValue("");
                            Ext.getCmp('contactManagerGrid').getStore().load();

                        }
                    },
                    { xtype: 'button', id: 'addContactBTN', text: 'Add Contact', icon: '/Images/add.png', x: 900, y: 50,
                        handler: function () { WindowEditorObj.getExtjsGenerator().renderWindowAddEdit(); }
                    }]
        });

        if (isReadOnly) {
            Ext.getCmp('addContactBTN').destroy();
        }


    }
    this.initializeGrid = function () {

        Ext.QuickTips.init();

        Ext.Ajax.disableCaching = false;
        Ext.Ajax.timeout = 120000; //2 minutes
        var grid = Ext.getCmp('contactManagerGrid');


        /* Initialize Renderer functions */
        function DeleteIcon(val, metadata, record, rowIndex, colIndex, store) {
            return '<div style=" text-align:center;"><img src="/Images/delete.png" id="deleteIcon" onclick=" ContactManagerObj.getLoader().ValidateEmailExistsForContact(selectionModelRow.getSelected().data.IndexID,ContactManagerObj.getExtjsGenerator().renderGridDeleteConfirmation,ContactManagerObj.getExtjsGenerator().renderContactExistsInEmail)"></img></div>';
        }

        function EditIcon(val, metadata, record, rowIndex, colIndex, store) {
            return '<div style=" text-align:center;"><img src="/Images/pencil.png" id="editIcon" onclick="WindowEditorObj.getExtjsGenerator().renderWindowAddEdit(selectionModelRow.getSelected().data)"></img></div>';
        }

        var store = ContactManagerObj.getLoader().buildActiveContactsStore();

        selectionModelRow = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            checkOnly: true,
            hideable: false,
            fixed: true,
            sortable: false
        });


        var gridDefaultColumns = [
                    { header: "<b>First Name</b>", dataIndex: 'FirstName', sortable: true, align: 'left', renderer: renderLeftAlignWithTooltip, width: 150 },
                    { header: "<b>Last Name</b>", dataIndex: 'LastName', sortable: true, align: 'left', renderer: renderLeftAlignWithTooltip, width: 150 },
                    { header: "<b>Email</b>", dataIndex: 'EmailAddress', sortable: true, hideable: false, align: 'left', renderer: renderLeftAlignWithTooltip, width: 150 },
                    { header: "<b>Departments</b>", dataIndex: 'DepartmentNames', sortable: true, align: 'left', renderer: renderArrayLeftTextWithTooltip, width: 300}];

        if (!isReadOnly) {
            gridDefaultColumns.push({ header: "<b>Edit</b>", dataIndex: '', sortable: false, hideable: false, align: "center", width: 50, renderer: EditIcon });
            gridDefaultColumns.push({ header: "<b>Delete</b>", dataIndex: '', sortable: false, hideable: false, align: "center", width: 50, renderer: DeleteIcon });
        }

        grid = new Ext.grid.GridPanel({
            autoHeight: true,
            autoScroll: true,
            border: true,
            columns: gridDefaultColumns,
            disableSelection: true,
            enableColumnHide: true,
            enableColumnMove: true,
            enableColumnResize: true,
            enableHdMenu: true,
            frame: true,
            id: 'contactManagerGrid',
            loadMask: true,
            store: store,
            trackMouseOver: true,
            selModel: selectionModelRow,
            stripeRows: true,
            width: 1000,
            viewConfig: new Ext.grid.GridView({
                forceFit: true,
                scrollOffset: 0,
                onLoad: Ext.emptyFn /*Note : Function to prevent scrollbar to re-initialize the position */
            })
        });

        // Apply Branding logic
        Branding.columnHeadearChange(grid.getColumnModel(), 'DepartmentNames', '<b>' + strDepartmentsLbl + '</b>');

        grid.render("contact-manager-grid");
        store.load();
    }

    this.reloadGrid = function () {
        Ext.getCmp('contactManagerGrid').store.reload();
    }

    this.reloadGridWithSearchResultsStore = function () {
        ContactManagerObj.getLoader().buildSearchResultsStore(Ext.getCmp('searchByNameTXT').getValue(), Ext.getCmp('searchByDepartmentDD').getValue());
    }

    this.renderGridDeleteConfirmation = function () {

        selectedRow = selectionModelRow.getSelected().data;

        Ext.MessageBox.show({
            title: 'Delete Confirmation',
            msg: 'Are you sure you want to delete contact ' + selectedRow.FirstName + ' ' + selectedRow.LastName + ' (' + selectedRow.EmailAddress + ')' + '?',
            buttons: Ext.MessageBox.YESNO,
            fn: ContactManagerObj.getEventManager().deleteBTNCallback,
            animEl: 'mb4',
            icon: Ext.MessageBox.WARNING
        });
    }

    this.renderContactExistsInEmail = function () {

        selectedRow = selectionModelRow.getSelected().data;

        Ext.MessageBox.show({
            title: 'Delete Confirmation',
            msg: 'The contact that you are trying to delete is a recipient of an existing email. Are you sure you want to delete contact ' + selectedRow.FirstName + ' ' + selectedRow.LastName + ' (' + selectedRow.EmailAddress + ')' + '?',
            buttons: Ext.MessageBox.YESNO,
            fn: ContactManagerObj.getEventManager().deleteBTNCallback,
            animEl: 'mb4',
            icon: Ext.MessageBox.WARNING
        });
    }
} 

                    
