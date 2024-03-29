"use strict"

Vue.component('player-list', {
  template: `
  <select id="player-list" @change="onChange($event)" @keydown="keymonitor" size="30">
    <option v-for="(player, index) in players"
            :value="index"
            :id="player"
            :style="{
              'background-image': 'url(' + player[1].image + ')'
            }" v-bind:selected="index === 0 ? 'selected' : false">
      {{ player[1].name }}
    </option>
  </select>
  `,
  data: function() {
    return {
      database: undefined,
      team: undefined,
      players: [],
      selected: undefined,
      index: 0,
      updatePending: false,
    }
  },
  mounted() {
    Vue.http.get('https://p1ho.github.io/nba-injuries/nba-injuries.json')
      .then(data => {
        this.database = data.body
        if (this.updatePending) {
          this.changeTeam(this.team)
          this.updatePending = false
        }
        this.changeUpdateTime()
      })
  },
  methods: {
    changeTeam(team) {
      this.team = team
      if (this.database !== undefined) {
        this.players = Object.entries(this.database['teams'][this.team])
        this.selected = this.players[+this.index][0]
        this.$emit('regraph', this.database['teams'][this.team][this.selected])
      } else {
        this.updatePending = true
      }
    },
    onChange(event) {
      this.index = +event.target.value
      this.selected = this.players[+this.index][0]
      this.$emit('regraph', this.database['teams'][this.team][this.selected])
    },
    keymonitor(event) {
      if (event.key === "ArrowLeft") {
        this.$emit('focus-team')
      }
    },
    changeUpdateTime() {
      let updated = Date(this.database.updated).split(' ').slice(0, 4).join(' ')
      document.getElementById('updated').textContent = `Updated ${ updated }`
    }
  }
})
