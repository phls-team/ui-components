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
        container.append('<div class="sc-no-default-cmd">Тренировки и питание</div>');
        container.append('<button id="newButton" type="button">Узнать все о тренировках</button>');
        container.append('<button id="searchInfoButton" type="button">Поиск главного идентификатора</button>');
        container.append('<button id="agentbutton" type="button">Узнать базальный метаболизм спортсмена</button>');
        container.append('<button id="agentbuttonsearchsport" type="button">Вывести список спортсменов</button>');
        //  container.append('<button id="moveToNavigationNode" type="button">Перейти к описанию ключевых узлов навигации</button>');
        //If you don't want to make default command - add class="sc-no-default-cmd" to button
        container.append('<button id="generateNodes" type="button">Основные узлы в разделе спорт</button>');
        container.append('<select id="disease-search-select">'
            + '<option id="abdomen">'
            + 'Упражнения на пресс'
            + '</option>'
            + '<option id="back">'
            + 'Упражнения на спину'
            + '</option>'
            + '<option id="full-body">'
            + 'Упражнения на всё тело'
            + '</option>'
            + '<option id="hands">'
            + 'Упражнения на руки'
            + '</option>'
            + '<option id="legs">'
            + 'Упражнения на ноги'
            + '</option>'
            + '<option id="lateral-muscles">'
            + 'Упражнения на шею'
            + '</option>'
            + '<option id="street-workout">'
            + 'Упражнения для стрит-воркаута'
            + '</option>'
            + '</select>');
        container.append('<button id="search-btn" type="button">Поиск</button>');

        $('#newButton').click(function () {
            self._showMainMenuNode();
        });
        $('#searchInfoButton').click(function () {
            self._findMainIdentifier();
        });
        $('#agentbutton').click(function () {
            self._findsportComponent();
        });
        $('#agentbuttonsearchsport').click(function () {
            self._findvagetableComponent();
        });

        //SCWeb.core.Server.resolveScAddr(['ui_menu_na_keynodes'], function (keynodes) {
        //$('#moveToNavigationNode').attr("sc_addr", keynodes['ui_menu_na_keynodes']);
        //});

        $('#generateNodes').click(function () {
            self._generateNodes();
        });
        $('#search-btn').click(function () {
            var selected = $('#disease-search-select').children(":selected").attr("id");
            switch (selected) {
                case "abdomen":
                    self._findAbdomenExercise();
                    break;
                case "back":
                    self._findBackExercise();
                    break;
                case "full-body":
                    self._findFullBodyExercice();
                    break;
                case "hands":
                    self._findHandsExercise();
                    break;
                case "legs":
                    self._findLegsExercise();
                    break;
                case "lateral-muscles":
                    self._findLateralExercise();
                    break;
                case "street-workout":
                    self._findSWorkoutExercise();
                    break;
            }
        });
    },

    /* Call agent of searching semantic neighborhood,
	send ui_main_menu node as parameter and add it in web window history
	*/
    _showMainMenuNode: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_training'], function (keynodes) {
            addr = keynodes['concept_training'];
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
        SCWeb.core.Server.resolveScAddr(['concept_training', 'nrel_main_idtf'], function (keynodes) {
            main_menu_addr = keynodes['concept_training'];
            nrel_main_idtf_addr = keynodes['nrel_main_idtf'];
            console.log(main_menu_addr);
            console.log(nrel_main_idtf_addr);
            // Resolve sc-addr of ui_menu_view_full_semantic_neighborhood node
            window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                main_menu_addr,
                sc_type_arc_common | sc_type_const,
                sc_type_link,
                sc_type_arc_pos_const_perm,
                nrel_main_idtf_addr]).done(function (identifiers) {
                window.sctpClient.get_link_content(identifiers[0][2], 'string').done(function (content) {
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
            SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_calculate_basal_metabolism"],
                function (data) {
                    var cmd = data["ui_menu_file_for_calculate_basal_metabolism"];
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
    _findAbdomenExercise: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_physical_exercise_for_the_abdomen'], function (keynodes) {
            addr = keynodes['concept_physical_exercise_for_the_abdomen'];
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
    _findBackExercise: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_physical_exercise_for_the_back'], function (keynodes) {
            addr = keynodes['concept_physical_exercise_for_the_back'];
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
    _findFullBodyExercice: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_physical_exercise_for_the_body'], function (keynodes) {
            addr = keynodes['concept_physical_exercise_for_the_body'];
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

    _findHandsExercise: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_physical_exercise_for_the_hands'], function (keynodes) {
            addr = keynodes['concept_physical_exercise_for_the_hands'];
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

    _findLegsExercise: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_physical_exercise_for_the_legs'], function (keynodes) {
            addr = keynodes['concept_physical_exercise_for_the_legs'];
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
    _findLateralExercise: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['strengthening_the_lateral_muscles'], function (keynodes) {
            addr = keynodes['strengthening_the_lateral_muscles'];
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
    _findSWorkoutExercise: function () {
        var addr;
        // Resolve sc-addr. Get sc-addr of ui_main_menu node
        SCWeb.core.Server.resolveScAddr(['concept_workout_element'], function (keynodes) {
            addr = keynodes['concept_workout_element'];
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
        SCWeb.core.Server.resolveScAddr(['concept_sport', 'lang_en', 'nrel_main_idtf'], function (keynodes) {
            main_menu_addr = keynodes['concept_sport'];
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
