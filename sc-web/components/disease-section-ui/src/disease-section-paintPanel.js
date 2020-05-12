/**
 * Paint panel.
 */

DiseasesSection.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

DiseasesSection.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);

        var self = this;
        container.append('<div class="sc-no-default-cmd">Раздел заболеваний</div>');
        container.append('<button id="classification-btn" type="button">Узнать о классификации заболеваний</button>');
          container.append('<button id="ICD-btn">Узнать о МКБ-11</button>');
          container.append('<button id="illness-button">Что такое болезнь?</button>');
          container.append('<button id="disease-button">Что такое заболевание?</button>');
          container.append('<button id="prophylax-button">Узнать о профилактике</button>');
container.append('<select id="disease-search-select">'
+'<option id="by-symptom-and-max-incub-per">'
+'Поиск заболевания по симптому и макс. инкубационному периоду'
+'</option>'
+'<option id="by-symptom-and-min-incub-per">'
+'Поиск заболевания по симптому и мин. инкубационному периоду'
+'</option>'
+'<option id="by-vaccine-and-pandemia-start">'
+'Поиск заболевания по началу пандемии и вакцине '
+'</option>'
+'<option id="by-vaccine-and-pandemia-end">'
+'Поиск заболевания по концу пандемии и вакцине'
+'</option>'
+'<option id="vaccine-by-disease-and-creation-year">'
+'Поиск вакцины по заболеванию и дате её создания'
+'</option>'
+'</select>');
container.append('<button id="search-btn" type="button">Поиск</button>');

      $('#ICD-btn').click(function(){
        self._showICD();
      });

      $('#prophylax-button').click(function(){
        self._showProphylaxConcept();
      });

      $('#disease-button').click(function(){
        self._showDiseaseConcept();
      });

      $('#illness-button').click(function(){
        self._showIllnessConcept();
      });
 $('#search-btn').click(function () {
var selected = $('#disease-search-select').children(":selected").attr("id");
switch (selected) {
    case "by-symptom-and-max-incub-per":
      	self._findBySymptomAndMaxIncubPer();
      break;
      case "by-symptom-and-min-incub-per":
       self._findBySymptomAndMinIncubPer();
      break;
      case "by-vaccine-and-pandemia-start":
      self._findDiseaseByPandemiaEndAndVaccine();
    break;
    case "vaccine-by-disease-and-creation-year":
    self._findVaccineByDiseaseAndCreationYear();
    break;
}
		});

        $('#classification-btn').click(function () {
			self._showIllenessClassification();
		});


		$('#searchInfoButton').click(function () {
			self._findMainIdentifier();
		});

		SCWeb.core.Server.resolveScAddr(['ui_menu_na_keynodes'], function (keynodes) {
			$('#moveToNavigationNode').attr("sc_addr", keynodes['ui_menu_na_keynodes']);
		});

		$('#generateNodes').click(function () {
			self._generateNodes();
		});
    },

	_findBySymptomAndMaxIncubPer: function () {
		var argOneAddr;
                var argTwoAddr;
		SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
			console.log("key", keynodes);
			console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
			argOneAddr = SCWeb.core.Arguments._arguments[0];
                        argTwoAddr = SCWeb.core.Arguments._arguments[1];
			SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_symptom_and_maximal_incubation_period"],
			function (data) {
				var cmd = data["ui_menu_file_for_finding_disease_by_symptom_and_maximal_incubation_period"];
				SCWeb.core.Main.doCommand(cmd,
				[argOneAddr, argTwoAddr], function (result) {
					if (result.question != undefined) {
						SCWeb.ui.WindowManager.appendHistoryItem(result.question);
					}
				});
			});
		});
	},
  _findBySymptomAndMinIncubPer: function () {
    var argOneAddr;
                var argTwoAddr;
    SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
      console.log("key", keynodes);
      console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
      argOneAddr = SCWeb.core.Arguments._arguments[0];
                        argTwoAddr = SCWeb.core.Arguments._arguments[1];
      SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_symptom_and_minimal_incubation_period"],
      function (data) {
        var cmd = data["ui_menu_file_for_finding_disease_by_symptom_and_minimal_incubation_period"];
        SCWeb.core.Main.doCommand(cmd,
        [argOneAddr, argTwoAddr], function (result) {
          if (result.question != undefined) {
            SCWeb.ui.WindowManager.appendHistoryItem(result.question);
          }
        });
      });
    });
  },
  _findDiseaseByPandemiaEndAndVaccine: function () {
    var argOneAddr;
                var argTwoAddr;
    SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
      console.log("key", keynodes);
      console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
      argOneAddr = SCWeb.core.Arguments._arguments[0];
                        argTwoAddr = SCWeb.core.Arguments._arguments[1];
      SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_pandemia_year_end_and_vaccine"],
      function (data) {
        var cmd = data["ui_menu_file_for_finding_disease_by_pandemia_year_end_and_vaccine"];
        SCWeb.core.Main.doCommand(cmd,
        [argOneAddr, argTwoAddr], function (result) {
          if (result.question != undefined) {
            SCWeb.ui.WindowManager.appendHistoryItem(result.question);
          }
        });
      });
    });
  },
  _findDiseaseByPandemiaStartAndVaccine: function () {
    var argOneAddr;
                var argTwoAddr;
    SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
      console.log("key", keynodes);
      console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
      argOneAddr = SCWeb.core.Arguments._arguments[0];
                        argTwoAddr = SCWeb.core.Arguments._arguments[1];
      SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_pandemia_year_start_and_vaccine"],
      function (data) {
        var cmd = data["ui_menu_file_for_finding_disease_by_pandemia_year_start_and_vaccine"];
        SCWeb.core.Main.doCommand(cmd,
        [argOneAddr, argTwoAddr], function (result) {
          if (result.question != undefined) {
            SCWeb.ui.WindowManager.appendHistoryItem(result.question);
          }
        });
      });
    });
  },

  _findVaccineByDiseaseAndCreationYear: function () {
    var argOneAddr;
                var argTwoAddr;
    SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
      console.log("key", keynodes);
      console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
      argOneAddr = SCWeb.core.Arguments._arguments[0];
                        argTwoAddr = SCWeb.core.Arguments._arguments[1];
      SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_vaccine_by_disease_and_creation_year"],
      function (data) {
        var cmd = data["ui_menu_file_for_finding_vaccine_by_disease_and_creation_year"];
        SCWeb.core.Main.doCommand(cmd,
        [argOneAddr, argTwoAddr], function (result) {
          if (result.question != undefined) {
            SCWeb.ui.WindowManager.appendHistoryItem(result.question);
          }
        });
      });
    });
  },

    /* Call agent of searching semantic neighborhood,
	send ui_main_menu node as parameter and add it in web window history
	*/
	_showIllenessClassification: function () {
		var addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['concept_illness_classification'], function (keynodes) {
			addr = keynodes['concept_illness_classification'];
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
  _showDiseaseConcept: function () {
    var addr;
    // Resolve sc-addr. Get sc-addr of concept_disease node
    SCWeb.core.Server.resolveScAddr(['concept_disease'], function (keynodes) {
      addr = keynodes['concept_disease'];
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
  _showIllnessConcept: function () {
    var addr;
    // Resolve sc-addr. Get sc-addr of ui_main_menu node
    SCWeb.core.Server.resolveScAddr(['concept_illness'], function (keynodes) {
      addr = keynodes['concept_illness'];
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
  _showProphylaxConcept: function () {
    var addr;
    // Resolve sc-addr. Get sc-addr of ui_main_menu node
    SCWeb.core.Server.resolveScAddr(['concept_prophylaxy'], function (keynodes) {
      addr = keynodes['concept_prophylaxy'];
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

  _showICD: function () {
    var addr;
    // Resolve sc-addr. Get sc-addr of ui_main_menu node
    SCWeb.core.Server.resolveScAddr(['concept_ICD_11_classification'], function (keynodes) {
      addr = keynodes['concept_ICD_11_classification'];
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
		SCWeb.core.Server.resolveScAddr(['ui_main_menu', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['ui_main_menu'];
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

    _generateNodes: function () {
		var main_menu_addr, nrel_main_idtf_addr, lang_en_addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['ui_main_menu', 'lang_en', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['ui_main_menu'];
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
