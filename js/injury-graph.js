"use strict"

/*
Notes:
 - Change Plotly Settings: "/js/assets/plotly-settings"
 - Function createTraces: "/js/create-traces.js"
 */

var injugyGraphPromise = Promise.all([
  Vue.http.get('/js/assets/injury-lookup.json'),
  Vue.http.get('/js/assets/plotly-settings.json')
]).then( values => {

  const injuryLookup = values[0].body
  const settings = values[1].body

  Vue.component('injury-graph', {
    template: `
    <div id="graph"></div>
    `,
    data: function() {
      return {
        layout: settings.layout,
        options: settings.options,
        traces: [],
        title: undefined
      }
    },
    methods: {
      default() {
        Plotly.react('graph', [], this.layout, this.options)
      },
      graph(payload) {
        this.layout.title.text = payload.name
        this.traces = createTraces(payload.injuries, injuryLookup, settings)
        Plotly.react('graph', this.traces, this.layout, this.options)
      }
    }
  })
})
