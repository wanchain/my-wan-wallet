<!-- Content -->
<div class="col-sm-8">

  <!-- If unlocked with PK -->
  <article class="block" ng-hide="wallet.type=='addressOnly'">
    <p>

      Stake your Wan using MyWanWallet!
    </p>

    <!-- Validator Dropdown -->
    <section class="row form-group">
        <div class="col-sm-11 clearfix">
            <label translate="STAKING_Title_2">
                Select Validator
            </label>

            <div class="dropdown ">
                <a class="btn btn-default dropdown-toggle "
                   class="dropdown-toggle"
                   style="background-color: white;"
                   ng-click="dropdownExistingValidators = !dropdownExistingValidators">
                    <img class="validatorIcon" ng-src="{{validator.logo}}" ng-show="validator.logo && validator.logo!=''"/>
                    <img class="validatorIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=" ng-hide="validator.logo && validator.logo!=''"/>
                    {{selectedValidator.name}} (Capacity left: {{selectedValidator.leftovercapacity}})
                    <i class="caret"></i>
                </a>

                <ul class="dropdown-menu dropdown-menu-left" ng-show="dropdownExistingValidators">
                    <li ng-repeat="validator in ajaxReq.validatorList track by $index">
                        <a ng-click="selectExistingValidator($index)">
                            <img class="validatorIcon" ng-src="{{validator.logo}}" ng-show="validator.logo && validator.logo!=''"/>
                            <img class="validatorIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=" ng-hide="validator.logo && validator.logo!=''"/>
                            {{validator.name}} (Capacity left: {{validator.leftovercapacity}})
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Validator Info -->
    <div class="row"><div class="col-sm-4 clearfix">Validator Self Stake:</div>
    <div class="col-sm-2 clearfix" style="text-align:right">{{selectedValidator.selfstake}}</div></div>
    <div class="row"><div class="col-sm-4 clearfix">Validator Total Stake:</div>
    <div class="col-sm-2 clearfix" style="text-align:right">{{selectedValidator.totalstake}}</div></div>
    <div class="row"><div class="col-sm-4 clearfix">Validator Total Capacity:</div>
    <div class="col-sm-2 clearfix" style="text-align:right">{{selectedValidator.capacity}}</div></div>
    <div class="row"><div class="col-sm-4 clearfix">Validator Remaining Capacity:</div>
    <div class="col-sm-2 clearfix" style="text-align:right">{{selectedValidator.leftovercapacity}}</div></div>
    <div class="row"><div class="col-sm-4 clearfix">Fee:</div>
    <div class="col-sm-2 clearfix" style="text-align:right">{{selectedValidator.feestring}}</div></div>

    <!-- Validator Address -->
    <section class="row form-group">
        <address-field labeltranslated="STAKING_Title" var-name="validator.address">{{selectedValidator.address}}</address-field>
    </section>

    <!-- Amount to Send -->
    <section class="row form-group">
        <div class="col-sm-11 clearfix">
            <a class="account-help-icon"
                href="#">
                <img src="images/icon-help.svg" class="help-icon" />
                <p class="account-help-text" translate="STAKE_Amount_Desc"></p>
            </a>
            <label translate="STAKE_amount">
                Amount to Stake (Min 100 for new delegation)
            </label>

            <input type="text"
                class="form-control"
                placeholder="{{ 'SEND_amount_short' | translate }}"
                ng-model="tx.value"
                ng-disabled="tx.readOnly || checkTxReadOnly"
                ng-class="Validator.isPositiveNumber(tx.value) ? 'is-valid' : 'is-invalid'"/>
        </div>
    </section>


    <!-- Gas Limit -->
    <section class="row form-group">
        <div class="col-sm-11 clearfix">
            <a class="account-help-icon"
                href="#">
                <img src="images/icon-help.svg" class="help-icon" />
                <p class="account-help-text" translate="STAKE_GAS_LIMIT_Desc"></p>
            </a>
            <label translate="STAKE_gas">
            Gas Limit (-1 means validator is full or you are not delegating minimum 100 Wan)
            </label>
            <input type="text"
                class="form-control"
                placeholder="21000"
                ng-model="tx.gasLimit"
                ng-change="gasLimitChanged=true"
                ng-disabled="tx.readOnly || checkTxReadOnly"
                ng-class="Validator.isPositiveNumber(tx.gasLimit) ? 'is-valid' : 'is-invalid'" />
        </div>
    </section>


    <div class="row form-group">
      <div class="col-xs-12 clearfix">
        <a class="btn btn-info btn-block"
           ng-click="generateTx()"
           translate="SEND_generate">
              Generate Transaction
        </a>
      </div>
    </div>

    <div class="row form-group" ng-show="rootScopeShowRawTx">

      <div class="col-sm-6">
        <label translate="SEND_raw">
          Raw Transaction
        </label>
        <textarea class="form-control" rows="4" readonly>{{rawTx}}</textarea>
      </div>

      <div class="col-sm-6">
        <label translate="SEND_signed">
          Signed Transaction
        </label>
        <textarea class="form-control" rows="4" readonly>{{signedTx}}</textarea>
      </div>

    </div>

    <div class="clearfix form-group" ng-show="rootScopeShowRawTx">
      <a class="btn btn-primary btn-block col-sm-11"
         data-toggle="modal"
         data-target="#sendTransaction"
         translate="SEND_trans"
         ng-click="parseSignedTx( signedTx )">
             Send Transaction
      </a>
    </div>


  </article>

</div>
<!-- / Content -->





<!-- Sidebar -->
<section class="col-sm-4">

  <div class="block block--danger"
       ng-show="wallet!=null && globalService.currentTab==globalService.tabs.staking.id && !hasEnoughBalance()">

    <h5 translate="STAKING_Warning_1">
      Warning! You do not have enough funds to complete this transaction.
    </h5>

    <p translate="STAKING_Warning_2">
      Please add more funds to your wallet or access a different wallet.
    </p>

  </div>

  <wallet-balance-drtv></wallet-balance-drtv>

  <div ng-show="checkTxPage"
       ng-click="checkTxReadOnly=!checkTxReadOnly"
       class="small text-right text-gray-lighter">
        <small translate="X_Advanced">
          Advanced Users Only.
        </small>
  </div>

</section>
<!-- / Sidebar -->
