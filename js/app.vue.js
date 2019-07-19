"use strict"

var vm = new Vue({
  el: '#app',
  template: `
  <main id="app">
    <team-list ref="team-list" @team-change="updatePlayerList"></team-list>
    <player-list ref="player-list" @regraph="regraph"></player-list>
    <injury-graph ref="injury-graph"></injury-graph>
  </main>
  `,
  components: {
    'team-list': Vue.options.components['team-list'],
    'player-list': Vue.options.components['player-list'],
    'injury-graph': Vue.options.components['injury-graph']
  },
  methods: {
    updatePlayerList(team) {
      this.$refs['player-list'].changeTeam(team)
    },
    regraph(payload) {
      this.$refs['injury-graph'].graph(payload)
    }
  }
})
