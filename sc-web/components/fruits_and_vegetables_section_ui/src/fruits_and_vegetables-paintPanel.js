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
        container.append('<div class="sc-no-default-cmd">Фрукты и овощи</div>');
        container.append('<button id="fruitsButton" type="button">Узнать все о фруктах</button>');
        container.append('<button id="searchInfoFruitsButton" type="button">Поиск главного идентификатора фрукты</button>');
        container.append('<button id="vegetablesButton" type="button">Узнать все об овощах</button>');
        container.append('<button id="searchInfoVegetablesButton" type="button">Поиск главного идентификатора овощи</button>');
		container.append('<button id="agentbutton" type="button">Узнать о подходящих фруктах и овощей по калорийности основываясь на минимальной и максимальной границе</button>');

        $('#fruitsButton').click(function () {
			self._showFruitsNode();
		});


		$('#searchInfoFruitsButton').click(function () {
			self._findFruitsMainIdentifier();
		});

        $('#vegetablesButton').click(function () {
			self._showVegetablesNode();
		});


		$('#searchInfoVegetablesButton').click(function () {
			self._findVegetablesMainIdentifier();
		});

		$('#agentbutton').click(function () {
			self._findFruitsAndVegetablesComponent();
		});
    },

    /* Call agent of searching semantic neighborhood,
	send ui_main_menu node as parameter and add it in web window history
	*/
	_showFruitsNode: function () {
		var addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['concept_fruit'], function (keynodes) {
			addr = keynodes['concept_fruit'];
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
	_showVegetablesNode: function () {
		var addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['concept_vegetable'], function (keynodes) {
			addr = keynodes['concept_vegetable'];
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

	_findFruitsMainIdentifier: function () {
		console.log("inFind");
		var main_menu_addr, nrel_main_idtf_addr;
		// Resolve sc-addrs.
		SCWeb.core.Server.resolveScAddr(['concept_fruit', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['concept_fruit'];
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

	_findVegetablesMainIdentifier: function () {
		console.log("inFind");
		var main_menu_addr, nrel_main_idtf_addr;
		// Resolve sc-addrs.
		SCWeb.core.Server.resolveScAddr(['concept_vegetable', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['concept_vegetable'];
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
	_findFruitsAndVegetablesComponent: function () {
		var argOneAddr;
		var argTwoAddr;
        SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
            console.log("key", keynodes);
            console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
			argOneAddr = SCWeb.core.Arguments._arguments[0];
			argTwoAddr = SCWeb.core.Arguments._arguments[1];
            SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_fruits_and_vegetables_by_min_max_calories"],
            function (data) {
                var cmd = data["ui_menu_file_for_finding_fruits_and_vegetables_by_min_max_calories"];
                SCWeb.core.Main.doCommand(cmd,
                [argOneAddr, argTwoAddr], function (result) {
                    if (result.question != undefined) {
                        SCWeb.ui.WindowManager.appendHistoryItem(result.question);
                    }
                });
            });
        });
    },
};