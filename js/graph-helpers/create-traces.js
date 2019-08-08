"use strict"

// trace creation helper
function createTraces(injuries, injuryLookup, settings) {
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
    let injuryName = `<span style="font-size: 15px;">${injury.injury.toLowerCase()}</span>`
    let injuryDate = `<span style="font-family: arial; font-size: 10px;">(${injury.date})</span>`
    let injuryHtmlLeft = injuryName + ' ' + injuryDate
    let injuryHtmlRight = injuryDate + ' ' + injuryName
    let found = false
    for (let location of Object.keys(injuryLookup)) {
      if (injuryName.includes(location)) {
        if (!Array.isArray(injuryLookup[location])) {
          if (injuryName.includes('right')) {
            let xyStr = injuryLookup[location].r.join(' ')
            accumulate(byLocation, xyStr, injuryHtmlRight)
          } else if (injuryName.includes('left')) {
            let xyStr = injuryLookup[location].l.join(' ')
            accumulate(byLocation, xyStr, injuryHtmlLeft)
          } else {
            injuriesUnlisted.push(injuryHtmlLeft)
          }
        } else {
          let xyStr = injuryLookup[location].join(' ')
          accumulate(byLocation, xyStr, injuryHtmlRight)
        }
        found = true
        break
      }
    }
    if (!found) {
      injuriesUnlisted.push(injuryHtmlLeft)
    }
  }

  const copy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
  }

  for (let [locKey, injuries] of Object.entries(byLocation)) {
    let coord = locKey.split(' ')
    if (locKey.includes('-') || locKey.includes('0 ')) {
      let midPoint = (-.5 + parseFloat(coord[0]))/2
      var x = [-.5, midPoint, parseFloat(coord[0])]
      var textPos = "center left"
    } else {
      let midPoint = (.5 + parseFloat(coord[0]))/2
      var x = [.5, midPoint, parseFloat(coord[0])]
      var textPos = "center right"
    }
    var y = [parseFloat(coord[1]), parseFloat(coord[1]), parseFloat(coord[1])]
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
    trace.entrycount = injuries.length
    traces.push(trace)
  }

  traces = reposition(traces)

  if (injuriesUnlisted.length != 0) {
    let traceUnlisted = copy(settings['trace-extra'])
    traceUnlisted.text = [
        '<span style="font-weight: bold; font-size: 1.5em;">'
        + '<span style="color: rgb(150, 150, 0);">&#9888;</span> '
        + 'Vague Injuries'
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

  return traces

}
