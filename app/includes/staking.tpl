<main class="tab-pane active"
      ng-if="globalService.currentTab==globalService.tabs.staking.id"
      ng-controller='stakingCtrl'
      ng-cloak >

  <!-- Title -->
  <div class="block text-center">
    <h1>
      <a translate="NAV_SendStake"
         ng-class="{'isActive': visibility=='stakingView'}"
         ng-click="setVisibility('stakingView')">
          Stake to
      </a>
      or
      <a translate="NAV_WithdrawStake"
         ng-class="{'isActive': visibility=='withdrawView'}"
         ng-click="setVisibility('withdrawView')">
          Withdraw from
      </a>
      Validator
    </h1>
  </div>
  <!-- / Title -->

  <!-- Unlock Wallet -->
  <article class="collapse-container">
    <div ng-click="wd = !wd">
      <a class="collapse-button"><span ng-show="wd">+</span><span ng-show="!wd">-</span></a>
      <!-- h1 translate="NAV_StakeCoins">
        Connect Wallet
      </h1-->
    </div>
    <div ng-show="!wd">
        @@if (site === 'mew' ) {  <wallet-decrypt-drtv></wallet-decrypt-drtv>         }
    </div>
  </article>

  <!-- Send Validator Content -->
  <article class="row" ng-show="wallet!=null && visibility=='stakingView'">
    @@if (site === 'mew' ) { @@include( './staking-content.tpl', { "site": "mew" } ) }
    @@if (site === 'mew' ) { @@include( './staking-modal.tpl',   { "site": "mew" } ) }
  </article>

  <!-- Withdraw Validator Content -->
  <article class="row" ng-show="wallet!=null  && visibility=='withdrawView'">
    @@if (site === 'mew' ) { @@include( './staking-withdraw-content.tpl', { "site": "mew" } ) }
    @@if (site === 'mew' ) { @@include( './staking-withdraw-modal.tpl',   { "site": "mew" } ) }
  </article>
</main>
