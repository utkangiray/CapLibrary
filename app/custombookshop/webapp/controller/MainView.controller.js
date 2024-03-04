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
          this.oMainModel = this.getOwnerComponent().getModel("mainModel");
          this.getView().setModel(this.oDataModel);

          // this.bookTableConfiguration();
          // this.oDataModel.read("/Books", {
          //   success: (oData, oResponse) => {
          //     var data = oData.results;
          //     let oSmartTableEntry = (({
          //       ID,
          //       author_ID,
          //       category_ID,
          //       descr,
          //       stock,
          //       title,
          //     }) => ({
          //       ID,
          //       author_ID,
          //       category_ID,
          //       descr,
          //       stock,
          //       title,
          //     }))(data);

          //     this.oMainModel.setProperty("/ListAll", oSmartTableEntry);
          //   },
          //   error: (oError) => {},
          // });
        },

        bookTableConfiguration: function () {
          let oTable = this.getView("ListAll").byId("idTblBookData").getTable();
          oTable.setMode("MultiSelect");
          oTable.attachSelectionChange(this.onTableSelection, this);
        },

        onOpenMultiEdit: function (oEvent) {
          Fragment.load({
            name: "ntt.bookshop.custombookshop.view.fragments.MultiEditBookDialog",
            controller: this,
          }).then(
            function (oFragment) {
              this.oBooksMultiEditDialog = oFragment;
              this.getView().addDependent(this.oBooksMultiEditDialog);

              this.oBooksMultiEditDialog.setEscapeHandler(
                function () {
                  this.onCloseDialog();
                }.bind(this)
              );

              this.oBooksMultiEditDialog
                .getContent()[0]
                .setContexts(
                  this.getView()
                    .byId("idTblBookData")
                    .getTable()
                    .getSelectedContexts()
                );
              syncStyleClass(
                "sapUiSizeCompact",
                this.getView(),
                this.oBooksMultiEditDialog
              );
              this.oBooksMultiEditDialog.open();
            }.bind(this)
          );
        },
        onBookCloseDialog: function () {
          this.oBooksMultiEditDialog.close();
          this.oBooksMultiEditDialog.destroy();
          this.oBooksMultiEditDialog = null;
        },
        onTableSelection: function () {
          var aSelectedItems = this.getView()
            .byId("idTblBookData")
            .getTable()
            .getSelectedItems();
          this.getView()
            .byId("btnMultiEditBook")
            .setEnabled(aSelectedItems.length > 0);
        },
        onBookDialogSaveButton: function () {
          var oMultiEditContainer = this.oBooksMultiEditDialog.getContent()[0];

          this.oBooksMultiEditDialog.setBusy(true);
          oMultiEditContainer
            .getErroneousFieldsAndTokens()
            .then(
              function (aErrorFields) {
                this.oBooksMultiEditDialog.setBusy(false);
                if (aErrorFields.length === 0) {
                  this._saveChanges();
                }
              }.bind(this)
            )
            .catch(
              function () {
                this.oBooksMultiEditDialog.setBusy(false);
              }.bind(this)
            );
        },
        _saveChanges: function () {
          var oMultiEditContainer = this.oBooksMultiEditDialog.getContent()[0],
            that = this,
            aUpdatedContexts,
            oContext,
            oUpdatedData,
            oObjectToUpdate,
            oUpdatedDataCopy;

          var fnHandler = function (oField) {
            var sPropName = oField.getPropertyName(),
              sUomPropertyName = oField.getUnitOfMeasurePropertyName();
            if (
              !oField.getApplyToEmptyOnly() ||
              !oObjectToUpdate[sPropName] ||
              (typeof oObjectToUpdate[sPropName] == "string" &&
                !oObjectToUpdate[sPropName].trim())
            ) {
              oUpdatedDataCopy[sPropName] = oUpdatedData[sPropName];
            }
            if (oField.isComposite()) {
              if (
                !oField.getApplyToEmptyOnly() ||
                !oObjectToUpdate[sUomPropertyName]
              ) {
                oUpdatedDataCopy[sUomPropertyName] =
                  oUpdatedData[sUomPropertyName];
              }
            }
          };

          MessageToast.show("Save action started");
          oMultiEditContainer.getAllUpdatedContexts(true).then(
            function (result) {
              MessageToast.show("Updated contexts available", {
                onClose: function () {
                  debugger;
                  aUpdatedContexts = result;
                  for (var i = 0; i < aUpdatedContexts.length; i++) {
                    oContext = aUpdatedContexts[i].context;
                    oUpdatedData = aUpdatedContexts[i].data;
                    oObjectToUpdate = oContext
                      .getModel()
                      .getObject(oContext.getPath());
                    oUpdatedDataCopy = {};
                    this._getFields()
                      .filter(function (oField) {
                        return !oField.isKeepExistingSelected();
                      })
                      .forEach(fnHandler);
                    oContext
                      .getModel()
                      .update(oContext.getPath(), oUpdatedDataCopy);
                  }
                  MessageToast.show("Model was updated");

                  that.onBookCloseDialog();
                }.bind(this),
              });
            }.bind(oMultiEditContainer)
          );
          this.oBooksMultiEditDialog.close();
        },
      }
    );
  }
);
