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
        }
      }
    );
  }
);
