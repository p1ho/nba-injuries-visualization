"use strict"

// var playerListPromise = Promise.all([
//   Vue.http.get('https://p1ho.github.io/nba-injuries/nba-injuries.json'),
//   injugyGraphPromise
// ]).then( values => {
// 
//   let database = values[0].body
//   let updated = Date(database.updated).split(' ').slice(0, 4).join(' ')
//   document.getElementById('updated').textContent = `Updated ${ updated }`

Vue.component('player-list', {
  template: `
  <select id="player-list" @change="onChange($event)" size="30">
    <option v-for="(player, index) in players"
            :value="player[0]"
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
        this.selected = this.players[0][0]
        this.$emit('regraph', this.database['teams'][this.team][this.selected])
      } else {
        this.updatePending = true
      }
    },
    onChange(event) {
      this.selected = event.target.value
      this.$emit('regraph', this.database['teams'][this.team][this.selected])
    },
    changeUpdateTime() {
      let updated = Date(this.database.updated).split(' ').slice(0, 4).join(' ')
      document.getElementById('updated').textContent = `Updated ${ updated }`
    }
  }
})
