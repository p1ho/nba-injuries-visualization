"use strict"

var vm = new Vue({
  el: '#app',
  template: `
  <main id="app">
    <team-list ref="team-list" @team-change="updatePlayerList" @focus-player="focusPlayerList"></team-list>
    <player-list ref="player-list" @regraph="regraph" @focus-team="focusTeamList"></player-list>
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
    },
    focusTeamList() {
      this.$refs['team-list'].$el.focus()
    },
    focusPlayerList() {
      this.$refs['player-list'].$el.focus()
    }
  },
  mounted() {
    this.focusTeamList()
  }
})
