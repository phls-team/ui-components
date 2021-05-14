/**
 * Paint panel.
 */

training_section.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

training_section.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);

        var self = this;
        container.append('<div class="sc-no-default-cmd">Тренажёр</div>');
        container.append('<button id="newButton" type="button">Узнать всё о тренажёре</button>');
        container.append('<button id="searchInfoButton" type="button">Поиск главного идентификатора</button>');
	container.append('<button id="agentbutton" type="button">Поиск тренажёров схожих с заданным тренажёром</button>');
	container.append('<button id="buttonsearchmuscle" type="button">Узнать всё о мышцах</button>');
        container.append('<button id="generateNodes" type="button">Узнать всё о тренировке</button>');

        $('#newButton').click(function () {
			self._showMainMenuNode();
		});


		$('#searchInfoButton').click(function () {
			self._findMainIdentifier();
		});

		$('#agentbutton').click(function () {
			self._findsportComponent();
		});

		$('#buttonsearchmuscle').click(function () {
			self._showMuscles();
		});

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
		SCWeb.core.Server.resolveScAddr(['concept_training_apparatus'], function (keynodes) {
			addr = keynodes['concept_training_apparatus'];
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
		SCWeb.core.Server.resolveScAddr(['concept_training_apparatus', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['concept_training_apparatus'];
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
	_findsportComponent: function () {
		var argOneAddr;
		SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0]], function (keynodes) {
		console.log("key", keynodes);
		console.log("arguments", SCWeb.core.Arguments._arguments[0]);
		argOneAddr = SCWeb.core.Arguments._arguments[0];
		SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_similar_training_apparatus"],
		function (data) {
		var cmd = data["ui_menu_file_for_finding_similar_training_apparatus"];
		SCWeb.core.Main.doCommand(cmd,
		[argOneAddr], function (result) {
		if (result.question != undefined) {
		SCWeb.ui.WindowManager.appendHistoryItem(result.question);
		}
		});
		});
		});
		},

	_findvagetableComponent: function () {
var argOneAddr;
var argTwoAddr;
SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
console.log("key", keynodes);
console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
argOneAddr = SCWeb.core.Arguments._arguments[0];
argTwoAddr = SCWeb.core.Arguments._arguments[1];
SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_sport_by_minimal_total_of_participants_and_match_time"],
function (data) {
var cmd = data["ui_menu_file_for_finding_sport_by_minimal_total_of_participants_and_match_time"];
SCWeb.core.Main.doCommand(cmd,
[argOneAddr, argTwoAddr], function (result) {
if (result.question != undefined) {
SCWeb.ui.WindowManager.appendHistoryItem(result.question);
}
});
});
});
},

_showMuscles: function () {
    var addr;
    // Resolve sc-addr. Get sc-addr of ui_main_menu node
    SCWeb.core.Server.resolveScAddr(['muscles'], function (keynodes) {
        addr = keynodes['muscles'];
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

    _generateNodes: function () {
		var main_menu_addr, nrel_main_idtf_addr, lang_en_addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['concept_training', 'lang_en', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['concept_training'];
			nrel_main_idtf_addr = keynodes['nrel_main_idtf'];
			lang_en_addr = keynodes['lang_en'];

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
