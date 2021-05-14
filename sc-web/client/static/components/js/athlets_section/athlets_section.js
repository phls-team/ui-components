var athlets_section = {};

function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superclass = parent.prototype;
}

/**
 * athlets_section component.
 */
athlets_section.DrawComponent = {
    ext_lang: 'athlets_section',
    formats: ['athlets_json'],
    struct_support: true,
    factory: function (sandbox) {
        return new athlets_section.DrawWindow(sandbox);
    }
};

athlets_section.DrawWindow = function (sandbox) {
    this.sandbox = sandbox;
    this.paintPanel = new athlets_section.PaintPanel(this.sandbox.container);
    this.paintPanel.init();
    this.recieveData = function (data) {
        console.log("in recieve data" + data);
    };

    var scElements = {};

    function drawAllElements() {
        var dfd = new jQuery.Deferred();
       // for (var addr in scElements) {
            jQuery.each(scElements, function(j, val){
                var obj = scElements[j];
                if (!obj || obj.translated) return;
// check if object is an arc
                if (obj.data.type & sc_type_arc_pos_const_perm) {
                    var begin = obj.data.begin;
                    var end = obj.data.end;
                    // logic for component update should go here
                }

        });
        SCWeb.ui.Locker.hide();
        dfd.resolve();
        return dfd.promise();
    }

// resolve keynodes
    var self = this;
    this.needUpdate = false;
    this.requestUpdate = function () {
        var updateVisual = function () {
// check if object is an arc
            var dfd1 = drawAllElements();
            dfd1.done(function (r) {
                return;
            });


/// @todo: Don't update if there are no new elements
            window.clearTimeout(self.structTimeout);
            delete self.structTimeout;
            if (self.needUpdate)
                self.requestUpdate();
            return dfd1.promise();
        };
        self.needUpdate = true;
        if (!self.structTimeout) {
            self.needUpdate = false;
            SCWeb.ui.Locker.show();
            self.structTimeout = window.setTimeout(updateVisual, 1000);
        }
    }
    
    this.eventStructUpdate = function (added, element, arc) {
        window.sctpClient.get_arc(arc).done(function (r) {
            var addr = r[1];
            window.sctpClient.get_element_type(addr).done(function (t) {
                var type = t;
                var obj = new Object();
                obj.data = new Object();
                obj.data.type = type;
                obj.data.addr = addr;
                if (type & sc_type_arc_mask) {
                    window.sctpClient.get_arc(addr).done(function (a) {
                        obj.data.begin = a[0];
                        obj.data.end = a[1];
                        scElements[addr] = obj;
                        self.requestUpdate();
                    });
                }
            });
        });
    };
// delegate event handlers
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
    this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
    this.sandbox.updateContent();
};
SCWeb.core.ComponentManager.appendComponentInitialize(athlets_section.DrawComponent);

/**
 * Paint panel.
 */

athlets_section.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

athlets_section.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);

        var self = this;
        container.append('<div class="sc-no-default-cmd">Спортсмены</div>');
        container.append('<button id="newButton" type="button">Узнать все об спортсменах</button>');
        container.append('<button id="searchInfoButton" type="button">Поиск главного идентификатора</button>');
	    container.append('<button id="agentbutton" type="button">Узнать степень ожирения по ИМТ спортсмена</button>');

        $('#newButton').click(function () {
			self._showMainMenuNode();
		});


		$('#searchInfoButton').click(function () {
			self._findMainIdentifier();
		});

		$('#agentbutton').click(function () {
			self._findAthletsComponent();
		});

		//$('#agentbuttonsearchsport').click(function () {
		//	self._findvagetableComponent();
		//});

		//SCWeb.core.Server.resolveScAddr(['ui_menu_na_keynodes'], function (keynodes) {
			//$('#moveToNavigationNode').attr("sc_addr", keynodes['ui_menu_na_keynodes']);
		//});

		$('#generateNodes').click(function () {
			self._generateNodes();
		});
    },

    /* Call agent of searching semantic neighborhood,
	send ui_main_menu node as parameter and add it in web window history
	*/
	_showMainMenuNode: function () {
		var addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['concept_athlete'], function (keynodes) {
			addr = keynodes['concept_athlete'];
			// Resolve sc-addr of ui_menu_view_full_semantic_neighborhood node
			SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],
			function (data) {
				// Get command of ui_menu_view_full_semantic_neighborhood
				var cmd = data["ui_menu_view_full_semantic_neighborhood"];
				// Simulate click on ui_menu_view_full_semantic_neighborhood button
				SCWeb.core.Main.doCommand(cmd,
				[addr], function (result) {
					// waiting for result
					if (result.question != undefined) {
						// append in history
						SCWeb.ui.WindowManager.appendHistoryItem(result.question);
					}
				});
			});
		});
	},

	_findMainIdentifier: function () {
		console.log("inFind");
		var main_menu_addr, nrel_main_idtf_addr;
		// Resolve sc-addrs.
		SCWeb.core.Server.resolveScAddr(['concept_athlete', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['concept_athlete'];
			nrel_main_idtf_addr = keynodes['nrel_main_idtf'];
			console.log(main_menu_addr);
			console.log(nrel_main_idtf_addr);
			// Resolve sc-addr of ui_menu_view_full_semantic_neighborhood node
			window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
 				main_menu_addr,
 				sc_type_arc_common | sc_type_const,
 				sc_type_link,
 				sc_type_arc_pos_const_perm,
 				nrel_main_idtf_addr]).
			done(function(identifiers){	 
				 window.sctpClient.get_link_content(identifiers[0][2],'string').done(function(content){
				 	alert('Главный идентификатор: ' + content);
				 });			
			});
		});
    },
	_findAthletsComponent: function () {
var argOneAddr;
SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0]], function (keynodes) {
console.log("key", keynodes);
console.log("arguments", SCWeb.core.Arguments._arguments[0]);
argOneAddr = SCWeb.core.Arguments._arguments[0];
SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_calculate_degree_of_obesity"],
function (data) {
var cmd = data["ui_menu_file_for_calculate_degree_of_obesity"];
SCWeb.core.Main.doCommand(cmd,
[argOneAddr], function (result) {
if (result.question != undefined) {
SCWeb.ui.WindowManager.appendHistoryItem(result.question);
}
});
});
});
},
};
