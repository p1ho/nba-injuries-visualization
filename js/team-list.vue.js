"use strict"

Vue.component('team-list', {
  template: `
  <select id="team-list" @change="onChange($event)" @focus="onChange($event)" @keydown="keymonitor" size="30">
    <option v-for="(team, index) in teams"
            :value="team[0]"
            :style="{
              'background-image': 'url(' + team[1].logo + ')'
            }" v-bind:selected="index === 0 ? 'selected' : false">
      {{ team[1].name }}
    </option>
  </select>
  `,
  data: function() {
    return {
      teams: undefined,
      selected: undefined
    }
  },
  mounted() {
    Vue.http.get('./js/assets/teams.json')
      .then(data => {
        let teams = this.process(data.body)
        this.teams = teams
        this.selected = teams[0][0]
        this.$emit('team-change', this.selected)
      })
  },
  methods: {
    onChange(event) {
      if (event.type === "change") { // because focus event also fires
        this.selected = event.target.value
        this.$emit('team-change', this.selected)
      }
    },
    keymonitor(event) {
      if (event.key === "ArrowRight") {
        this.$emit('focus-player')
      }
    },
    process(obj) {
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
  }
})
