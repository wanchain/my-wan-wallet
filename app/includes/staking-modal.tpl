<article class="modal fade" id="sendTransaction" tabindex="-1">
  <section class="modal-dialog">
    <section class="modal-content">

      <div class="modal-body">

        <button type="button" class="close" data-dismiss="modal" aria-label="Close Dialog">&times;</button>

        <h2 class="modal-title text-center">
          <span translate="STAKEModal_Content_1">You are about to stake</span>...
        </h2>

        <table class="table text-center">
          <tbody>
            <tr>
              <td>
                <div class="addressIdenticon med"
                     title="Address Indenticon"
                     blockie-address="{{wallet.getAddressString()}}"
                     watch-var="wallet.getAddressString()">
                </div>
                <p>
                  <strong class="send-modal__addr">
                    {{wallet.getChecksumAddressString()}}
                  </strong>
                  <br />&nbsp;
                </p>
              </td>
              <td class="mono">
                ->
                <br />
                <h4 class="text-danger">
                  {{tx.value}} {{unitReadable}}
                </h4>
              </td>
              <td>
                <div class="addressIdenticon med" title="Address Indenticon" blockie-address="{{validator.address}}" watch-var="validator.address"></div>
                <p>
                  <strong class="send-modal__addr">
                    {{validator.address}}
                  </strong>
                  <br />
                  <strong class="send-modal__addr">
                    {{validator.name}}
                  </strong>
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <table class="table small table-condensed table-hover">
          <tbody>
            <tr>
              <td class="small text-right">To Address:</td>
              <td class="small text-left mono">{{parsedSignedTx.to}}
                <br />
                <em><small>When staking this is the staking contract address.</small></em>
              </td>
            </tr>
            <tr>
              <td class="small text-right">To Validator:</td>
              <td class="small text-left mono">{{validator.name}}
              </td>
            </tr>
            <tr>
              <td class="small text-right">To Validator Address:</td>
              <td class="small text-left mono">{{validator.address}}
              </td>
            </tr>
            <tr>
              <td class="small text-right">From Address:</td>
              <td class="small text-left mono">{{parsedSignedTx.from}}</td>
            </tr>
            <tr>
              <td class="small text-right">Amount to Send:</td>
              <td class="small text-left mono">{{parsedSignedTx.value}} WAN</td>
            </tr>
            <tr>
              <td class="small text-right">Account Balance:</td>
              <td class="small text-left mono">{{parsedSignedTx.balance}}</td>
            </tr>
            <tr>
              <td class="small text-right">Coin:</td>
              <td class="small text-left mono">{{unitReadable}}</td>
            </tr>
            <tr>
              <td class="small text-right">Network:</td>
              <td class="small text-left mono">{{ajaxReq.type}} by {{ajaxReq.service}}</td>
            </tr>
            <tr>
              <td class="small text-right">Gas Limit:</td>
              <td class="small text-left mono">{{parsedSignedTx.gasLimit}}</td>
            </tr>
            <tr>
              <td class="small text-right">Gas Price:</td>
              <td class="small text-left mono">{{parsedSignedTx.gasPrice.gwei}} GWEI <small>({{parsedSignedTx.gasPrice.eth}} WAN)</small>
              </td>
            </tr>
            <tr>
              <td class="small text-right">Max TX Fee:</td>
              <td class="small text-left mono"> {{parsedSignedTx.txFee.eth}} WAN <small>({{parsedSignedTx.txFee.gwei}} GWEI)</small></td>
            </tr>
            <tr>
              <td class="small text-right">Nonce:</td>
              <td class="small text-left mono">{{parsedSignedTx.nonce}}</td>
            </tr>
            <tr>
              <td class="small text-right">Data:</td>
              <td class="small text-left mono">{{parsedSignedTx.data}}</td>
            </tr>

          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <h4 class="text-center">
          <span translate="STAKEModal_Content_1">You are about to send</span>
          <strong class="mono">{{tx.value}} {{unitReadable}}</strong>
          <span>to {{validator.name}}</span>
          <strong class="mono">({{validator.address}}).</strong>
        </h4>
        <p translate="STAKEModal_Content_3">
          Are you sure you want to do this?
        </p>
        <br />
        <button class="btn btn-default" data-dismiss="modal" translate="STAKEModal_No">
          No, get me out of here!
        </button>
        <button class="btn btn-primary" ng-click="sendTx()" translate="STAKEModal_Yes">
          Yes, I am sure! Make transaction.
        </button>
      </div>
    </section>
  </section>
</article>
