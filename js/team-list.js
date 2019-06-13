"use strict"

var teamListPromise = Promise.all([
  Vue.http.get('./js/assets/teams.json'),
  playerListPromise
]).then( values => {

  // process teams
  let teams = process(values[0].body)

  Vue.component('team-list', {
    template: `
    <select id="team-list" @change="onChange($event)" @focus="onChange($event)" size="30">
      <option v-for="team in teams"
              :value="team[0]"
              :style="{
                'background-image': 'url(' + team[1].logo + ')'
               }">
        {{ team[1].name }}
      </option>
    </select>
    `,
    components: {
      'player-list': Vue.options.components['player-list']
    },
    data: function() {
      return {
        teams: teams,
        selected: teams[0][0]
      }
    },
    methods: {
      onChange(event) {
        this.selected = event.target.value
        this.$emit('team-change', this.selected)
      }
    }
  })

})

// helper function
function process(obj) {
  const capitalize = str => {
    let strSplit = str.toLowerCase().split(' ')
    return strSplit.map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
  }
  let teamsSorted = Object.entries(obj).sort((a, b) => {
    return a[1].name[0] > b[1].name[0] ? 1 : -1
  })
  teamsSorted.forEach(e => e[1].name = capitalize(e[1].name))
  return teamsSorted
}
