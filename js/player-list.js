"use strict"

var playerListPromise = Promise.all([
  Vue.http.get('https://p1ho.github.io/nba-injuries/nba-injuries.json'),
  injugyGraphPromise
]).then( values => {

  let database = values[0].body
  let updated = Date(database.updated).split(' ').slice(0, 4).join(' ')
  document.getElementById('updated').textContent = `Updated ${ updated }`

  Vue.component('player-list', {
    template: `
    <select id="player-list" @change="onChange($event)" size="30">
      <option v-for="player in players"
              :value="player[0]"
              :style="{
                'background-image': 'url(' + player[1].image + ')'
              }">
        {{ player[1].name }}
      </option>
    </select>
    `,
    components: {
      'injury-graph': Vue.options.components['injury-graph']
    },
    data: function() {
      return {
        database: database,
        team: undefined,
        players: [],
        selected: undefined,
      }
    },
    methods: {
      changeTeam(team) {
        this.team = team
        this.players = Object.entries(this.database['teams'][this.team])
      },
      onChange(event) {
        this.selected = event.target.value
        this.$emit('regraph', this.database['teams'][this.team][this.selected])
      }
    }
  })

})
