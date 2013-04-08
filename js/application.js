Ext.onReady(function(){
 
	// Create a variable to hold our EXT Form Panel. 	 
    var login = new Ext.FormPanel({ 
        labelWidth:80,
        url:'', 
        frame:true, 
        title:'Please Login', 
        defaultType:'textfield',
	    monitorValid: true,
        items:[{ 
                fieldLabel:'Email', 
                name:'loginEmail', 
                id: 'loginEmail',
                inputType: 'email',
                allowBlank:false 
            },{ 
                fieldLabel:'Password', 
                name:'loginPassword', 
                id: 'loginPassword',
                inputType:'password', 
                allowBlank:false 
            }],
     
        buttons:[{ 
                text:'Login',
                formBind: true,	 
                // Handle form submission. With backend this is where you'd submit and get
                // success or failure response from the server. We aren't checking creds here
                handler:function(){  
                    this.handleLoginClick();
                    this.beginClock();
                },

                // Custom stuff to handle login click
                handleLoginClick: function() {
                    var emailText = Ext.get('loginEmail').getValue();
                    var emailDiv = Ext.getCmp('email-text')
                    emailDiv.body.update('Email: ' + emailText);
                    win.close();
                },

                beginClock: function() {
                    var i = 0;
                    var durationDiv = Ext.getCmp('duration-text')
                    durationDiv.body.update('Login Duration: ' + i + ' seconds');
                    window.setInterval(function(){
                        durationDiv.body.update('Login Duration: ' + ++i + ' seconds');
                    }, 1000);
                } 
            }] 
    });
 
 
	// Need to create a window and add the formPanel to it.
    // Set modal on this window, NOT the formPanel #lessonslearned        
    var win = new Ext.Window({
        layout:'fit',
        width:300,
        height:150,
        closable: false,
        resizable: false,
        plain: true,
        border: false,
        modal: true,
        items: [login]
	});
	win.show();

    var welcomeText = '<div>Welcome to the ExtJs Test</div>';
    var emailText = durationText ='<div></div>';

    var borderLayout = new Ext.Viewport({
        layout: 'border',
        items: [
            {
                region: 'north',
                height: 100,
                items: [
                    {
                        html: welcomeText,
                        id: 'welcome-text',
                        border: false
                    },
                    {
                        html: emailText,
                        id: 'email-text',
                        border: false
                    },
                    {
                        html: durationText,
                        id: 'duration-text',
                        border: false
                    }
                ]
            },
            {
                title: 'Menu',
                region: 'west',
                id: 'west-treepanel',
                collapsible: true,
                margins: '0 5 0 0',
                xtype: 'treepanel',
                width: 200,
                autoScroll: true,
                loader: new Ext.tree.TreeLoader(),
                root: new Ext.tree.AsyncTreeNode({
                    expanded: true,
                    children: [
                    {
                        id: 'file-folder',
                        text: 'File',
                        children: [
                            {
                                id: 'file-new',
                                text: 'New',
                                leaf: true
                            },
                            {
                                id: 'file-open',
                                text: 'Open',
                                leaf: true
                            },
                            {
                                id: 'file-test',
                                text: 'Test',
                                leaf: true
                            }
                        ]
                   },
                   {
                        id: 'edit-folder',
                        text: 'Edit',
                        children: [
                            {
                                id: 'edit-find',
                                text: 'Find',
                                leaf: true
                            },
                            {
                                id: 'edit-replace',
                                text: 'Replace',
                                leaf: true
                            },
                            {
                                id: 'edit-test',
                                text: 'Test',
                                leaf: true
                            }
                        ]
                   },
                   {
                        id: 'about',
                        text: 'About',
                        leaf: true
                    }
                   ]
                }),
                rootVisible: false,
                listeners: {
                    click: function(node) {
                        if(node.attributes.leaf) {
                            //Ext.Msg.alert(node.attributes.id);
                            var tabPanel = Ext.getCmp('center-tab-panel');
                            handleTreeLeafClick(node, tabPanel);
                        }
                    }
                }
            },
            {
                region: 'center',
                items: [
                    new Ext.TabPanel({
                        id: 'center-tab-panel',
                        activeTab: 0,
                        frame:true,
                        defaults:{autoHeight: true},
                        border: false,
                        listeners: {
                            tabchange: function(tp,newTab){
                                if(newTab.id != 'home-tab') {
                                    hightlightTreeOnTabChange(newTab);
                                }
                            }
                        },

                        items:[
                            {
                                title: 'Home',
                                id: 'home-tab',
                                autoLoad:'../docs/home.html',
                                closable: false
                            }
                        ],
                    })
                ]
            },
            {
                region: 'south',
                height: '30px',
                items: [
                    {
                        html: 'Copyright 2013'
                    }
                ]
            },
        ]
    });

    var handleTreeLeafClick = function(clicked, tabPanel) {
        var clickedId = clicked.attributes.id;
        var tabItems = tabPanel.items.items;
        var targetTab = null;
        for(var i = 0; i < tabItems.length; i++) {
            if(tabItems[i].id == clickedId + '-tab') {
                targetTab = tabItems[i];
            }
        }
        if(!targetTab) {
            // tab doesn't exist yet so create one
            var newTab = createTab(clicked);
            tabPanel.add(newTab);
            setActiveTabById(newTab.id, tabPanel);
        }
        else {
            // tab already exists so highlight it
            setActiveTabById(targetTab.id, tabPanel);
        }
    };

    var createTab = function(clicked) {
        return {
            title: clicked.attributes.text,
            id: clicked.attributes.id + '-tab',
            autoLoad:'../docs/' + clicked.attributes.id + '.html',
            closable: true
        }
    };

    var setActiveTabById = function(tabId, tabPanel) {
       var tabs = tabPanel.find('id', tabId);
       tabPanel.setActiveTab(tabs[0]);
    };

    var hightlightTreeOnTabChange = function(newTab) {
        var newTabId = newTab.id.replace('-tab', '');
        var treePanel = Ext.getCmp('west-treepanel');
        var node = treePanel.getNodeById(newTabId);
        node.select();
    };
});