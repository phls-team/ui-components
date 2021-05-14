var healthySection = {};

function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superclass = parent.prototype;
}

/**
 * ProjectHealthy section component.
 */
healthySection.DrawComponent = {
    ext_lang: 'Healthy_lifestyle_section',
    formats: ['Healthy_lifestyle_json'],
    struct_support: true,
    factory: function (sandbox) {
        return new healthySection.DrawWindow(sandbox);
    }
};

healthySection.DrawWindow = function (sandbox) {
    this.sandbox = sandbox;
    this.paintPanel = new healthySection.PaintPanel(this.sandbox.container);
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
SCWeb.core.ComponentManager.appendComponentInitialize(healthySection.DrawComponent);

/**
 * Paint panel.
 */

healthySection.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

healthySection.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
      var container = $('#' + containerId);

      var self = this;
      container.append('<label for="introduction" id="interface"><u>Добро пожаловать в интерефейс посвященному Здоровому образу жизни</u></label>');
      container.append('<label for="sport_nutrition" id="sport_nutrition"><b>Спортивное питание<b></label>');
      container.append('<button id="about-sport-nutrition" type="button">Узнать о спортивном питании</button>');
            $('#about-sport-nutrition').click(function(){
              self._aboutSportNutrition();
            });
            container.append('<select id="select_sport_nutrition_information>'
      +'<option id="amino_acids">'
      +'Что такое <b>аминокислоты?</b>'
      +'</option>'
      +'<option id="anticatabolic">'
      +'Что такое <b>антикатаболик?</b>'
      +'</option>'
      +'<option id="carbohydrate_protein_mixtures">'
      +'Что такое <b>гейнер?</b>'
      +'</option>'
      +'<option id="chondroitin_sulfate">'
      +'Что такое <b>хондроитин сульфат?</b>'
      +'</option>'
      +'<option id="collagen">'
      +'Что такое <b>коллаген?</b>'
      +'</option>'
      +'<option id="creatine">'
      +'Что такое <b>креатин?</b>'
      +'</option>'
      +'<option id="energy_drink">'
      +'Что такое <b>энергетические напитки?</b>'
      +'</option>'
      +'<option id="fat_burners">'
      +'Что такое <b>жиросжигатели?</b>'
      +'</option>'
      +'<option id="glucosamine">'
      +'Что такое <b>глюкозамин?</b>'
      +'</option>'
      +'<option id="growth_hormone">'
      +'Что такое <b>глюкозамин?</b>'
      +'</option>'
      +'<option id="high_protein_foods">'
      +'Что такое <b>высокобелковые продукты?</b>'
      +'</option>'
      +'<option id="isotonic">'
      +'Что такое <b>изотоник?</b>'
      +'</option>'
      +'<option id="meal_replacement">'
      +'Что такое <b>заменитель еды?</b>'
      +'</option>'
      +'<option id="nitrogen_oxide_doner">'
      +'Что такое <b>нитробустеры?</b>'
      +'</option>'
      +'<option id="phosphatidylserine">'
      +'Что такое <b>фосфатидилсерин?</b>'
      +'</option>'
      +'<option id="testosterone">'
      +'Что такое <b>тестостероные добавки?</b>'
      +'</option>'
      +'<option id="vitamin_complexes">'
      +'Что такое <b>витамино-минеральные комплексы?</b>'
      +'</option>'
      +'<option id="hondroprotector">'
      +'Что такое <b>xондропротекторы?</b>'
      +'</option>'
      +'</select>');

      /*
     $('#select_sport_nutrition_information').click(function () {
        var selected = $('#select_sport_nutrition_information').children(":selected").attr("id");
        switch (selected) {
            case "amino_acids":
                self._findSubject('concept_amino_acids');
              break;
              case "anticatabolic":
               self._findSubject('concept_anticatabolic');
              break;
              case "carbohydrate_protein_mixtures":
               self._findSubject('concept_carbohydrate_protein_mixtures');
              break;
              case "chondroitin_sulfate":
               self._findSubject('concept_chondroitin_sulfate');
              break;
              case "collagen":
               self._findSubject('concept_collagen');
              break;
              case "creatine":
               self._findSubject('concept_creatine');
              break;
              case "energy_drink":
               self._findSubject('concept_energy_drink');
              break;
              case "fat_burners":
               self._findSubject('concept_fat_burners');
              break;
              case "glucosamine":
               self._findSubject('concept_glucosamine');
              break;
              case "growth_hormone":
               self._findSubject('concept_growth_hormone');
              break;
              case "isotonic":
               self._findSubject('concept_isotonic');
              break;
              case "meal_replacement":
               self._findSubject('concept_meal_replacement');
              break;
              case "nitrogen_oxide_doner":
               self._findSubject('concept_nitrogen_oxide_doner');
              break;
              case "phosphatidylserine":
               self._findSubject('concept_phosphatidylserine');
              break;
              case "testosterone":
               self._findSubject('concept_testosterone');
              break;
              case "vitamin_complexes":
               self._findSubject('concept_vitamin_complexes');
              break;
              case "hondroprotector":
               self._findSubject('concept_hondroprotector');
              break;
        }
            });
*/

      container.append('<select id="sport_type_nutrition_found">'
      +'<option id="for_finding_sports_nutrition_for_a_specific_type">'
      +'Поиск определенного вида спортивного питания'
      +'</option>'
      +'<option id="finding_products_of_a_certain_type_of_sports_nutrition">'
      +'Найти все спортивное питание, по определенному виду'
      +'</option>'
      +'</select>');
      container.append('<button id="choose-btn" type="button">Найти</button>');
      $('#choose-btn').click(function () {
        var selected = $('#sport_type_nutrition_found').children(":selected").attr("id");
        switch (selected) {
            case "for_finding_sports_nutrition_for_a_specific_type":
                self._findSportNutritionForSpecificType();
              break;
              case "finding_products_of_a_certain_type_of_sports_nutrition":
              self._findProductsOfACertainType();
              break;
        }
            });

      //finish disease
      container.append('<label for="diseases" id="epidemic-diseases-label"><b>Болезни-эпидемии<b></label>');
      container.append('<button id="about-epidemic" type="button">Что такое эпидемия?</button>');
            $('#about-epidemic').click(function(){
              self._aboutEpidemic();
            });
      container.append('<select id="disease-epidemic-search-select">'
      +'<option id="by_symptom_and_begin_pandemia">'
      +'Поиск заболевания-эпидемии по сиптомам и началу пандемии'
      +'</option>'
      +'<option id="by_symptom_and_end_pandemia">'
      +'Поиск заболевания-эпидемии по сиптомам и концу пандемии'
      +'</option>'
      +'</select>');
      container.append('<button id="search-btn" type="button">Поиск</button>');
      $('#search-btn').click(function () {
        var selected = $('#disease-epidemic-search-select').children(":selected").attr("id");
        switch (selected) {
            case "by_symptom_and_begin_pandemia":
                self._findBySymptomAndBeginPandemia();
              break;
              case "by_symptom_and_end_pandemia":
               self._findBySymptomAndEndPandemia();
              break;
        }
            });
},

_findBySymptomAndBeginPandemia: function () {
  var argOneAddr;
  var argTwoAddr;
  SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
    console.log("key", keynodes);
    console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
    argOneAddr = SCWeb.core.Arguments._arguments[0];
                      argTwoAddr = SCWeb.core.Arguments._arguments[1];
    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_symptom_and_begin_pandemia"],
    function (data) {
      var cmd = data["ui_menu_file_for_finding_disease_by_symptom_and_begin_pandemia"];
      SCWeb.core.Main.doCommand(cmd,
      [argOneAddr, argTwoAddr], function (result) {
        if (result.question != undefined) {
          SCWeb.ui.WindowManager.appendHistoryItem(result.question);
        }
      });
    });
  });
},

_findBySymptomAndEndPandemia: function () {
  var argOneAddr;
  var argTwoAddr;
  SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]], function (keynodes) {
    console.log("key", keynodes);
    console.log("arguments", SCWeb.core.Arguments._arguments[0], SCWeb.core.Arguments._arguments[1]);
    argOneAddr = SCWeb.core.Arguments._arguments[0];
                      argTwoAddr = SCWeb.core.Arguments._arguments[1];
    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_disease_by_symptom_and_end_pandemia"],
    function (data) {
      var cmd = data["ui_menu_file_for_finding_disease_by_symptom_and_end_pandemia"];
      SCWeb.core.Main.doCommand(cmd,
      [argOneAddr, argTwoAddr], function (result) {
        if (result.question != undefined) {
          SCWeb.ui.WindowManager.appendHistoryItem(result.question);
        }
      });
    });
  });
},

_findSportNutritionForSpecificType: function () {
  var argOneAddr;
  SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0]], function (keynodes) {
    console.log("key", keynodes);
    console.log("arguments", SCWeb.core.Arguments._arguments[0]);
    argOneAddr = SCWeb.core.Arguments._arguments[0];
    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_sports_nutrition_for_a_specific_type"],
    function (data) {
      var cmd = data["ui_menu_file_for_finding_sports_nutrition_for_a_specific_type"];
      SCWeb.core.Main.doCommand(cmd,
      [argOneAddr], function (result) {
        if (result.question != undefined) {
          SCWeb.ui.WindowManager.appendHistoryItem(result.question);
        }
      });
    });
  });
},

_findProductsOfACertainType: function () {
  var argOneAddr;
  SCWeb.core.Server.resolveScAddr([SCWeb.core.Arguments._arguments[0]], function (keynodes) {
    console.log("key", keynodes);
    console.log("arguments", SCWeb.core.Arguments._arguments[0]);
    argOneAddr = SCWeb.core.Arguments._arguments[0];
    SCWeb.core.Server.resolveScAddr(["ui_menu_finding_products_of_a_certain_type_of_sports_nutrition"],
    function (data) {
      var cmd = data["ui_menu_finding_products_of_a_certain_type_of_sports_nutrition"];
      SCWeb.core.Main.doCommand(cmd,
      [argOneAddr], function (result) {
        if (result.question != undefined) {
          SCWeb.ui.WindowManager.appendHistoryItem(result.question);
        }
      });
    });
  });
},

_aboutSportNutrition: function () {
  var addr;
  // Resolve sc-addr. Get sc-addr of ui_main_menu node
  SCWeb.core.Server.resolveScAddr(['concept_sport_eat'], function (keynodes) {
    addr = keynodes['concept_sport_eat'];
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

_aboutEpidemic: function () {
  var addr;
  // Resolve sc-addr. Get sc-addr of ui_main_menu node
  SCWeb.core.Server.resolveScAddr(['concept_epiemic'], function (keynodes) {
    addr = keynodes['concept_epiemic'];
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

_findSubject: function (number) {
  var addr;
  // Resolve sc-addr. Get sc-addr of ui_main_menu node
  SCWeb.core.Server.resolveScAddr([number], function (keynodes) {
    addr = keynodes[number];
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
