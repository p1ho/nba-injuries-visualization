"use strict"

teamListPromise.then(() => {
  var vm = new Vue({
    el: '#app',
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
    },
    mounted() {
      this.$refs['injury-graph'].default()
    }
  })
})
