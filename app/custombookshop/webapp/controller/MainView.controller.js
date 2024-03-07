sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Fragment, syncStyleClass, MessageToast) {
    "use strict";

    return Controller.extend(
      "ntt.bookshop.custombookshop.controller.MainView",
      {
        onInit: function () {
          var oDataModel, oView;
          this.oDataModel = this.getOwnerComponent().getModel();
          //  this.oMainModel = this.getOwnerComponent().getModel("mainModel");
          this.getView().setModel(this.oDataModel);

          var oEventBus = sap.ui.getCore().getEventBus();
       oEventBus.subscribe("LisAll", "rebindCharts", this.rebindCharts, this)
     
        },

        rebindCharts : function () {
          this.getView().byId("smartChartBooks").rebindChart();
          this.getView().byId("smartChartAuthor").rebindChart();
        }
      }
    );
  }
);
