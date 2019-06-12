var injuryData
Vue.http.get('https://p1ho.github.io/nba-injuries/nba-injuries.json').then(res => {
  injuryData = res.body
})

var injuryLookup
Vue.http.get('/js/injury-lookup.json').then(res => {
  injuryLookup = res.body
})

var settings
Vue.http.get('/js/plotly-settings.json').then(res => {
  settings = res.body
  Plotly.plot('injury-graph', [], settings.layout, settings.options)
})

const playerList = new Vue({
  el: '#player-list',
  data: {
    players: [],
    chosen: undefined
  },
  methods: {
    onChange(event) {
      this.chosen = event.target.value

      let injuries = injuryData.teams[teamList.chosen][this.chosen].injuries

      let traces = []
      let byLocation = {}
      let injuriesUnlisted = []

      const accumulate = (obj, key, value) => {
        if (Object.keys(obj).includes(key)) {
          obj[key].push(value)
        } else {
          obj[key] = [value]
        }
      }

      for (let injury of injuries) {
        let injuryName = injury.injury.toLowerCase()
        let found = false
        for (let location of Object.keys(injuryLookup)) {
          if (injuryName.includes(location)) {
            if (!Array.isArray(injuryLookup[location])) {
              if (injuryName.includes('right')) {
                let xyStr = injuryLookup[location].r.join(' ')
                accumulate(byLocation, xyStr, injuryName)
              } else if (injuryName.includes('left')) {
                let xyStr = injuryLookup[location].l.join(' ')
                accumulate(byLocation, xyStr, injuryName)
              } else {
                injuriesUnlisted.push(injuryName)
              }
            } else {
              let xyStr = injuryLookup[location].join(' ')
              accumulate(byLocation, xyStr, injuryName)
            }
            found = true
            break
          }
        }
        if (!found) {
          injuriesUnlisted.push(injuryName)
        }
      }

      const copy = (obj) => {
        return JSON.parse(JSON.stringify(obj))
      }

      for (let [locKey, injuries] of Object.entries(byLocation)) {
        console.log(injuries)
        let coord = locKey.split(' ')
        if (locKey.includes('-')) {
          var x = [-.5, parseFloat(coord[0])]
          var textPos = "center left"
        } else {
          var x = [.5, parseFloat(coord[0])]
          var textPos = "center right"
        }
        var y = [parseFloat(coord[1]), parseFloat(coord[1])]
        let trace = copy(settings['trace-base'])
        trace.x = x
        trace.y = y
        trace.text = [
            '<span style="font-size: 16px;">'
            + '<br>'.repeat(injuries.length-1)
            + injuries.join('<br>')
          + '</span>'
        ]
        trace.textposition = textPos
        trace.line.color = 'rgb(255, 204, 0)'
        traces.push(trace)
      }

      if (injuriesUnlisted.length != 0) {
        let traceUnlisted = copy(settings['trace-extra'])
        traceUnlisted.text = [
            '<span style="font-weight: bold; font-size: 1.5em;">'
            + '<span style="color: rgb(150, 150, 0);">&#9888;</span> '
            + 'Vague Injuries:'
          + '</span><br><br>'
          + injuriesUnlisted.map(x => '<span style="font-size: 16px;">' + x + '</span>').join('<br>')
        ]
        traces.push(traceUnlisted)
      }

      if (traces.length === 0) {
        let traceUninjured = copy(settings['trace-extra'])
        traceUninjured.text = [
            '<span style="font-weight: bold; font-size: 2em;">'
            + '<span style="color: green;">&#10003;</span> '
            + 'No Injuries'
          + '</span>'
        ]
        traces.push(traceUninjured)
      }

      Plotly.react('injury-graph', traces, settings.layout, settings.options)

    }
  }
})

const teamList = new Vue({
  el: '#team-list',
  data: {
    teams: [],
    chosen: undefined
  },
  methods: {
    onChange(event) {
      this.chosen = event.target.value
      playerList.players = Object.entries(injuryData.teams[event.target.value])
      playerList.chosen = undefined
      document.getElementById('player-list').childNodes.forEach(e=>{e.selected = false})
      Plotly.react('injury-graph', [], settings.layout, settings.options)
    }
  }
})

Vue.http.get('/js/teams.json').then(res => {
  teamList.teams = Object.entries(res.body)
})
