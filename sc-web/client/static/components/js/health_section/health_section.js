var Example = {};

function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superclass = parent.prototype;
}

/**
 * Example component.
 */
Example.DrawComponent = {
    ext_lang: 'sport_section',
    formats: ['sport_json'],
    struct_support: true,
    factory: function (sandbox) {
        return new Example.DrawWindow(sandbox);
    }
};

Example.DrawWindow = function (sandbox) {
    this.sandbox = sandbox;
    this.paintPanel = new Example.PaintPanel(this.sandbox.container);
    this.paintPanel.init();
    this.recieveData = function (data) {
        console.log("in recieve data" + data);
    };

    var scElements = {};

    function drawAllElements() {
        var dfd = new jQuery.Deferred();
            jQuery.each(scElements, function(j, val){
                var obj = scElements[j];
                if (!obj || obj.translated) return;
                if (obj.data.type & sc_type_arc_pos_const_perm) {
                    var begin = obj.data.begin;
                    var end = obj.data.end;
                }

        });
        SCWeb.ui.Locker.hide();
        dfd.resolve();
        return dfd.promise();
    }


    var self = this;
    this.needUpdate = false;
    this.requestUpdate = function () {
        var updateVisual = function () {
            var dfd1 = drawAllElements();
            dfd1.done(function (r) {
                return;
            });


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
SCWeb.core.ComponentManager.appendComponentInitialize(Example.DrawComponent);

/**
 * Paint panel.
 */

Example.PaintPanel = function (containerId) {
	this.containerId = containerId;
};

Example.PaintPanel.prototype = {

	init: function () {
		this._initMarkup(this.containerId);
	},

	_initMarkup: function (containerId) {
		var container = $('#' + containerId);

		var self = this;
		container.append('<div class="sc-no-default-cmd alert alert-success"> <h4 class="alert-heading">Интерфейс по здоровому образу жизни</h4></div>');
		container.append('<div class="container">');
		container.append('<button class="histoy-item-btn btn btn-primary" id="neButton" type="button">Узнать о здоровом образе жизни</button>');
		container.append('<button class="histoy-item-btn btn btn-primary" id="searchInfoButton" type="button">Главный индентификатор</button>');
		container.append('<button class="histoy-item-btn btn btn-primary" id="searchInfoButtonDiet" type="button">Узнать о диете</button>');
		container.append('<button class="histoy-item-btn btn btn-primary" id="agentbutton" type="button">Из каких разделов состоит Здоровый образ жизни</button>');
		container.append('<button class="histoy-item-btn btn btn-primary" id="angentMax" type="button">Поиск заболевания по симптому и максимальному инкубационному периоду</button>');
		container.append('<button class="histoy-item-btn btn btn-primary" id="agentbuttonsearchsport" type="button">Поиск заболевания по симптому и минимальному инкубационному периоду</button>');
		container.append('<div class="form-floating mb-3"> <input type="text" id="inp" class="form-control" placeholder="аргуент 1"> </div>');
		container.append('<div class="form-floating mb-3"> <input type="text" id="inp2" class="form-control" placeholder="аргугмент 2"> </div>');
		container.append('</div>');

		

		$('#neButton').click(function () {
			self._showMainMenuNode();
		});


		$('#searchInfoButton').click(function () {
			self._findMainIdentifier();
		});
		$('#searchInfoButtonDiet').click(function () {
			self._showDiet();
		});

		$('#agentbutton').click(function () {
			self._decomposition();
		});

		$('#angentMax').click(function (){
			self._findsportMaxComponent();
		});

		$('#agentbuttonsearchsport').click(function () {
			self._findsportComponent();
		});

		$('#generateNodes').click(function () {
			self._generateNodes();
		});
	},



	_showMainMenuNode: function () {
		var addr;
		SCWeb.core.Server.resolveScAddr(['healthy_style_of_life'], function (keynodes) {
			addr = keynodes['healthy_style_of_life'];
			SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],
				function (data) {
					var cmd = data["ui_menu_view_full_semantic_neighborhood"];
					SCWeb.core.Main.doCommand(cmd,
						[addr], function (result) {
							if (result.question != undefined) {
								SCWeb.ui.WindowManager.appendHistoryItem(result.question);
							}
						});
				});
		});
	},

	_decomposition: function () {
		var addr;
		SCWeb.core.Server.resolveScAddr(['healthy_style_of_life'], function (keynodes) {
			addr = keynodes['healthy_style_of_life'];
			SCWeb.core.Server.resolveScAddr(["ui_menu_view_decomposition"],function (data) {
					var cmd = data["ui_menu_view_decomposition"];
					SCWeb.core.Main.doCommand(cmd,
						[addr], function (result) {
							if (result.question != undefined) {
								SCWeb.ui.WindowManager.appendHistoryItem(result.question);
							}
						});
				});
		});
	},

	_showDiet: function () {
		var addr;
		SCWeb.core.Server.resolveScAddr(['concept_diets'], function (keynodes) {
			addr = keynodes['concept_diets'];
			SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],
				function (data) {
					var cmd = data["ui_menu_view_full_semantic_neighborhood"];
					SCWeb.core.Main.doCommand(cmd,
						[addr], function (result) {
							if (result.question != undefined) {
								SCWeb.ui.WindowManager.appendHistoryItem(result.question);
							}
						});
				});
		});
	},

	_findMainIdentifier: function () {
		console.log("inFind");
		var main_menu_addr, nrel_main_idtf_addr;
		SCWeb.core.Server.resolveScAddr(['concept_health', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['concept_health'];
			nrel_main_idtf_addr = keynodes['nrel_main_idtf'];
			console.log(main_menu_addr);
			console.log(nrel_main_idtf_addr);
			window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
				main_menu_addr,
				sc_type_arc_common | sc_type_const,
				sc_type_link,
				sc_type_arc_pos_const_perm,
				nrel_main_idtf_addr]).
				done(function (identifiers) {
					window.sctpClient.get_link_content(identifiers[0][2], 'string').done(function (content) {
						alert('Главный идентификатор: ' + content);
					});
				});
		});
	},




	_findsportComponent: function () {

		var input = $("#inp").val();
		var input2 = $('#inp2').val();
		SCWeb.core.Server.resolveScAddr([input,input2], function (keynodes) {
			var argOneAddr = keynodes[input];
			var argTwoAddr = keynodes[input2];
			SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_symptom_and_minimal_incubation_period"],function (data) {
					var cmd = data["ui_menu_file_for_finding_disease_by_symptom_and_minimal_incubation_period"];
					SCWeb.core.Main.doCommand(cmd,[argOneAddr,argTwoAddr], function (result) {
							if (result.question != undefined) {
								SCWeb.ui.WindowManager.appendHistoryItem(result.question);
							}
						});
				});
		});
	},


	_findsportMaxComponent: function () {

		var input = $("#inp").val();
		var input2 = $('#inp2').val();
		SCWeb.core.Server.resolveScAddr([input,input2], function (keynodes) {
			var argOneAddr = keynodes[input];
			var argTwoAddr = keynodes[input2];
			console.log("key", keynodes);
			console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
			SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_symptom_and_maximal_incubation_period.scs"],function (data) {
					var cmd = data["ui_menu_file_for_finding_disease_by_symptom_and_maximal_incubation_period.scs"];
					SCWeb.core.Main.doCommand(cmd,[argOneAddr,argTwoAddr], function (result) {
							if (result.question != undefined) {
								SCWeb.ui.WindowManager.appendHistoryItem(result.question);
							}
						});
				});
		});
	},


	_findvagetableComponent: function () {



		var input = $("#inp").val();


		
		SCWeb.core.Server.resolveScAddr([input], function (keynodes) {
			var argOneAddr = keynodes[input];
			var argTwoAddr;
			console.log("key", keynodes);
			console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
			// argOneAddr = SCWeb.core.Arguments._arguments[0];
			// argTwoAddr = SCWeb.core.Arguments._arguments[1];
			SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_search_animals_by_population"],function (data) {
					var cmd = data["ui_menu_file_for_search_animals_by_population"];
					SCWeb.core.Main.doCommand(cmd,[argOneAddr], function (result) {
							if (result.question != undefined) {
								SCWeb.ui.WindowManager.appendHistoryItem(result.question);
							}
						});
				});
		});
	},

	_generateNodes: function () {
		var main_menu_addr, nrel_main_idtf_addr, lang_en_addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['bivalvia', 'lang_lat', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['bivalvia'];
			nrel_main_idtf_addr = keynodes['nrel_main_idtf'];
			lang_en_addr = keynodes['lang_lat'];

			window.sctpClient.create_link().done(function (generatedLink) {
				window.sctpClient.set_link_content(generatedLink, 'Main menu');
				window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, main_menu_addr, generatedLink).done(function (generatedCommonArc) {
					window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_main_idtf_addr, generatedCommonArc);
				});
				window.sctpClient.create_arc(sc_type_arc_pos_const_perm, lang_en_addr, generatedLink);
			});
			$('#generateNodes').attr("sc_addr", main_menu_addr);
			SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],
				function (data) {
					// Get command of ui_menu_view_full_semantic_neighborhood
					var cmd = data["ui_menu_view_full_semantic_neighborhood"];
					// Simulate click on ui_menu_view_full_semantic_neighborhood button
					SCWeb.core.Main.doCommand(cmd,
						[main_menu_addr], function (result) {
							// waiting for result
							if (result.question != undefined) {
								// append in history
								SCWeb.ui.WindowManager.appendHistoryItem(result.question);
							}
						});
				});
		});
	}
};
