  <table class="table table-striped"
         style="margin: 2em auto;">

    <tr>
      <td>Name:</td>
      <td class="mono">
        {{objENS.name}}.wan
        <!-- TODO: ENS Browser
        <a href="https://etherscan.io/enslookup?q={{objENS.name}}.wan"
           target="_blank"
           rel="noopener noreferrer">
              {{objENS.name}}.wan
        </a>
        -->
      </td>
    </tr>

    <tr>
      <td>               Labelhash ({{objENS.name}}):    </td>
      <td class="mono">  {{objENS.nameSHA3}}             </td>
    </tr>

    <tr>
      <td>               Namehash ({{objENS.name}}.wan): </td>
      <td class="mono">  {{objENS.namehash}}             </td>
    </tr>

    <tr>
      <td>               Owner:                          </td>
      <td class="mono">  {{objENS.owner}}                </td>
    </tr>

    <tr>
      <td>               Highest Bidder (Deed Owner):    </td>
      <td class="mono">  {{objENS.deedOwner}}</span>     </td>
    </tr>

    <tr>
      <td>               Resolved Address:               </td>
      <td class="mono">  {{objENS.resolvedAddress}}      </td>
    </tr>

  </table>
