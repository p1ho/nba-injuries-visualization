"use strict"

/*
Notes:
 - Change Plotly Settings: "/js/assets/plotly-settings"
 - Function createTraces: "/js/create-traces.js"
 */

Vue.component('injury-graph', {
  template: `
  <div id="graph"></div>
  `,
  data: () => ({
    settings: undefined,
    traces: [],
    title: undefined,
    injuryLookup: undefined,
  }),
  mounted() {
    Promise.all([
      Vue.http.get('./js/assets/plotly-settings.json')
        .then(data => {
          this.settings = data.body
        }),
      Vue.http.get('./js/assets/injury-lookup.json')
        .then(data => {
          this.injuryLookup = data.body
        })
    ]).then( () => {
      this.default()
    })
  },
  methods: {
    default() {
      Plotly.react('graph', [], this.settings.layout, this.settings.options)
    },
    graph(payload) {
      this.settings.layout.title.text = payload.name
      this.traces = createTraces(payload.injuries, this.injuryLookup, this.settings)
      Plotly.react('graph', this.traces, this.settings.layout, this.settings.options)
    }
  }
})
